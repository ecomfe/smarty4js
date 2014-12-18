{%$list = [1,2,3,4,5,6,7]%}
{%foreach from=$list item=item%}
    {%if $item@last%}
        {%$item%}
    {%/if%}
{%/foreach%}