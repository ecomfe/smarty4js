/**
 * @file assign stmt render
 * @author Johnson (zoumiaojiang@gmail.com)
 */

var utils = require('../utils');


module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {
        /**
         * [_getExpr description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _assign: function (node) {
            var ret = '';
            var me = this;
            var key = node.key;
            var ret = me._getOriginVar(key);

            function addScope(str) {
                var tmps = '';
                var scope = me.ctxScope[0];
                //me.ctxScope.reverse().forEach(function (scope) {
                var tmpa = ret.replace(/__SCOPE/g, scope).split('.');
                var kf = tmpa[0];
                tmpa.forEach(function (item, index) {
                    if (index != 0 && index != tmpa.length - 1 && item) {
                        var spli = ((item.indexOf('[') > -1) ? '' : '.');
                        var tmp = kf + spli + item;
                        tmps += tmp + '=__v(' + tmp + ')?' + tmp + ':{};';
                        kf += spli + item; 
                    }
                });

                tmps += ret.replace(/__SCOPE/g, scope).replace(/\.\[/g, '[') + '=' + me._getExpr(node.value) + ';';
                //});
                //me.ctxScope.reverse();
                return tmps;
            }

            return addScope(ret);
        },

        _assignFunc: function (node) {
            var me = this;
            var attrs = node.attrs;
            var varKey, varVal;
            var ret = '';
            if (attrs) {
                if (attrs.length == 2) {
                    attrs.forEach(function (attr) {
                        var key = attr.key;
                        var val = attr.value;
                        if (key.value.toLowerCase() == 'var') {
                            if (val.type == 'STR') {
                                var tmp = 'data.' + val.value;
                                varKey = splitVar(tmp) + tmp;
                            }
                            else {
                                throw new Error('Assign Type Error!');
                            }
                        }

                        if (key.value.toLowerCase() == 'value') {
                            varVal = me._getExpr(val);
                        }
                    });

                    if (varKey && varVal) {
                        ret += varKey + '=' + varVal + ';';
                    }
                }
            }
            return ret;
        }
    });
};