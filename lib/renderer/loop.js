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
                    + 'for('
                    +     'var ' + fc + 'i=' + me._getExpr(start) + ';' 
                    +     fc + 'i<=' + me._getExpr(end) + ';' 
                    +     fc + 'i++'
                    + '){';
                me.ctxScope.push(fc);
                ret += '\nvar ' + fc + '={};';
                ret += fc + '["' + item.value.value + '"]=' + fc + 'i;';
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
                ret = 'var ' + fc + '__d=' + data + ';';
                ret += 'var ' + fc + 'fi=0,' + fc + '__={},' + fc + '={};\n'
                    + 'for(var ' + fc + 'k in ' + fc + '__d){if(' + fc + '__d.hasOwnProperty(' + fc + 'k)){';
                me.ctxScope.push(fc);
                ret += '\n' + fc + '__=smarty.foreach={'
                    +     'index:' + fc + 'fi,'
                    +     'key:' + fc + 'k.replace("__a",""),'
                    +     'total:__f.count(' + fc + '__d),'
                    +     'first:' + fc + 'fi==0?1:"",'
                    +     'last:(' + fc + 'fi==__f.count(' + fc + '__d)-1)?1:"",'
                    +     'show:(' + fc + '__d[' + fc + 'k])?true:false' 
                    + '};\n';
                if (key) {
                    ret += fc + '["' + key + '"] = ' + fc + 'k.replace(/__a/g,"");';
                }

                ret += fc + '["' + val + '"]=' + fc + '__d[' + fc + 'k];';
                ret += me._init(block) + fc + 'fi++;}}';
                me.ctxScope.pop();
            }

            return ret;
        },

        _getFuncFor: function (node) {
            var me = this;
            var attrs = node.attrs;
            var block = node.block;
            var from, item, key, name;
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
                ret = 'var ' + fc + '__d=' + from + ';';
                ret += 'var ' + fc + 'fi=0,' + fc + '__={},' + fc + '={};'
                    + '\nfor(var ' + fc + 'k in ' + fc + '__d){if(' + fc + '__d.hasOwnProperty(' + fc + 'k)){'
                me.ctxScope.push(fc);
                ret += '\n' + fc + '__=smarty.foreach={'
                    +     'index:' + fc + 'fi,'
                    +     'key:' + fc + 'k.replace("__a",""),'
                    +     'total:__f.count(' + fc + '__d),'
                    +     'first:' + fc + 'fi==0?1:"",'
                    +     'last:(' + fc + 'fi==__f.count(' + fc + '__d)-1)?1:"",'
                    +     'show:(' + fc + '__d[' + fc + 'k])?true:false' 
                    + '};\n';
                if (key) {
                    ret += fc + '["' + key + '"]=' + fc + 'k.replace(/__a/g,"");';
                }
                ret += fc + '["' + item + '"]=' + fc + '__d[' + fc + 'k];';
                ret += me._init(block) + fc + 'fi++;}}'
                me.ctxScope.pop();
            }

            return ret;
        },

        _getWhile: function (node) {
            var me = this;
            var expr = node.expr;
            var block = node.block;
            return '\nwhile(' + me._getExpr(expr) + '){' + me._init(block) + '}'
        },

        _getSection: function (node) {
            // TODO: section
            var me = this;
            var fc = '__fc' + utils.GUID();
            var name, loop, step=1, start=0, max=fc+'l', show=true;
            var attrs = node.attrs;
            var block = node.block;
            var ret = '';

            if (attrs) {
                attrs.forEach(function (attr) {
                    var key = attr.key.value;
                    var val = attr.value;
                    if (key == 'name') {
                        name = me._getExpr(val);
                    }
                    if (key == 'loop') {
                        loop = me._getExpr(val);
                    }
                    if (key == 'step') {
                        step = me._getExpr(val);
                    }
                    if (key == 'start') {
                        start = me._getExpr(val);
                    }
                    if (key == 'show') {
                        show = me._getExpr(val);
                    }
                    if (key == 'max') {
                        max = me._getExpr(val);
                    }
                });
                if (name && loop) {
                    me.ctxScope.push(fc)
                    ret += '\nvar ' 
                        + fc + 'l,' 
                        + fc + 'n=0,' 
                        + fc + '={},'
                        + fc + 'o=' + loop + ';\n'
                        + 'if(typeof ' + fc + 'o=="number"){' 
                        +     fc + 'o=__f.range(0, ' + fc + 'o-1);' 
                        + '}'
                        + step + '<0&&' + fc + 'o.reverse();'
                        + fc + 'l=__f.count(' + fc + 'o);\n'
                        + 'for('
                        +     'var ' + fc + 'i=' + start + ';' 
                        +     fc + 'i<' + fc + 'l;' 
                        +     fc + 'i+=Math.abs(' + step + ')'
                        + '){\n'
                        +     'if(' + fc + 'n>=' + max + '){break;}' 
                        +     '__sec[' + name + ']=smarty.section[' + name + ']={'
                        +         'index:' + fc + 'i,'
                        +         'index_prev:' + fc + 'i-Math.abs(' + step + '),'
                        +         'index_next:' + fc + 'i+Math.abs(' + step + '),'
                        +         'first:' + fc + 'n==0?1:"",'
                        +         'last:' + fc + 'n==(' + fc + 'l-' + start + ')/' + step + '-1?1:"",'
                        +         'rownum:' + fc + 'n+1,'
                        +         'total:' + fc + 'l/' + step + ','
                        +         'show:' + show + ','
                        +         'loop:' + fc + 'l'
                        +     '};'
                        +     (show == true? me._init(block) : '')
                        +     fc + 'n++;\n'
                        + '}'
                    me.ctxScope.pop();
                }
            }

            return ret;
        }
    });
};