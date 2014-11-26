var Smarty = require('../index');
var util = require('util');
var fs = require('fs');

function console_log(obj) {
    return JSON.stringify(obj, null, 4);
}

var code = fs.readFileSync('./test.tpl', 'utf8');
var data = fs.readFileSync('./data.json', 'utf8');

























var s = new Smarty();
s.config({
    left_delimiter: '{%',
    right_delimiter: '%}'
});

s.register({
    'foreach' : function (form, item, index) {
        alert(1);
    },

    'append': function (str) {
        return 'caonidaye';
    }
});

var complier = s.complie(code);
var jsTpl = complier.getJsTpl();
fs.writeFileSync('/Users/zoumiaojiang/Desktop/a.js', jsTpl, {encoding:'utf8'});
var html = complier.render(JSON.parse(data));

//var html = new Function('data', 'engine', jsTpl)(JSON.parse(data), s);
console.log(html);

























































fs.writeFileSync(
    '/Users/zoumiaojiang/Desktop/smarty.json', 
    console_log(s.ast), 
    {encoding: 'utf8'}
);
