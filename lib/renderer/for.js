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
        _getFor: function (node) {
            var item = node.item;
            var from = node.from;
            var block = node.block;
            var start = node.start;
            var end = node.end;
            var me = this;
            var fc = '__fc' + utils.GUID();
            var ret;

            if (start && end) {
                ret = '\n'
                    + 'for ('
                    +     'var ' + fc + 'i=' + me._getExpr(start) + '; ' 
                    +     fc + 'i <= ' + me._getExpr(end) + ';' 
                    +     fc + 'i++'
                    + ') {';
                me.ctxScope.push(fc);
                ret += '\nvar ' + fc + ' = {};';
                ret += fc + '["' + item.value.value + '"] = ' + fc + 'i;';
                ret += me._init(block);
                ret += '}';
                me.ctxScope.pop();
            }
            else {
                var data = me._getExpr(from);
                ret = '\n'
                    + 'for ('
                    +     'var ' + fc + 'i = 0,' 
                    +      fc + 'len = ' + data + '.length; ' 
                    +      fc + 'i < ' + fc + 'len; ' 
                    +      fc + 'i++'
                    + ') {';
                me.ctxScope.push(fc);
                ret += '\nvar ' + fc + ' = {'
                    +     'index: ' + fc + 'i, '
                    +     'total: ' + fc + 'len, '
                    +     'first: ' + data + '[0], '
                    +     'last: ' + data + '[this.total],'
                    +     'show: (' + data + '[this.index]) ? true : false' 
                    + '};\n';
                ret += fc + '["' + item.value.value + '"] = ' + data + '[' + fc + 'i]';
                ret += me._init(block);
                ret += '}';
                me.ctxScope.pop();
            }

            return ret;
        }
    });
};