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
        _getIf: function (node) {
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
                        ret += me._getIfReal(nod);
                        break;
                    case 'ELSEIF':
                        ret += me._getElseIf(nod);
                        break;
                    case 'ELSE':
                        ret += me._getElse(nod);
                        break;
                    default:
                        break;
                }
            });

            return ret;
        },

        _getIfReal: function (node) {

            var expr = this._getExpr(node.expr);
            return '\nif (' + expr + ') {' + this._init(node.block) + '}';
        },

        _getElseIf: function (node) {
            return '\nelse if (' + this._getExpr(node.expr) + ') {' + this._init(node.block) + '}';
        },

        _getElse: function (node) {
            return '\nelse {' + this._init(node.block) + '}';
        }
    });
};