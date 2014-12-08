
{%foreach from=$list item=info key=indexkey name='fuck'%}
    {%$info->name|capitalize%}, {%$info.age|cat:'s'%}, {%$info.url%}, {%$keyindex%}
{%/foreach%}

{%time()%}