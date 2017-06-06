/**
 * @file render of php_function and smarty_tag_function
 * @author mj(zoumiaojiang@gmail.com)
 */


import utils from '../utils';

export default function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * enter of all functions
         *
         * @param  {Object} node  ast node
         * @param  {number|boolean} f     is literal(2) or echo result(1)?
         * @return {string}       render result
         */
        _getFunction(node, f) {

            // exclued 'config_load, php, include_php'
            let me = this;
            let name = node.name;
            let ret;
            let fobj = me.engine.phpfunc;
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
         *
         * @param  {Object} node  ast node
         * @return {string}       render result
         */
        _getFunc(node) {
            let me = this;
            let func = '__func' + utils.getGUID();
            let funcName;
            let tmparr = [];

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
             *
             * @param  {string} func            function context scope
             * @param  {Array<Object>} arr      array of ast node(params)
             * @return {string}                 render result
             */
            function getDefaultParams(func, arr) {
                let tmps = '';
                arr.forEach(function (node) {
                    if (node.value) {
                        let p = node.key.value;
                        let vara = me._getExpr(node.value);
                        tmps += '\n' + func  + '.' + p + '=__v(__p.' + p + ',' + vara + ');';
                    }
                });

                return tmps;
            }

            let ret = '\n__func["__fn__' + funcName + '"]=function(__p){';
            let fc = utils.getGUID();
            me.ctxScope.push(func);
            ret += 'for(let __ in __p){if(__p.hasOwnProperty(__)&&__da[__]==undefined){__da[__]=__p[__];}}\n'
                + 'let ' + func + ' = __p,__' + fc + 'h="";'
                + getDefaultParams(func, tmparr)
                + me._init(node.block).replace(/__h/g, '__' + fc + 'h')
                + 'return __' + fc + 'h;\n};';
            me.ctxScope.pop();
            return ret;
        },

        /**
         * call function
         * just like ({%a_function_name attrK=attrV ...%})
         *
         * @param  {Object} node    ast node
         * @param  {number} flag    is literal or echo?
         * @return {string}         render result
         */
        _callFunc(node, flag) {
            let me = this;
            let funcName = node.name;
            let attrs = node.attrs;
            let ps = [];
            let ret = '';
            let begin = (flag === 2 ? '' : '__h+=');
            let end = (flag === 2 ? '' : ';');
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
         *
         * @param  {Object} node    ast node
         * @return {string}         render result
         */
        _getStrip(node) {
            let block = node.block;
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
         *
         * @param  {Object} node   ast node
         * @return {string}        render result
         */
        _getFuncLiteral(node) {
            let block = node.block;
            return this._init(block);
        },

        /**
         * render call function..
         * {%call k1=v1 k2=v2 ...%}
         *
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getCallFunc(node) {
            let me = this;
            let ret = '';
            let attrs = node.attrs;
            let name = '';
            let params = '{';
            let assign;
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
         *
         * @param  {Object} node    ast node
         * @return {string}         render result
         */
        _getAppend(node) {
            let me = this;
            let ret = '';
            let attrs = node.attrs;
            let vara;
            let ind = '';
            let value;

            if (attrs) {
                attrs.forEach((attr, index) => {
                    let key = attr.key.value;
                    let valObj = attr.value;
                    if ((key === 'var' || (!valObj && index === 0))) {
                        let varaNode = valObj ? valObj : attr.key;
                        if (varaNode.type === 'STR') {
                            vara = me._getStr(varaNode);
                        }
                    }
                    if ((key === 'value' || (!valObj && index === 1))) {
                        value = me._getExpr(valObj ? valObj : attr.key);
                    }
                    if (key === 'index') {
                        let tmp = valObj.value;
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
         *
         * @param  {Object} node    ast node
         * @return {string}         render result
         */
        _getCapture(node) {
            let me = this;
            let ret = '';
            let attrs = node.attrs;
            let block = node.block;
            let name = '';
            let assign = '';
            let append = '';
            let ca = '__ca' + utils.getGUID();

            if (attrs) {
                ret += 'let ' + ca + 'a=function(){let ' + ca + '="";'
                    + me._init(block).replace(/__h/g, ca)
                    + 'return ' + ca + ';};';
                attrs.forEach(attr => {
                    let key = attr.key.value;
                    let valObj = attr.value;
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
                let f = me.capAssign[append];
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
}
