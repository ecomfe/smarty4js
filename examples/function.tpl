{%$myOptions = [
    '11' => 'aaa', 
    '22' => 'bbb', 
    '33' => 'ccc'
]%}
{%$mySelect = 22%}
{%html_options name=foo options=$myOptions selected=$mySelect%}

{%function name=funca p=11%}
    {%$p%}
{%/function%}
{%funca p=123%}

{%function name=a%}
    {%$funca%}
{%/function%}

{%$bbbb = "asdsakljdlk---{%a funca='asdasdas'%}---asd;aslkd"%}
{%$bbbb%}


{%function name=testAssign%}
    {%for $i = 1 to $funca%}
        {%for $j = 1 to $funcb%}
            {%$i%} * {%$j%} = {%$i * $j%}, 
        {%/for%}
    {%/for%}
{%/function%}

{%call testAssign funca=9 funcb=9 assign=testFuncAssign%}
{%$testFuncAssign%}


{%capture append="foo"%}
    hello
{%/capture%}
I say just
{%capture append="foo"%}
    world
{%/capture%}
{%foreach $foo as $text%}
    {%$text%}, 
{%/foreach%}

{%*all function used like smarty grammar*%}