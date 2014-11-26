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
        _getLiteral: function (node) {
            var type = node.type;
            var me = this;
            switch (type) {
                case 'VAR':
                    return me._getVar(node);
                    break;
                case 'NUM':
                    return me._getNum(node);
                    break;
                case 'BOOL':
                    return me._getBool(node);
                    break;
                case 'STR':
                    return me._getStr(node);
                    break;
                case 'PIPE':
                    return me._getPipe(node);
                    break;
                case 'OBJ':
                    return me._getObj(node);
                    break;
                case 'ARRAY':
                    return me._getArray(node);
                    break;
                case 'FUNC':
                    return me._getPhpFunc(node);
                    break;
                default:
                    break;
            };
        },


        _getVar: function (node) {
            var items = node.value;
            var me = this;
            var ret = '';
            var tret = '';
            if (utils.isArray(items)) {
                _.each(items, function (idNode) {
                    if (idNode.opt) {
                        var opt = idNode.opt;
                        switch (opt) {
                            case '.':
                                ret += '.' + idNode.value;
                                break;
                            case '[':
                                if (idNode.opt1 && idNode.opt1 == ']') {
                                    ret += me._getExpr(idNode);
                                }
                        };
                    }
                    else {
                        ret += '.' + idNode.value;
                    }
                });
            }
            else if (utils.isObject(items)) {
                ret += '.' + items.value;
            }

            for (var i = me.ctxScope.length - 1; i >= 0; i--) {
                var headret = me.ctxScope[i];
                tret += (headret + ret + ' || ');
            }

            return '(' + tret.slice(0, tret.length - 4) + ')';
        },

        _getPhpFunc: function (node) {
            var pstr = '';
            var me = this;
            var ps = node.params;
            _.each(ps, function (p) {
                pstr += me._getExpr(p) + ((p != ps[ps.length - 1]) ? ',' : '');
            });
            return '__f.' + node.name + '(' + pstr + ')'
        },

        _getText: function (node) {
            return utils.escapeString(node.value)
                //.replace(/\\n/g, '')
                //.replace(/\s+/g, ' ');
        },

        _getNum: function (node) {
            return parseFloat(node.value, 10);
        },

        _getBool: function (node) {
            return node.value;
        },

        _getStr: function (node) {
            return utils.escapeString(node.value);
        },

        _getPipe: function (node) {
            return '__f.' + node.func; 
        },

        _getPipeParams: function (arr) {
            var me = this;
            var ret;
            if (arr.length > 0) {
                ret = ',';
                _.each(arr, function (node) {
                    ret += me._getExpr(node) + ',';
                });
                ret = ret.substr(0, ret.length - 1);
            }
            else {
                return '';
            }

            return ret;
        },

        _getObj: function (node) {
            var me = this;
            var key = node.key;
            var vara = node.value;
            var items = node.items;
            var ret;

            if (items) {
                ret = '{';
                _.each(items, function (nod) {
                    ret += me._getLiteral(nod);
                });
                ret = ret.slice(0, ret.length - 1);
                ret += '}'
            }
            else if (key && vara) {
                ret = me._getLiteral(key) + ':' + me._getLiteral(vara) + ',';
            }
            else {
                ret = '[';
                ret += me._getLiteral(node.value);
                ret += ']';
            }
            return ret;
        },

        _getArray: function (node) {
            var ret = '[';
            var me = this;
            _.each(node.items, function (nod) {
                ret += me._getExpr(nod) + ',';
            });
            ret = ret.slice(0, ret.length - 1);
            ret += ']';

            return ret;
        }
    });
};