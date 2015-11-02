/**
 * @file php function module
 * @author johnson [zoumiaojiang@gmail.com]
 */

var __nre = /[\.\(\)\[\]\{\}\+\-\*\?\|\^\$]/g;

module.exports = {
    escape: function (str, f) {
        var tmp = '';
        function padnum (n, w, r, p) {
            n = n.toString(r || 10); p = p || '0';
            while (n.length < w) {
                n = p + n;
            }
            return n.toUpperCase();
        }
        if (!str) {
            return '';
        }
        if (typeof str === 'string') {
            if (!f) {
                return this.escape(str, 'html');
            }
            if (f === 'html' || f === 'htmlall') {
                var obj = {'<': '&#60;', '>': '&#62;', '\'': '&#039;', '"': '&#034;', '&': '&#038;'};
                return str.replace(/['"<>&']/g, function (s) {
                    return obj[s];
                });
            }
            if (f === 'url') {
                return encodeURI(str);
            }
            if (f === 'urlpathinfo') {
                return encodeURIComponent(str).replace(/%2F/g, '/');
            }
            if (f === 'quotes') {
                return str.replace(/\'/g, '\\\'').replace(/\"/g, '\\\"');
            }
            if (f === 'mail') {
                return str.replace(/@/g, ' [AT] ').replace(/\./g, ' [DOT] ');
            }
            if (f === 'hex') {
                for (var i = 0, l = str.length; i < l; i++) {
                    tmp += '%' + padnum(str.charCodeAt(i), 2, 16);
                }
                return tmp;
            }
            if (f === 'hexentity') {
                for (i = 0, l = str.length; i < l; i++) {
                    tmp += '&#x' + padnum(str.charCodeAt(i), 4, 16);
                }
                return tmp;
            }
            if (f === 'decentity') {
                for (i = 0, l = str.length; i < l; i++) {
                    tmp += '&#' + str.charCodeAt(i) + ';';
                }
                return tmp;
            }
            if (f === 'javascript') {
                var map = {'\\': '\\\\', '\'': '\\\'', '"': '\\"', '\r': '\\r', '\n': '\\n', '</': '<\\/'};
                return str.replace(/[\\'"\r\n]|<\//g, function (s) {
                    return map[s];
                });
            }
        }
        return str;
    },

    strip: function (str, s) {
        return str.replace(/[\s\n\r\t]+/g, ((s && ('string' === typeof s)) ? s : ' '));
    },

    isset: function (any) {
        return any === undefined ? false : true;
    },

    empty: function (obj) {
        var n = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return (n > 0) ? false : true;
    },

    count: function (obj) {
        var n = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return n;
    },

    sizeof: function (obj) {
        var n = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return n;
    },

    time: function () {
        var d = new Date();
        return ''
            + [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' '
            + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    },

    capitalize: function (str, cnb) {
        return str.replace(/\w+\s*/g, function (item) {
            return /\d/g.test(item)
                ? ((cnb === true) ? item.charAt(0).toUpperCase() + item.slice(1) : item)
                : item.charAt(0).toUpperCase() + item.slice(1);
        });
    },

    cat: function (a, b) {
        return '' + a + b;
    },

    'count_characters': function (str, iws) {
        return iws ? str.length : str.split(/\s*/).join('').length;
    },

    'count_paragraphs': function (str, iws) {
        return str.split(new RegExp('[\r\n]' + iws ? '' : '+')).length;
    },
    'count_sentences': function (str) {
        return str.split('.').length;
    },

    'count_words': function (str) {
        return str.split(/\w+\s*/).length - 1;
    },

    'default': function (str, con) {
        return str !== undefined ? str : con;
    },

    indent: function (str, num, repl) {
        function gotSpace(n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += (repl ? '' + repl : ' ');
            }
            return s;
        }
        return ('number' === typeof num && num > 0) ? (gotSpace(num) + str) : (gotSpace(4) + str);
    },

    lower: function (str) {
        return ('' + str).toLowerCase();
    },

    nl2br: function (str) {
        return ('' + str).replace(/\n/g, '<br/>');
    },

    'regex_replace': function (str, re, rs) {
        return ('' + str).replace((new Function('return ' + re))(), rs);
    },

    replace: function (str, s, o) {
        return ('' + str).split(s).join(o);
    },

    spacify: function (str, ss) {
        return ss !== undefined ? str.split('').join(ss) : str.split('').join(' ');
    },

    'string_format': function (num, f) {
        num = parseFloat('' + (num || 0), 10);
        return f !== undefined
            ? f === '%d'
                ? parseInt('' + num, 10)
                : (/%\.(\d)f/.test(f)) ? num.toFixed(parseInt(RegExp.$1, 10)) : num
            : num;
    },

    'strip_tags': function (str) {
        return ('' + str).replace(/<.*?>/g, '');
    },

    truncate: function (str, num, s) {
        str = '' + str;
        return num >= str.length ? str : str.substr(0, ((num >= 0) ? num : 80)) + (s ? '' + s : '...');
    },

    upper: function (str) {
        return ('' + str).toUpperCase();
    },

    wordwrap: function (str, num, s) {
        str = ('' + str).split('');
        num = (num >= 0 ? num : 80);
        for (var i = 0, l = str.length; i < l; i++) {
            if (i % num === 0 && i !== 0) {
                str[i] = str[i] + (s ? '' + s : '\n');
            }
        }
        return str.join('');
    },
    'is_array': function (obj) {
        return ({}.toString.call(obj) === '[object Object]' || {}.toString.call(obj) === '[object Array]');
    },

    ceil: function (num) {
        return Math.ceil(parseFloat((num || 0), 10));
    },

    range: function (a, b, step) {
        var arr = [];
        step = step || 1;
        if (typeof a === 'number' && typeof b === 'number' && a < b) {
            for (var i = a; i <= b; i += step) {
                arr[(i - a) / step] = i;
            }
        }
        if (typeof a === 'string' && typeof b === 'string') {
            a = ('' + a).charCodeAt(0);
            b = ('' + b).charCodeAt(0);
            if (a < b) {
                for (i = a; i <= b; i += step) {
                    arr[(i - a) / step] = String.fromCharCode('' + i);
                }
            }
        }
        return arr;
    },

    'in_array': function (any, array) {
        return array[any] ? true : false;
    },

    explode: function (s, str) {
        var obj = {};
        var arr = str.split(s);
        for (var i = 0, l = arr.length; i < l; i++) {
            obj['__a' + i] = arr[i];
        }
        return obj;
    },
    implode: function (s, obj) {
        var arr = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                arr.push(obj[p]);
            }
        }
        return arr.join(s);
    },
    join: function (s, obj) {
        var arr = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                arr.push(obj[p]);
            }
        }
        return arr.join(s);
    },
    array: function () {
        return [];
    },
    'array_unique': function (array) {
        var obj = {};
        var ret = {};
        for (var p in array) {
            if (array.hasOwnProperty(p) && !obj[array[p]]) {
                obj[array[p]] = true;
                ret[p] = array[p];
            }
        }
        return ret;
    },
    'array_sum': function (array) {
        var sum = 0;
        for (var p in array) {
            if (array.hasOwnProperty(p) && typeof array[p] === 'number') {
                sum += array[p];
            }
        }
        return sum;
    },

    'array_product': function (array) {
        var sum = 1;
        for (var p in array) {
            if (array.hasOwnProperty(p) && typeof array[p] === 'number') {
                sum *= array[p];
            }
        }
        return sum;
    },

    'array_merge': function () {
        var arrs = Array.prototype.slice.call(arguments);
        var obj = {};
        var ind = 0;
        for (var i = 0, l = arrs.length; i < l; i++) {
            var arr = arrs[i];
            for (var p in arr) {
                if (arr.hasOwnProperty(p)) {
                    obj[(p.indexOf('__a') > -1) ? ('__a' + ind++) : p] = arr[p];
                }
            }
        }
        return obj;
    },

    'array_merge_recursive': function () { // TODO:
        var arrs = Array.prototype.slice.call(arguments);
        var obj = {};
        var ind = 0;
        for (var i = 0, l = arrs.length; i < l; i++) {
            var arr = arrs[i];
            for (var p in arr) {
                if (arr.hasOwnProperty(p)) {
                    obj[(p.indexOf('__a') > -1) ? ('__a' + ind++) : p] = arr[p];
                }
            }
        }
        return obj;
    },

    'array_keys': function (obj) {
        var t = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                t.push(p.replace('__a', ''));
            }
        }
        return t;
    },

    'array_key_exists': function (any, array) {
        return !array[any] === undefined ? true : false;
    },

    // string method
    addcslashes: function (str, c) {
        return ('' + str).split(c).join('\\' + c);
    },

    stripcslashes: function (str) {
        return ('' + str).replace(/\\/, '');
    },

    addslashes: function (str) {
        return ('' + str).replace(/[\'\"\\]/g, function (s) {
            return '\\' + s;
        });
    },

    stripslashes: function (str) {
        return ('' + str).replace(/(\\\')|(\\\")|(\\\\)/g, function (s) {
            return s.replace('\\', '');
        });
    },

    // rtrim alias
    chop: function (str, clist) {
        var res = (clist !== undefined)
            ? '[' + ('' + clist).replace(__nre, function (s) {
                return '\\' + s;
            }) + ']+$'
            : '[\\0\\t\\n\\r\\s]+$';
        return ('' + str).replace(new RegExp(res), '');
    },

    chr: function (asc) {
        return String.fromCharCode('' + asc);
    },

    'chunk_split': function (str, len, end) {
        str = '' + str;
        len = len || 0;
        end = end || '';
        return len === 0 ? str : str.replace(new RegExp('.{' + len + '}', 'g'), function (s) {
            return s + end;
        });
    },

    ltrim: function (str, clist) {
        var res = (clist !== undefined)
            ? '^[' + ('' + clist).replace(__nre, function (s) {
                return '\\' + s;
            }) + ']+'
            : '^[\\0\\t\\n\\r\\s]+';
        return ('' + str).replace(new RegExp(res), '');
    },

    rtrim: function (str, clist) {
        var res = (clist !== undefined)
            ? '[' + ('' + clist).replace(__nre, function (s) {
                return '\\' + s;
            }) + ']+$'
            : '[\\0\\t\\n\\r\\s]+$';
        return ('' + str).replace(new RegExp(res), '');
    },

    trim: function (str, clist) {
        var tmps = (clist !== undefined)
            ? ('' + clist).replace(__nre, function (s) {
                return '\\' + s;
            })
            : '\\0\\t\\n\\r\\s';
        return ('' + str).replace(new RegExp('(^[' + tmps + ']+)|([' + tmps + ']+$)', 'g'), '');
    },

    ord: function (str) {
        return ('' + str).charCodeAt(0);
    },

    'parse_str': function (str) {
        var obj = {};
        var arr = ('' + str).split('&');
        for (var i = 0, l = arr.length; i < l; i++) {
            var item = arr[i];
            item = item.indexOf('%') > -1 ? decodeURI(item) : item;
            var pi = item.split('=');
            obj[pi[0]] = pi[1] || '';
        }
        return obj;
    },

    print: function () {
        var args = Array.prototype.slice.call(arguments);
        var s = '';
        for (var i = 0, l = args.length; i < l; i++) {
            var ts = args[i];
            s += ts ? ts : '';
        }
        return s;
    },

    quotemeta: function (str) {
        return ('' + str).replace(__nre, function (s) {
            return '\\' + s;
        });
    },

    'str_pad': function (str, len, pad, type) {
        var to = {'STR_PAD_RIGHT': 0, 'STR_PAD_LEFT': 1, 'STR_PAD_BOTH': 2};
        var par = '';
        var t = 0;
        str = '' + str;
        var ret = str;
        len = len || 0;
        pad = pad || '';
        type = type || 'STR_PAD_RIGHT';
        if (len > str.length) {
            if (to[type] !== 2) {
                t = (len - str.length) / pad.length;
                while (t-- > 0) {
                    par += pad;
                }
                ret = to[type] === 0 ? (str + par) : (par + str);
            }
            else {
                t = (len - str.length) / pad.length / 2;
                while (t-- > 0) {
                    par += pad;
                }
                ret = par + str + par;
            }
        }
        return ret;
    },

    'str_repeat': function (str, rn) {
        var all = '';
        while (rn--) {
            all += str;
        }
        return all;
    },

    'str_split': function (str, len) {
        var arr = [];
        str = '' + str;
        len = len || 0;
        if (len !== 0) {
            var mats = str.match(new RegExp('.{' + len + '}', 'g'));
            for (var i = 0, l = mats.length; i < l; i++) {
                arr.push(mats[i]);
            }
            var lef = str.slice(l * len);
            if (lef) {
                arr.push(lef);
            }
        }
        else {
            arr = [str];
        }
        return arr;
    },

    strcmp: function (str1, str2) {
        str1 = '' + str1, str2 = '' + str2;
        return str1 === str2 ? 0 : (str1 > str2 ? 1 : -1);
    },

    strcasecmp: function (str1, str2) {
        str1 = ('' + str1).toLowerCase(), str2 = '' + str2.toLowerCase();
        return str1 === str2 ? 0 : (str1 > str2 ? 1 : -1);
    },

    strchr: function (str, search) {
        str =  '' + str;
        return str.slice(str.indexOf((typeof search === 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    strstr: function (str, search) {
        str =  '' + str;
        return str.slice(str.indexOf((typeof search === 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    stristr: function (str, search) {
        str = '' + str;
        return str.slice(str.toLowerCase().indexOf(
            (typeof search === 'number'
                ? String.fromCharCode(search).toLowerCase()
                : ('' + search).toLowerCase())
        ));
    },

    stripos: function (str, find, start) {
        str =  '' + str, start = start || 0;
        return str.toLowerCase().indexOf(('' + find).toLowerCase(), start);
    },

    strpos: function (str, find, start) {
        str =  '' + str, start = start || 0;
        return str.indexOf(('' + find), start);
    },

    strlen: function (str) {
        return ('' + str).length;
    },

    strrchr: function (str, search) {
        str =  '' + str;
        return str.slice(str.lastIndexOf((typeof search === 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    strrev: function (str) {
        return ('' + str).split('').reverse().join('');
    },

    strripos: function (str, find, start) {
        str =  '' + str, start = start || 0;
        return str.toLowerCase().lastIndexOf(('' + find).toLowerCase(), start);
    },

    strrpos: function (str, find, start) {
        str =  '' + str, start = start || 0;
        return str.lastIndexOf(('' + find), start);
    },

    strtolower: function (str) {
        return ('' + str).toLowerCase();
    },

    strtoupper: function (str) {
        return ('' + str).toUpperCase();
    },

    substr: function (str, start, len) {
        str = '' + str;
        start = start || 0;
        len = (len === undefined || typeof len !== 'number') ? -1 : len;
        return str.substring(start, (len === -1 ? str.length : (start + len)));
    },

    'substr_count': function (str, substr, start, len) {
        str = '' + str;
        start = start || 0;
        len = (len === undefined || typeof len !== 'number') ? -1 : len;
        return str.substring(start, (len === -1 ? str.length : (start + len))).split(substr).length - 1;
    },

    ucfirst: function (str) {
        str = '' + str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    ucwords: function (str) {
        return ('' + str).replace(/\w+\s*/g, function (item) {
            return /\d/g.test(item) ? item : item.charAt(0).toUpperCase() + item.slice(1);
        });
    },

    rawurldecode: function (str) {
        return decodeURIComponent('' + str);
    },

    rawurlencode: function (url) {
        return encodeURIComponent('' + url);
    },

    urldecode: function (str) {
        return decodeURI('' + str);
    },

    urlencode: function (url) {
        return encodeURI('' + url);
    },

    // varibal function

    'is_bool': function (bool) {
        return (bool === true || bool === false) ? true : false;
    },

    floatval: function (str) {
        return parseFloat('' + str, 10);
    },

    intval: function (str) {
        return parseInt('' + str, 10);
    },

    'is_float': function (f) {
        return (typeof f === 'number' && parseInt(f, 10) !== f) ? true : false;
    },

    'is_real': function (f) {
        return (typeof f === 'number' && parseInt(f, 10) !== f) ? true : false;
    },

    'is_int': function (i) {
        return (typeof i === 'number' && parseInt(i, 10) === i) ? true : false;
    },

    'is_integer': function (i) {
        return (typeof i === 'number') ? true : false;
    },

    'is_object': function (o) {
        return {}.toString.call(o) === '[object Object]';
    },

    'is_callable': function (o) {
        return (typeof o === 'function') ? true : false;
    },

    'is_string': function (s) {
        return (typeof s === 'string') ? true : false;
    },

    'is_numeric': function (a) {
        return (typeof a === 'number') ? true : false;
    },

    strval: function (any) {
        return (any !== undefined && any.toString) ? any.toString() : '';
    },

    'var_dump': function (any) {
        function isArray(o) {
            return {}.toString.call(o) === '[object Array]';
        }
        function isObj(o) {
            return {}.toString.call(o) === '[object Object]';
        }
        function isOA(o) {
            return (isArray(o) || isObj(o)) ? true : false;
        }
        function isRealArr(o) {
            for (var p in o) {
                if (o.hasOwnProperty(p) && p.indexOf('__a') !== 0) {
                    return false;
                }
            }
            return true;
        }
        function pa(o) {
            var type = (isArray(o) || (isRealArr(o) && isObj(o))) ? 0 : ((isObj(o) && !isRealArr(o)) ? 1 : 2);
            var __enc;
            if (type === 0 || type === 1) {
                __enc = type === 0 ? '[' : '{';
                for (var p in o) {
                    if (o.hasOwnProperty(p)) {
                        var to = o[p];
                        __enc += (type === 0
                            ? ''
                            : ('"' + p + '":')) + (isOA(to)
                                ? pa(to)
                                : (typeof to === 'string' ? '"' + to + '"' : to)) + ',';
                    }
                }
                __enc = __enc.slice(0, __enc.length - 1) + (type === 0 ? ']' : '}');
            }
            else {
                __enc = o;
            }
            return __enc;
        }
        return (isArray(any) || isObj(any)) ? pa(any).replace(/__a/g, '') : (any || '');
    },

    echo: function () {
        var args = Array.prototype.slice.call(arguments);
        var s = '';
        for (var i = 0, l = args.length; i < l; i++) {
            var ts = args[i];
            s += ts ? ts : '';
        }
        return s;
    },

    // math

    abs: function (num) {
        return Math.abs(num);
    },

    acos: function (deg) {
        return Math.acos(deg);
    },

    acosh: function (deg) {
        return Math.acosh(deg);
    },

    asin: function (deg) {
        return Math.asin(deg);
    },

    asinh: function (deg) {
        return Math.asinh(deg);
    },

    atan2: function (x, y) {
        return Math.atan2(x, y);
    },

    atan: function (p) {
        return Math.atan(p);
    },

    atanh: function (x) {
        return Math.atanh(x);
    },

    cos: function (x) {
        return Math.cos(x);
    },

    sin: function (x) {
        return Math.sin(x);
    },

    tan: function (x) {
        return Math.tan(x);
    },

    cosh: function (x) {
        return Math.cosh(x);
    },

    sinh: function (x) {
        return Math.sinh(x);
    },

    tanh: function (x) {
        return Math.tanh(x);
    },

    dexbin: function (num) {
        return num.toString(2);
    },

    dechex: function (num) {
        return num.toString(16);
    },

    decoct: function (num) {
        return num.toString(8);
    },

    deg2rad: function (deg) {
        return deg * Math.PI / 180;
    },

    rad2deg: function (rad) {
        return rad * 180 / Math.PI;
    },
    exp: function (x) {
        return Math.exp(x);
    },

    expm1: function (x) {
        return Math.expm1(x);
    },

    floor: function (x) {
        return Math.floor(x);
    },

    fmod: function (x, y) {
        return (typeof x === 'number' && typeof y === 'number') && x % y;
    },

    hexdec: function (hex) {
        return parseInt('' + hex, 16);
    },

    octdec: function (oct) {
        return parseInt('' + oct, 8);
    },

    hypot: function (x, y) {
        return (typeof x === 'number' && typeof y === 'number') && Math.sqrt(x * x + y * y);
    },

    'is_infinite': function (x) {
        return (('' + x) === 'Infinity') ? true : false;
    },

    'is_nan': function (x) {
        return (('' + x) === 'NaN') ? true : false;
    },

    'lcg_value': function () {
        return Math.random();
    },

    log10: function (x) {
        return Math.log10(x);
    },

    log1p: function (x) {
        return Math.log1p(x);
    },

    log: function (x) {
        return Math.log(x);
    },

    max: function () {
        var arrs = Array.prototype.slice.call(arguments);
        var obj = (typeof arrs[0] === 'object') ? arrs[0] : arrs;
        var max = obj[0];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] > max) {
                max = obj[p];
            }
        }
        return max;
    },

    min: function () {
        var arrs = Array.prototype.slice.call(arguments);
        var obj = (typeof arrs[0] === 'object') ? arrs[0] : arrs;
        var min = obj[0];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] < min) {
                min = obj[p];
            }
        }
        return min;
    },

    pi: function () {
        return Math.PI;
    },

    pow: function (x, y) {
        return (typeof x === 'number' && typeof y === 'number') ? Math.pow(x, y) : false;
    },

    round: function (x) {
        return Math.round(x);
    },

    sqrt: function (x) {
        return Math.sqrt(x);
    },

    // common php method
    uniqid: function (prefix) {
        return (prefix || '') + (new Date()).getTime();
    },

    highlight: function (str, type) {
        return str;
    },

    'json_encode': function (obj) {
        function isArray(o) {
            return {}.toString.call(o) === '[object Array]';
        }
        function isObj(o) {
            return {}.toString.call(o) === '[object Object]';
        }
        function isOA(o) {
            return (isArray(o) || isObj(o)) ? true : false;
        }
        function isRealArr(o) {
            for (var p in o) {
                if (o.hasOwnProperty(p) && p.indexOf('__a') !== 0) {
                    return false;
                }
            }
            return true;
        }
        function pa(o) {
            var type = (isArray(o) || (isRealArr(o) && isObj(o))) ? 0 : ((isObj(o) && !isRealArr(o)) ? 1 : 2);
            var __enc = type === 0 ? '[' : '{';
            for (var p in o) {
                if (o.hasOwnProperty(p)) {
                    var to = o[p];
                    __enc += (type === 0 ? '' : ('"' + p + '":')) + (isOA(to)
                        ? pa(to)
                        : (typeof to === 'string' ? '"' + to + '"' : to)) + ',';
                }
            }
            __enc = __enc.slice(0, __enc.length - 1) + (type === 0 ? ']' : '}');
            return __enc;
        }
        return pa(obj).replace(/__a/g, '');
    },

    date_format: function (time, format) {
        time = (time instanceof Date) ? time : new Date(+time);
        if (format) {
            var o = {
                '\%m': time.getMonth() + 1,
                '\%d': time.getDate(),
                '\%H': time.getHours(),
                '\%M': time.getMinutes(),
                '\%S': time.getSeconds(),
                '\%s': time.getMilliseconds() 
            }
            if (/(\%Y)/.test(format)) {
                format = format.replace(RegExp.$1, (time.getFullYear() + ''));
            }
            for (var k in o) {
                if (o.hasOwnProperty(k) && new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length === 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length));
                }
            }
        }
        else {
            format = time.toDateString();
        }
        return format;
    },

    'json_decode': function (json) {
        // TODO
    }
};

