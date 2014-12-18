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
                    filePath = (tmpPath.charAt(0) == '/') ? tmpPath : path.resolve(s.dirname, tmpPath);
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
                    filePath = (tmpPath.charAt(0) == '/') ? tmpPath : path.resolve(s.dirname, tmpPath); // todo: this is wrong in windows
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
            var ret = '';

            if (attrs) {
                attrs.forEach(function (attr) {
                    var key = attr.key;
                    var val = attr.value;
                    if (key.value == 'name' && val && val.type == 'STR') {
                        var es = me.extScope[me.extScope.length - 1];
                        var bf = es + val.value;
                        ret += 'function ' + bf + '(__p){__p.c();};'  
                            + bf + '({'
                            +    'c: function(){' + me._init(block) + '}'
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
            var content = me._init(block);
            var ret = '';

            if (attrs) {
                for (var i = 0, l = attrs.length; i < l; i++) {
                    var attr = attrs[i];
                    var key = attr.key;
                    var val = attr.value;
                    if (key.value == 'append' && !val) {
                        content = '__p.c();' + content;
                        break;
                    }
                    else if (key.value == 'prepend' && !val) {
                        content = content + '__p.c();';
                        break;
                    }
                }

                for (var i = 0, l = attrs.length; i < l; i++) {
                    var attr = attrs[i];
                    var key = attr.key;
                    var val = attr.value;
                    if (key.value == 'name' && val && val.type == 'STR') {
                        var es = me.extScope[me.extScope.length - 1];
                        ret += '\nfunction ' + es + val.value + '(__p){' + content + '}'
                    }
                }
            }

            return ret;
        }
    });
};