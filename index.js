/**
 * @file Smarty4js
 * @author johnson [zoumiaojiang@gmail.com]
 * @date  2014-11-13
 */

var Compiler = require('./lib/compiler');
var Renderer = require('./lib/renderer');
var phpfunc = require('./lib/phpfunc');
var func = require('./lib/func');
var utils = require('./lib/utils');
var path = require('path');
var fs = require('fs');


/**
 * pretreatment template code
 *
 * @param  {string} code template code
 * @param  {Object} conf smarty config
 * @return {string}      code of after pre define
 */
function pretreatmentCode(code, conf) {
    var ld = conf.left_delimiter;
    var rd = conf.right_delimiter;
    var reld = utils.regEscape(ld);
    var rerd = utils.regEscape(rd);

    // literal filter
    var literalPaserModulePath = path.resolve(__dirname, 'lib', 'parser','literal.js');
    var literalPaserFile = fs.readFileSync(literalPaserModulePath, 'utf8');
    var homePath = utils.getHomePath();
    var realLiteralParserFilePath = path.resolve(homePath, 'literal.js');

    if (ld !== '{%') {
        literalPaserFile = literalPaserFile.replace(/\\\{%/g, reld);
    }
    if (rd !== '%}') {
        literalPaserFile = literalPaserFile.replace(/%\\\}/g, rerd);
    }

    fs.writeFileSync(realLiteralParserFilePath, literalPaserFile);

    var literalAst = require(realLiteralParserFilePath).parse(code);
    var newCode = '';

    literalAst.forEach(function (node) {
        var type = node.type;
        var value = node.value;
        if (value && value.trim().length > 0) {
            if (type === 'TEXT') {
                newCode += value;
            }
            else if (type === 'LTEXT') {
                newCode += value.replace(new RegExp(reld, 'g'), '__LD').replace(new RegExp(rerd, 'g'), '__RD');
            }
        }
    });

    // jison hack
    newCode += (ld + '*smarty4js*' + rd);

    return newCode
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
    this.conf = {
        'left_delimiter': '{%',
        'right_delimiter': '%}',
        'isAmd': true,
        'isCmd': true,
        'globalVar': '_smartyTpl'
    };
    this.config.apply(this, arguments);
    this.compiler = new Compiler(this);
    this.renderer = new Renderer(this);
}

/**
 * smarty config
 * @param  {Object} conf config options
 */
Smarty.prototype.config = function (conf) {
    this.conf = utils.extend(this.conf, conf);
};

/**
 * set tpl file base dir
 * @param {string} path  base path
 */
Smarty.prototype.setBasedir = function (path) {
    this.dirname = path;
}

/**
 * compile the smarty template code
 * @param  {string} tpl smarty template code/file path
 * @return {Object}     smarty Compiler object, have `render` mathod
 */
Smarty.prototype.compile = function (tpl) {

    var conf = this.conf;
    var filePath = path.resolve(process.cwd(), (tpl || '' + utils.getGUID()));
    var ld = conf.left_delimiter;
    var rd = conf.right_delimiter;
    var paserModulePath = path.resolve(__dirname, 'lib', 'parser','index.js');
    var paserFile = fs.readFileSync(paserModulePath, 'utf8');
    var homePath = utils.getHomePath();
    var realParserFilePath = path.resolve(homePath, 'index.js');

    if (fs.existsSync(filePath)) {
        tpl = fs.readFileSync(filePath, 'utf-8');
        this.dirname = this.dirname || path.dirname(filePath);
    }

    if (ld !== '{%') {
        paserFile = paserFile.replace(/\\\{%/g, utils.regEscape(ld));
    }
    if (rd !== '%}') {
        paserFile = paserFile.replace(/%\\\}/g, utils.regEscape(rd));
    }

    fs.writeFileSync(realParserFilePath, paserFile);
    this.ast = require(realParserFilePath).parse(pretreatmentCode(tpl, conf));

    return this.compiler;
};

/**
 * render tpl with json data
 * @param  {string} tpl  template code/file path
 * @param  {Object} data json data
 * @return {string}      html string
 */
Smarty.prototype.render = function (tpl, data) {

    var filePath = path.resolve(process.cwd(), tpl);

    if (fs.existsSync(filePath)) {
        tpl = fs.readFileSync(filePath, 'utf-8');
        this.dirname = this.dirname || path.dirname(filePath);
    }

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

/**
 * support express
 *
 * @param  {string}   path    tpl path
 * @param  {Object}   options data
 * @param  {Function} fn      callback
 */
Smarty.__express = function (path, options, fn) {
    fn(null, new Smarty().render(path, options));
};

module.exports = Smarty;
