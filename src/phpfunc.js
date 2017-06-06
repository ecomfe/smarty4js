/**
 * @file php function module
 * @author mj(zoumiaojiang@gmail.com)
 */

let __nre = /[\.\(\)\[\]\{\}\+\-\*\?\|\^\$]/g;

export default {
    escape(str, f) {
        let tmp = '';
        function padnum(n, w, r, p = '0') {
            n = n.toString(r || 10);
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
                let obj = {'<': '&#60;', '>': '&#62;', '\'': '&#039;', '"': '&#034;', '&': '&#038;'};
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
                for (let i = 0, l = str.length; i < l; i++) {
                    tmp += '%' + padnum(str.charCodeAt(i), 2, 16);
                }
                return tmp;
            }
            if (f === 'hexentity') {
                str.split('').forEach(s => {
                    tmp += '&#x' + padnum(s, 4, 16);
                });
                return tmp;
            }
            if (f === 'decentity') {
                str.split('').forEach(s => {
                    tmp += '&#' + s + ';';
                });
                return tmp;
            }
            if (f === 'javascript') {
                let map = {'\\': '\\\\', '\'': '\\\'', '"': '\\"', '\r': '\\r', '\n': '\\n', '</': '<\\/'};
                return str.replace(/[\\'"\r\n]|<\//g, function (s) {
                    return map[s];
                });
            }
        }
        return str;
    },

    strip(str, s) {
        return str.replace(/[\s\n\r\t]+/g, ((s && ('string' === typeof s)) ? s : ' '));
    },

    isset(any) {
        return any !== undefined;
    },

    empty(obj) {
        return Object.keys(obj).length === 0;
    },

    count(obj) {
        return Object.keys(obj).length;
    },

    sizeof(obj) {
        return Object.keys(obj).length;
    },

    time() {
        let d = new Date();
        return ''
            + [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' '
            + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    },

    capitalize(str, cnb) {
        return str.replace(/\w+\s*/g, item => (/\d/g.test(item)
            ? ((cnb === true) ? item.charAt(0).toUpperCase() + item.slice(1) : item)
            : item.charAt(0).toUpperCase() + item.slice(1))
        );
    },

    cat(a, b) {
        return '' + a + b;
    },

    'count_characters'(str, iws) {
        return iws ? str.length : str.split(/\s*/).join('').length;
    },

    'count_paragraphs'(str, iws) {
        return str.split(new RegExp('[\r\n]' + iws ? '' : '+')).length;
    },
    'count_sentences'(str) {
        return str.split('.').length;
    },

    'count_words'(str) {
        return str.split(/\w+\s*/).length - 1;
    },

    'default'(str, con) {
        return str !== undefined ? str : con;
    },

    indent(str, num, repl) {
        function gotSpace(n) {
            let s = '';
            for (let i = 0; i < n; i++) {
                s += (repl ? '' + repl : ' ');
            }
            return s;
        }
        return ('number' === typeof num && num > 0) ? (gotSpace(num) + str) : (gotSpace(4) + str);
    },

    lower(str) {
        return ('' + str).toLowerCase();
    },

    nl2br(str) {
        return ('' + str).replace(/\n/g, '<br/>');
    },

    'regex_replace'(str, re, rs) {
        return ('' + str).replace((new Function('return ' + re))(), rs);
    },

    replace(str, s, o) {
        return ('' + str).split(s).join(o);
    },

    spacify(str, ss) {
        return ss !== undefined ? str.split('').join(ss) : str.split('').join(' ');
    },

    'string_format'(num, f) {
        num = parseFloat('' + (num || 0), 10);
        return f !== undefined
            ? f === '%d'
                ? parseInt('' + num, 10)
                : (/%\.(\d)f/.test(f)) ? num.toFixed(parseInt(RegExp.$1, 10)) : num
            : num;
    },

    'strip_tags'(str) {
        return ('' + str).replace(/<.*?>/g, '');
    },

    truncate(str, num, s) {
        str = '' + str;
        return num >= str.length ? str : str.substr(0, ((num >= 0) ? num : 80)) + (s ? '' + s : '...');
    },

    upper(str) {
        return ('' + str).toUpperCase();
    },

    wordwrap(str, num, s) {
        str = ('' + str).split('');
        num = (num >= 0 ? num : 80);
        for (let i = 0, l = str.length; i < l; i++) {
            if (i % num === 0 && i !== 0) {
                str[i] = str[i] + (s ? '' + s : '\n');
            }
        }
        return str.join('');
    },
    'is_array'(obj) {
        return ({}.toString.call(obj) === '[object Object]' || {}.toString.call(obj) === '[object Array]');
    },

    ceil(num) {
        return Math.ceil(parseFloat((num || 0), 10));
    },

    range(a, b, step = 1) {
        let arr = [];
        if (typeof a === 'number' && typeof b === 'number' && a < b) {
            for (let i = a; i <= b; i += step) {
                arr[(i - a) / step] = i;
            }
        }
        if (typeof a === 'string' && typeof b === 'string') {
            a = ('' + a).charCodeAt(0);
            b = ('' + b).charCodeAt(0);
            if (a < b) {
                for (let i = a; i <= b; i += step) {
                    arr[(i - a) / step] = String.fromCharCode('' + i);
                }
            }
        }
        return arr;
    },

    'in_array'(any, array) {
        return !!array[any];
    },

    explode(s, str) {
        let obj = {};
        let arr = str.split(s);
        for (let i = 0, l = arr.length; i < l; i++) {
            obj['__a' + i] = arr[i];
        }
        return obj;
    },
    implode(s, obj) {
        let arr = [];
        Object.keys(obj).forEach(p => {
            arr.push(obj[p]);
        });
        return arr.join(s);
    },
    join(s, obj) {
        let arr = [];
        Object.keys(obj).forEach(p => {
            arr.push(obj[p]);
        });
        return arr.join(s);
    },
    array() {
        return [];
    },
    'array_unique'(array) {
        let obj = {};
        let ret = {};
        Object.keys(array).forEach(p => {
            if (!obj[array[p]]) {
                obj[array[p]] = true;
                ret[p] = array[p];
            }
        });
        return ret;
    },
    'array_sum'(array) {
        let sum = 0;
        Object.keys(array).forEach(p => {
            if (typeof array[p] === 'number') {
                sum += array[p];
            }
        });
        return sum;
    },

    'array_product'(array) {
        let sum = 1;
        Object.keys(array).forEach(p => {
            if (typeof array[p] === 'number') {
                sum *= array[p];
            }
        });
        return sum;
    },

    'array_merge'(...args) {
        let obj = {};
        let ind = 0;
        args.forEach(arr => {
            Object.keys(arr).forEach(p => {
                obj[(p.indexOf('__a') > -1) ? ('__a' + ind++) : p] = arr[p];
            });
        });
        return obj;
    },

    'array_merge_recursive'(...args) { // TODO:
        let obj = {};
        let ind = 0;
        args.forEach(arr => {
            Object.keys(arr).forEach(p => {
                obj[(p.indexOf('__a') > -1) ? ('__a' + ind++) : p] = arr[p];
            });
        });
        return obj;
    },

    'array_keys'(obj) {
        let t = [];
        Object.keys(obj).forEach(p => {
            t.push(p.replace('__a', ''));
        });
        return t;
    },

    'array_key_exists'(any, array) {
        return !array[any] === undefined;
    },

    // string method
    addcslashes(str, c) {
        return ('' + str).split(c).join('\\' + c);
    },

    stripcslashes(str) {
        return ('' + str).replace(/\\/, '');
    },

    addslashes(str) {
        return ('' + str).replace(/[\'\"\\]/g, function (s) {
            return '\\' + s;
        });
    },

    stripslashes(str) {
        return ('' + str).replace(/(\\\')|(\\\")|(\\\\)/g, function (s) {
            return s.replace('\\', '');
        });
    },

    // rtrim alias
    chop(str, clist) {
        let res = (clist !== undefined)
            ? '[' + ('' + clist).replace(__nre, function (s) {
                return '\\' + s;
            }) + ']+$'
            : '[\\0\\t\\n\\r\\s]+$';
        return ('' + str).replace(new RegExp(res), '');
    },

    chr(asc) {
        return String.fromCharCode('' + asc);
    },

    'chunk_split'(str, len = 0, end = '') {
        str = '' + str;
        return len === 0 ? str : str.replace(new RegExp('.{' + len + '}', 'g'), s => s + end);
    },

    ltrim(str, clist) {
        let res = (clist !== undefined)
            ? '^[' + ('' + clist).replace(__nre, function (s) {
                return '\\' + s;
            }) + ']+'
            : '^[\\0\\t\\n\\r\\s]+';
        return ('' + str).replace(new RegExp(res), '');
    },

    rtrim(str, clist) {
        let res = (clist !== undefined)
            ? '[' + ('' + clist).replace(__nre, s => '\\' + s) + ']+$'
            : '[\\0\\t\\n\\r\\s]+$';
        return ('' + str).replace(new RegExp(res), '');
    },

    trim(str, clist) {
        let tmps = (clist !== undefined)
            ? ('' + clist).replace(__nre, function (s) {
                return '\\' + s;
            })
            : '\\0\\t\\n\\r\\s';
        return ('' + str).replace(new RegExp('(^[' + tmps + ']+)|([' + tmps + ']+$)', 'g'), '');
    },

    ord(str) {
        return ('' + str).charCodeAt(0);
    },

    'parse_str'(str) {
        let obj = {};
        let arr = ('' + str).split('&');
        for (let i = 0, l = arr.length; i < l; i++) {
            let item = arr[i];
            item = item.indexOf('%') > -1 ? decodeURI(item) : item;
            let pi = item.split('=');
            obj[pi[0]] = pi[1] || '';
        }
        return obj;
    },

    print(...args) {
        let s = '';
        for (let i = 0, l = args.length; i < l; i++) {
            let ts = args[i];
            s += ts ? ts : '';
        }
        return s;
    },

    quotemeta(str) {
        return ('' + str).replace(__nre, function (s) {
            return '\\' + s;
        });
    },

    'str_pad'(str, len = 0, pad = '', type = 'STR_PAD_RIGHT') {
        let to = {
            STR_PAD_RIGHT: 0,
            STR_PAD_LEFT: 1,
            STR_PAD_BOTH: 2
        };
        let par = '';
        let t = 0;
        str = '' + str;
        let ret = str;
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

    'str_repeat'(str, rn) {
        let all = '';
        while (rn--) {
            all += str;
        }
        return all;
    },

    'str_split'(str, len = 0) {
        let arr = [];
        str = '' + str;
        if (len !== 0) {
            let mats = str.match(new RegExp('.{' + len + '}', 'g'));
            let l = mats.length;
            for (let i = 0; i < l; i++) {
                arr.push(mats[i]);
            }
            let lef = str.slice(l * len);
            if (lef) {
                arr.push(lef);
            }
        }
        else {
            arr = [str];
        }
        return arr;
    },

    strcmp(str1, str2) {
        str1 = '' + str1, str2 = '' + str2;
        return str1 === str2 ? 0 : (str1 > str2 ? 1 : -1);
    },

    strcasecmp(str1, str2) {
        str1 = ('' + str1).toLowerCase(), str2 = '' + str2.toLowerCase();
        return str1 === str2 ? 0 : (str1 > str2 ? 1 : -1);
    },

    strchr(str, search) {
        str =  '' + str;
        return str.slice(str.indexOf((typeof search === 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    strstr(str, search) {
        str =  '' + str;
        return str.slice(str.indexOf((typeof search === 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    stristr(str, search) {
        str = '' + str;
        return str.slice(str.toLowerCase().indexOf(
            (typeof search === 'number'
                ? String.fromCharCode(search).toLowerCase()
                : ('' + search).toLowerCase())
        ));
    },

    stripos(str, find, start = 0) {
        str =  '' + str;
        return str.toLowerCase().indexOf(('' + find).toLowerCase(), start);
    },

    strpos(str, find, start = 0) {
        str =  '' + str;
        return str.indexOf(('' + find), start);
    },

    strlen(str) {
        return ('' + str).length;
    },

    strrchr(str, search) {
        str =  '' + str;
        return str.slice(str.lastIndexOf((typeof search === 'number' ? String.fromCharCode(search) : ('' + search))));
    },

    strrev(str) {
        return ('' + str).split('').reverse().join('');
    },

    strripos(str, find, start = 0) {
        str =  '' + str;
        return str.toLowerCase().lastIndexOf(('' + find).toLowerCase(), start);
    },

    strrpos(str, find, start = 0) {
        str =  '' + str;
        return str.lastIndexOf(('' + find), start);
    },

    strtolower(str) {
        return ('' + str).toLowerCase();
    },

    strtoupper(str) {
        return ('' + str).toUpperCase();
    },

    substr(str, start = 0, len) {
        str = '' + str;
        len = (len === undefined || typeof len !== 'number') ? -1 : len;
        return str.substring(start, (len === -1 ? str.length : (start + len)));
    },

    'substr_count'(str, substr, start = 0, len) {
        str = '' + str;
        len = (len === undefined || typeof len !== 'number') ? -1 : len;
        return str.substring(start, (len === -1 ? str.length : (start + len))).split(substr).length - 1;
    },

    ucfirst(str) {
        str = '' + str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    ucwords(str) {
        return ('' + str).replace(/\w+\s*/g, function (item) {
            return /\d/g.test(item) ? item : item.charAt(0).toUpperCase() + item.slice(1);
        });
    },

    rawurldecode(str) {
        return decodeURIComponent('' + str);
    },

    rawurlencode(url) {
        return encodeURIComponent('' + url);
    },

    urldecode(str) {
        return decodeURI('' + str);
    },

    urlencode(url) {
        return encodeURI('' + url);
    },

    // letibal function

    'is_bool'(bool) {
        return bool === true || bool === false;
    },

    floatval(str) {
        return parseFloat('' + str, 10);
    },

    intval(str) {
        return parseInt('' + str, 10);
    },

    'is_float'(f) {
        return typeof f === 'number' && parseInt(f, 10) !== f;
    },

    'is_real'(f) {
        return typeof f === 'number' && parseInt(f, 10) !== f;
    },

    'is_int'(i) {
        return typeof i === 'number' && parseInt(i, 10) === i;
    },

    'is_integer'(i) {
        return typeof i === 'number';
    },

    'is_object'(o) {
        return {}.toString.call(o) === '[object Object]';
    },

    'is_callable'(o) {
        return typeof o === 'function';
    },

    'is_string'(s) {
        return typeof s === 'string';
    },

    'is_numeric'(a) {
        return typeof a === 'number';
    },

    strval(any) {
        return (any !== undefined && any.toString) ? any.toString() : '';
    },

    'let_dump'(any) {
        function isArray(o) {
            return {}.toString.call(o) === '[object Array]';
        }
        function isObj(o) {
            return {}.toString.call(o) === '[object Object]';
        }
        function isOA(o) {
            return isArray(o) || isObj(o);
        }
        function isRealArr(o) {
            Object.keys(o).forEach(p => {
                if (p.indexOf('__a') !== 0) {
                    return false;
                }
            });
            return true;
        }
        function pa(o) {
            let type = (isArray(o) || (isRealArr(o) && isObj(o))) ? 0 : ((isObj(o) && !isRealArr(o)) ? 1 : 2);
            let __enc;
            if (type === 0 || type === 1) {
                __enc = type === 0 ? '[' : '{';
                Object.keys(o).forEach(p => {
                    let to = o[p];
                    __enc += (type === 0
                        ? ''
                        : ('"' + p + '":')) + (isOA(to)
                            ? pa(to)
                            : (typeof to === 'string' ? '"' + to + '"' : to)) + ',';
                });
                __enc = __enc.slice(0, __enc.length - 1) + (type === 0 ? ']' : '}');
            }
            else {
                __enc = o;
            }
            return __enc;
        }
        return (isArray(any) || isObj(any)) ? pa(any).replace(/__a/g, '') : (any || '');
    },

    echo(...args) {
        let s = '';
        for (let i = 0, l = args.length; i < l; i++) {
            let ts = args[i];
            s += ts ? ts : '';
        }
        return s;
    },

    // math

    abs(num) {
        return Math.abs(num);
    },

    acos(deg) {
        return Math.acos(deg);
    },

    acosh(deg) {
        return Math.acosh(deg);
    },

    asin(deg) {
        return Math.asin(deg);
    },

    asinh(deg) {
        return Math.asinh(deg);
    },

    atan2(x, y) {
        return Math.atan2(x, y);
    },

    atan(p) {
        return Math.atan(p);
    },

    atanh(x) {
        return Math.atanh(x);
    },

    cos(x) {
        return Math.cos(x);
    },

    sin(x) {
        return Math.sin(x);
    },

    tan(x) {
        return Math.tan(x);
    },

    cosh(x) {
        return Math.cosh(x);
    },

    sinh(x) {
        return Math.sinh(x);
    },

    tanh(x) {
        return Math.tanh(x);
    },

    dexbin(num) {
        return num.toString(2);
    },

    dechex(num) {
        return num.toString(16);
    },

    decoct(num) {
        return num.toString(8);
    },

    deg2rad(deg) {
        return deg * Math.PI / 180;
    },

    rad2deg(rad) {
        return rad * 180 / Math.PI;
    },
    exp(x) {
        return Math.exp(x);
    },

    expm1(x) {
        return Math.expm1(x);
    },

    floor(x) {
        return Math.floor(x);
    },

    fmod(x, y) {
        return (typeof x === 'number' && typeof y === 'number') && x % y;
    },

    hexdec(hex) {
        return parseInt('' + hex, 16);
    },

    octdec(oct) {
        return parseInt('' + oct, 8);
    },

    hypot(x, y) {
        return (typeof x === 'number' && typeof y === 'number') && Math.sqrt(x * x + y * y);
    },

    'is_infinite'(x) {
        return ('' + x) === 'Infinity';
    },

    'is_nan'(x) {
        return ('' + x) === 'NaN';
    },

    'lcg_value'() {
        return Math.random();
    },

    log10(x) {
        return Math.log10(x);
    },

    log1p(x) {
        return Math.log1p(x);
    },

    log(x) {
        return Math.log(x);
    },

    max(...args) {
        let obj = (typeof args[0] === 'object') ? args[0] : args;
        let max = obj[0];
        Object.keys(obj).forEach(p => {
            if (obj[p] > max) {
                max = obj[p];
            }
        });
        return max;
    },

    min(...args) {
        let obj = (typeof args[0] === 'object') ? args[0] : args;
        let min = obj[0];
        Object.keys(obj).forEach(p => {
            min = obj[p];
        });
        return min;
    },

    pi() {
        return Math.PI;
    },

    pow(x, y) {
        return (typeof x === 'number' && typeof y === 'number') ? Math.pow(x, y) : false;
    },

    round(x) {
        return Math.round(x);
    },

    sqrt(x) {
        return Math.sqrt(x);
    },

    // common php method
    uniqid(prefix) {
        return (prefix || '') + (new Date()).getTime();
    },

    highlight(str, type) {
        return str;
    },

    'json_encode'(obj) {
        function isArray(o) {
            return {}.toString.call(o) === '[object Array]';
        }
        function isObj(o) {
            return {}.toString.call(o) === '[object Object]';
        }
        function isDate(o) {
            return {}.toString.call(o) === '[object Date]';
        }
        function isOAD(o) {
            return isArray(o) || isObj(o) || isDate(o);
        }
        function isRealArr(o) {
            Object.keys(o).forEach(p => {
                if (p.indexOf('__a') !== 0) {
                    return false;
                }
            });
            return true;
        }

        function pa(o) {
            let type = (isArray(o) || (isRealArr(o) && isObj(o))) ? 0 : ((isObj(o) && !isRealArr(o)) ? 1 : 2);
            let __enc = type === 0 ? '[' : '{';
            Object.keys(o).forEach(p => {
                let to = o[p];
                __enc += (type === 0 ? '' : ('"' + p + '":')) + (isOAD(to)
                    ? (isDate(to) ? ('"' + to + '"') : pa(to))
                    : (typeof to === 'string' ? '"' + to.replace(/\"/g, '\\"') + '"' : to)) + ',';
            });
            __enc = (__enc.length <= 1 ? __enc : __enc.slice(0, __enc.length - 1)) + (type === 0 ? ']' : '}');
            return __enc;
        }
        return pa(obj).replace(/__a/g, '');
    },

    date_format(time, format) {
        time = (time instanceof Date) ? time : new Date(+time);
        if (format) {
            let o = {
                '\%m': time.getMonth() + 1,
                '\%d': time.getDate(),
                '\%H': time.getHours(),
                '\%M': time.getMinutes(),
                '\%S': time.getSeconds(),
                '\%s': time.getMilliseconds()
            };

            if (/(\%Y)/.test(format)) {
                format = format.replace(RegExp.$1, (time.getFullYear() + ''));
            }
            Object.keys(o).forEach(k => {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length === 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length));
                }
            });
        }
        else {
            format = time.toDateString();
        }
        return format;
    },

    'json_decode'(json) {
        // TODO
    }
};

