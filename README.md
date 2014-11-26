Smarty4Js (Smarty For Javascript)
======================================

## what?

- A Javascript template engin most like smarty 
- A more simple tool to write a template
- A easy way to use

## why?

- Because don't want to have two or more template in your project.
- Because you are a lazy coder who don't want to write more template code.
- Because deep love smarty -- :P


## when?

- When your Synchronous template is Smarty ,and your ajax template will use the same template.
- When you want write smarty template with JavaScript anywhere.
- When you want put a lot of logic in JavaScript template
- When you like smarty very much
    
## how?

- with grunt
- with gulp
- with edp
- with itself
- with all subject

### useage

#### install
```bash
    [sudo] npm install -g smarty4Js
```

#### grammar
```
    all of smarty
```

#### command line
 ```bash
    smarty4Js smartyTemplateString  jsonDataString  outputFilePath  
    smarty4Js smartyTemplateFilePath jsonDataFilePath outputFilePath
``` 

#### use in nodejs
```javascript
    /*get Smarty class*/
    var Smarty = require('smarty4Js');

    /*create a smarty object*/
    var smarty = new Smarty();

    /*create smarty ast*/
    var ast = smarty.compile(smartyCode);

    /*render smarty with data*/
    var html = ast.render(data);
    var html = smarty.render(ast, data);
```

