{%*include file="./a.tpl"*%}

{%$a = 'sadasdaksjdhk--{%$a%}--ashdkjasd'%}

{%$a%}

{%append var = name value = Bob index=last%}

{%$name->'last'%}

{%$list = [1,2,3,4,5]%}

{%foreach from=$list item="item"%}
    {%$item%}
{%/foreach%}