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
            var me = this;
            var key;
            var tmps = me._getVar(node.key).split('||');

            // find the most close scope from this foreach block
            for (var i = 0, len = tmps.length; i < len; i++) {
                var pipe = tmps[i];
                 if (pipe.indexOf('__fc') == -1) {
                    key = tmps[i].replace('(', '').replace(')', '');
                    break;
                }
            }

            return '\n' + key + '= ' + me._getExpr(node.value) + ';';
        }
    });
};