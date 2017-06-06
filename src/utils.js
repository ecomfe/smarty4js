/**
 * @file utils module of smarty4Js
 * @author mj(zoumiaojiang@gmail.com)
 */


import fs from 'fs';

let guidIndex = 0x0907;

export default {

    /**
     * extend srcObj to target
     *
     * @param  {Object} target  target Object
     * @param  {Object} srcObj  source Object
     * @return {Object}         result object
     */
    extend(target, srcObj) {
        Object.keys(srcObj).forEach(p => {
            target[p] = srcObj[p];
        });
        return target;
    },

    /**
     * get GUID
     *
     * @return {string} GUID string
     */
    getGUID() {
        return guidIndex++;
    },

    /**
     * echo stmt(remove \n\s+\t\b\r)
     *
     * @param  {string} code pre-code
     * @return {string}      echo code
     */
    p(code) {
        if (/^".*?"$/.test(code) && code.slice(1, code.length - 1).replace(/\\n/g, '').trim() === '') {
            return '';
        }
        return '\n__h+=' + code.replace(/(\\n)|[\b\t\r\n]/g, '').replace(/\s+/g, ' ') + ';';
    },

    /**
     * string escape for echo
     *
     * @param  {string} source  source string
     * @return {string}         result string
     */
    escapeString(source) {
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
     *
     * @param  {any}  obj    judge object
     * @return {boolean}     result
     */
    isArray(obj) {
        return {}.toString.call(obj) === '[object Array]';
    },

    /**
     * judge object
     *
     * @param  {any}  obj    judge object
     * @return {boolean}     result
     */
    isObject(obj) {
        return {}.toString.call(obj) === '[object Object]';
    },

    /**
     * deeply mix two object
     *
     * @param  {Object} to   target
     * @param  {Object} fromObj source
     * @return {Object}      result
     */
    mixin(to, fromObj) {
        Object.keys(fromObj).forEach(p => {
            let val = fromObj[p];
            if (this.isArray(val) || this.isObject(val)) {
                to[p] = this.mixin(val, to[p] || {});
            }
            else {
                to[p] = val;
            }
        });
        return to;
    },

    /**
     * object method toString
     *
     * @param  {Object} obj    source object
     * @param  {string} prefix result function prefix
     * @return {string}        function string
     */
    toFuncString(obj, prefix) {
        let ret = [];
        Object.keys(obj).forEach(p => {
            if (obj[p]) {
                ret.push('\'' + (prefix || '') + p + '\':' + obj[p].toString());
            }
        });
        return '{' + ret.join(',') + '}';
    },

    /**
     * delete repeat item in array
     *
     * @param  {Array} arr  source array
     * @return {Array}     result array
     */
    excludeItem(arr) {
        let obj = {};
        let tmpa = [];
        arr.forEach(function (a) {
            obj[a] = a;
        });

        Object.keys(obj).forEach(p => tmpa.push(p));

        return tmpa;
    },

    /**
     * regexp string escape
     *
     * @param  {string} str source regexp string
     * @return {string}     result regexp string
     */
    regEscape(str) {
        return str.replace(/[\{\}\*\.\+\-\?\^\$\[\]\(\)\\\/]/g, item => '\\' + item);
    },

    /**
     * get index of foreachelse
     *
     * @param  {Object} block   block of foreach in ast
     * @return {number}         index of foreachelse
     */
    getForeachelseIndex(block) {
        let flag = 0;
        block.forEach((node, index) => {
            if (node.type === 'FORELSE') {
                flag = index;
            }
        });

        return flag;
    },

    /**
     * get index of sectionelse
     *
     * @param  {Object} block   block of section in ast
     * @return {number}         index of sectionelse
     */
    getSectionelseIndex(block) {
        let flag = 0;
        block.forEach((node, index) => {
            if (node.type === 'SECELSE') {
                flag = index;
            }
        });

        return flag;
    },


    /**
     * get home path
     *
     * @return {string} home path
     */
    getHomePath() {
        let path = require('path');
        let dir = process.env[
            require('os').platform() === 'win32'
                ? 'APPDATA'
                : 'HOME'
            ] + path.sep + '.smarty4js';

        !fs.existsSync(dir) && fs.mkdirSync(dir);
        return dir;
    }
};
