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
            var dirname = me.engine.dirname || process.cwd();
            var filePath;
            var s = new (me.eClass)(me.engine.conf);
            var includeRet;
            var fc = '__ic' + utils.GUID();
            var ret = fc + '={};';

            me.ctxScope.push(fc);
            for (var index = 0, l = attrs.length; index < l; index++) {
                var attr = attrs[index];
                var key = attr.key.value;
                if (key == 'file' || !attr.value) {
                    var vn = attr.value;
                    var tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
                    filePath = (tmpPath.charAt(0) == '/') ? tmpPath : path.resolve(dirname, tmpPath);
                    if (fs.existsSync(filePath)) {
                        includeRet = s.compile(fs.readFileSync(filePath, 'utf8')).getJsTpl(true);
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
            var dirname = me.engine.dirname || process.cwd();
            var filePath;
            var s = new (me.eClass)(me.engine.conf);
            var extendsRet = '';

            for (var index = 0, l = node.attrs.length; index < l; index++) {
                var attr = node.attrs[index];
                var key = attr.key.value;
                if (key == 'file' || !attr.value) {
                    var vn = attr.value;
                    var tmpPath = me._getExpr(vn ? vn : attr.key).replace(/\"/g, '');
                    filePath = (tmpPath.charAt(0) == '/') ? tmpPath : path.resolve(dirname, tmpPath);
                    if (fs.existsSync(filePath)) {
                        extendsRet = s.compile(fs.readFileSync(filePath, 'utf8')).getJsTpl(true);
                    }
                    else {
                        console.log('No such file `' + filePath + '`')
                    }
                    break;
                }
            }
            return extendsRet;
        },

        _getMasterBlock: function (node) { // name="aaa" append prepend
            var attrs = node.attrs;
            var block = node.block;
            var ret = '';

            if (attrs) {
                attrs.forEach(function (attr) {
                    if (attr.key.value == 'name') {

                    }
                });
            }

            return '__h +="master block";';
        },

        _getSubBlock: function (node) { // name="aaa"
            return '__h +="sub block";';
        }
    });
};