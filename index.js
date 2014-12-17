/**
 * @file Smarty4Js
 * @author johnson(zoumiaojiang@gmail.com)
 * @date  2014-11-13
 */

var parser = require('./lib/parser/index');
var Compiler = require('./lib/Compiler');
var Renderer = require('./lib/Renderer');
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
    return code.replace(ld, '{%') // todo: new RegExp
             .replace(rd, '%}')
             .replace(/\\\"/g, '__QD') // replace \" in string ""
             .replace(/\\\'/g, '__QD') // replace \' in string ''
     + ld + '*' + this.id + '*' + rd;
}

/**
 * @constructor
 *
 * Smarty Class
 */
function Smarty() {
    this.id = '__smarty__' + utils.GUID();
    this.func = func;
    this.compiler = new Compiler(this);
    this.renderer = new Renderer(this);
    this.conf = {
        left_delimiter: '{%',
        right_delimiter: '%}'
    }

    this.config.apply(this, arguments);
};

/**
 * smarty config
 * @param  {object} conf config options
 */
Smarty.prototype.config = function (conf) {
    this.conf = utils.extend(this.conf, conf);
};

/**
 * compile the smarty template code
 * @param  {string} tpl smarty template code/file path
 * 
 * @return {Object}     a smarty Compiler object, have `render` mathod
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
 * 
 * @return {string}      html string
 */
Smarty.prototype.render = function (tpl, data) {
    return this.compile(tpl).render(data);
};

/**
 * user-defined function regiester in smarty
 * @param  {string}    funcName  function name
 * @param  {Function}  func      a function
 * 
 * @return {Object}              function Object
 */
Smarty.prototype.register = function (funcObj) {
    for (var p in funcObj) {
        if (funcObj.hasOwnProperty(p)) {
            this.func[p] = funcObj[p];
        }
    }
};



module.exports = Smarty;