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
                var val, key;
                
                if (item.type == 'OBJ') {
                    val = item.value.value.value;
                    key = item.key.value.value;
                }
                else {
                    val = item.value.value;
                }

                // todo: foreach for object
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
                    +     'key: ' + fc + 'i, '
                    +     'total: ' + fc + 'len, '
                    +     'first: ' + data + '[0], '
                    +     'last: ' + data + '[' + fc + 'len - 1],'
                    +     'show: (' + data + '[' + fc + 'i]) ? true : false' 
                    + '};\n';
                if (key) {
                    ret += fc + '[' + key + '] = ' + fc + 'i;';
                }
                ret += fc + '["' + val + '"] = ' + data + '[' + fc + 'i];';
                ret += me._init(block) + '}';
                me.ctxScope.pop();
            }

            return ret;
        },

        _getForIn: function (node) { //todo : object for-in is not ok, because don't know data is object or array
            var item = node.item;
            var from = node.from;
            var block = node.block;
            var me = this;
            var fc = '__fc' + utils.GUID();
            var ret;

            var data = me._getExpr(from);
            ret = 'for (var ' + fc + 'k in ' + data + ') {';
            me.ctxScope.push(fc);
            ret += '\nvar ' + fc + ' = { key: ' + fc + 'k };\n';
            ret += fc + '["' + item.value.value + '"] = ' + data + '[' + fc + 'k]';
            ret += me._init(block);
            ret += '}';
            me.ctxScope.pop();

            return ret;
        }
    });
};