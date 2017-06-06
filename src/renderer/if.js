/**
 * @file conditions render(include if, else, elseif, else if)
 * @author mj(zoumiaojiang@gmail.com)
 */


import utils from '../utils';

export default function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * render if stmts
         * (this method include adapta ast nodes to real if, else, elseif)
         *
         * @param  {Object} node  ast node
         * @param  {number} flag  is tag in string?(2: true, 0: false)
         * @return {string}       render result
         */
        _getIf(node, flag) {
            let me = this;
            let {expr, block} = node;
            let ci = 0;
            let elseifindex = [];
            let elseindex = 0;
            let ifProcess = []; // real relations of if-else stmts
            let ret = '';

            block.forEach((b, index) => {
                if (b.type === 'ELSEIF') {
                    elseifindex.push(index);
                }
                else if (b.type === 'ELSE') {
                    elseindex = index;
                }
            });

            if (elseifindex.length > 0) {
                for (let i = 0, l = elseifindex.length; i <= l; i++) {
                    if (ci === 0) {
                        ifProcess.push({
                            type: 'IF',
                            expr: expr,
                            block: block.slice(ci, elseifindex[i])
                        });
                        ci = elseifindex[i];
                    }
                    else {
                        ifProcess.push({
                            type: 'ELSEIF',
                            expr: block[ci].expr,
                            block: block[ci].block.concat(
                                block.slice(
                                    ci + 1,
                                    elseifindex[i] || elseindex || block.length
                                )
                            )
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
                });
            }

            ifProcess.forEach(function (nod) {
                let type = nod.type;
                let tmps = '';
                switch (type) {
                    case 'IF':
                        ret += me._getIfReal(nod, flag);
                        break;
                    case 'ELSEIF':
                        tmps = me._getElseIf(nod, flag);
                        ret = flag ? ret.replace('__ELSE__', tmps) : (ret + tmps);
                        break;
                    case 'ELSE':
                        tmps = me._getElse(nod, flag);
                        ret = flag ? ret.replace('__ELSE__', tmps) : (ret + tmps);
                        break;
                    default:
                        break;
                }
            });

            return ret.replace('__ELSE__', '""');
        },

        /**
         * real render of if_stmt
         *
         * @param  {Object} node  ast node
         * @param  {number} flag  is tag in string?(2: true, 0: false)
         * @return {string}       render result
         */
        _getIfReal(node, flag) {
            let me = this;
            let expr = me._getExpr(node.expr);
            return flag
                ? '(' + expr + '?(' + me._init(node.block, flag) + '):__ELSE__)'
                : '\nif(' + expr + '){' + me._init(node.block) + '}';
        },

        /**
         * real render of else_stmt
         *
         * @param  {Object} node  ast node
         * @param  {number} flag  is tag in string?(2: true, 0: false)
         * @return {string}       render result
         */
        _getElseIf(node, flag) {
            let me = this;
            let expr = me._getExpr(node.expr);
            return flag
                ? '(' + expr + '?(' + me._init(node.block, flag) + '):__ELSE__)'
                : '\nelse if(' + expr + '){' + me._init(node.block) + '}';
        },

        /**
         * real render of elseif_stmt
         *
         * @param  {Object} node  ast node
         * @param  {number} flag  is tag in string?(2: true, 0: false)
         * @return {string}       render result
         */
        _getElse(node, flag) {
            let me = this;
            return flag
                ? '(' + me._init(node.block, flag) + ')'
                : '\nelse{' + me._init(node.block) + '}';
        }
    });
}
