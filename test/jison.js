/**
 * @file te complier
 * @author johnson(zoumiaojiang@gmail.com)
 */

var fs = require('fs');
var util = require('util');
var jison = require('jison');

var code = fs.readFileSync('./test.tpl', 'utf8') + '{*Smarty 4 JavaScript*}';
var grammar = fs.readFileSync('../lib/parser/index.jison', 'utf8');


function console_log(obj) {
    return JSON.stringify(obj, null, 4);
}

var ast = new(jison.Parser)(grammar).parse(code);

fs.writeFileSync(
    '/Users/zoumiaojiang/Desktop/smarty.json', 
    console_log(ast), 
    {encoding: 'utf8'}
);
