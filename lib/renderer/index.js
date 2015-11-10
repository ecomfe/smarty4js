/**
 * @file Renderer of Smarty4Js
 * @author johnson [zoumiaojiang@gmail.com]
 */

var utils = require('../utils');

/**
 * add php functions after generate jsCode
 * @param  {Object} engine  engine
 * @param  {string} jsTpl   js code generate by engine
 * @return {string}         result code
 */
function addPhpFuncs(engine, jsTpl) {
    var arr = [];
    var obj = {};
    var matches = jsTpl.match(/__f\[\".+?\"\]\(/g);
    if (matches) {
        matches.forEach(
            function (item) {
                arr.push(item.slice(5, item.length - 3));
            }
        );
        utils.excludeItem(arr).forEach(
            function (p) {
                obj[p] = engine.phpfunc[p];
            }
        );
        return 'var __f=' + utils.toFuncString(obj) + ';' + jsTpl;
    }
    return jsTpl;
}

/**
 * add smarty-tag functions after generate jsCode
 * @param  {Object} engine  engine
 * @param  {string} jsTpl   js code generate by engine
 * @return {string}         result code
 */
function addUserDefinedFuncs(engine, jsTpl) {
    var arr = [];
    var obj = {};
    var matches = jsTpl.match(/"__fn__.+?"/g);
    if (matches) {
        matches.forEach(
            function (item) {
                arr.push(item.slice(7, item.length - 1));
            }
        );
        utils.excludeItem(arr).forEach(
            function (p) {
                obj[p] = engine.func[p];
            }
        );
        return 'var __func=' + utils.toFuncString(obj, '__fn__') + ';' + jsTpl;
    }
    return jsTpl;
}

/**
 * add a closure after generate jsCode
 * @param  {string} jsTpl   js code generate by engine
 * @return {string}         result code
 */
function addClosure(jsTpl) {
    var conf = this.conf;
    return ''
        + '(function(root){'
        +     'var __ret={'
        +         'render:function(__tn, __da){'
        +             'if(typeof __tn=="object"){__da=__tn;__tn=undefined;}'
        +             'if(typeof __tn=="string"){__da=__da||{};}' + jsTpl
        +         '}'
        +     '};\n'
        +     (conf.isCmd 
                    ? 'if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}\n'
                    : '')
        +     (conf.isAmd 
                    ? 'if (typeof define=="function" && define.amd){define(__ret);}\n'
                    : '')
        +     'root.' + (conf.globalVar || '_smartyTpl') + '=__ret;\n'
        +     'return __ret;'
        + '})(this);';
}

/**
 * @constructor
 * @param {Object} engine current engine
 */
function Renderer(engine) {
    this.ctxId = utils.getGUID();
    this.engine = engine;
    this.eClass = require('../../index');
    this.conf = engine.conf;
    this.includeAssign = {};
    this.capAssign = {};
}

/**
 * @prototype of Renderer
 */
Renderer.prototype = {

    constructor: Renderer,

    // context scope stack
    ctxScope: ['__da'],

    // extends scope stack
    extScope: [],

    /**
     * parser of Renderer
     * @param  {number} flag  flag of env (1,2...: addclosure, 0: just logic template)
     * @return {string}        generate js template
     */
    parser: function (flag) {
        var me = this;
        var ast = me.engine.ast;
        var jsTpl = '';
        if (!flag) {
            jsTpl += '\nvar __h="",__cap={},__ext={},__assign,__sec={},__for={},smarty={'
                + 'foreach:{},capture:{},'
                + 'ldelim:"' + me.conf.left_delimiter + '",'
                + 'rdelim:"' + me.conf.right_delimiter + '"},'
                + '__dre=/^\\d+(\\.\\d+)?$/g,__nre=/[\\.\\(\\)\\[\\]\\{\\}\\+\\-\\*\\?\\|\\^\\$]/g,'
                + '\n__v=function(){'
                +     'var __va=Array.prototype.slice.call(arguments);'
                +     'for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){'
                +         'var __vd=__va[__vi];'
                +         'if(__vd!=undefined&&""+__vd!="NaN"){'
                +             'if(typeof __vd=="function"){return __vd();}'
                +             'else{return __vd;}'
                +         '}'
                +     '}'
                + '};'
                + me._init(ast) + '\nif(__tn){return __func["__fn__"+__tn](__da);}' + '\nreturn __h;';
            jsTpl = addClosure.call(this, addPhpFuncs(this.engine, addUserDefinedFuncs(this.engine, jsTpl)));
        }
        else {
            jsTpl += me._init(ast, flag);
        }

        return jsTpl;
    },

    /**
     * enter of render
     * @param  {Object} root          ast tree
     * @param  {number|boolean} flag  env flag(2: tag in string, other: normal)
     * @return {string}               js template
     */
    _init: function (root, flag) {

        var me = this;
        var ret = '';
        var n0 = root[0];
        var n1 = root[1];

        if (flag === 2) { // smarty tags in string
            var tmpRet = [];
            root.forEach(function (node, index) {
                var type = node.type;
                switch (type) {
                    case 'T':
                        tmpRet.push(me._getText(node));
                        break;
                    case 'VAR':
                        tmpRet.push(me._getVar(node));
                        break;
                    case 'E':
                        tmpRet.push(me._getExpr(node));
                        break;
                    case 'IF':
                        tmpRet.push(me._getIf(node, flag));
                        break;
                    case 'FUNC':
                        tmpRet.push(me._getFunction(node, flag));
                        break;
                    default:
                        break;
                }
            });
            return tmpRet.join('+');
        }
        if (n0 && n1
            && n0.type === 'T'
            && n0.value.trim() === ''
            && n1.type === 'FUNC'
            && n1.name === 'extends'
        ) { // extends
            var prefix = '__ext__' + utils.getGUID();
            me.extScope.push(prefix);
            ret += me._getExtends(n1);
            root.forEach(function (node) {
                var type = node.type;
                switch (type) { // if extends, just deal with block stmts
                    case 'FUNC':
                        if (node.name === 'block') {
                            ret += me._getSubBlock(node);
                        }
                        break;
                    default:
                        break;
                }
            });
            me.extScope.pop();
            // return ret;
        }
        else { // normal smarty tags
            root.forEach(function (node) {
                var type = node.type;
                switch (type) {
                    case 'T':
                        ret += utils.p(me._getText(node));
                        break;
                    case 'VAR':
                        ret += utils.p(me._getVar(node))
                            .replace(/__h\+=__fn__/g, '__fn__')
                            .replace(/__h\+=__cap__/g, '__cap__');
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
                    case 'GLOBAL':
                        ret += utils.p(me._getGlobal(node));
                        break;
                    case 'AUTO':
                        ret += me._getVar(node.items, node.r + node.ops);
                        break;
                    case 'C':
                        break;
                    case 'STR':
                        ret += utils.p(me._getStr(node));
                        break;
                    default:
                        throw new Error('error in ' + node.type);
                }
            });
        }
        var config = me.engine.conf;
        // finanly escape to normal JS code (replace placeholder)
        // __D: .
        // __QD: "
        // __QS: '
        // __LD: left_delimiter
        // __RD: right_delimiter
        ret = ret
            .replace(/__D/g, '.')
            .replace(/__QD/g, '\\\"')
            .replace(/__QS/g, '\\\'')
            .replace(/__RD/g, config.right_delimiter)
            .replace(/__LD/g, config.left_delimiter);
        return ret;
    }
};

require('./expr')(Renderer);
require('./literal')(Renderer);
require('./if')(Renderer);
require('./loop')(Renderer);
require('./assign')(Renderer);
require('./function')(Renderer);
require('./module')(Renderer);

module.exports = Renderer;
