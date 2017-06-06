/**
 * @file render expression of smarty
 * @author mj(zoumiaojiang@gmail.com)
 */


import utils from '../utils';

export default function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * render expression
         *
         * @param  {Object} node     ast node
         * @param  {number} f        is echo?
         * @return {string}          render result
         */
        _getExpr(node, f) {
            let me = this;
            let pipeParams = '';
            let ret = '';
            if ('E' === node.type) {
                let items = node.items || [];
                if (items.length === 2) {
                    let op = node.ops;
                    let i0 = me._getExpr(items[0]);
                    let i1 = me._getExpr(items[1]);
                    if (op === '|') {
                        if (items[1].params && items[1].params.length) {
                            pipeParams = me._getPipeParams(items[1].params);
                        }
                        ret = i1 + '(' + i0 + pipeParams + ')';
                    }
                    else {
                        if (op === '+') {

                            let p1 = '(__dre.test(""+' + i0 + ')?parseFloat(""+' + i0 + ',10):' + i0 + ')';
                            let p2 = '(__dre.test(""+' + i1 + ')?parseFloat(""+' + i1 + ',10):' + i1 + ')';

                            ret = '(' + p1 + op + p2 + ')';
                        }
                        else {
                            ret = '(' + i0 + op + i1 + ')';
                        }
                    }
                }
                else if (items.length === 1) {
                    let ops = node.ops;
                    let vara = me._getExpr(items[0]);
                    return (node.r === 'l') ? ops + vara : vara + ops;
                }
            }
            else {
                ret =  me._getLiteral(node, f);
            }
            return ret;
        }
    });
}
