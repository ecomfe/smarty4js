/**
 * @file Smarty4js
 * @author mj(zoumiaojiang@gmail.com)
 */

import Compiler from './compiler';
import Renderer from './renderer';
import phpfunc from './phpfunc';
import func from './func';
import utils from './utils';
import path from 'path';
import fs from 'fs';

/**
 * pretreatment template code
 *
 * @param  {string} code template code
 * @param  {Object} conf smarty config
 * @return {string}      code of after pre define
 */
function pretreatmentCode(code, conf) {
    let ld = conf.left_delimiter;
    let rd = conf.right_delimiter;
    let reld = utils.regEscape(ld);
    let rerd = utils.regEscape(rd);

    // literal filter
    let literalPaserModulePath = path.resolve(__dirname, 'parser', 'literal.js');
    let literalPaserFile = fs.readFileSync(literalPaserModulePath, 'utf8');
    let homePath = utils.getHomePath();
    let realLiteralParserFilePath = path.resolve(homePath, 'literal.js');

    if (ld !== '{%') {
        literalPaserFile = literalPaserFile.replace(/\\\{%/g, reld);
    }
    if (rd !== '%}') {
        literalPaserFile = literalPaserFile.replace(/%\\\}/g, rerd);
    }

    fs.writeFileSync(realLiteralParserFilePath, literalPaserFile);

    let literalAst = require(realLiteralParserFilePath).parse(code);
    let newCode = '';

    literalAst.forEach(node => {
        let {type, value} = node;
        if (value && value.trim().length > 0) {
            if (type === 'TEXT') {
                newCode += value;
            }
            else if (type === 'LTEXT') {
                newCode += value.replace(new RegExp(reld, 'g'), '__LD').replace(new RegExp(rerd, 'g'), '__RD');
            }
        }
    });

    // jison hack
    newCode += (ld + '*smarty4js*' + rd);

    return newCode
        .replace(/\\\"/g, '__QD') // replace \" in string ""
        .replace(/\\\'/g, '__QS'); // replace \' in string ''
}



/**
 * Smarty class
 *
 * @class
 */
export default class Smarty {
    constructor(...args) {
        this.id = '__smarty__' + utils.getGUID();
        this.phpfunc = phpfunc;
        this.func = func;
        this.conf = {
            left_delimiter: '{%',
            right_delimiter: '%}',
            isAmd: true,
            isCmd: true,
            globalVar: '_smartyTpl'
        };
        this.config(args);
        this.compiler = new Compiler(this);
        this.renderer = new Renderer(this);
    }

    /**
     * smarty config
     *
     * @param  {Object} conf config options
     */
    config(conf) {
        this.conf = utils.extend(this.conf, conf);
    }


    /**
     * set tpl file base dir
     *
     * @param {string} path  base path
     */
    setBasedir(path) {
        this.dirname = path;
    }

    /**
     * compile the smarty template code
     *
     * @param  {string} tpl smarty template code/file path
     * @return {Object}     smarty Compiler object, have `render` mathod
     */
    compile(tpl) {
        let conf = this.conf;
        let filePath = path.resolve(process.cwd(), (tpl || '' + utils.getGUID()));
        let ld = conf.left_delimiter;
        let rd = conf.right_delimiter;
        let paserModulePath = path.resolve(__dirname, 'parser', 'index.js');
        let paserFile = fs.readFileSync(paserModulePath, 'utf8');
        let homePath = utils.getHomePath();
        let realParserFilePath = path.resolve(homePath, 'index.js');

        if (fs.existsSync(filePath)) {
            tpl = fs.readFileSync(filePath, 'utf-8');
            this.dirname = path.dirname(filePath);
        }

        if (ld !== '{%') {
            paserFile = paserFile.replace(/\\\{%/g, utils.regEscape(ld));
        }
        if (rd !== '%}') {
            paserFile = paserFile.replace(/%\\\}/g, utils.regEscape(rd));
        }

        fs.writeFileSync(realParserFilePath, paserFile);
        this.ast = require(realParserFilePath).parse(pretreatmentCode(tpl, conf));

        return this.compiler;
    }


    /**
     * render tpl with json data
     *
     * @param  {string} tpl  template code/file path
     * @param  {Object} data json data
     * @return {string}      html string
     */
    render(tpl, data) {

        let filePath = path.resolve(process.cwd(), tpl);

        if (fs.existsSync(filePath)) {
            tpl = fs.readFileSync(filePath, 'utf-8');
            this.dirname = path.dirname(filePath);
        }

        return this.compile(tpl).render(data);
    }

    /**
     * user-defined function regiester in smarty
     *
     * @param  {Object}    funcObj  function Object
     */
    register(funcObj) {
        let me = this;
        Object.keys(funcObj).forEach(key => {
            me.func[key] = funcObj[key];
        });
    }


    /**
     * php plugin regiester in smarty
     *
     * @param  {Object}    plugins   plugin's Object
     */
    addPlugin(plugins) {
        let me = this;
        Object.keys(plugins).forEach(key => {
            me.phpfunc[key] = plugins[key];
        });
    }

    /**
     * support express
     *
     * @param  {string}   path    tpl path
     * @param  {Object}   options data
     * @param  {Function} fn      callback
     */
    __express(path, options, fn) {
        fn(null, new Smarty().render(path, options));
    }
}

