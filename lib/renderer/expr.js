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
                    var i0 = me._getExpr(items[0]);
                    var i1 = me._getExpr(items[1]);
                    if (op === '|') {
                        if (items[1].params && items[1].params.length) {
                            pipeParams = me._getPipeParams(items[1].params);
                        }
                        ret = i1 + '(' + i0 + pipeParams + ')';
                    }
                    else {
                        if (op === '+') {

                            var p1 = '(__dre.test(""+' + i0 + ') ? parseFloat(""+' + i0 + ', 10) : ' + i0 + ')';
                            var p2 = '(__dre.test(""+' + i1 + ') ? parseFloat(""+' + i1 + ', 10) : ' + i1 + ')';

                            ret = '(' + p1 + op + p2 + ')';
                        }
                        else {
                            ret = '(' + i0 + op + i1 + ')';
                        }
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