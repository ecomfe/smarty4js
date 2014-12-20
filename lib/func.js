/**
 * @file php function module
 * @author Johnson (zoumiaojiang@gmail.com)
 */

module.exports = {
    escape: function (str, f) {
        if (!str) return '';
        if (typeof str == 'string') {
            if (!f) {
                return this.escape(str, 'html');
            }
            if (f == 'html') {
                var obj = { '<': '&#60;', '>': '&#62;', '\'': '&#039;', '"': '&#034;', '&': '&#038;' };
                return str.replace(/[\'\"<>&']/g, function (item) {
                    return obj[item];
                });
            }
            if (f == 'url') {
                return escape(str);
            }
            if (f == 'quotes') {
                return str.replace(/\'/g, '\\\'').replace(/\"/g, '\\\"');
            }
            if (f == 'javascript') {

            }
        }
        return str;
    },

    strip: function (str, s) {
        return str.replace(/[\s\n\r\t]+/g, ((s && ('string' == typeof s)) ? s : ' '));
    },

    isset: function (any) {
        return any == undefined ? false : true;
    },

    empty: function (obj) {
        var n = 0;
        for (var i in obj) {if (obj.hasOwnProperty(i)) {n++;}}
        return (n > 0) ? false : true;
    },

    count: function (obj) {
        var n = 0;
        for(var i in obj) {if (obj.hasOwnProperty(i)) {n++;}}
        return n;
    },

    sizeof: function (obj) {
        var n = 0;
        for(var i in obj) {if (obj.hasOwnProperty(i)) {n++;}}
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

    count_characters: function (str, iws) {
        return iws ? str.length : str.split(/\s*/).join('').length;
    },

    count_paragraphs: function (str, iws) { // TODO:
        return str;
    },
    count_sentences: function (str) { // TODO:
        return str;
    },

    count_words: function (str) {
        return str.split(/\w+\s*/).length - 1;
    },

    date_format: function (time, format, defaultTime) { // TODO:
        if (time.getDate) {
            return time.getTime();
        }
        else {
            return this.date_format(defaultTime, format, new Date());
        }
    },

    default: function (str, con) {
        return str != undefined ? str : con;
    },

    indent: function (str, num, repl) {
        function gotSpace(n) {
            var s = '';
            for (var i = 0; i < n; i++) { s += (repl ? '' + repl : ' '); }
            return s;
        }
        return ('number' == typeof num && num > 0) ? (gotSpace(num) + str) : (gotSpace(4) + str);
    },

    lower: function (str) {
        return ('' + str).toLowerCase();
    },

    nl2br: function (str) {
        return ('' + str).replace(/\n/g, '<br/>');
    },

    regex_replace: function (str, re, rs) {
        return ('' + str).replace((new Function('return ' + re))(), rs);
    },

    replace: function (str, s, o) {
        return ('' + str).split(s).join(o);
    },

    spacify: function (str, ss) {
        return ss != undefined ? str.split('').join(ss) : str.split('').join(' ');
    },

    string_format: function (num, f) {
        num = parseFloat('' + (num || 0), 10);
        return f != undefined
            ? f == '%d' 
                ? parseInt('' + num, 10) 
                : (/%\.(\d)f/.test(f)) ? num.toFixed(parseInt(RegExp.$1, 10)) : num
            : num;
    },

    strip_tags: function (str) {
        return ('' + str).replace(/<.*?>/g, '');
    },

    truncate: function (str, num, s) {
        str = '' + str || '';
        return num >= str.length ? str : str.substr(0, ((num >= 0) ? num : 80)) + (s? '' + s : '...');
    },

    upper: function (str) {
        return ('' + str).toUpperCase();
    },

    wordwrap: function (str, num, s) {
        str = ('' + str).split('');
        num = (num >= 0 ? num : 80);
        for (var i = 0, l = str.length; i < l; i++) {
            if (i % num == 0 && i !== 0) {
                str[i] = str[i] + (s ? '' + s : '\n');
            }
        }
        return str.join('');
    },
    is_array: function (obj) {
        return ({}.toString.call(obj) === '[object Object]' || {}.toString.call(obj) === '[object Array]');
    },

    ceil: function (num) {
        return Math.ceil(parseFloat((num || 0), 10));
    },

    range: function (a, b) {
        var obj = {};
        a = ('' + a).charCodeAt();
        b = ('' + b).charCodeAt();
        if (a < b) {
            for (var i = a; i <= b; i++) {
                obj[i - a] = String.fromCharCode('' + i);
            }
        }
        return obj;
    },

    in_array: function (any, array) {
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
    array: function() {return {};},
    array_unique: function (array) {
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
    array_sum: function (array) {
        var sum = 0;
        for (var p in array) {
            if (array.hasOwnProperty(p) && typeof array[p] == 'number') {
                sum += array[p];
            }
        }
        return sum;
    },

    array_product: function (array) {
        var sum = 1;
        for (var p in array) {
            if (array.hasOwnProperty(p) && typeof array[p] == 'number') {
                sum *= array[p];
            }
        }
        return sum;
    },

    array_merge: function () {
        var arrs = Array.prototype.slice.call(arguments), obj = {}, ind = 0;
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

    array_merge_recursive: function () { // TODO:
        var arrs = Array.prototype.slice.call(arguments), obj = {}, ind = 0;
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

    array_keys: function (obj) {
        var t = {}, i = 0;
        for (var p in obj) {if (obj.hasOwnProperty(p)) {t[i++] = p.replace("__a", "");}}
        return t;
    },

    array_key_exists: function (any, array) {
        return array[any] ? true : false;
    },

    // string method
    addcslashes: function (str, c) {
        return ('' + str).split(c).join('\\' + c);
    },
    stripcslashes: function (str) {
        return ('' + str).replace(/\\/, '');
    },

    addslashes: function (str) {
        return ('' + str).replace(/[\'\"\\]/g, function (s) {return '\\' + s;});
    },

    stripslashes: function (str) {
        return ('' + str).replace(/(\\\')|(\\\")|(\\\\)/g, function (s) {return s.replace('\\', '');});
    },

    // rtrim alias
    chop: function (str, clist) {
        var res = (clist != undefined)
            ? '[' + ('' + clist).replace(__nre, function (s) {return '\\' + s;})+ ']+$'
            : '[\\0\\t\\n\\r\\s]+$' 
        return ('' + str).replace(new RegExp(res), '');
    },

    chr: function (asc) {
        return String.fromCharCode('' + asc);
    },

    chunk_split: function (str, len, end) {
        str = '' + str, len = len || 0, end = end || '';
        return len == 0 ? str : str.replace(new RegExp('.{' + len + '}', 'g'), function (s) {
            return s + end;
        });
    },

    ltrim: function (str, clist) {
        var res = (clist != undefined)
            ? '^[' + ('' + clist).replace(__nre, function (s) {return '\\' + s;})+ ']+'
            : '^[\\0\\t\\n\\r\\s]+' 
        return ('' + str).replace(new RegExp(res), '');
    },

    rtrim: function (str, clist) {
        var res = (clist != undefined)
            ? '[' + ('' + clist).replace(__nre, function (s) {return '\\' + s;})+ ']+$'
            : '[\\0\\t\\n\\r\\s]+$' 
        return ('' + str).replace(new RegExp(res), '');
    },

    trim: function (str, clist) {
        var tmps = (clist != undefined) 
            ? ('' + clist).replace(__nre, function (s) {return '\\' + s;})
            : '\\0\\t\\n\\r\\s';
        return ('' + str).replace(new RegExp('(^[' + tmps + ']+)|([' + tmps + ']+$)', 'g'), '');
    },

    ord: function (str) {
        return ('' + str).charCodeAt(0);
    },

    parse_str: function (str) {
        var obj = {}, arr = ('' + str).split('&');
        for (var i = 0, l = arr.length; i < l; i++) {
            var item = arr[i];
            item = item.indexOf('%') > -1 ? decodeURI(item) : item;
            var pi = item.split('=');
            obj[pi[0]] = pi[1] || '';
        }
        return obj;
    },

    print: function () {
        var args = Array.prototype.slice.call(arguments), s = '';
        for (var i = 0, l = args.length; i < l; i++) {
            var ts = args[i];
            s += ts ? ts : '';
        }
        return s;
    },

    quotemeta: function (str) {
        return ('' + str).replace(__nre, function (s) {return '\\' + s});
    },

    str_pad: function (str, len, pad, type) {
        var to = {'STR_PAD_RIGHT': 0, 'STR_PAD_LEFT': 1, 'STR_PAD_BOTH': 2};
        str = '' + str, len = len || 0, pad = pad || '', type = type || 'STR_PAD_RIGHT';
        if (len > str.length) {
            if (to[type] != 2){
                var par = '', t = (len - str.length) / pad.length;
                while(t-- > 0) {par += pad;}
                return to[type] == 0 ? (str + par) : (par + str);
            }
            else {
                var par = '', t = (len - str.length) / pad.length / 2;
                while(t-- > 0) {par += pad;}
                return par + str + par;
            }
        }
        return str;
    },

    str_repeat: function (str, rn) {
        var all = '';
        while (rn--) {all += str;}
        return all;
    },

    str_split: function (str, len) {
        str = '' + str, len = len || 0;
        if (len !== 0) {
            var obj = {};
            var mats = str.match(new RegExp('.{' + len + '}', 'g'));
            for (var i = 0, l = mats.length; i < l; i++) {
                obj['__a' + i] = mats[i];
            }
            var lef = str.slice(l * len);
            if (lef) {
                obj['__a' + i] = lef;
            }
            return obj;
        }
        else {
            return {'__a0': str};
        }
    },

    strcmp: function (str1, str2) {
        str1 = '' + str1, str2 = '' + str2;
        return str1 == str2 ? 0 : (str1 > str2 ? 1 : -1);
    },

    strcasecmp: function (str1, str2) {
        str1 = ('' + str1).toLowerCase(), str2 = '' + str2.toLowerCase();
        return str1 == str2 ? 0 : (str1 > str2 ? 1 : -1);
    },

    strchr: function (str, search) {
        str =  '' + str;
        return str.slice(str.indexOf((typeof search == 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    strstr: function (str, search) {
        str =  '' + str;
        return str.slice(str.indexOf((typeof search == 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    stristr: function (string,search) {
        str =  '' + str;
        return str.slice(str.toLowerCase().indexOf(
            (typeof search == 'number' 
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
        return str.slice(str.lastIndexOf((typeof search == 'number' ? String.fromCharCode(search) : ('' + search))));
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
        str = '' + str, start = start || 0, len = (len == undefined || typeof len != 'number') ? -1 : len;
        return str.substring(start, (len == -1 ? str.length : (start + len)));
    },

    substr_count: function (str, substr, start, len) {
        str = '' + str, start = start || 0, len = (len == undefined || typeof len != 'number') ? -1 : len;
        return str.substring(start, (len == -1 ? str.length : (start + len))).split(substr).length - 1;
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
    
    is_bool: function (bool) {
        return (bool === true || bool === false) ? true : false;
    },

    floatval: function (any) {
        return parseFloat('' + str);
    },

    intval: function (str) {
        return parseInt('' + str)
    },

    is_float: function (f) {
        return (typeof f == 'number' && parseInt(f) != f) ? true : false;
    },

    is_real: function (f) {
        return (typeof f == 'number' && parseInt(f) != f) ? true : false;
    },

    is_int: function (i) {
        return (typeof f == 'number' && parseInt(f) == f) ? true : false;
    },

    is_integer: function (i) {
        return (typeof i == 'number') ? true : false;
    },

    is_object: function (o) {
        return {}.toString.call(o) === '[object Object]';
    },

    is_callable: function (o) {
        return (typeof o == 'function') ? true : false;
    },

    is_string: function (s) {
        return (typeof s == 'string') ? true : false;
    },

    is_numeric: function (a) {
        return (typeof a == 'number') ? true : false;
    },

    strval: function (any) {
        return (any != undefined && any.toString) ? arr.toString() : '';
    },

    var_dump: function (any) {
        if (typeof any == 'obj') { // TODO:

        }
        else {
            return '' + any;
        }
    },

    echo: function () {
        var args = Array.prototype.slice.call(arguments), s = '';
        for (var i = 0, l = args.length; i < l; i++) {
            var ts = args[i];
            s += ts ? ts : '';
        }
        return s;
    },

    //math
    
    abs: function (num) {
        return (typeof num == 'number') ? (num < 0 ? (0 - num) : num) : '';
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
        return Math.atanh(x)
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
        return red * 180 / Math.PI;
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
        return (typeof x == 'number' && typeof y == 'number') && x % y;
    },

    hexdec: function (hex) {
        return parseInt('' + hex, 16);
    },

    octdec: function (oct) {
        return parseInt('' + oct, 8);
    },

    hypot: function (x, y) {
        return (typeof x == 'number' && typeof y == 'number') && Math.sqrt(x * x + y * y);
    },

    is_infinite: function (x) {
        return (('' + x) == 'Infinity') ? true : false; 
    },

    is_nan: function (x) {
        return (('' + x) == 'NaN') ? true : false;
    },

    lcg_value: function () {
        return Math.random();
    },

    lcg_value: function () {
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
        var arrs = Array.prototype.slice.call(arguments)
        obj = (typeof arrs[0] == 'object') ? arrs[0] : arrs;
        var max = obj['__a0'];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] > max) {
                max = obj[p];
            }
        }
        return max;
    },

    min: function () {
        var arrs = Array.prototype.slice.call(arguments)
        obj = (typeof arrs[0] == 'object') ? arrs[0] : arrs;
        var min = obj['__a0'];
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
        return (typeof x == 'number' && typeof y == 'number') ? Math.pow(x, y) : false;
    },

    round: function (x) {
        return Math.round(x);
    },

    sqrt: function (x) {
        return Math.sqrt(x);
    },

    // common php method
    uniqid: function (prefix, more_entropy) {

    },

    highlight: function (str, type) {
        return str;
    },

    json_encode: function (obj) {
        return JSON.stringify(obj).replace(/__a/g, '');
    },
    json_decode: function (json) {

    }
};