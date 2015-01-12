/**
 * @file render of assign_stmt
 * @author johnson [zoumiaojiang@gmail.com]
 */

var utils = require('../utils');


module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * render assign
         * {%$some_var = anything%}
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _assign: function (node) {
            var me = this;
            var key = node.key;
            var ret = me._getOriginVar(key);

            /**
             * add scope for assign var
             * @param  {string} str   pre-render result
             * @return {string}       render result
             */
            function addScope(str) { // TODO: now all assign to smarty global context...

                // a tmp assign var
                var tmps = '__assign=' + me._getExpr(node.value) + ';';
                var scope;

                // scope = me.ctxScope[0];
                for (var ctxi = me.ctxScope.length - 1; ctxi >= 0; ctxi--) {
                    scope = me.ctxScope[ctxi];
                    var tmpa = ret.replace(/__SCOPE/g, scope).split('.');
                    var kf = tmpa[0];
                    for (var index = 0, jl = tmpa.length; index < jl; index++) {
                        var item = tmpa[index];
                        if (index !== 0 && index !== jl - 1 && item) {
                            var spli = ((item.indexOf('[') > -1) ? '' : '.');
                            var tmp = kf + spli + item;
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
         * @param  {Object} node     ast node
         * @return {string}          render string
         */
        _assignFunc: function (node) {
            var me = this;
            var attrs = node.attrs;
            var varKey;
            var varVal;
            var ret = '';
            if (attrs) {
                attrs.forEach(function (attr) {
                    var key = attr.key;
                    var val = attr.value;
                    if (key.value === 'var') {
                        if (val.type === 'STR') {
                            varKey = '__da.' + val.value;
                        }
                        else {
                            throw new Error('Assign Type Error!');
                        }
                    }

                    if (key.value === 'value') {
                        varVal = me._getExpr(val);
                    }
                });

                if (varKey && varVal) {
                    ret += varKey + '=' + varVal + ';';
                }
            }
            return ret;
        }
    });
};
