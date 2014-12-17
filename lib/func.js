

module.exports = {
    escape: function (str, format) {
        if (typeof str == 'number') {
            return str;
        }
        else if (typeof str != 'string') {
            return '';
        }
        // format: html,htmlall,url,quotes,hex,hexentity,javascript
        switch (format) {
            case 'html': // escape & " ' < > *
                var obj = {
                    '<': '&#60;',
                    '>': '&#62;',
                    '\'': '&#039;',
                    '"': '&#034;',
                    '&': '&#038;'
                };
                return str.replace(/[\'\"<>&']/g, function (item) {
                    return obj[item];
                });
                break;
            case 'htmlall':
                break;
            case 'url':
                return encodeURIComponent(str);
                break;
            case 'quotes':
                return str.replace(/[\'\"]/g, function (item) {
                    return '\\' + item;
                });
                break;
            case 'hex':
                break;
            case 'hexentity':
                break;
            case 'javascript':
                return str; 
                break;
            default:
                return str;
                break;
        }
    },

    strip: function (str, repl) {
        var tmp = (repl && ('string' == typeof repl)) ? repl : ' ';
        return str.replace(/[\s\n\r\t]+/g, tmp);
    },

    isset: function (any) {
        return any ? true : false;
    },

    empty: function (obj) {
        return (this.count(obj) > 0) ? false : true;
    },

    count: function (obj) {
        var n = 0;
        for(var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return n;
    },

    time: function () {
        return new Date().toLocaleString();
    },

    capitalize: function (str, containNum) {
        return str.replace(/\w+\s*/g, function (item) {
            if (/\d/g.test(item)) {
                return (containNum === true) ? item.charAt(0).toUpperCase() + item.slice(1) : item;
            }
            else {
                return item.charAt(0).toUpperCase() + item.slice(1);
            }
        });
    },

    cat: function (str, ss) {
        return str + ss;
    },

    count_characters: function (str, isWithSpace) {
        return isWithSpace ? str.length : str.split(/\s*/).join('').length;
    },

    count_paragraphs: function (str, isWithSpace) { //with \n

    },
    count_sentences: function (str) { //with .

    },

    count_words: function (str) {
        return str.split(/\w+\s*/).length;
    },

    date_format: function (time, format, defaultTime) {
        if (time.getDate) {
            return time.getTime();
        }
        else {
            return this.date_format(defaultTime, format, new Date());
        }
    },

    default: function (str, con) {
        return str ? str : con;
    },

    indent: function (str, num, repl) {
        function gotSpace(n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += ((repl && 'string' == typeof repl) ? repl : ' ');
            }
            return s;
        }
        return ('number' == typeof num && num > 0) ? (gotSpace(num) + str) : (gotSpace(4) + str);
    },

    lower: function (str) {
        return str.toLowerCase();
    },

    nl2br: function (str) {
        return str.replace(/\n/g, '<br />');
    },

    regex_replace: function (str, reg, repl) {
        return str.replace(re, repl);
    },

    replace: function (str, srcstr, opstr) {
        return str.replace(srcstr, opstr);
    },

    spacify: function (str, spacifystr) {
        if ('string' == typeof spacifystr) {
            return spacifystr ? str.split('').join(spacifystr) : str.split('').join(' ');
        }
    },

    string_format: function (number, format) { //%.2f, %d
        return number;
    },

    strip_tags: function (str) {
        return str.replace(/<.*?>/g, '');
    },

    truncate: function (str, num, repl) { //num默认80
        return str.substr(0, ((num && 'number' == typeof num && num > 0) ? num : 80)) 
            + ((repl && 'string' == typeof repl) ? repl : '...');
    },

    upper: function (str) {
        return str.toUpperCase();
    },

    wordwrap: function (str, num, repl) {
        var re = new RegExp('.{' + ((num && 'number' == typeof num && num > 0) ? num : 80) + '}', 'g');
        return str.replace(re, function (item) {
            return item + (repl && 'string' == typeof repl) ? repl : '\n';
        });
    },
    is_array: function (obj) {
        return {}.toString.call(obj) === '[object Object]';
    },
    ceil: function (number) {
        return Math.ceil(number);
    },
    range: function (a, b) {
        var obj = {};
        a = ('' + a).charCodeAt();
        b = ('' + b).charCodeAt();
        if (a < b) {
             for (var i = a; i <= b; i++) {
                obj[i] = String.fromCharCode('' + i);
            }
        }
        return obj;
    },
    in_array: function (str, array) {
        return array[str] ? true : false;
    },

    explode: function (symbol, array) {
        var ret = '';
        var len = symbol.length;
        for (var p in array) {
            ret += array[p] + symbol;
        }
        return ret.slice(0, ret.length - len);
    },
    json_encode: function (obj) {
        return JSON.stringify(obj);
    }
};