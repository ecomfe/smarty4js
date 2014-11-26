/**
 * 
 */

var utils = require('../utils');
var _ = require('underscore');


module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {
        /**
         * [_getExpr description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _getFunction: function (node) {
            var me = this;
            var name = node.name;
            var ret;
            switch (name) {
                case 'function':
                    ret = me._getFunc(node);
                    break;
                default:
                    break;
            };

            return ret;
        },

        _getFunc: function (node) {
            var me = this;
            var func = '__func' + utils.GUID();
            var attrs = me._getAttr(node.attrs);
            var ret = '\nfunction name() {';
            me.ctxScope.push(func);
            ret += '\nvar ' + func + ' = {};';
            ret += me._init(node.block) + '}';
            me.ctxScope.pop();
            return ret;
        },

        _getAttr: function (arr) {
            var obj = {};
        }
    });
};