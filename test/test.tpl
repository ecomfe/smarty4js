{%strip%}
{%function a%}
    {%while $s > 0%}
        {%$s%}, 
        {%$s--%}
    {%/while%}
{%/function%}
{%a s=100%}
{%/strip%}