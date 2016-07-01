{%include file="../../a/a.tpl"%}

{%$b = 'this is b page'%}

{%$b%}

{%literal%}
    {%$a.b.c%}
{%/literal%}