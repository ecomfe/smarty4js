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
                    return me._getStr(node);
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


        _getVar: function (node) {
            var items = node.value;
            var me = this;
            var ret = '';
            var tret = '';
            if (utils.isArray(items)) {
                items.forEach(function (idNode, index) {
                    if (idNode.type == 'VAR' && idNode.opt == '.') {
                        ret += '.[' + me._getExpr(idNode) + ']';
                    }
                    else if (idNode.type == 'ECHO' && idNode.opt == '.') {
                        ret += '.[' + me._getExpr(idNode.value) + ']';
                    }
                    else if (idNode.opt) {
                        var opt = idNode.opt;
                        switch (opt) {
                            case '.':
                                ret += '.' + idNode.value;
                                break;
                            case '[':
                                if (idNode.opt1 && idNode.opt1 == ']') {
                                    ret += '.[' + me._getExpr(idNode.value) + ']';
                                }
                                break;
                            case '->':
                                ret += '.[' + me._getExpr(idNode.value) + ']';
                                break;
                            case '@':
                                ret = '.' + idNode.value;
                                break;
                        };
                    }
                    else {
                        if (index == 0) {
                            if (idNode.type == 'ECHO') {
                                ret = ret.replace(/\]$/, '');
                                ret += '[' + me._getExpr(idNode.value) + ']';
                            }
                            else {
                                ret += '.["' + idNode.value +'"]';
                            }
                        }
                        else {
                            if (idNode.type == 'ECHO') {
                                ret = ret.replace(/\]$/, '');
                                ret += '+' + me._getExpr(idNode.value) + ']';
                            }
                            else if (idNode.type == 'ID') {
                                ret = ret.replace(/\]$/, '');
                                ret += '+' + me._getStr(idNode) + ']';
                            }
                        }
                    }
                });
            }
            else if (utils.isObject(items)) {
                ret += '.' + items.value;
            }

            for (var i = me.ctxScope.length - 1; i >= 0; i--) {
                var headret = me.ctxScope[i];
                tret += (headret + ret + ', ');
            }

            console.log(tret);
            // select right scope by method __v
            var datastr = tret.slice(0, tret.length - 2);
            datastr = datastr.replace(/\[.*?\]/g, function (item) {
                return item.replace(/,/g, '__F').replace(/\./g, '__C');
            });

            var datas = datastr.split(/\s*?,\s*?/);
            var tmpa = [];

            function aw(arr) {
                if (arr.length == 2) {
                    return arr[1].trim() + ((arr[0].indexOf('[') > -1) ? '' : '.') + arr[0].trim();
                }
                else {
                    var s = arr.shift();
                    return '__v(' + aw(arr) + ',{})' + ((s.indexOf('[') > -1) ? '' : '.') + s.trim();
                }
            }

            datas.forEach(function (item) {
                var dots = item.split(/\./);
                for (var i = 0; i < dots.length; i++) {
                    var di = dots[i];
                    if (/(\[.*?\])/.test(di)) {
                        var t = RegExp.$1;
                        dots[i] = di.replace(t, '');
                        dots.splice(i + 1, 0, t);
                        i++;
                    }
                }
                
                tmpa.push(aw(dots.reverse()));
            });

            return '__v(' + tmpa.join(', ').replace(/(__C)/g, '.').replace(/(__F)/g, ',').replace(/\.,/g, ',') + ')';
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
            var ret = '[';
            arr.forEach(function (item, index) {
                ret += me._getExpr(item) + ','
            });
            return ret.slice(0, ret.length - 1) + ']'
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
                    return 'null';
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
                return 'null';
            }
        }
    });
};