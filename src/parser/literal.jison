/**
 * @file smarty4Js/lib/parser/literal.jison
 * @author johnson [zoumiaojiang@gmail.com]
 * @date 2015-11-11
 */

%lex

lo  '{%literal%}'
lc  '{%/literal%}'
any  (.|{delim})*?
delim  [ \t\n\r\f\b]


/*----- start lexical grammar -----*/
%x l
%%

<INITIAL><<EOF>>                            { return 'EOF'; }
<INITIAL,l>{lo}                             { this.pushState('l'); return 'literal_opentag'; }
<INITIAL>{any}/(<<EOF>>|{lo})               { return 'smarty_code'; }
<l>{lc}                                     { this.popState(); return 'literal_closetag'; }
<l>{any}/({lo}|{lc})                        {
                                                if (yytext.trim().length !== 0) {
                                                    return 'literal_code';
                                                }
                                            }

/lex

/*----- start smarty grammar -----*/
%start root
%ebnf
%%

root
    : EOF 
        {
            return [];
        }
    | stmts EOF  
        {
            return [].concat($1);
        }
    ;

stmts
    : stmts stmt 
        {
            $$ = [].concat($1, $2);
        }
    | stmt 
        {
            $$ = $1;
        }
    ;

stmt
    : smarty_code
        {
            $$ = {
                type: 'TEXT',
                value: $1
            };
        }

    | literal_code
        {
            $$ = {
                type: 'LTEXT',
                value: $1
            };
        }
    | literal_opentag literal_closetag
        {
            $$ = {
                type: 'LTEXT',
                value: ''
            }
        }
    | literal_opentag stmts literal_closetag
        {
            $$ = [].concat($2);
        }
    ;