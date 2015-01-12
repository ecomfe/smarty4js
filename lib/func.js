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
        __h += '<img src="' + (p.file || '') + '"' + height + width + border + alt + '/>';
    },
    'html_checkboxes': function (p) {
        if (p.values && p.output) {
            for (var i in p.values) {
                if (p.values.hasOwnProperty(i)) {
                    var val = p.values[i];
                    var out = p.output[i];
                    __h += '<label><input type="checkbox" name="' + (p.name || '') + '" value="' + val + '"'
                        + (val === '' + p.selected ? ' checked' : '') + '/>' + out + '</label>' + (p.separator || '');
                }
            }
        }
        else if (p.options) {
            var opts = p.options;
            for (var j in opts) {
                if (opts.hasOwnProperty(j)) {
                    __h += '<label><input type="checkbox" name="' + (p.name || '') + '" value="' + j + '"'
                        + (j === '' + p.selected ? ' checked' : '') + '/>' + opts[j] + '</label>' + (p.separator || '');
                }
            }
        }
    },

    'html_options': function (p) {
        __h += '<select name="' + (p.name || '') + '">';
        if (p.values && p.output) {
            for (var i in p.values) {
                if (p.values.hasOwnProperty(i)) {
                    var val = p.values[i];
                    var out = p.output[i];
                    __h += '<option label="' + out + '" value="' + val + '"'
                        + (val === '' + p.selected ? ' selected' : '') + '>' + out + '</option>';
                }
            }
        }
        else if (p.options) {
            var opts = p.options;
            for (var j in opts) {
                if (opts.hasOwnProperty(j)) {
                    __h += '<option label="' + opts[j] + '" value="' + j + '"'
                        + (j === '' + p.selected ? ' selected="selected"' : '') + '>' + opts[j] + '</option>';
                }
            }
        }
        __h += '</select>';
    },

    'html_radios': function (p) {
        var name = p.name || '';
        if (p.values && p.output) {
            for (var i in p.values) {
                if (p.values.hasOwnProperty(i)) {
                    var val = p.values[i];
                    var out = p.output[i];
                    __h += '<label for="' + name + '_' + val + '">'
                        + '<input type="radio" name="' + (p.name || '') + '" value="' + name + '_' + val + '"'
                        + (val === '' + p.selected ? ' checked' : '') + '/>' + out + '</label>' + (p.separator || '');
                }
            }
        }
        else if (p.options) {
            var opts = p.options;
            for (var j in opts) {
                if (opts.hasOwnProperty(j)) {
                    __h += '<label for="' + name + '_' + val + '">'
                        + '<input type="radio" name="' + (p.name || '') + '" value="' + name + '_' + j + '"'
                        + (j === '' + p.selected ? ' checked' : '') + '/>' + opts[j] + '</label>' + (p.separator || '');
                }
            }
        }
    },

    math: function (p) {
        var ret = '';
        if (p.equation) {
            ret = (new Function('o', 'return ' + p.equation.replace(/[_\w][_\w\d]*/g, function (s) {
                return (Math[s] ? 'Math.' : 'o.') + s;
            })))(p);
        }
        if (p.format) {
            ret = __f.string_format('' + ret, p.format);
        }
        if (p.assign) {
            __da[p.assign] = ret;
        }
        else {
            __h += ret;
        }
    }
};
