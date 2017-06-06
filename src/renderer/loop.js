/**
 * @file loop of smarty(for, foreach, section, while)
 * @author mj(zoumiaojiang@gmail.com)
 */


import utils from '../utils';

export default function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * for or foreach like php
         * {%for $xxx = 1 to 10%}
         *     ...
         * {%/for%}
         * {%foreach $from as $key => $item%}
         *     ...
         * {%/foreach%}
         *
         * @param  {Object} node    ast node
         * @return {string}         render result
         */
        _getFor(node) {
            let item = node.item;
            let from = node.from;
            let block = node.block;
            let start = node.start;
            let end = node.end;
            let step = node.step;
            let fel = 0; // foreachelse
            let me = this;
            let fc = '__fc' + utils.getGUID();
            let ret;
            let stepStr = 'i++';

            if (start && end) {
                if (step) {
                    if (step.key === 'step') {
                        stepStr = 'i+=' + this._getExpr(step.value);
                    }
                    // Just let it going on ~~ :P
                    // else {
                    //     throw new Error('... for $item = $start to $end ^ [Expecting `step`] ...');
                    // }
                }
                ret = '\n'
                    + 'for('
                    +     'var ' + fc + 'i=' + me._getExpr(start) + ';'
                    +     fc + 'i<=' + me._getExpr(end) + ';'
                    +     fc + stepStr //'i++'
                    + '){\n';
                me.ctxScope.push(fc);
                ret += 'var ' + fc + '={};'
                    + fc + '["' + item.value.value + '"]=' + fc + 'i;'
                    + me._init(block)
                    + '}';
                me.ctxScope.pop();
            }
            else {
                let data = me._getExpr(from);
                let val;
                let key;
                fel = utils.getForeachelseIndex(block);
                if (item.type === 'OBJ') {
                    val = item.value.value.value;
                    key = item.key.value.value;
                }
                else {
                    val = item.value.value;
                }
                ret = 'var '
                    + fc + '__d=' + data + ','
                    + fc + 'fi=0,'
                    + fc + '__={},'
                    + fc + '={};\n';
                if (fel) {
                    let feblock = block[fel].block.concat(block.slice(fel + 1));
                    block = block.slice(0, fel);
                    ret += 'if(' + fc + '__d&&__f["count"](' + fc + '__d)) {';
                }
                ret += 'for(var ' + fc + 'k in ' + fc + '__d){if(' + fc + '__d.hasOwnProperty(' + fc + 'k)){';
                me.ctxScope.push(fc);
                ret += '\n' + fc + '__=smarty.foreach={'
                    +     'index:' + fc + 'fi,'
                    +     'iteration:' + fc + 'fi==0?"":' + fc + 'fi,'
                    +     'key:' + fc + 'k.replace("__a",""),'
                    +     'total:__f["count"](' + fc + '__d),'
                    +     'first:' + fc + 'fi==0?1:"",'
                    +     'last:(' + fc + 'fi==__f["count"](' + fc + '__d)-1)?1:"",'
                    +     'show:(' + fc + '__d[' + fc + 'k])?true:false'
                    + '};\n';
                if (key) {
                    ret += fc + '["' + key + '"] = ' + fc + 'k.replace(/__a/g,"");';
                }

                ret += fc + '["' + val + '"]=' + fc + '__d[' + fc + 'k];';
                ret += me._init(block) + fc + 'fi++;}}';
                if (fel) {
                    ret += '}else{' + me._init(feblock) + '}';
                }
                me.ctxScope.pop();
            }

            return ret;
        },

        /**
         * render foreach function
         * {%foreach from=xxx key=xxx name=xxx item=xxx%}
         *     ...
         * {%/foreach%}
         *
         * @param  {Object}     node ast node
         * @return {string}     render result
         */
        _getFuncFor(node) {
            let me = this;
            let attrs = node.attrs;
            let block = node.block;
            let from;
            let item;
            let key;
            let name;
            let ret;
            let fel = 0; // foreachelse

            attrs.forEach(attr => {
                let akey = attr.key.value;
                let type = attr.value ? attr.value.type : '';
                if (akey === 'from' && (type === 'VAR' || type === 'E' || type === 'ARRAY')) {
                    from = me._getExpr(attr.value);
                }
                else if (akey === 'item') {
                    let val = attr.value;
                    if (val.type === 'STR') {
                        item = me._getExpr(val);
                    }
                    else if (val.type === 'VAR') {
                        item = '"' + val.value.value + '"';
                    }
                }
                else if (akey === 'name') {
                    name = me._getExpr(attr.value);
                }
                else if (akey === 'key') {
                    key = me._getExpr(attr.value);
                }
            });

            if (from && item) {
                let fc = '__fc' + utils.getGUID();
                fel = utils.getForeachelseIndex(block);
                ret = 'var '
                    + fc + '__d=' + from + ','
                    + fc + 'fi=0,'
                    + fc + '__={},'
                    + fc + '={};\n';
                if (fel) {
                    let feblock = block[fel].block.concat(block.slice(fel + 1));
                    block = block.slice(0, fel);
                    ret += 'if(' + fc + '__d&&__f["count"](' + fc + '__d)) {';
                }
                ret += 'for(var ' + fc + 'k in ' + fc + '__d){if(' + fc + '__d.hasOwnProperty(' + fc + 'k)){';
                me.ctxScope.push(fc);
                ret += '\n' + fc + '__=__for[' + (name || fc) + ']=smarty.foreach={'
                    +     'index:' + fc + 'fi,'
                    +     'iteration:' + fc + 'fi==0?"":' + fc + 'fi,'
                    +     'key:' + fc + 'k.replace("__a",""),'
                    +     'total:__f["count"](' + fc + '__d),'
                    +     'first:' + fc + 'fi==0?1:"",'
                    +     'last:(' + fc + 'fi==__f["count"](' + fc + '__d)-1)?1:"",'
                    +     'show:(' + fc + '__d[' + fc + 'k])?true:false'
                    + '};\n';
                if (key) {
                    ret += fc + '[' + key + ']=' + fc + 'k.replace(/__a/g,"");';
                }
                ret += fc + '[' + item + ']=' + fc + '__d[' + fc + 'k];';
                ret += me._init(block) + fc + 'fi++;}}';
                if (fel) {
                    ret += '}else{' + me._init(feblock) + '}';
                }
                me.ctxScope.pop();
            }

            return ret;
        },

        /**
         * render while stmt
         * {%while expr%}
         *     ...
         * {%/while%}
         *
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getWhile(node) {
            let me = this;
            return '\nwhile(' + me._getExpr(node.expr) + '){' + me._init(node.block) + '}';
        },

        /**
         * render section function
         *
         * @param  {Object} node     ast node
         * @return {string}          render string
         */
        _getSection(node) {
            let me = this;
            let fc = '__fc' + utils.getGUID();
            let name;
            let loop;
            let step = 1;
            let start = 0;
            let max = fc + 'l';
            let show = true;
            let attrs = node.attrs;
            let block = node.block;
            let sel = 0; // sectionelse flag
            let ret = '';

            if (attrs) {
                attrs.forEach(attr => {
                    let key = attr.key.value;
                    let val = attr.value;
                    if (key === 'name') {
                        name = me._getExpr(val);
                    }
                    if (key === 'loop') {
                        loop = me._getExpr(val);
                    }
                    if (key === 'step') {
                        step = me._getExpr(val);
                    }
                    if (key === 'start') {
                        start = me._getExpr(val);
                    }
                    if (key === 'show') {
                        show = me._getExpr(val);
                    }
                    if (key === 'max') {
                        max = me._getExpr(val);
                    }
                });
                if (name && loop) {
                    sel = utils.getSectionelseIndex(block);
                    me.ctxScope.push(fc);
                    ret += '\nvar '
                        + fc + 'l,'
                        + fc + 'n=0,'
                        + fc + '={},'
                        + fc + 't=0,'
                        + fc + 'o=' + loop + ';\n'
                        + 'if(typeof ' + fc + 'o==="number"){'
                        +     fc + 'o=__f["range"](0, ' + fc + 'o-1);'
                        +     fc + 't=1;'
                        + '}';
                    if (sel) {
                        let seblock = block[sel].block.concat(block.slice(sel + 1));
                        block = block.slice(0, sel);
                        ret += 'if(' + fc + 'o&&__f["count"](' + fc + 'o)) {';
                    }
                    ret += ''
                        + step + '<0&&' + fc + 'o.reverse();'
                        + fc + 'l=__f["count"](' + fc + 'o);\n'
                        + 'for('
                        +     'var ' + fc + 'i=' + start + ';'
                        +     fc + 'i<' + fc + 'l;'
                        +     fc + 'i+=Math.abs(' + step + ')'
                        + '){\n'
                        +     'if(' + fc + 'n>=' + max + '){break;}'
                        +     '__sec[' + name + ']={'
                        +         'index:' + fc + 't===0?' + fc + 'i:' + fc + 'o[' + fc + 'i],'
                        +         'index_prev:' + fc + 'i-Math.abs(' + step + '),'
                        +         'index_next:' + fc + 'i+Math.abs(' + step + '),'
                        +         'first:' + fc + 'n===0?1:"",'
                        +         'last:' + fc + 'n===(' + fc + 'l-' + start + ')/' + step + '-1?1:"",'
                        +         'rownum:' + fc + 'n+1,'
                        +         'total:' + fc + 'l/' + step + ','
                        +         'show:' + show + ','
                        +         'loop:' + fc + 'l'
                        +     '};'
                        +     ('' + show === 'true' ?  me._init(block) : '')
                        +     fc + 'n++;\n'
                        + '}';
                    if (sel) {
                        ret += '}else{' + me._init(seblock) + '}';
                    }

                    me.ctxScope.pop();
                }
            }

            return ret;
        }
    });
}
