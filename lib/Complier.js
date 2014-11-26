/**
 * @file Complier of Smarty4Js
 * @author johnson(zoumiaojiang@gmail.com)
 * @date  2014-11-13
 */

var utils = require('./utils');

/**
 * @constructor
 *
 * Complier Class
 */
function Complier() {
    this.init.apply(this, arguments);
}

/**
 * init Complier
 * @param  {Object} engine a template engine object
 */
Complier.prototype.init = function (engine) {
    this.engine = engine;
};

/**
 * [render description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Complier.prototype.render = function (data) {

    var jsTpl = this.getJsTpl();
    var renderData = new Function('data', jsTpl);

    return renderData(data);
};

/**
 * [getJsTpl description]
 * @return {[type]} [description]
 */
Complier.prototype.getJsTpl = function () {
    return this.engine.renderer.parser();
};

module.exports = Complier;