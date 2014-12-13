/**
 * 
 */

var utils = require('../utils');
var fs = require('fs');
var path = require('path');


module.exports = function (Renderer) {

    utils.mixin(Renderer.prototype, {
        /**
         * [_getExpr description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        _getInclude: function (node) {
            var me = this;
            var attrs = node.attrs;
            var dirname = me.engine.dirname || process.cwd();
            var filePath;
            var s = new (me.eClass)(me.engine.conf);
            var ret;

            attrs.forEach(function (attr) {
                if (attr.key.value == 'file') {
                    var tmpPath = me._getExpr(attr.value).replace(/\"/g, '');
                    filePath = (tmpPath.charAt(0) == '/') ? tmpPath : path.resolve(dirname, tmpPath);
                    if (fs.existsSync(filePath)) {
                        ret = s.compile(fs.readFileSync(filePath, 'utf8')).getJsTpl(true);
                    }
                    else {
                        console.log('No such file `' + filePath + '`')
                    }
                }
            });
            return ret;
        },

        _getExtend: function (node) {

        }
    });
};