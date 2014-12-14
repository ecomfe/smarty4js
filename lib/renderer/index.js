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
    this.engine = engine;
    this.eClass = require('../../index');
    this.includeAssign = {};
}

/**
 * [render description]
 * @return {[type]} [description]
 */
Renderer.prototype = {

    constructor: Renderer,

    ctxScope: ['data'],

    extScope: [],

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
                + me._init(ast, true) + '\nreturn __h;'
            jsTpl = addClosure(addPhpFuncs(this.engine, jsTpl) + jsTpl);
        }
        else {
            jsTpl += me._init(ast, true);
        }
        
        return jsTpl;
    },


    /**
     * [_init description]
     * @param  {[type]} root [description]
     * @return {[type]}      [description]
     */
    _init: function (root, first) {
        var me = this;
        var ret = '';
        var n0 = root[0];
        var n1 = root[1];

        if (first && n0 && n1 && n0.type == 'T' && n0.value.trim() == '' && n1.type == 'FUNC' && n1.name == 'extends') {
            var prefix = '__ext__' + utils.GUID();
            me.extScope.push(prefix);
            ret = '\nvar ' + prefix + '={};'
            ret += me._getExtends(n1);
            root.forEach(function (node) {
                var type = node.type;
                switch (type) {
                    case 'FUNC':
                        if (node.name == 'block') {
                            ret += me._getSubBlock(node);
                        }
                        break;
                    default:
                        break;
                }
            });
            me.extScope.pop();
            return ret;
        }
        else {
            root.forEach(function (node) {
                var type = node.type;
                switch (type) {
                    case 'T':
                        ret += utils.p(me._getText(node));
                        break;
                    case 'VAR':
                        ret += utils.p(me._getVar(node)).replace(/__h\+=__fn__/g, '__fn__');
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
        }
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