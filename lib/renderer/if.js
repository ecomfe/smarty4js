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
        _getIf: function (node, flag) {
            var me = this;
            var expr = node.expr;
            var block = node.block;
            var ci = 0;
            var elseifindex = [];
            var elseindex = 0;
            var ifProcess = [];
            var ret = '';

            block.forEach(function (b, index) {
                if (b.type == 'ELSEIF') {
                    elseifindex.push(index);
                }
                else if (b.type == 'ELSE') {
                    elseindex = index;
                }
            });

            if (elseifindex.length > 0) {
                for (var i = 0, l = elseifindex.length; i <= l; i++) {
                    if (ci === 0) {
                        ifProcess.push({
                            type: 'IF',
                            expr: expr,
                            block: block.slice(ci, elseifindex[i])
                        })
                        ci = elseifindex[i];
                    }
                    else {
                        ifProcess.push({
                            type: 'ELSEIF',
                            expr: block[ci].expr,
                            block: block[ci].block.concat(block.slice(ci + 1, elseifindex[i] || elseindex))
                        });
                        ci = elseifindex[i];
                    }
                }
            }
            else {
                ifProcess.push({
                    type: 'IF',
                    expr: expr,
                    block: block.slice(0, elseindex || block.length)
                });
            }

            if (elseindex) {
                ifProcess.push({
                    type: 'ELSE',
                    block: block[elseindex].block.concat(block.slice(elseindex + 1))
                })
            }

            ifProcess.forEach(function (nod) {
                var type = nod.type;
                switch (type) {
                    case 'IF':
                        ret += me._getIfReal(nod, flag);
                        break;
                    case 'ELSEIF':
                        var tmps = me._getElseIf(nod, flag);
                        ret = flag ? ret.replace('__ELSE__', tmps) : (ret + tmps);
                        break;
                    case 'ELSE':
                        var tmps = me._getElse(nod, flag);
                        ret = flag ? ret.replace('__ELSE__', tmps) : (ret + tmps);
                        break;
                    default:
                        break;
                }
            });

            return ret.replace('__ELSE__', '""');
        },

        _getIfReal: function (node, flag) {
            var me = this;
            var expr = me._getExpr(node.expr);
            return flag 
                ? '(' + expr + '?(' + me._init(node.block, flag) + '):__ELSE__)'
                : '\nif(' + expr + '){' + me._init(node.block) + '}';
        },

        _getElseIf: function (node, flag) {
            var me = this;
            var expr = me._getExpr(node.expr);
            return flag
                ? '(' + expr + '?(' + me._init(node.block, flag) + '):__ELSE__)'
                : '\nelse if(' + expr + '){' + me._init(node.block) + '}';
        },

        _getElse: function (node, flag) {
            var me = this;
            return flag 
                ? '(' + me._init(node.block, flag) + ')'
                : '\nelse{' + me._init(node.block) + '}';
        }
    });
};