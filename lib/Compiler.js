/**
 * @file Compiler of Smarty4Js
 * @author johnson(zoumiaojiang@gmail.com)
 * @date  2014-11-13
 */

var utils = require('./utils');

/**
 * @constructor
 *
 * Compiler Class
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
 * [render description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Compiler.prototype.render = function (data) {

    var jsTpl = this.getJsTpl();
    var renderData = new Function('data', jsTpl);

    return renderData(data);
};

/**
 * [getJsTpl description]
 * @return {[type]} [description]
 */
Compiler.prototype.getJsTpl = function () {
    return this.engine.renderer.parser();
};

module.exports = Compiler;