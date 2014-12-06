/**
 * @file smarty4Js/lib/parser/index.jison
 * @author Johnson zoumiaojiang@gmail.com
 * @date 2014-11-11
 */

%lex

ws  {delim}+
nl  \n|\r\n|\r|\f
ot  '{%'
ct  '%}'
id   {letter}({letter}|{digit})*
str1 \"{anyns}\" /*"*/
str2 \'{anysns}\' /*'*/
str  {str1}|{str2}
num   {digit}+(\.{digit}+)?([E|e][\+\-]?{digit}+)?
any   (.|{delim})*?
anyns ([^\"]|{delim})*? /*"*/
anysns ([^\']|{delim})*? /*'*/
digit   [0-9]
delim   [ \t\n\r\f\b]
letter  [a-zA-Z_]
nln     [^a-zA-Z0-9_]
simple_op  [\[\]\(\)\.\$@\+\-\*\/%\^=<>\!:\|,#`]
kw      (
            'elseif'|'if'|'foreach'|'else'|'foreachesle'|
            'section'|'sectionelse'|'for'|'to'|'while'|'as'|
            'true'|'false'|'null'|'function'|'strip'|
            'block'|'smarty'|'assign'|'literal'
        )
multi_op  ('>='|'<='|'==='|'=='|'!='|'&&'|'||'|'->'|'=>'|'++'|'--')
al_op     ('and'|'or'|'ge'|'not'|'gte'|'le'|'lte'|'lt'|'gt'|'ne'|'neq'|'eq')

%{
    /*JavaScript util package here*/

    parser.operator_sync = function (str) {
        var opsMap = {
            'ne': '!=',
            'neq': '!=',
            'eq': '==',
            'ge': '>=',
            'gte': '>=',
            'le': '<=',
            'lte': '<=',
            'and': '&&',
            'gt': '>',
            'lt': '<',
            'or': '||',
            'not': '!',
            '===': '=='
        };
        return opsMap[str] ? opsMap[str] : str;
    };

    parser.cutStr = function () {
        yytext = yytext.substr(1, yytext.length - 2);
    }
%}


/*----- start lexical grammar -----*/
%x t v iv eof c
%%
<v,iv,t,eof>{ot}/'*'    { this.begin('c'); return 'L'; }
<eof>{ot}               { this.popState(); this.begin('v'); return 'L'; }
<v,iv>{ot}              { this.begin('iv'); return 'L'; }
<v,iv,c>{ct}            {
                            var s = this.popState();
                            if ('c' == s) {
                                s = this.popState();
                            }
                            if ('v' == s) {
                                this.begin('t');
                            }
                            return 'R';
                        }
<v,iv>{ws}              ;
<c>'*'{any}'*'/{ct}     { return 'COMMENTS'; }
<v,iv>{kw}/{nln}        { return yytext; }
<v,iv>{num}             { return 'NUM'; }
<v,iv>{str}             { parser.cutStr(); return 'STR'; }
<v,iv>{multi_op}        { return parser.operator_sync(yytext); }
<v,iv>{al_op}/{nln}     { return parser.operator_sync(yytext); }
<v,iv>{simple_op}       { return yytext; }
<v,iv>{id}              { return 'ID'; }
<t>{any}/{ot}           { 
                            this.popState(); 
                            this.begin('eof'); 
                            //if (yytext.trim().length > 0) { 
                                return 'TEXT'; 
                            //}
                        }
<t>{any}/<<EOF>>        {
                            if (yytext.trim().length == 0) {
                                return 'EOF';
                            }
                            else {
                                this.popState();
                                this.begin('eof');
                                return 'TEXT';
                            } 
                        }
<eof><<EOF>>            { this.popState(); return 'EOF'; }
<INITIAL><<EOF>>        { return 'EOF'; }
<INITIAL>               { this.begin('t');}

/lex

/*----- operator associations and precedence -----*/
%left '||' '&&'
%left '!'
%left '>=' '<=' '>' '==' '<' '!='
%left '+' '-'
%left '*' '/' '%' '^'
%left '++' '--'
%left '$'
%left ID
%left '.' '[' '->' L '@'
%left '|'
%left ':'
%left '`'
%left ','
%left '=>'
%left TEXT

/*----- start smarty grammar -----*/
%start root
%ebnf
%%

root
    : EOF 
        { return []; }
    | stmts EOF  
        { return $1; }
    ;

stmts
    : stmts stmt 
        { $$ = [].concat($1, $2); }
    | stmt 
        { $$ = [$1]; }
    ;

stmt
    : TEXT 
        { $$ = { 
            type: 'T', 
            value: $1 
        }; }
    | L COMMENTS R 
        { $$ = { 
            type: 'C', 
            value: $2 
        }; }
    | blocks 
        { $$ = $1; }
    | single_stmt 
        { $$ = $1; }
    ;

single_stmt
    : echo_expr_stmt 
        { $$ = $1; }
    | assign_stmts 
        { $$ = $1; }
    | plugin_func_stmts
        { $$ = $1; }
    ;

blocks
    : if_stmts 
        { $$ = $1; }
    | strip_stmts 
        { $$ = $1; }
    | function_stmts 
        { $$ = $1; }
    | for_stmts 
        { $$ = $1; }
    | while_stmts
        { $$ = $1; }
    | section_stmts
        { $$ = $1; }
    | block_stmts 
        { $$ = $1; }
    | literal_stmts
        { $$ = $1; }
    ;

echo_expr_stmt
    : L expr R 
        { $$ = $2; }
    ;

plugin_func_stmts
    : L ID attrs R
        { $$ = {
            type: 'FUNC',
            name: $2,
            attrs: $3
        }; }
    | L ID R
        { $$ = { 
            type: 'FUNC',
            name: $2, 
            attrs: [] 
        }; }
    ;

function_stmts
    : L function attrs R stmts L '/' function R 
        { $$ = { 
            type: 'FUNC', 
            name: $2, 
            attrs: $3, 
            block: $5 
        }; }
    ;

block_stmts
    : L block attrs R stmts L '/' block R
        { $$ = { 
            type: 'FUNC',
            name: $2, 
            attrs: $3 , 
            block: $5 
        }; }
    ;

literal_stmts
    : L literal R stmts L '/' literal R 
        { $$ = { 
            type: 'FUNC', 
            name: $2, 
            attrs: [], 
            block: $4 
        }; }
    ;

strip_stmts
    : L strip attrs R stmts L '/' strip R 
        { $$ = { 
            type: 'FUNC', 
            name: $2, 
            attrs: $3, 
            block: $5
        }; }
    | L strip R stmts L '/' strip R 
        { $$ = { 
            type: 'FUNC', 
            name: $2, 
            attrs: [], 
            block: $4 
        }; }
    ;


for_stmts
    : L foreach vara as vara R stmts L '/' foreach R 
        { $$ = { 
            type: 'FOR', 
            from: $3, 
            item: $5, 
            block: $7 
        }; }

    | L foreach vara as objkvs R stmts L '/' foreach R  
        { $$ = { 
            type: 'FOR', 
            from: $3, 
            item: $5[0], 
            block: $7 
        }; }
    
    | L foreach attrs R stmts L '/' foreach R  
        { $$ = { 
            type: 'FUNC', 
            name: $2, 
            attrs: $3 , 
            block: $5 
        }; }
    
    | L for vara '=' expr to expr R stmts L '/' for R 
        { $$ = { 
            type: 'FOR', 
            item: $3, 
            start: $5, 
            end: $7, 
            block: $9 
        }; }
    ;

section_stmts
    : L section attrs R stmts L '/' section R
        { $$ = { 
            type: 'FUNC', 
            name: $2, 
            attrs: $3, 
            block: $5 
        }; }
    ;

while_stmts
    : L while expr R stmts L '/' while R
        { $$ = { 
            type: 'WHILE', 
            expr: $3, 
            block: $5 
        }; }
    ;

attrs_item
    : ID 
        { $$ = { 
            type: 'ATTR', 
            key: { 
                type: 'STR', 
                value: $1 
            } 
        }; }
    | ID '=' expr 
        { $$ = { 
            type: 'ATTR', 
            key: { 
                type: 'STR', 
                value: $1 
            }, 
            value: $3 
        }; }
    | ID '=' ID 
        { $$ = { 
            type: 'ATTR', 
            key: { 
                type: 'STR', 
                value: $1 
            }, 
            value: { 
                type: 'STR', 
                value: $3 
            } 
        }; }
    ;

attrs
    : attrs_item 
        { $$ = [$1]; }
    | attrs attrs_item 
        { $$ = [].concat($1, $2); }
    ;

if_stmts
    : L if expr R stmts L '/' if R 
        { $$ = { 
            type: 'IF', 
            expr: $3 , 
            block: $5 
        }; }
    | else_stmts 
        { $$ = $1; }
    | elseif_stmts 
        { $$ = $1; }
    ;

else_stmts
    : L else R stmts 
        { $$ = { 
            type:'ELSE', 
            block: $4 
        }; }
    ;

elseif_stmts
    : L elseif expr R stmts 
        { $$ = { 
            type: 'ELSEIF', 
            expr: $3, 
            block: $5 
        }; }
    | L else if expr R stmts 
        { $$ = { 
            type: 'ELSEIF', 
            expr: $4, 
            block: $6 
        }; }
    ;

expr
    : expr '+' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '+' 
        }; }
    | expr '-' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '-' 
        }; }
    | expr '*' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '*' 
        }; }
    | expr '/' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '/' 
        }; }
    | expr '%' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '%' 
        }; }
    | expr '^' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '^' 
        }; }
    | expr '&&' expr    
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '&&' 
        }; }
    | expr '||' expr    
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '||' 
        }; }
    | expr '>' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '>' 
        }; }
    | expr '<' expr     
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '<' 
        }; }
    | expr '>=' expr    
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '>=' 
        }; }
    | expr '<=' expr    
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '<=' 
        }; }
    | expr '==' expr    
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '==' 
        }; }
    | expr '!=' expr    
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '!=' 
        }; }
    | expr '++'         
        { $$ = { 
            type: 'E', 
            items: [$1], 
            ops: '++', 
            r: 'r' 
        }; }
    | expr '--'         
        { $$ = { 
            type: 'E', 
            items: [$1], 
            ops: '--', 
            r: 'r' 
        }; }
    | '++' expr         
        { $$ = { 
            type: 'E', 
            items: [$2], 
            ops: '++', 
            r: 'l' 
        }; }
    | '--' expr         
        { $$ = { 
            type: 'E', 
            items: [$2], 
            ops: '--', 
            r: 'l' 
        }; }
    | '!' expr          
        { $$ = { 
            type: 'E', 
            items: [$2], 
            ops: '!', 
            r: 'l' 
        }; }
    | '(' expr ')'      
        { $$ = $2; }
    | '-' expr          
        { $$ = { 
            type: 'E', 
            items: [$2], 
            ops: '-', 
            r: 'l' 
        }; }
    | expr '|' pipe_func
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '|' 
        }; }
    | expr '|' '@' pipe_func
        { $$ = { 
            type: 'E', 
            items: [$1, $3], 
            ops: '|' 
        }; }
    | vara              
        { $$ = $1; }
    | echo_expr_stmt    
        { $$ = $1; }
    ;

pipe_func
    : pipe_func ':' expr 
        { $$ = { 
            type: 'PIPE', 
            func: $1.func, 
            params: [].concat($1.params, $3) 
        }; }
    | pipe_func ':' ID 
        { $$ = { 
            type: 'PIPE', 
            func: $1.func, 
            params: [].concat($1.params, { 
                type: 'STR', 
                value: $3 
            } ) 
        }; }
    | strip 
        { $$ = { 
            type: 'PIPE', 
            func: $1, 
            params: [] 
        }; }
    | ID  
        { $$ = { 
            type: 'PIPE', 
            func: $1, 
            params: [] 
        }; }
    ;

vara_b
    : ID 
        { $$ = { 
            type: 'ID', 
            value: $1 
        }; }
    | vara_b '[' expr ']' 
        { $$ = [].concat($1, { 
            type: 'OBJ', 
            value: $3, 
            opt: $2, 
            opt1: $4 
        }); }
    | vara_b '[' ID ']' 
        { $$ = [].concat($1, { 
            type: 'OBJ', 
            value: { 
                type: 'ID', 
                value: $3 
            }, 
            opt: $2, 
            opt1: $4 
        }); }
    | vara_b '[' ']' 
        { $$ = [].concat($1, { 
            type: 'OBJ', 
            value: {}, 
            opt: $2, 
            opt1: $3 
        }); }
    | vara_b '.' echo_expr_stmt
        { $$ = [].concat($1, { 
            type: 'ECHO', 
            value: $3, 
            opt: $2
        }); }
    | vara_b '.' '$' ID  
        { $$ = [].concat($1, { 
            type: 'VAR', 
            value: { 
                type: 'ID', 
                value: $4 
            }, 
            opt: $2 
        }); }
    | vara_b '.' ID 
        { $$ = [].concat($1, { 
            type: 'ID', 
            value: $3, 
            opt: $2 
        }); }
    | echo_expr_stmt
        { $$ = { 
            type: 'ECHO', 
            value: $1 
        }; }
    | vara_b '->' expr 
        { $$ = [].concat($1, { 
            type: 'E', 
            value: $3 , 
            opt: $2 
        }); }
    | vara_b '->' ID 
        { $$ = [].concat($1, { 
            type: 'ID', 
            value: $3 , 
            opt: $2 
        }); }
    | vara_b '@' ID
        { $$ = [].concat($1, { 
            type: 'ID', 
            value: $3, 
            opt: $2 
        }); }
    | vara_b ID
        { $$ = [].concat($1,{ 
            type: 'ID', 
            value: $2 
        }); }
    | vara_b echo_expr_stmt
        { $$ = [].concat($1, { 
            type: 'ECHO', 
            value: $2 
        }); }
    ;

vara
    : '$' vara_b  
        { $$ = { 
            type: 'VAR', 
            value: $2 
        }; }
    | global_vara
        { $$ = $1; }
    | literals 
        { $$ = $1; }
    ;

global_vara
    : '$' smarty 
        { $$ = { 
            type: 'GLOBAL', 
            value: $2
        }; }
    | '$' smarty '.' foreach
        { $$ = [].concat({ 
            type: 'GLOBAL', 
            value: $2 
        }, { 
            type: 'GLOBAL', 
            value: $4, 
            opt: $3 
        }); }
    | '$' smarty '.' section
        { $$ = [].concat({ 
            type: 'GLOBAL', 
            value: $2 
        }, { 
            type: 'GLOBAL', 
            value: $4, 
            opt: $3 
        }); }
    ;

literals
    : number 
        { $$ = $1; }
    | string 
        { $$ = $1; }
    | bool 
        { $$ = $1; }
    | ID '(' params ')' 
        { $$ = { 
            type:'FUNC', 
            name: $1,  
            params: $3 
        }; }
    | array 
        { $$ = $1; }
    ;

params
    : expr 
        { $$ = [$1]; }
    | params ',' expr 
        { $$ = [].concat($1, $3); }
    | 
        { $$ = []; }
    ;

assign_stmts
    : L vara '=' expr R 
        { $$ = { 
            type: 'ASSIGN', 
            key: $2, 
            value: $4 
        }; }
    | L assign attrs R
        { $$ = { 
            type: 'FUNC', 
            name: $2, 
            attrs: $3 
        }; }
    ;

objkvs
    : expr '=>' expr 
        { $$ = [{ 
            type: 'OBJ', 
            key: $1, 
            value: $3 
        }]; }
    | objkvs ',' expr '=>' expr 
        { $$ = [].concat($1, { 
            type: 'OBJ', 
            key: $3, 
            value: $5 
        }); }
    ;

array_item
    : expr
        { $$ = $1; }
    | array_item ',' expr
        { $$ = [].concat($1, $3); }
    | array_item '=>' expr,
        { $$ = { 
            type: 'OBJ', 
            key: $1, 
            value: $3 
        }; }
    | array_item ',' expr '=>' expr
        { $$ = [].concat($1, { 
            type: 'OBJ', 
            key: $3, 
            value: $5 
        }); }
    ;

array
    : '[' ']' 
        { $$ = {
            type: 'ARRAY', 
            items: []
        }; }
    | '[' array_item ']' 
        { $$ = { 
            type: 'ARRAY', 
            items: $2 
        }; }
    ;

string
    : STR
        { $$ = { 
            type: 'STR', 
            value: $1 
        }; }
    ;

number
    : NUM 
        { $$ = { 
            type: 'NUM',
            value: $1 
        }; }
    ;

bool
    : true 
        { $$ = { 
            type: 'BOOL', 
            value: $1 
        }; }
    | false 
        { $$ = { 
            type: 'BOOL', 
            value: $1 }; 
        }
    | null 
        { $$ = { 
            type: 'BOOL', 
            value: $1 
        }; }
    ;