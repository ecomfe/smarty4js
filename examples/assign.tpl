{%$test = 1%}
{%$test%}

{%$arr = [1,2,3,[1,2],4,5]%}
{%json_encode($arr)%}

{%assign var=testAssign value='test assign'%}
{%$testAssign%}

{%$a.b['c'].d = 1%}
{%json_encode($a)%}
{%$a.b.c.d%}

{%assign var=foo value=[1,[9,8],3]%}
{%json_encode($foo)%}

{%$num = 5%}
{%$aa = {%$num%} + 3%}
{%$aa%}

{%$x = 4%}
{%$y = 10%}
{%$ret = pow($x, $y)%}
{%$ret%} 
