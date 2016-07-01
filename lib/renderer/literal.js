/**
 * @file render literal
 * @author johnson [zoumiaojiang@gmaile.com]
 */

var utils = require('../utils');

module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * render literal
         * (top level than variable, include all of type in switch-case)
         * @param  {Object}  node ast node
         * @param  {boolean} f    is in echo env?
         * @return {string}       render result
         */
        _getLiteral: function (node, f) {
            var type = node.type;
            var me = this;
            switch (type) {
                case 'VAR':
                    return me._getVar(node);
                case 'NUM':
                    return me._getNum(node);
                case 'BOOL':
                    return me._getBool(node);
                case 'STR':
                    return me._getStr(node);
                case 'PIPE':
                    return me._getPipe(node);
                case 'OBJ':
                    return me._getObj();
                case 'ARRAY':
                    return me._getArray(node, f);
                case 'FUNC':
                    return me._getPhpFunc(node);
                case 'AUTO': // ++/-- opration
                    return me._getVar(node.items, node.r + node.ops);
                case 'GLOBAL':
                    return me._getGlobal(node);
                default:
                    break;
            }
        },

        /**
         * render variables first time
         * (because assign variable is diffrent with echo variable...)
         * @param  {Object} node  ast node
         * @return {string}       render result
         */
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
                                // if (idNode.opt1 && idNode.opt1 === ']') {
                                if (idNode.type !== 'SEC') {
                                    ret += '.[' + (idNode.value.type ? me._getExpr(idNode.value) : '0') + ']';
                                }
                                else { // if section name property...
                                    var secVal = idNode.value;
                                    if (secVal.length === 1) {
                                        ret += '.[__sec__D'
                                            + me._getExpr(secVal[0]).replace(/"/g, '')
                                            + '__Dindex]';
                                    }
                                    else {
                                        ret += '.[__sec__D' + me._getExpr(secVal[0]).replace(/"/g, '')
                                            + '__D' + me._getExpr(secVal[1]).replace(/"/g, '') + ']';
                                    }
                                }
                                // }
                                break;
                            case '->':
                                ret += '.[';
                                if (idNode.type === 'ID') {
                                    ret += '"' + idNode.value + '"';
                                }
                                else if (idNode.type === 'E' && idNode.value.type !== 'ID') {
                                    ret += me._getExpr(idNode.value).replace(/\./g, '__D');
                                }
                                ret += ']';
                                break;
                            case '@':
                                ret = me.ctxScope[me.ctxScope.length - 1] + '____D' + idNode.value + '@';
                                break;
                        }
                    }
                    else {
                        if (index === 0) {
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
                var val = items.value;
                if (me.includeAssign[val]) {
                    ret = '__fn__' + val + '()';
                }
                else if (me.capAssign[val] === true) {
                    ret = '__h+=__cap.' + val + '()';
                }
                else {
                    ret += '__SCOPE.' + val;
                }
            }
            return ret;
        },

        /**
         * render variables
         * @param  {Object} node  ast node
         * @param  {string} opTag inner operator of variable
         * @return {string}       variable result with scope
         */
        _getVar: function (node, opTag) {
            var me = this;
            var ret = me._getOriginVar(node);
            if (opTag) {
                var r = opTag.charAt(0);
                opTag = opTag.slice(1);
            }

            /**
             * split variables's items, and make sure variable link is right
             * @param  {array<string>} arr  pices of varible
             * @return {string}             result after add scope
             */
            function aw(arr) {
                var awret = '';
                if (arr.length === 2) {
                    awret = arr[1].trim() + ((arr[0].indexOf('[') > -1) ? '' : '__D') + arr[0].trim();
                }
                else {
                    var s = arr.shift();
                    awret = '__v(' + aw(arr) + ',{})' + ((s.indexOf('[') > -1) ? '' : '__D') + s.trim();
                }
                return awret;
            }

            /**
             * add all scope for current variable by scope stack
             * @param  {string} str  origin code
             * @return {string}      result code
             */
            function addScope(str) {
                var tmps = '__v(' + ((opTag && r === 'l') ? opTag : '');

                // from most close scope to root scope
                me.ctxScope.reverse().forEach(function (scope) {
                    var dots = str.replace(/__SCOPE/g, scope).split(/\./);
                    tmps += aw(dots.reverse()) + ((opTag && r === 'r') ? opTag : '') + ',';
                });
                me.ctxScope.reverse();
                return tmps.slice(0, tmps.length - 1) + ')';
            }
            if (ret.indexOf('__fn__') === -1 && ret.indexOf('__cap__') === -1) {
                ret = ret.indexOf('@') > -1 ? ret.slice(0, ret.length - 1) : addScope(ret);
            }
            return ret;
        },

        /**
         * render php function (translate php function to Js function)
         * @param  {Object} node ast node
         * @return {string}      render result
         */
        _getPhpFunc: function (node) {
            var pstr = '';
            var me = this;
            var ps = node.params;
            ps && ps.forEach(function (p) {
                pstr += me._getExpr(p) + (p !== ps[ps.length - 1] ? ',' : '');
            });
            return '__f["' + node.name + '"](' + pstr + ')';
        },

        /**
         * render text content not in smarty tags
         * @param  {Object} node  ast node
         * @return {string}       render result
         */
        _getText: function (node) {
            return utils.escapeString(node.value);
        },

        /**
         * render numble
         * @param  {Object} node ast node
         * @return {string}      render result
         */
        _getNum: function (node) {
            return parseFloat(node.value, 10);
        },

        /**
         * render bool
         * @param  {Object} node  ast node
         * @return {string}       render result
         */
        _getBool: function (node) {
            return node.value;
        },

        /**
         * render string
         * @param  {Object} node  ast node
         * @return {string}       render result
         */
        _getStr: function (node) {
            var me = this;
            var str = node.value;
            var ld = me.engine.conf.left_delimiter;
            var rd = me.engine.conf.right_delimiter;
            var envRe = new RegExp(utils.regEscape(ld) + '.*?' + utils.regEscape(rd), 'g');
            var ret = '';

            // adapta tag series if there is some smarty tag in string
            str = str.replace(/(\`.*?\`)/g, function (item) {
                return ld + item.slice(1, item.length - 1) + rd;
            }).replace(new RegExp('\\b\\$[_\\d\\w]+\\b(?!' + utils.regEscape(rd) + ')'), function (item) {
                return ld + item + rd;
            });

            // smarty tag in string, open a new compile environment
            if (envRe.test(str)) {
                var Class = me.eClass;
                var s = new Class(me.engine.conf);
                var strPipe = s.compile(str).getJsTpl(2);
                ret = strPipe;
            }
            else {
                ret = utils.escapeString(str);
            }
            return ret;
        },

        /**
         * render variables filter function
         * @param  {Object} node  ast node
         * @return {string}       render result
         */
        _getPipe: function (node) {
            return '__f["' + node.func + '"]';
        },

        /**
         * render smarty params of variables filter function
         * @param  {Array} arr  params ast data
         * @return {string}     render result [like `xx,xx`]
         */
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

        /**
         * render JavaScript Object
         * (but is array in smarty -- PHP)
         * @param  {Object} obj  obj ast data
         * @return {string}      render result
         */
        _getObj: function (obj) {
            var me = this;
            var ret = '{';
            if (utils.isArray(obj)) {
                obj.forEach(function (node) {
                    if (node.type === 'STR') {
                        ret += '"0":"' + node.value + '",';
                    }
                    else if (node.key && node.key.type === 'STR') {
                        ret += me._getLiteral(node.key) + ':' + me._getExpr(node.value) + ',';
                    }
                });
            }
            else if (utils.isObject(obj)) {
                var key = me._getLiteral(obj.key);
                var value = me._getExpr(obj.value);
                ret += 'key:' + key + ',';
                ret += key + ':' + value + ',';
            }

            return ret.slice(0, ret.length - 1) + '}';
        },

        /**
         * render real JavaScript array
         * @param  {array<Object>} arr  array ast data
         * @return {string}     render result
         */
        _getArrayReal: function (arr) {
            var me = this;
            var ret = '[';
            arr.forEach(function (item, index) {
                ret += me._getExpr(item) + ',';
            });
            return ret.slice(0, ret.length - 1) + ']';
        },

        /**
         * render array
         * (php array not like JavaScript, include object && array)
         * @param  {Object}  node  ast node
         * @param  {boolean} f     is in echo environment?
         * @return {string}        render result
         */
        _getArray: function (node, f) {
            var ret;
            var me = this;
            var items = node.items;
            if (utils.isObject(items)) {
                ret = me._getObj([items]);
            }
            if (utils.isArray(items)) {
                if (items.length === 0) {
                    return '{}';
                }
                var objf = items.every(function (nod) {
                    return nod.type === 'OBJ';
                });
                var arrf = items.every(function (nod) {
                    return nod.type !== 'OBJ';
                });
                if (objf && !f) {
                    ret = me._getObj(items);
                }
                else if (arrf && !f) {
                    ret = me._getArrayReal(items);
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
                            ret += '"__a' + ind + '":' + me._getExpr(nod, true) + ',';
                        }
                        ind++;
                    });
                    ret = ret.slice(0, ret.length - 1) + '}';
                }
            }
            else {
                ret = '{}';
            }
            return ret;
        },

        /**
         * render global variables
         * @param  {Object} node ast node
         * @return {string}      render result
         */
        _getGlobal: function (node) {

            // exclude '$smarty.const, $smarty.template, $smarty.current_dir, $smarty.block, $smarty.version'
            var ret = '';
            switch (node.value) {
                case '$smarty.now':
                    return 'Date.now()';
                case '$smarty.ldelim':
                    return 'smarty__Dldelim';
                case '$smarty.rdelim':
                    return 'smarty__Drdelim';
                default:
                    var val = node.value;
                    if (val.indexOf('$smarty.foreach.') === 0) {
                        var ga = val.split('.');
                        var sepMap = {
                            'first': 1,
                            'last': 1,
                            'index': 1,
                            'key': 1,
                            'index_prev': 1,
                            'index_next': 1,
                            'total': 1,
                            'show': 1
                        };
                        if (ga.length === 3 && sepMap[ga[2]] === 1) {
                            ret = 'smarty__Dforeach__D' + val.slice(16).replace(/\./, '__D');
                        }
                        else if (ga.length === 4 && sepMap[ga[3]] === 1) {
                            ret = '__for__D' + val.slice(16).replace(/\./, '__D');
                        }
                    }
                    else if (val.indexOf('$smarty.capture.') === 0) {
                        ret = 'smarty__Dcapture__D' + val.slice(16).replace(/\./, '__D');
                    }
                    else if (val.indexOf('$smarty.section.') === 0) {
                        ret = '__sec__D' + val.slice(16).replace(/\./, '__D');
                    }
                    else {
                        // about `$smarty.block`, With `append or prepend` instead of it
                        // other global variables don't support here, because they are no use in javascript
                        // so... helpless... no result if you use others global variables
                        ret = '""';
                    }
                    return ret;
            }
        }
    });
};
