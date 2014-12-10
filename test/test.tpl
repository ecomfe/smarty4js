{%strip%}{%literal%}
{%function a%}
    {%while $s > 0%}
        {%$s%}, 
        {%$s--%}
    {%/while%}
{%/function%}
{%call name=a s=100%}
{%/literal%}
{%/strip%}

{%ldelim%}