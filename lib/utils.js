/**
 * @file utils module of smarty4Js
 * @author johnson [zoumiaojiang@gmail.com]
 */

var guidIndex = 0x0907;

module.exports = {

    /**
     * extend srcObj to target
     * @param  {Object} target  target Object
     * @param  {Object} srcObj  source Object
     * @return {Object}         result object
     */
    extend: function (target, srcObj) {
        for (var p in srcObj) {
            if (srcObj.hasOwnProperty(p)) {
                target[p] = srcObj[p];
            }
        }
        return target;
    },

    /**
     * get GUID
     * @return {string} GUID string
     */
    getGUID: function () {
        return guidIndex++;
    },

    /**
     * echo stmt(remove \n\s+\t\b\r)
     * @param  {string} code pre-code
     * @return {string}      echo code
     */
    p: function (code) {
        if (/^".*?"$/.test(code) && code.slice(1, code.length - 1).replace(/\\n/g, '').trim() === '') {
            return '';
        }
        return '\n__h+=' + code.replace(/(\\n)|[\b\t\r\n]/g, '').replace(/\s+/g, ' ') + ';';
    },

    /**
     * string escape for echo
     * @param  {string} source  source string
     * @return {string}         result string
     */
    escapeString: function (source) {
        return '"'
            + source
                .replace(/\x5C/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/'/g, '\\\'')
                .replace(/\x0A/g, '\\n')
                .replace(/\x09/g, '\\t')
                .replace(/\x0D/g, '\\r')
                .replace(/\x08/g, '\\b')
                .replace(/\x0C/g, '\\f')
            + '"';
    },

    /**
     * judge array
     * @param  {any}  obj    judge object
     * @return {boolean}     result
     */
    isArray: function (obj) {
        return {}.toString.call(obj) === '[object Array]';
    },

    /**
     * judge object
     * @param  {any}  obj    judge object
     * @return {boolean}     result
     */
    isObject: function (obj) {
        return {}.toString.call(obj) === '[object Object]';
    },

    /**
     * deeply mix two object
     * @param  {Object} to   target
     * @param  {Object} from source
     * @return {Object}      result
     */
    mixin: function (to, from) {
        for (var p in from) {
            if (from.hasOwnProperty(p)) {
                var val = from[p];
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

    /**
     * object method toString
     * @param  {Object} obj    source object
     * @param  {string} prefix result function prefix
     * @return {string}        function string
     */
    toFuncString: function (obj, prefix) {
        var ret = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p]) {
                ret.push('\'' + (prefix || '') + p + '\':' + obj[p].toString());
            }
        }
        return '{' + ret.join(',') + '}';
    },

    /**
     * delete repeat item in array
     * @param  {Array} arr  source array
     * @return {Array}     result array
     */
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

    /**
     * regexp string escape
     * @param  {string} str source regexp string
     * @return {string}     result regexp string
     */
    regEscape: function (str) {
        return str.replace(/[\{\}\*\.\+\-\?\^\$\[\]\(\)\\\/]/g, function (item) {
            return '\\' + item;
        });
    },

    /**
     * get index of foreachelse
     * @param  {Object} block   block of foreach in ast
     * @return {number}         index of foreachelse
     */
    getForeachelseIndex: function (block) {
        var flag = 0;
        block.forEach(function (node, index) {
            if (node.type === 'FORELSE') {
                flag = index;
            }
        });

        return flag;
    },

    /**
     * get index of sectionelse
     * @param  {Object} block   block of section in ast
     * @return {number}         index of sectionelse
     */
    getSectionelseIndex: function (block) {
        var flag = 0;
        block.forEach(function (node, index) {
            if (node.type === 'SECELSE') {
                flag = index;
            }
        });

        return flag;
    }
};
