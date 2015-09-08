/**
 * @file smarty build-in function
 * @author johnson [zoumiaojiang@gmail.com]
 */

module.exports = {

    // TODO: counter, cycle ...
    'html_image': function (p) {
        var height = p.height ? ' height="' + p.height + '"' : '';
        var width = p.width ? ' width="' + p.width + '"' : '';
        var border = p.border ? ' border="' + p.border + '"' : '';
        var alt = p.alt ? ' alt="' + p.alt + '"' : '';
        return '<img src="' + (p.file || '') + '"' + height + width + border + alt + '/>';
    },

    'html_checkboxes': function (p) {
        var __htm = '';
        var name = p.name || 'checkboxs';
        if (p.values && p.output) {
            for (var i in p.values) {
                if (p.values.hasOwnProperty(i)) {
                    var val = p.values[i];
                    var out = p.output[i];
                    __htm += '<label><input type="checkbox" name="' + name + '" value="' + val
                        + '"' + (val == p.selected ? ' checked' : '') + '/>'
                        + out + '</label>' + (p.separator || '');
                }
            }
        }
        else if (p.options) {
            var opts = p.options;
            for (var j in opts){
                if (opts.hasOwnProperty(j)) {
                    __htm += '<label><input type="checkbox" name="' + name + '" value="' + j + '"'
                        + (j == p.selected ? ' checked' : '') + '/>' + opts[j] + '</label>' + (p.separator || '');
                }
            }
        }
        return __htm;
    },

    'html_options': function (p) {
        var name = p.name || 'select';
        var __htm = '<select name="' + name + '">';
        if (p.values && p.output) {
            for (var i in p.values) {
                if (p.values.hasOwnProperty(i)) {
                    var val = p.values[i];
                    var out = p.output[i];
                    __htm += '<option label="' + out + '" value="' + val + '"' 
                        + (val == p.selected ? ' selected' : '') + '>' + out + '</option>';
                }
            }
        }
        else if (p.options) {
            var opts = p.options;
            for (var j in opts) {
                if (opts.hasOwnProperty(j)) {
                    __htm += '<option label="' + opts[j] + '" value="' + j + '"' 
                        + (j == p.selected ? ' selected' : '') + '>' + opts[j] + '</option>';
                }
            }
        }
        return __htm + '</select>';
    },

    'html_radios': function (p) {
        var __htm='';
        var name = p.name||'radios';
        if (p.values && p.output) {
            for (var i in p.values) {
                if (p.values.hasOwnProperty(i)) {
                    var val = p.values[i];
                    var out = p.output[i];
                    __htm += '<label for="' + name + '_' + val + '">' + '<input type="radio" name="' + name + '" value="' + name + '_'
                        + val + '"' + (val == p.checked ? ' checked' : '') + '/>'
                        + out + '</label>' + (p.separator || '');
                }
            }
        }
        else if (p.options){
            var opts = p.options;
            for (var j in opts) {
                if (opts.hasOwnProperty(j)) {
                    __htm += '<label for="' + name + '_' + j + '">' + '<input type="radio" name="' + name
                        + '" value="' + name + '_' + j + '"' + (j == p.checked ? ' checked' : '') + '/>'
                        + opts[j] + '</label>' + (p.separator || '');
                }
            }
        }
        return __htm;
    },

    math: function (p) {
        var ret = '';
        if (p.equation) {
            ret = (new Function('o', 'return ' + p.equation.replace(/[_\w][_\w\d]*/g, function (s) {
                return (Math[s] ? 'Math.' : 'o.') + s;
            })))(p);
        }
        if (p.format) {
            ret = __f["string_format"]('' + ret, p.format);
        }
        if (p.assign) {
            __da[p.assign] = ret;
            ret = '';
        }
        return ret;
    }
};
