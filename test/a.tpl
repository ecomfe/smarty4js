{%function name="target1"%}
    {%foreach $tplData.list as $item%}
        <p>{%$item.name|escape:'html'%}</p>
    {%/foreach%}
{%/function%}


{%function name="target2"%}
    <p>target2</p>
    <p>target2</p>
    <p>target2</p>
    <p>target2</p>
    <p>target2</p>
    <p>target2</p>
    <p>target2</p>
    <p>target2</p>
    {%$a%}
{%/function%}

{%target1%}
{%target2%}