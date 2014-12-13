/**
 * @file Renderer of Smarty4Js
 * @author Johnson(zoumiaojiang@gmail.com)
 */

var utils = require('../utils');

/**
 * [addPhpFuncs description]
 * @param {[type]} engine [description]
 * @param {[type]} jsTpl  [description]
 */
function addPhpFuncs(engine, jsTpl) {
    
    var arr = [];
    var obj = {};
    var matches = jsTpl.match(/__f\.(.*?)\(/g);
    if (matches) {
        matches.forEach(
            function (item) {
                arr.push(item.slice(4, item.length - 1));
            }
        );
        utils.excludeItem(arr).forEach(
            function (p) {
                obj[p] = engine.func[p];
            }
        );
        return 'var __f=' + utils.toFuncString(obj) + ';';
    }
    return '';
}

/**
 * [addClosure description]
 * @param {[type]} jsTpl [description]
 */
function addClosure(jsTpl) {
      return ''
        + '(function(){'
        +     'var __ret={'
        +         'render:function(data){\n' + jsTpl + '\n}'
        +     '};\n'
        +     'if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}\n'
        +     'else if (typeof define=="function" && define.amd){define(__ret);}\n'
        +     'else {return __ret;}'
        + '})();'
}

/**
 * [Renderer description]
 */
function Renderer(engine) {
    this.ctxId = utils.GUID();
    this.condition = {};
    this.engine = engine;
    this.eClass = require('../../index');
}

/**
 * [render description]
 * @return {[type]} [description]
 */
Renderer.prototype = {

    constructor: Renderer,

    ctxScope: ['data'],

    parser: function (flag) {
        var me = this;
        var ast = me.engine.ast;
        var jsTpl = '';
        if (!flag) {
            jsTpl += 'var __h="";'
                + 'var __dre=/^\\d+(\\.\\d+)?$/g;'
                + 'var __v=function(){'
                +     'var __va=Array.prototype.slice.call(arguments);'
                +     'for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){'
                +         'var __vd=__va[__vi];'
                +         'if(__vd!=undefined)return __vd;'
                +     '}'
                + '};'
                + me._init(ast) + '\nreturn __h;'
            jsTpl = addClosure(addPhpFuncs(this.engine, jsTpl) + jsTpl);
        }
        else {
            jsTpl += me._init(ast);
        }
        
        return jsTpl;
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
require('./loop')(Renderer);
require('./assign')(Renderer);
require('./function')(Renderer);
require('./file')(Renderer);

module.exports = Renderer;