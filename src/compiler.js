/**
 * @file Compiler of Smarty4Js
 * @author mj(zoumiaojiang@gmail.com)
 */


/**
 * compiler class
 *
 * @class
 */
export default class Compiler {

    constructor(engine) {
        this.init(engine);
    }

    /**
     * init Compiler
     *
     * @param  {Object} engine a template engine object
     */
    init(engine) {
        this.engine = engine;
    }

    /**
     * render of compiler
     *
     * @param  {Object} data  data of render
     * @return {string}       html code
     */
    render(data) {
        let jsTpl = this.getJsTpl();
        return (new Function('return ' + jsTpl)()).render(data || {});
    }

    /**
     * get js template
     *
     * @param  {number} type  js template style
     * @return {string}       js code
     */
    getJsTpl(type) {
        return this.engine.renderer.parser(type);
    }


}




