{%*include file="../../../work/views/loan/index.tpl"*%}
{%$list = [1,2,'a' => ['a' => 2], 'b' => 4, 3]%}
{%$count = 2%}

{%*$a = "{%if count($list) < 3%}{%if 1>2%}1{%else%}44{%/if%}{%elseif 4 > 3%}2{%elseif 4 == 3%}8{%else%}3{%/if%}"*%}
{%*$a*%}
{%$a = []%}
{%$b['a']['c'] = 'asdas'%}
{%if ($list.a.a++ == 0)%}
    xxx
{%/if%} 