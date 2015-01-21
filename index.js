/**
 * @file Smarty4Js
 * @author johnson [zoumiaojiang@gmail.com]
 * @date  2014-11-13
 */

var parser = require('./lib/parser/index');
var Compiler = require('./lib/Compiler');
var Renderer = require('./lib/Renderer');
var phpfunc = require('./lib/phpfunc');
var func = require('./lib/func');
var utils = require('./lib/utils');

/**
 * pre define template code
 * @param  {string} code template code
 * @param  {Object} conf smarty config
 * @return {string}      code of after pre define
 */
function defineCode(code, conf) {
    var ld = conf.left_delimiter;
    var rd = conf.right_delimiter;
    return (code + ld + '*smarty4Js*' + rd)
        .replace(new RegExp(utils.regEscape(ld), 'g'), '{%')
        .replace(new RegExp(utils.regEscape(rd), 'g'), '%}')
        .replace(/\\\"/g, '__QD') // replace \" in string ""
        .replace(/\\\'/g, '__QS'); // replace \' in string ''
}

/**
 * @constructor
 */
function Smarty() {
    this.id = '__smarty__' + utils.getGUID();
    this.phpfunc = phpfunc;
    this.func = func;
    this.compiler = new Compiler(this);
    this.renderer = new Renderer(this);
    this.conf = {
        'left_delimiter': '{%',
        'right_delimiter': '%}'
    };
    this.config.apply(this, arguments);
}

/**
 * smarty config
 * @param  {Object} conf config options
 */
Smarty.prototype.config = function (conf) {
    this.conf = utils.extend(this.conf, conf);
};

/**
 * compile the smarty template code
 * @param  {string} tpl smarty template code/file path
 * @return {Object}     smarty Compiler object, have `render` mathod
 */
Smarty.prototype.compile = function (tpl) {
    var conf = this.conf;
    this.ast = parser.parse(defineCode(tpl, conf));

    return this.compiler;
};

/**
 * render tpl with json data
 * @param  {string} tpl  template code/file path
 * @param  {Object} data json data
 * @return {string}      html string
 */
Smarty.prototype.render = function (tpl, data) {
    return this.compile(tpl).render(data);
};

/**
 * user-defined function regiester in smarty
 * @param  {Object}    funcObj  function Object
 */
Smarty.prototype.register = function (funcObj) {
    for (var p in funcObj) {
        if (funcObj.hasOwnProperty(p)) {
            this.func[p] = funcObj[p];
        }
    }
};

/**
 * php plugin regiester in smarty
 * @param  {Object}    plugins   plugin's Object
 */
Smarty.prototype.addPlugin = function (plugins) {
    for (var p in plugins) {
        if (plugins.hasOwnProperty(p)) {
            this.phpfunc[p] = plugins[p];
        }
    }
};

module.exports = Smarty;
