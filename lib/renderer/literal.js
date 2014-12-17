/**
 * 
 */

var utils = require('../utils');

module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * [_getExpr description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _getLiteral: function (node, f) {
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
                    return me._getStr(node); // todo: smarty tag in '"' string...
                    break;
                case 'PIPE':
                    return me._getPipe(node);
                    break;
                case 'OBJ':
                    return me._getObj(arr);
                    break;
                case 'ARRAY':
                    return me._getArray(node, f);
                    break;
                case 'FUNC':
                    return me._getPhpFunc(node);
                    break;
                default:
                    break;
            };
        },

        _getOriginVar: function (node) {
            var items = node.value;
            var me = this;
            var ret = '';

            if (utils.isArray(items)) {
                items.forEach(function (idNode, index) {
                    if (idNode.type === 'VAR' && idNode.opt === '.') {
                        ret += '.[' + me._getExpr(idNode) + ']';
                    }
                    else if (idNode.type === 'ECHO' && idNode.opt === '.') {
                        ret += '.[' + me._getExpr(idNode.value) + ']';
                    }
                    else if (idNode.opt) {
                        var opt = idNode.opt;
                        switch (opt) {
                            case '.':
                                ret += '.' + idNode.value;
                                break;
                            case '[':
                                if (idNode.opt1 && idNode.opt1 === ']') {
                                    ret += '.[' + (idNode.value.type ? me._getExpr(idNode.value) : '0') + ']';
                                }
                                break;
                            case '->':
                                ret += '.[' 
                                    + (idNode.value.type !== 'ID' 
                                        ? me._getExpr(idNode.value) 
                                        : '"' + idNode.value) + '"' 
                                    + ']';
                                break;
                            case '@':
                                ret = me.ctxScope[me.ctxScope.length - 1] + '__.' + idNode.value + '@';
                                break;
                        };
                    }
                    else {
                        if (index == 0) {
                            if (idNode.type === 'ECHO') {
                                ret += '__SCOPE.[' + me._getExpr(idNode.value) + ']';
                            }
                            else {
                                ret += '__SCOPE.["' + idNode.value + '"]';
                            }
                        }
                        else {
                            if (idNode.type === 'ECHO') {
                                ret = ret.replace(/\]$/, '');
                                ret += '+' + me._getExpr(idNode.value) + ']';
                            }
                            else if (idNode.type === 'ID') {
                                ret = ret.replace(/\]$/, '');
                                ret += '+' + me._getStr(idNode) + ']';
                            }
                        }
                    }
                });
            }
            else if (utils.isObject(items)) {
                if (me.includeAssign[items.value]) {
                    ret = '__fn__' + items.value + '()';
                }
                else {
                    ret += '__SCOPE.' + items.value;
                }
            }

            return ret;
        },

        _getVar: function (node) {
            var me = this;
            var ret = me._getOriginVar(node);

            // split variables's items, and make sure variable link is right
            function aw(arr) {
                if (arr.length == 2) {
                    return arr[1].trim() + ((arr[0].indexOf('[') > -1) ? '' : '__D') + arr[0].trim();
                }
                else {
                    var s = arr.shift();
                    return '__v(' + aw(arr) + ',{})' + ((s.indexOf('[') > -1) ? '' : '__D') + s.trim();
                }
            }

            // add all scope for current variable by scope stack
            function addScope(str) {
                var tmps = '__v(';
                // from most close scope to root scope
                me.ctxScope.reverse().forEach(function (scope) {
                    var dots = str.replace(/__SCOPE/g, scope).split(/\./);
                    tmps += aw(dots.reverse()) + ',';
                });
                me.ctxScope.reverse();
                return tmps.slice(0, tmps.length - 1) + ')';
            }
            if (ret.indexOf('__fn__') == -1) {
                ret = ret.indexOf('@') > -1 ? ret.slice(0, ret.length - 1) : addScope(ret);
            }
            return ret;
        },

        /**
         * [_getPhpFunc description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _getPhpFunc: function (node) {
            var pstr = '';
            var me = this;
            var ps = node.params;
            ps.forEach(function (p) {
                pstr += me._getExpr(p) + ((p != ps[ps.length - 1]) ? ',' : '');
            });
            return '__f.' + node.name + '(' + pstr + ')'
        },

        /**
         * [_getText description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _getText: function (node) {
            return utils.escapeString(node.value)
                //.replace(/\\n?/g, '')
                //.replace(/\s+/g, ' ');
        },

        _getNum: function (node) {
            return parseFloat(node.value, 10);
        },

        _getBool: function (node) {
            return node.value;
        },

        _getStr: function (node) {
            var me = this;
            var str = node.value;
            // var s = new (me.eClass)(me.engine.conf);
            // str = s.compile(str).getJsTpl(2);
            
            return utils.escapeString(str)//str.slice(0, str.length - 1);
        },

        _getPipe: function (node) {
            return '__f.' + node.func; 
        },

        _getPipeParams: function (arr) {
            var me = this;
            var ret = '';
            if (arr.length > 0) {
                ret = ',';
                arr.forEach(function (node) {
                    ret += me._getExpr(node) + ',';
                });
                ret = ret.substr(0, ret.length - 1);
            }

            return ret;
        },

        _getObj: function (arr) {
            var me = this;
            var ret = '{';
            if (utils.isArray(arr)) {
                arr.forEach(function (node) {
                    if (node.key.type == 'STR') {
                        ret += me._getLiteral(node.key) + ':' + me._getExpr(node.value) + ',';
                    } 
                });
            }
            else if (utils.isObject(arr)) {
                var key = me._getLiteral(arr.key);
                var value = me._getExpr(arr.value);
                ret += 'key:' + key + ',';
                ret += key + ':' + value + ','
            }

            return ret.slice(0, ret.length - 1) + '}';
        },

        _getArrayReal: function (arr) {
            var me = this;
            var ret = '{';
            arr.forEach(function (item, index) {
                ret += '\'' + index + '\':' + me._getExpr(item) + ','
            });
            return ret.slice(0, ret.length - 1) + '}'
        },

        _getArray: function (node, f) {
            var ret;
            var me = this;
            var items = node.items;
            
            if (utils.isObject(items)) {
                return me._getObj([items]);
            }
            if (utils.isArray(items)) {
                if (items.length == 0) {
                    return '{}';
                }
                var objf = items.every(function (nod) {return nod.type === 'OBJ'; });
                var arrf = items.every(function (nod) {return nod.type !== 'OBJ'; });
                if (objf && !f) {
                    return me._getObj(items);
                }
                else if (arrf && !f) {
                    return me._getArrayReal(items);
                }
                else {
                    ret = '{';
                    var ind = 0;
                    items.forEach(function (nod, index) {
                        if (nod.type === 'OBJ') {
                            ret += me._getStr(nod.key) + ': ' + me._getExpr(nod.value, true) + ',';
                            ind--;
                        }
                        else {
                            ret += '"' + ind + '":' + me._getExpr(nod, true) + ',';
                        }
                        ind++;
                    });
                    return ret.slice(0, ret.length - 1) + '}';
                }
            }
            else {
                return '{}';
            }
        }
    });
};