/**
 * @file smarty build-in function
 * @author mj(zoumiaojiang@gmail.com)
 */

export default {

    // TODO: counter, cycle ...
    'html_image'(p) {
        let height = p.height ? ' height="' + p.height + '"' : '';
        let width = p.width ? ' width="' + p.width + '"' : '';
        let border = p.border ? ' border="' + p.border + '"' : '';
        let alt = p.alt ? ' alt="' + p.alt + '"' : '';
        return '<img src="' + (p.file || '') + '"' + height + width + border + alt + '/>';
    },

    'html_checkboxes'(p) {
        let __htm = '';
        let name = p.name || 'checkboxs';
        if (p.values && p.output) {
            Object.keys(p.values).forEach(i => {
                let val = p.values[i];
                let out = p.output[i];
                __htm += '<label><input type="checkbox" name="' + name + '" value="' + val
                    + '"' + (val === p.selected ? ' checked' : '') + '/>'
                    + out + '</label>' + (p.separator || '');
            });
        }
        else if (p.options) {
            let opts = p.options;
            Object.keys(opts).forEach(j => {
                __htm += '<label><input type="checkbox" name="' + name + '" value="' + j + '"'
                    + (j === p.selected ? ' checked' : '') + '/>' + opts[j] + '</label>' + (p.separator || '');
            });
        }
        return __htm;
    },

    'html_options'(p) {
        let name = p.name || 'select';
        let __htm = '<select name="' + name + '">';
        if (p.values && p.output) {
            Object.keys(p.values).forEach(i => {
                let val = p.values[i];
                let out = p.output[i];
                __htm += '<option label="' + out + '" value="' + val + '"'
                    + (val === p.selected ? ' selected' : '') + '>' + out + '</option>';
            });
        }
        else if (p.options) {
            let opts = p.options;
            Object.keys(opts).forEach(j => {
                __htm += '<option label="' + opts[j] + '" value="' + j + '"'
                    + (j === p.selected ? ' selected' : '') + '>' + opts[j] + '</option>';
            });
        }
        return __htm + '</select>';
    },

    'html_radios'(p) {
        let __htm = '';
        let name = p.name || 'radios';
        if (p.values && p.output) {
            Object.keys(p.values).forEach(i => {
                let val = p.values[i];
                let out = p.output[i];
                __htm += '<label for="' + name + '_' + val + '">'
                    + '<input type="radio" name="' + name + '" value="' + name + '_'
                    + val + '"' + (val === p.checked ? ' checked' : '') + '/>'
                    + out + '</label>' + (p.separator || '');
            });
        }
        else if (p.options) {
            let opts = p.options;
            Object.keys(opts).forEach(j => {
                __htm += '<label for="' + name + '_' + j + '">' + '<input type="radio" name="' + name
                    + '" value="' + name + '_' + j + '"' + (j === p.checked ? ' checked' : '') + '/>'
                    + opts[j] + '</label>' + (p.separator || '');
            });
        }
        return __htm;
    },

    math(p) {
        let ret = '';
        if (p.equation) {
            ret = (new Function(
                'o',
                'return ' + p.equation.replace(/[_\w][_\w\d]*/g, s => (Math[s] ? 'Math.' : 'o.') + s)
            ))(p);
        }
        if (p.format) {
            ret = __f.string_format('' + ret, p.format);
        }
        if (p.assign) {
            __da[p.assign] = ret;
            ret = '';
        }
        return ret;
    }
};
