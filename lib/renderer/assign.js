/**
 * @file assign stmt render
 * @author Johnson (zoumiaojiang@gmail.com)
 */

var utils = require('../utils');


module.exports = function (Renderer) {


    function splitVar(varVal) {

        var ret = '';
        var ka = varVal.split('.');

        for (var i = 0; i < ka.length; i++) {
            var di = ka[i];
            if (/(\[.*?\])/.test(di)) {
                var t = RegExp.$1;
                ka[i] = ka[i].replace(t, '');
                ka.splice(i + 1, 0, t);
                i++;
            }
        }
        console.log(ka)
        var keyFinal = ka[0];
        ka.forEach(function (item, index) {
            if (index != 0 && index != ka.length - 1 && item) {
                var spli = ((item.indexOf('[') > -1) ? '' : '.');
                var tmp = keyFinal + spli + item;
                ret += tmp + '=__v(' + tmp + ')?' + tmp + ':{};';
                keyFinal += spli + item; 
            }
        });

        return ret;
    }


    utils.mixin(Renderer.prototype, {
        /**
         * [_getExpr description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _assign: function (node) {
            var ret = '';
            var me = this;
            var key;
            if (node.key.type == 'STR' || node.key.type == 'FUNC') {
                throw new Error('Assign Type Error!');
            }
            var tmps = me._getVar(node.key)
                .replace(/__v/g, '')
                .replace(/\(/g, '')
                .replace(/\)/g, '')
                .replace(/(,\{\})/g, '').replace(/\[/g, '.[')
                .split(',');

            // find the most close scope from this foreach block
            for (var j = 0, len = tmps.length; j < len; j++) {
                ret += splitVar(tmps[j]);
            }

            ret += '\n' + tmps.join('=') + ' = ' + me._getExpr(node.value) + ';'

            return ret.replace(/\.([^\w])/g, function (s) {
                return RegExp.$1;
            });
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