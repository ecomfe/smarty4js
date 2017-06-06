/**
 * @file render of assign_stmt
 * @author mj(zoumiaojiang@gmail.com)
 */

import utils from '../utils';

export default function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * render assign
         * {%$some_let = anything%}
         *
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _assign(node) {
            let me = this;
            let key = node.key;
            let ret = me._getOriginVar(key);

            /**
             * add scope for assign var
             *
             * @param  {string} str   pre-render result
             * @return {string}       render result
             */
            function addScope(str) { // TODO: now all assign to smarty global context...

                // a tmp assign var
                let tmps = '__assign=' + me._getExpr(node.value) + ';';
                let scope;

                // scope = me.ctxScope[0];
                for (let ctxi = me.ctxScope.length - 1; ctxi >= 0; ctxi--) {
                    scope = me.ctxScope[ctxi];
                    let tmpa = ret.replace(/__SCOPE/g, scope).split('.');
                    let kf = tmpa[0];
                    for (let index = 0, jl = tmpa.length; index < jl; index++) {
                        let item = tmpa[index];
                        if (index !== 0 && index !== jl - 1 && item) {
                            let spli = ((item.indexOf('[') > -1) ? '' : '.');
                            let tmp = kf + spli + item;
                            tmps += tmp + '=' + tmp + '?' + tmp + ':{};';
                            kf += spli + item;
                        }
                    }

                    if (ctxi === 0) {
                        tmps += ret.replace(/__SCOPE/g, scope).replace(/\.\[/g, '[') + '=';
                    }
                }
                return tmps += '__assign;';
            }

            return addScope(ret);
        },

        /**
         * assign function
         * {%assign var=xxx value=xxx%}
         *
         * @param  {Object} node     ast node
         * @return {string}          render string
         */
        _assignFunc(node) {
            let me = this;
            let attrs = node.attrs;
            let varKey;
            let varVal;
            let ret = '';
            if (attrs) {
                attrs.forEach(attr => {
                    let {key, value} = attr;
                    if (key.value === 'var') {
                        if (value.type === 'STR') {
                            varKey = '__da.' + value.value;
                        }
                        else {
                            throw new Error('Assign Type Error!');
                        }
                    }

                    if (key.value === 'value') {
                        varVal = me._getExpr(value);
                    }
                });

                if (varKey && varVal) {
                    ret += varKey + '=' + varVal + ';';
                }
            }
            return ret;
        }
    });
}
