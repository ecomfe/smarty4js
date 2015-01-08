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
        _getFunction: function (node, f) {
            var me = this;
            var name = node.name;
            var ret;
            var fobj = me.engine.phpfunc;
            if (fobj[name] && node.params) {
                if (f === true) {
                    ret = utils.p(me._getPhpFunc(node));
                }
                else {
                    ret = me._getPhpFunc(node);
                }
            }   
            else {
                switch (name) {
                    case 'function':
                        ret = me._getFunc(node);
                        break;
                    case 'strip':
                        ret = me._getStrip(node);
                        break;
                    case 'call':
                        ret = me._getCallFunc(node);
                        break;
                    case 'assign':
                        ret = me._assignFunc(node);
                        break;
                    case 'foreach':
                        ret = me._getFuncFor(node);
                        break;
                    case 'section':
                        ret = me._getSection(node);
                        break;
                    case 'include':
                        ret = me._getInclude(node);
                        break;
                    case 'literal':
                        ret = me._getFuncLiteral(node);
                        break;
                    case 'ldelim':
                        ret = utils.p('"' + me.engine.conf.left_delimiter + '"');
                        break;
                    case 'rdelim':
                        ret = utils.p('"' + me.engine.conf.right_delimiter + '"');
                        break;
                    case 'block':
                        ret = me._getMasterBlock(node);
                        break;
                    case 'append':
                        ret = me._getAppend(node);
                        break;
                    case 'capture':
                        ret = me._getCapture(node);
                        break;
                    case 'break':
                        ret = 'break;'
                        break;
                    default:
                        ret = me._callFunc(node, f);
                        break;
                };
            }

            return ret;
        },

        _getFunc: function (node) {
            var me = this;
            var func = '__func' + utils.GUID();
            var funcName;

            var tmparr = [];

            node.attrs.forEach(function (nod, index) {
                if (nod.value) {
                    if (nod.key.value == 'name' && nod.value.type == 'STR') {
                        funcName = nod.value.value;
                    }
                    else {
                        tmparr.push(nod);
                    }
                }
                else if (!nod.value && index == 0){
                    funcName = nod.key.value;
                }
                else {
                    tmparr.push(nod);
                }
            });

            function getFuncParams(arr) {
                var tmps = '';
                arr.forEach(function (node) {
                    tmps += node.key.value + ',';
                });
                return tmps.slice(0, tmps.length - 1);
            }

            function getDefaultParams(func, arr) {
                var tmps = '';
                arr.forEach(function (node) {
                    if (node.value) {
                        var p = node.key.value;
                        var vara = me._getExpr(node.value);
                        tmps += '\n' + func  + '.' + p + '=__v(__p.' + p + ',' + vara + ');'
                    }
                });

                return tmps;
            }

            var ret = '\n__func["__fn__' + funcName + '"]=function(__p){';
            me.ctxScope.push(func);
            ret += 'for(var __ in __p){if(__p.hasOwnProperty(__)&&__da[__]==undefined){__da[__]=__p[__];}}\n'
                + 'var ' + func + ' = __p;'
            ret += getDefaultParams(func, tmparr);
            ret += me._init(node.block) + '\n};';
            me.ctxScope.pop();
            return ret;
        },

        _callFunc: function (node, flag) {
            
            // todo: call have assign attribute like return
            var me = this;
            var funcName = node.name;
            var attrs = node.attrs;
            var params = node.params;
            if (funcName) {
                if (attrs) {
                    if (attrs.length == 0) {
                        return '__func["__fn__' + funcName + '"]({})' + (flag == 2 ? '' : ';');
                    }
                    else {
                        var me = this;
                        var params = [];
                        node.attrs.forEach(function (nod) {
                            params.push(nod.key.value + ': ' + (nod.value ? me._getExpr(nod.value) : ''));
                        });
                        return '__func["__fn__' + funcName + '"]({' + params.join(',') + '})' + (flag == 2 ? '' : ';');
                    }
                }
            }
            else {
                throw new Error('No Function Name Error! -- no function `' + funcName + '`');
            }
        },

        _getStrip: function (node) {
            var block = node.block;
            return this._init(block)
                .replace(/\"\s+/g, '" ')
                .replace(/\s+\"/g, ' "')
                .replace(/\s+</g, '<')
                .replace(/>\s+/g, '>');
        },

        _getFuncLiteral: function (node) {

            // we don't suggest to use '{' and '}' to be limiter, so this function is smarty adapter
            var block = node.block;
            return this._init(block);
        },

        _getCallFunc: function (node) {
            var me = this;
            var ret = '';
            var attrs = node.attrs;
            var f = true;
            if (attrs) {
                attrs.forEach(function (attr) {
                    if ((attr.key.value == 'name' || !attr.value) && f) {
                        ret += '\n__func["__fn__' + (attr.value ?  attr.value.value : attr.key.value) + '"]({';
                        f = false;
                    }
                    else {
                        ret += '"' + attr.key.value + '":' + me._getExpr(attr.value) + ',';
                    }
                });
                
                ret = (ret.indexOf(',') > -1 ? ret.slice(0, ret.length - 1) : ret) + '});'
            }

            return ret;
        },
        _getAppend: function (node) {
            var me = this;
            var ret = '';
            var attrs = node.attrs;
            var vara;
            var ind = '';
            var value;

            if (attrs) {
                attrs.forEach(function (attr, index) {
                    var key = attr.key.value;
                    var valObj = attr.value;
                    if ((key == 'var' || (!valObj && index == 0))) {
                        var varaNode = valObj ? valObj : attr.key;
                        if (varaNode.type == 'STR') {
                            vara = me._getStr(varaNode);
                        }
                    }
                    if ((key == 'value' || (!valObj && index == 1))) {
                        value = me._getExpr(valObj ? valObj : attr.key);
                    }
                    if (key == 'index') {
                        var tmp = valObj.value;
                        ind = typeof tmp == 'string' ? ('"' + tmp + '"') : me._getExpr(tmp);
                    }
                });
                if (vara && value) {
                    ret += '__ti_=' + (ind ? ind : '__f.count((__da[' + vara + ']||{}))') + ';'
                    ret += '__t_=__da[' + vara + '];';
                    ret += '__da[' + vara + ']=__t_?__t_:{};';
                    ret += '__da[' + vara + '][__ti_]=' + value + ';';
                }
            }

            return ret;
        },

        _getCapture: function (node) {
            var me = this;
            var ret = '';
            var attrs = node.attrs;
            var block = node.block;
            var assign;
            var name = '', assign = '', append = '';
            var ca = '__ca' + utils.GUID();

            if (attrs) {
                ret += 'var ' + ca + 'a=function(){var ' + ca + '="";' 
                + me._init(block).replace(/__h/g, ca) 
                + 'return ' + ca + ';};'
                attrs.forEach(function (attr) {
                    var key = attr.key.value;
                    var valObj = attr.value;
                    if (key == 'name' || !valObj) {
                        name = valObj ? valObj.value : key;
                    }
                    if (key == 'assign' && valObj.type == 'STR') {
                        assign = valObj.value;
                    }
                    if (key == 'append' && valObj.type == 'STR') {
                        append = valObj.value
                    }
                });
            }

            if (name) {
                ret += 'smarty.capture["' + name + '"]=' + ca + 'a();';
            }
            if (assign) {
                me.capAssign[assign] = true;
                ret += '__cap["' + assign + '"]=function(){return ' + ca + 'a();}'
            }
            if (append) {
                var f = me.capAssign[append];
                if (f) {
                    ret += '__da.' + append + '["' + f + '"]=' + ca + 'a;'
                    me.capAssign[append]++
                }
                else {
                    ret += '__da.' + append + '={"0":' + ca + 'a};';
                    me.capAssign[append] = 1;
                }
            }
            
            return ret;
        }
    });
};