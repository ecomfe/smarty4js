/**
 * @file setup test
 * @author mj(zoumiaojiang@gmail.com)
 */

import Smarty from '../../src/index';

const smarty = new Smarty();
smarty.config({
    globalVar: 'fuckyou'
});
const compiler = smarty.compile('hello {%$name%}');
const jsTpl = compiler.getJsTpl();



console.log('jsTpl: \n--------------------------------------\n', jsTpl);

const renderResult = compiler.render({name: 'world'});

console.log('render result: \n------------------------------------\n', renderResult);

