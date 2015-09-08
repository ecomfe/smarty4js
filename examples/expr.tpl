
{%1 + 2%}

{%$x = 1%}
{%$y = 2%}
{%$x + $y%}

{%$foo = 'abcdef'%}
{%$count = 6%}
{%$factor = 2%}
{%$foo|truncate:"`$count / $factor - 1`"%}

{%*support all logic expression and operation expression or mix*%}