/**
 * @file Renderer of Smarty4Js
 * @author Johnson(zoumiaojiang@gmail.com)
 */

var _ = require('underscore');
var utils = require('../utils');

/**
 * [Renderer description]
 */
function Renderer(engine) {
    this.ctxId = utils.GUID();
    this.condition = {};
    this.engine = engine;
}

/**
 * [render description]
 * @return {[type]} [description]
 */
Renderer.prototype = {

    constructor: Renderer,

    ctxScope: ['data'],

    parser: function () {

        var ast = this.engine.ast;
        var UglifyJS = require('uglify-js');
        // return function body (this API exposed to user)
        // function a_func_name(data) {
        var jsTpl = 'var __h=[];__f=' + utils.toFuncString(this.engine.func) + ';';
        jsTpl += this._init(ast);
        jsTpl += '\nreturn __h.join("");'
        // }
        return jsTpl.replace(/(\\n)+/g, '\\n') ;
    },


    /**
     * [_init description]
     * @param  {[type]} root [description]
     * @return {[type]}      [description]
     */
    _init: function (root) {
        var me = this;
        var ret = '';
        _.each(root, function (node) {
            var type = node.type;
            switch (type) {
                case 'T':
                    ret += utils.p(me._getText(node));
                    break;
                case 'VAR':
                    ret += utils.p(me._getVar(node));
                    break;
                case 'E':
                    ret += utils.p(me._getExpr(node));
                    break;
                case 'ASSIGN':
                    ret += me._assign(node);
                    break;
                case 'IF':
                    ret += me._getIf(node);
                    break;
                case 'FOR':
                    ret += me._getFor(node);
                    break;
                case 'FUNC':
                    ret = me._getFunction(node);
                    break;
                default:
                    break;
            }
        });
        return ret;
    }
};

require('./expr')(Renderer);
require('./literal')(Renderer);
require('./if')(Renderer);
require('./for')(Renderer);
require('./assign')(Renderer);
require('./function')(Renderer);

module.exports = Renderer;