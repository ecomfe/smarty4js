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
        _getExpr: function (node, f) {
            var me = this;
            var pipeParams = '';
            var ret = '';
            if ('E' === node.type) {
                var items = node.items || [];
                if (items.length == 2) {
                    var op = node.ops;
                    if (op === '|') {
                        if (items[1].params.length) {
                            pipeParams = me._getPipeParams(items[1].params);
                        }
                        ret = me._getExpr(items[1]) + '(' + me._getExpr(items[0]) + pipeParams + ')';
                    }
                    else {
                        ret = '(' + me._getExpr(items[0]) + op + me._getExpr(items[1]) + ')';
                    }
                }
                else if (items.length == 1) {
                    var ops = node.ops;
                    var vara = me._getExpr(items[0]);
                    return (node.r === 'l') ? ops + vara : vara + ops;
                }

                return ret;
            }
            else {
                return me._getLiteral(node, f);
            }
        }
    });
};