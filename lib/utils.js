/**
 * @file utils package of smarty4Js
 * @author johnson zoumiaojiang@gmail.com
 */

var guidIndex = 0x0907;

module.exports = {
    /**
     * [extend description]
     * @param  {[type]} target [description]
     * @param  {[type]} srcObj [description]
     * @return {[type]}        [description]
     */
    extend: function (target, srcObj) {
        var obj = {};
        for (var p in srcObj) {
            if (srcObj.hasOwnProperty(p)) {
                target[p] = srcObj[p];
            }
        }
        return target;
    },

    inherit: function () {

    },

    /**
     * [GUID description]
     */
    GUID: function () {
        return guidIndex++;
    },

    p: function (code) {
        return '\n__h+=' + code + ';';
    },

    escapeString: function (source) {
        return '"'
            + source
                .replace(/\x5C/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/'/g, "\\'")
                .replace(/\x0A/g, '\\n')
                .replace(/\x09/g, '\\t')
                .replace(/\x0D/g, '\\r')
                .replace( /\x08/g, '\\b' )
                .replace( /\x0C/g, '\\f' )
            + '"';
    },

    isArray: function (obj) {
        return {}.toString.call(obj) === '[object Array]';
    },

    isObject: function (obj) {
        return {}.toString.call(obj) === '[object Object]';
    },

    mixin: function (to, from) {
        for (var p in from) {
            if (from.hasOwnProperty(p)) {
                var val = from[p];
                var toString = {}.toString.call(val);
                if (this.isArray(val) || this.isObject(val)) {
                    to[p] = this.mixin(val, to[p] || {});
                }
                else {
                    to[p] = val;
                }
            }
        }
        return to;
    },

    toFuncString: function (obj) {
        var ret = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p]) {
                ret.push(p + ':' + obj[p].toString());
            }
        }
        return '{' + ret.join(',') + '}'
    },

    excludeItem: function (arr) {
        var obj = {};
        var tmpa = [];
        arr.forEach(function (a) {
            obj[a] = a;
        });

        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                tmpa.push(p);
            }
        }

        return tmpa;
    },

    regEscape: function (str) {
        return str.replace(/[\{\}\*\.\+\-\?\^\$\[\]\(\)\\\/]/g, function (item) {
            return '\\' + item;
        });
    }
};