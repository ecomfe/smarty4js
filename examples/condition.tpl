
{%$a = 1%}

{%if $a gt 0%}
    <p>true</p>
{%else%}
    <p>false</p>
{%/if%}

{%foreach range(0, 100) as $num%}
    {%if $num % 4 eq 0%}
        {%$num%}--4--, 
    {%else%}
        {%if $num % 5 == 0%}
            {%$num%}--5--,
        {%else if $num % 3 == 0%}
            {%$num%}--3--,
        {%else%}
            --
        {%/if%}
    {%/if%}
{%/foreach%}

{%if !isset($ssssss)%}
    yes!!
{%else%}
    no!!
{%/if%}

{%foreach $peoples as $item%}
    {%if $item@first%}
        {%$item.name%}
    {%else%}
        --
    {%/if%}
{%/foreach%}