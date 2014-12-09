/**
 * @file Renderer of Smarty4Js
 * @author Johnson(zoumiaojiang@gmail.com)
 */

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
        var jsTpl = 'var __f=' + utils.toFuncString(this.engine.func) + ';\nvar __sf={};\nvar __h=[];'
            + 'var __v=function(){var __va=Array.prototype.slice.call(arguments);for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){var __vd=__va[__vi];if(__vd!=undefined)return __vd;}};'
            + this._init(ast) + '\nreturn __h.join("");'
        // }
        return jsTpl.replace(/(\\n)+/g, '\\n');
    },




    /**
     * [_init description]
     * @param  {[type]} root [description]
     * @return {[type]}      [description]
     */
    _init: function (root) {
        var me = this;
        var ret = '';
        root.forEach(function (node) {
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
                    ret += me._getFunction(node, true);
                    break;
                case 'WHILE':
                    ret += me._getWhile(node);
                    break;
                default:
                    break;
            }
        });
        return ret.replace(/__D/g, '.');
    }
};

require('./expr')(Renderer);
require('./literal')(Renderer);
require('./if')(Renderer);
require('./for')(Renderer);
require('./assign')(Renderer);
require('./function')(Renderer);

module.exports = Renderer;