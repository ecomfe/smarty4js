/**
 * @file Compiler of Smarty4Js
 * @author johnson [zoumiaojiang@gmail.com]
 * @date  2014-11-13
 */

var utils = require('./utils');

/**
 * constructor
 */
function Compiler() {
    this.init.apply(this, arguments);
}

/**
 * init Compiler
 * @param  {Object} engine a template engine object
 */
Compiler.prototype.init = function (engine) {
    this.engine = engine;
};

/**
 * render of compiler
 * @param  {Object} data  data of render
 * @return {string}       html code
 */
Compiler.prototype.render = function (data) {
    var jsTpl = this.getJsTpl();
    return (new Function('return ' + jsTpl)()).render(data);
};

/**
 * get js template
 * @param  {number} type  js template style
 * @return {string}       js code
 */
Compiler.prototype.getJsTpl = function (type) {
    return this.engine.renderer.parser(type);
};

module.exports = Compiler;
