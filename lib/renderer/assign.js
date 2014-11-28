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
        _assign: function (node) {
            var ret = '';
            var me = this;
            var key;
            var tmps = me._getVar(node.key)
                .replace(/__v/g, '')
                .replace(/\(/g, '')
                .replace(/\)/g, '')
                .replace(/(,\{\})/g, '')
                .split(',');

            // find the most close scope from this foreach block
            for (var i = 0, len = tmps.length; i < len; i++) {
                var pipe = tmps[i];
                if (pipe.indexOf('__fc') == -1) {
                    key = tmps[i];
                    break;
                }
            }

            var ka = key.split('.');

            for (var i = 0; i < ka.length; i++) {
                var di = ka[i];
                if (/(\[.*?\])/.test(di)) {
                    var t = RegExp.$1;
                    ka[i] = ka[i].replace(t, '');
                    ka.splice(i + 1, 0, t);
                    i++;
                }
            }

            var keyFinal = ka[0];
            ka.forEach(function (item, index) {
                if (index != 0 && index != ka.length - 1) {
                    var spli = ((item.indexOf('[') > -1) ? '' : '.');
                    var tmp = keyFinal + spli + item;
                    ret += tmp + '=__v(' + tmp + ')?' + tmp + ':{};';
                    keyFinal += spli + item; 
                }
            });
            ret += '\n' + key + ' = ' + me._getExpr(node.value) + ';'

            return ret;
        }
    });
};