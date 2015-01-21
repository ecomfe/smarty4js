/**
 * @file module of smarty (extends, include, block)
 * @author johnson [zoumiaojiang@gmail.com]
 */

var utils = require('../utils');
var fs = require('fs');
var path = require('path');

module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {

        /**
         * render include
         * {%include file="./a/b/c.tpl" assign=xxx%}
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getInclude: function (node) {
            var me = this;
            var attrs = node.attrs;
            var filePath;
            var Class = me.eClass;
            var s = new Class(me.engine.conf);
            var includeRet;
            var fc = '__ic' + utils.getGUID();
            var ret = 'var ' + fc + '={};';

            s.dirname = me.engine.dirname || process.cwd();

            me.ctxScope.push(fc);
            for (var index = 0, l = attrs.length; index < l; index++) {
                var attr = attrs[index];
                var key = attr.key.value;
                if (key === 'file' || !attr.value) {
                    var vn = attr.value;
                    var tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
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

            attrs.forEach(function (attr) {
                var key = attr.key.value;
                var value = attr.value;
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
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getExtends: function (node) {
            var me = this;
            var filePath;
            var Class = me.eClass;
            var s = new Class(me.engine.conf);
            var extendsRet = '';
            s.dirname = me.engine.dirname || process.cwd();

            for (var index = 0, l = node.attrs.length; index < l; index++) {
                var attr = node.attrs[index];
                var key = attr.key.value;
                if (key === 'file' || !attr.value) {
                    var vn = attr.value;
                    var tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
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
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getMasterBlock: function (node) { // name="aaa"
            var me = this;
            var attrs = node.attrs;
            var block = node.block;
            var scope = me.extScope;
            var ret = '';

            if (attrs) {
                attrs.forEach(function (attr) {
                    var key = attr.key;
                    var val = attr.value;
                    if (key.value === 'name' && val && val.type === 'STR') {
                        var defaultFunc = '';
                        var des = '';
                        if (scope.length > 1) {
                            for (var i = 0; i < scope.length - 1; i++) {
                                des = scope[i] + val.value;
                                ret += 'function ' + des + '(){return 0;}';
                            }
                            for (i = 0; i < scope.length - 1; i++) {
                                des = scope[i] + val.value;
                                defaultFunc += des + '(__p)||';
                            }
                        }
                        var es = scope[scope.length - 1] + val.value;
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
         * @param  {Object} node     ast node
         * @return {string}          render result
         */
        _getSubBlock: function (node) { // name="aaa" append && prepend
            var me = this;
            var attrs = node.attrs;
            var block = node.block;
            var name = '';
            var pos = '';
            var content = '';
            var ret = '';
            var scope = me.extScope;

            if (attrs) {
                for (var i = 0, l = attrs.length; i < l; i++) {
                    var attr = attrs[i];
                    var key = attr.key.value;
                    var val = attr.value;
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
                    for (i = scope.length - 2; i >= 0; i--) {
                        content += scope[i] + name + '({c:function (){' + me._init(block) + '}});';
                    }
                }
                content = pos ? (pos === 1 ? ('__p.c();' + content) : (content + '__p.c();')) : content;

                var es = scope[scope.length - 1] + name;
                ret += '\nfunction ' + es + '(__p){' + content + 'return 1;}';
            }

            return ret;
        }
    });
};
