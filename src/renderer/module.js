/**
 * @file module of smarty (extends, include, block)
 * @author mj(zoumiaojiang@gmail.com)
 */


import utils from '../utils';
import path from 'path';
import fs from 'fs';

export default function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * render include
         * {%include file="./a/b/c.tpl" assign=xxx%}
         *
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getInclude(node) {
            let me = this;
            let attrs = node.attrs;
            let filePath;
            let Class = me.eClass;
            let s = new Class(me.engine.conf);
            let includeRet;
            let fc = '__ic' + utils.getGUID();
            let ret = 'let ' + fc + '={};';

            s.dirname = me.engine.dirname || process.cwd();

            me.ctxScope.push(fc);
            for (let index = 0, l = attrs.length; index < l; index++) {
                let attr = attrs[index];
                let key = attr.key.value;
                if (key === 'file' || !attr.value) {
                    let vn = attr.value;
                    let tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
                    filePath = path.resolve(s.dirname, tmpPath);
                    if (fs.existsSync(filePath)) {
                        s.dirname = path.dirname(filePath);
                        includeRet = s.compile(fs.readFileSync(filePath, 'utf8')).getJsTpl(1);
                    }
                    else {
                        console.log('No such file `' + filePath + '`');
                    }
                    break;
                }
            }

            attrs.forEach(attr => {
                let key = attr.key.value;
                let value = attr.value;
                if (key === 'assign') {
                    if (value.type === 'STR') {
                        includeRet = '\nfunction __fn__' + value.value + '(){' + includeRet + '\n}';
                        me.includeAssign[value.value] = true;
                    }
                }
                else if (key === 'file' || !value) {}
                else {
                    ret += fc + '["' + key + '"]=' + (attr.value ? me._getExpr(attr.value) : '') + ';';
                }
            });
            me.ctxScope.pop();
            return ret + includeRet;
        },

        /**
         * render extends
         *
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getExtends(node) {
            let me = this;
            let filePath;
            let Class = me.eClass;
            let s = new Class(me.engine.conf);
            let extendsRet = '';
            s.dirname = me.engine.dirname || process.cwd();

            for (let index = 0, l = node.attrs.length; index < l; index++) {
                let attr = node.attrs[index];
                let key = attr.key.value;
                if (key === 'file' || !attr.value) {
                    let vn = attr.value;
                    let tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
                    filePath = path.resolve(s.dirname, tmpPath);
                    if (fs.existsSync(filePath)) {
                        s.dirname = path.dirname(filePath);
                        extendsRet = s.compile(fs.readFileSync(filePath, 'utf8')).getJsTpl(1);
                    }
                    else {
                        console.log('No such file `' + filePath + '`');
                    }
                    break;
                }
            }
            return extendsRet;
        },

        /**
         * render block in master of extends
         *
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getMasterBlock(node) { // name="aaa"
            let me = this;
            let {attrs, block} = node;
            let scope = me.extScope;
            let ret = '';

            if (attrs) {
                attrs.forEach(attr => {
                    let key = attr.key;
                    let val = attr.value;
                    if (key.value === 'name' && val && val.type === 'STR') {
                        let defaultFunc = '';
                        let des = '';
                        if (scope.length > 1) {
                            for (let i = 0; i < scope.length - 1; i++) {
                                des = scope[i] + val.value;
                                ret += 'function ' + des + '(){return 0;}';
                            }
                            for (let i = 0; i < scope.length - 1; i++) {
                                des = scope[i] + val.value;
                                defaultFunc += des + '(__p)||';
                            }
                        }
                        let es = scope[scope.length - 1] + val.value;
                        ret += 'function ' + es + '(__p){' + defaultFunc + '__p.c();return 1;};'
                            + es + '({'
                            +    'c: function(){' + me._init(block) + 'return 1;}'
                            + '});';
                    }
                });
            }

            return ret;
        },

        /**
         * render block in child of extends
         *
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getSubBlock(node) { // name="aaa" append && prepend
            let me = this;
            let {attrs, block} = node;
            let name = '';
            let pos = '';
            let content = '';
            let ret = '';
            let scope = me.extScope;

            if (attrs) {
                for (let i = 0, l = attrs.length; i < l; i++) {
                    let attr = attrs[i];
                    let key = attr.key.value;
                    let val = attr.value;
                    if (key === 'name' && val && val.type === 'STR') {
                        name = val.value;
                    }
                    if (key === 'append') {
                        pos = 1;
                    }
                    else if (key === 'prepend') {
                        pos = 2;
                    }
                }
                if (scope.length === 1) {
                    content += me._init(block);
                }
                else {
                    for (let i = scope.length - 2; i >= 0; i--) {
                        content += scope[i] + name + '({c:function (){' + me._init(block) + '}});';
                    }
                }
                content = pos ? (pos === 1 ? ('__p.c();' + content) : (content + '__p.c();')) : content;

                let es = scope[scope.length - 1] + name;
                ret += '\nfunction ' + es + '(__p){' + content + 'return 1;}';
            }

            return ret;
        }
    });
}
