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
                
                ret = '\nfor (var ' + fc + 'k in ' + data + ') { \nif (' + data + '.hasOwnProperty(' + fc + 'k)) {';
                me.ctxScope.push(fc);
                ret += '\nvar ' + fc + ' = {};var ' + fc + '__ = {'
                    +     'index: ' + fc + 'k, '
                    +     'key: ' + fc + 'k, '
                    +     'total: __f.count(' + data + '),'
                    +     'first: ' + fc + 'k == 0 ? true : false, '
                    +     'last: ' + fc + 'k == __f.count(' + data + ') - 1 ? true : false,'
                    +     'show: (' + data + '[' + fc + 'k]) ? true : false' 
                    + '};\n';
                if (key) {
                    ret += fc + '["' + key + '"] = ' + fc + 'k;';
                }

                ret += fc + '["' + val + '"] = ' + data + '[' + fc + 'k];';
                ret += me._init(block) + '}}';
                me.ctxScope.pop();
            }

            return ret;
        },

        _getFuncFor: function (node) {
            var me = this;
            var attrs = node.attrs;
            var block = node.block;
            var from;
            var item;
            var key;
            var name;
            var ret;

            attrs.forEach(function (attr) {
                var akey = attr.key.value;
                var type = attr.value ? attr.value.type : '';
                if (akey === 'from' && (type === 'VAR' || type === 'E')) {
                    from = me._getExpr(attr.value);
                }
                else if (akey === 'item' && type === 'STR') {
                    item = attr.value.value;
                }
                else if (akey === 'name' && type === 'STR') {
                    name = attr.value.value;
                }
                else if (akey === 'key' && type === 'STR') {
                    key = attr.value.value;
                }
            });

            if (from && item) {
                var fc = '__fc' + (name ? name : utils.GUID());
                ret = '\nfor (var ' + fc + 'k in ' + from + ') {\nif (' + from + '.hasOwnProperty(' + fc + 'k)) {'
                me.ctxScope.push(fc);
                ret += '\nvar ' + fc + ' = {};var ' + fc + '__ = {'
                    +     'index: ' + fc + 'k, '
                    +     'key: ' + fc + 'k, '
                    +     'total: __f.count(' + from + '),'
                    +     'first: ' + fc + 'k == 0 ? true : false, '
                    +     'last: ' + fc + 'k == __f.count(' + from + ') - 1 ? true : false,'
                    +     'show: (' + from + '[' + fc + 'k]) ? true : false' 
                    + '};\n';
                if (key) {
                    ret += fc + '["' + key + '"] = ' + fc + 'k;';
                }
                ret += fc + '["' + item + '"] = ' + from + '[' + fc + 'k];';
                ret += me._init(block) + '}};'
                me.ctxScope.pop();
            }

            return ret;
        },

        _getWhile: function (node) {
            var me = this;
            var expr = node.expr;
            var block = node.block;
            return '\nwhile (' + me._getExpr(expr) + ') {' + me._init(block) + '}'
        },

        _getSection: function (node) {
            // todo: section
            
            return '';
        }
    });
};