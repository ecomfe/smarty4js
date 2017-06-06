Smarty4Js (Smarty For JavaScript)
======================================

## What?

- JavaScript template engine
- Supports Smarty template syntax
- Used in Node.js
- Simple and powerful way to create and render a template

## Why?

- Powerful
- Don't want to have two or more templates in your project
- Deep love for Smarty

## When?

- When your synchronous templates is Smarty, and your Ajax templates will use the same template
- When you want to write Smarty templates with JavaScript anywhere
- When you want to put a lot of logic in JavaScript templates
- When you like Smarty very much
    
## How?

- Single
- With Grunt
- With Gulp
- With EDP
- With all Node.js web subject


### Usage

#### Install
```bash
    npm install -g smarty4js
```

#### Syntax
```
    Most of Smarty syntax is supported.
```

#### Command line
 ```bash
    // get tpl.js
    smarty4Js compile a.tpl [b.tpl ...] [-c|--config=confPath -o|--output=outputPath]
        -c | --config: Use user-define config file
        -o | --output: Specify a destination directory

    // get tpl.html
    smarty4Js render a.tpl [b.tpl ...] -d|--data=jsonFilePath [-c|--config=confPath -o|--output=outputPath]
        -d | --data  : JSON data file path to render
        -c | --config: Use user-defined config file
        -o | --output: Specify a destination directory

    // show current version
    smarty4Js -v|--version

``` 

- if `render`, return html(`demo.tpl.html`), if `compile`, return jsTpl(`demo.tpl.js`)
- jsTpl is a closure. It has a `render` method that you can use:

```Javascript
    
    // amd and cmd
    var template = require('demo.tpl');
    template.render(data);

    // you can also use <script>

```

#### used in Node.js
```javascript
    // get Smarty class
    var Smarty = require('smarty4Js');

    // create a Smarty object

    var s = new Smarty();

    // if you want to reset smarty config, you can do like this
    var s = new Smarty({
        'left_delimiter': '{%', // default
        'right_delimiter': '%}', // default
        'isAmd': false,
        'isCmd': false,
        'globalVar': '_smartyTpl' // window._smartyTpl is jsTpl object
    });

    // also, you can execute `s.config()` method before do compile
    s.config({
        'left_delimiter': '{%', // default
        'right_delimiter': '%}', // default
        'isAmd': false,
        'isCmd': false,
        'globalVar': '_smartyTpl'
    })

    // if compile source is template code and have `include, extend...` sentence in code
    // you must give a path by `setBasedir` method
    s.setBasedir(path);

    // get compiler
    // `tpl` param is template code or template file path
    var compiler = s.compile(tpl); 


    // get ast
    var ast = s.ast;

    // get js code
    var js = compiler.getJsTpl();

    // render Smarty with data (3 methods)
    var html = compiler.render(data);

    // `tpl` param is template code or template file path
    var html = s.render(tpl, data);

    var html = (new Function('return ' + js)()).render(data);
```

