/**
 * @file render of php_function and smarty_tag_function
 * @author johnson [zoumiaojiang@gmail.com]
 */

var utils = require('../utils');

module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * enter of all functions
         * @param  {Object} node  ast node
         * @param  {number|boolean} f     is literal(2) or echo result(1)?
         * @return {string}       render result
         */
        _getFunction: function (node, f) {

            // exclued 'config_load, php, include_php'
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
                        return me._getFunc(node);
                    case 'strip':
                        return me._getStrip(node);
                    case 'call':
                        return me._getCallFunc(node);
                    case 'assign':
                        return me._assignFunc(node);
                    case 'foreach':
                        return me._getFuncFor(node);
                    case 'section':
                        return me._getSection(node);
                    case 'include':
                        return me._getInclude(node);
                    case 'insert':
                        return me._getInclude(node);
                    case 'literal':
                        return me._getFuncLiteral(node);
                    case 'nocache':
                        return me._getFuncLiteral(node);
                    case 'ldelim':
                        return utils.p('"' + me.engine.conf.left_delimiter + '"');
                    case 'rdelim':
                        return utils.p('"' + me.engine.conf.right_delimiter + '"');
                    case 'block':
                        return me._getMasterBlock(node);
                    case 'append':
                        return me._getAppend(node);
                    case 'capture':
                        return me._getCapture(node);
                    case 'break':
                        return 'break;';
                    default:
                        return me._callFunc(node, f);
                }
            }

            return ret;
        },

        /**
         * function define tag
         * {%function name=example ... %}
         *     ...
         * {%/function%}
         * @param  {Object} node  ast node
         * @return {string}       render result
         */
        _getFunc: function (node) {
            var me = this;
            var func = '__func' + utils.getGUID();
            var funcName;
            var tmparr = [];

            node.attrs.forEach(function (nod, index) {
                if (nod.value) {
                    if (nod.key.value === 'name' && nod.value.type === 'STR') {
                        funcName = nod.value.value;
                    }
                    else {
                        tmparr.push(nod);
                    }
                }
                else if (!nod.value && index === 0) {
                    funcName = nod.key.value;
                }
                else {
                    tmparr.push(nod);
                }
            });

            /**
             * get default params of smarty-tag function
             * @param  {string} func            function context scope
             * @param  {Array<Object>} arr      array of ast node(params)
             * @return {string}                 render result
             */
            function getDefaultParams(func, arr) {
                var tmps = '';
                arr.forEach(function (node) {
                    if (node.value) {
                        var p = node.key.value;
                        var vara = me._getExpr(node.value);
                        tmps += '\n' + func  + '.' + p + '=__v(__p.' + p + ',' + vara + ');';
                    }
                });

                return tmps;
            }

            var ret = '\n__func["__fn__' + funcName + '"]=function(__p){';
            var fc = utils.getGUID();
            me.ctxScope.push(func);
            ret += 'for(var __ in __p){if(__p.hasOwnProperty(__)&&__da[__]==undefined){__da[__]=__p[__];}}\n'
                + 'var ' + func + ' = __p,__' + fc + 'h="";'
                + getDefaultParams(func, tmparr)
                + me._init(node.block).replace(/__h/g, '__' + fc + 'h')
                + 'return __' + fc + 'h;\n};';
            me.ctxScope.pop();
            return ret;
        },

        /**
         * call function
         * just like ({%a_function_name attrK=attrV ...%})
         * @param  {Object} node    ast node
         * @param  {number} flag    is literal or echo?
         * @return {string}         render result
         */
        _callFunc: function (node, flag) {
            var me = this;
            var funcName = node.name;
            var attrs = node.attrs;
            var ps = [];
            var ret = '';
            var begin = (flag === 2 ? '' : '__h+=');
            var end = (flag === 2 ? '' : ';');
            if (funcName) {
                if (attrs) {
                    if (attrs.length === 0) {
                        ret = begin + '__func["__fn__' + funcName + '"]({})' + end;
                    }
                    else {
                        node.attrs.forEach(function (nod) {
                            ps.push(nod.key.value + ':' + (nod.value ? me._getExpr(nod.value) : ''));
                        });
                        ret = begin + '__func["__fn__' + funcName + '"]({' + ps.join(',') + '})' + end;
                    }
                }
            }
            else {
                throw new Error('No Function Error! No function `' + funcName + '`!');
            }
            return ret;
        },

        /**
         * render strip function
         * {%strip%} ... {%/strip%}
         * @param  {Object} node    ast node
         * @return {string}         render result
         */
        _getStrip: function (node) {
            var block = node.block;
            return this._init(block)
                .replace(/\"\s+/g, '" ')
                .replace(/\s+\"/g, ' "')
                .replace(/\s+</g, '<')
                .replace(/>\s+/g, '>');
        },

        /**
         * render literal function
         * {%literal%} ... {%/literal%}
         * don't suggest to use single '{' and '}' to be limiter
         * so this function is smarty adapter
         * @param  {Object} node   ast node
         * @return {string}        render result
         */
        _getFuncLiteral: function (node) {
            var block = node.block;
            return this._init(block);
        },

        /**
         * render call function..
         * {%call k1=v1 k2=v2 ...%}
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getCallFunc: function (node) {
            var me = this;
            var ret = '';
            var attrs = node.attrs;
            var name = '';
            var params = '{';
            var assign;
            if (attrs) {
                attrs.forEach(function (attr) {
                    if ((attr.key.value === 'name' || !attr.value)) {
                        name = (attr.value ?  me._getExpr(attr.value).replace(/"/g, '') : attr.key.value);
                    }
                    else if (attr.key.value === 'assign') {
                        assign = me._getExpr(attr.value).replace(/"/g, '');
                    }
                    else {
                        params += attr.key.value + ':' + me._getExpr(attr.value) + ',';
                    }
                });

                if (name) {
                    ret += '\n'
                        + (assign ? ('__da.' + assign + '=') : '__h+=')
                        + '__func["__fn__' + name + '"]('
                        + (params.indexOf(',') > -1 ? params : ',')
                        + (assign ? '__s:1' : '') + '});';
                }
            }

            return ret;
        },

        /**
         * append function
         * {%append var=xxx index=xxx value=xxx%}
         * @param  {Object} node    ast node
         * @return {string}         render result
         */
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
                    if ((key === 'var' || (!valObj && index === 0))) {
                        var varaNode = valObj ? valObj : attr.key;
                        if (varaNode.type === 'STR') {
                            vara = me._getStr(varaNode);
                        }
                    }
                    if ((key === 'value' || (!valObj && index === 1))) {
                        value = me._getExpr(valObj ? valObj : attr.key);
                    }
                    if (key === 'index') {
                        var tmp = valObj.value;
                        ind = typeof tmp === 'string' ? ('"' + tmp + '"') : me._getExpr(tmp);
                    }
                });
                if (vara && value) {
                    ret += '__ti_=' + (ind ? ind : '__f["count"]((__da[' + vara + ']||{}))') + ';'
                        + '__t_=__da[' + vara + '];'
                        + '__da[' + vara + ']=__t_?__t_:{};'
                        + '__da[' + vara + '][__ti_]=' + value + ';';
                }
            }

            return ret;
        },

        /**
         * capture function
         * {%capture name=xxx assign=xxx append=xxx%}
         * @param  {Object} node    ast node
         * @return {string}         render result
         */
        _getCapture: function (node) {
            var me = this;
            var ret = '';
            var attrs = node.attrs;
            var block = node.block;
            var name = '';
            var assign = '';
            var append = '';
            var ca = '__ca' + utils.getGUID();

            if (attrs) {
                ret += 'var ' + ca + 'a=function(){var ' + ca + '="";'
                    + me._init(block).replace(/__h/g, ca)
                    + 'return ' + ca + ';};';
                attrs.forEach(function (attr) {
                    var key = attr.key.value;
                    var valObj = attr.value;
                    if (key === 'name' || !valObj) {
                        name = valObj ? valObj.value : key;
                    }
                    if (key === 'assign' && valObj.type === 'STR') {
                        assign = valObj.value;
                    }
                    if (key === 'append' && valObj.type === 'STR') {
                        append = valObj.value;
                    }
                });
            }

            if (name) {
                ret += 'smarty.capture["' + name + '"]=' + ca + 'a();';
            }
            if (assign) {
                me.capAssign[assign] = true;
                ret += '__cap["' + assign + '"]=function(){return ' + ca + 'a();}';
            }
            if (append) {
                var f = me.capAssign[append];
                if (f) {
                    ret += '__da.' + append + '["__a' + f + '"]=' + ca + 'a;';
                    me.capAssign[append]++;
                }
                else {
                    ret += '__da.' + append + '={"__a0":' + ca + 'a};';
                    me.capAssign[append] = 1;
                }
            }

            return ret;
        }
    });
};
