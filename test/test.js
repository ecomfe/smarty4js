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
    ceil: function (num) {
        return num;
    },
    highlight: function (str) {
        return str;
    }
});

var compiler = s.compile(code);
var jsTpl = compiler.getJsTpl();
fs.writeFileSync('/Users/zoumiaojiang/Desktop/a.js', jsTpl, {encoding:'utf8'});
//var html = compiler.render(JSON.parse(data));

var html = (new Function('return ' + jsTpl)()).render(JSON.parse(data));
console.log('------------\nhtml: \n', html);

























































fs.writeFileSync(
    '/Users/zoumiaojiang/Desktop/smarty.json', 
    console_log(s.ast), 
    {encoding: 'utf8'}
);
