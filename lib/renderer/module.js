/**
 * 
 */

var utils = require('../utils');
var fs = require('fs');
var path = require('path');


module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {
        
        _getInclude: function (node) {
            var me = this;
            var attrs = node.attrs;
            var filePath;
            var s = new (me.eClass)(me.engine.conf);
            var includeRet;
            var fc = '__ic' + utils.GUID();
            var ret = 'var ' + fc + '={};';

            s.dirname = me.engine.dirname || process.cwd();

            me.ctxScope.push(fc);
            for (var index = 0, l = attrs.length; index < l; index++) {
                var attr = attrs[index];
                var key = attr.key.value;
                if (key == 'file' || !attr.value) {
                    var vn = attr.value;
                    var tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
                    filePath = path.resolve(s.dirname, tmpPath);
                    if (fs.existsSync(filePath)) {
                        s.dirname = path.dirname(filePath);
                        includeRet = s.compile(fs.readFileSync(filePath, 'utf8')).getJsTpl(1);
                    }
                    else {
                        console.log('No such file `' + filePath + '`')
                    }
                    break;
                }
            }

            attrs.forEach(function (attr) {
                var key = attr.key.value;
                var value = attr.value;
                if (key == 'assign') {
                    if (value.type == 'STR') {
                        includeRet = '\nfunction __fn__' + value.value + '() {' + includeRet + '\n}';
                        me.includeAssign[value.value] = true;
                    }
                }
                else if (key == 'file' || !value) {}
                else {
                    ret += fc + '["' + key + '"]=' + (attr.value ? me._getExpr(attr.value) : '') + ';' ;
                }
            });
            me.ctxScope.pop();
            return ret + includeRet;
        },

        _getExtends: function (node) {
            var me = this;
            var filePath;
            var s = new (me.eClass)(me.engine.conf);
            var extendsRet = '';
            s.dirname = me.engine.dirname || process.cwd();

            for (var index = 0, l = node.attrs.length; index < l; index++) {
                var attr = node.attrs[index];
                var key = attr.key.value;
                if (key == 'file' || !attr.value) {
                    var vn = attr.value;
                    var tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
                    filePath = path.resolve(s.dirname, tmpPath);
                    if (fs.existsSync(filePath)) {
                        s.dirname = path.dirname(filePath);
                        extendsRet = s.compile(fs.readFileSync(filePath, 'utf8')).getJsTpl(1);
                    }
                    else {
                        console.log('No such file `' + filePath + '`')
                    }
                    break;
                }
            }
            return extendsRet;
        },

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
                    if (key.value == 'name' && val && val.type == 'STR') {
                        var defaultFunc = '';
                        if (scope.length > 1) {
                            for (var i = 0; i < scope.length - 1; i++) {
                                var des = scope[i] + val.value;
                                ret += 'function '+ des + '(){return 0;}'
                            }
                            for (var i = 0; i < scope.length - 1; i++) {
                                var des = scope[i] + val.value;
                                defaultFunc += des + '(__p)||'
                            }
                        }
                        var es = scope[scope.length - 1] + val.value;
                        ret += 'function ' + es + '(__p){' + defaultFunc + '__p.c();return 1;};'
                        ret += es + '({'
                        +    'c: function(){' + me._init(block) + 'return 1;}'
                        +'});'
                    }
                });
            }

            return ret;
        },

        _getSubBlock: function (node) { // name="aaa" append prepend
            var me = this;
            var attrs = node.attrs;
            var block = node.block;
            var name = '', pos = '';
            var content = '';
            var ret = '';
            var scope = me.extScope;

            if (attrs) {
                for (var i = 0, l = attrs.length; i < l; i++) {
                    var attr = attrs[i];
                    var key = attr.key.value;
                    var val = attr.value;
                    if (key == 'name' && val && val.type == 'STR') {
                        name = val.value;
                    }
                    if (key == 'append') {
                        pos = 1;
                    }
                    else if (key == 'prepend') {
                        pos = 2;
                    }
                }
                if (scope.length == 1) {
                    content += me._init(block);
                }
                else {
                    for (var i = scope.length - 2; i >= 0; i--) {
                        content += scope[i] + name + '({c:function (){'+me._init(block)+'}});';
                    }
                }
                content = pos ? (pos == 1 ? ('__p.c();' + content) : (content + '__p.c();')) : content;

                var es = scope[scope.length - 1] + name;
                ret += '\nfunction ' + es + '(__p){' + content + 'return 1;}'
            }

            return ret;
        }
    });
};