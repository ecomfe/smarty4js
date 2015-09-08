{%for $i = 1 to 9%}
    {%for $j = 1 to 9%}
        {%$i%} * {%$j%} = {%$i * $j%}, 
    {%/for%}
{%/for%}

{%foreach $peoples as $item%}
    {%$item.name%},
    {%$item.age%},
    {%$item.city%},
    {%$item@total%} -- 
    {%$smarty.foreach.index%} ++
{%/foreach%}

{%foreach from=$peoples name=getPeopleInfo item=$item key=aaa%}
    {%$item.name%},
    {%$item.age%},
    {%$item.city%},
    {%$smarty.foreach.total%} -- 
    {%$aaa%}
{%/foreach%}
{%$smarty.foreach.getPeopleInfo.total%}

{%$num = 0%}
{%while $num lt 10%}
    {%$num%},
    {%$num++%}
{%/while%}

{%section name=n loop=$peoples%}
    name:{%$peoples[n].name%}
{%/section%}

{%$smarty.section%}


{%section name=sss loop=20 max=7 step=-2%}
    {%$smarty.section.sss.index%}, 
{%/section%}


{%$b = 'test foreachelse'%}
{%foreach $aaa as $item%}
    {%$item%}, 

{%foreachelse%}
    {%$b%},
    {%foreach from=[1,2,3,4,5] item=a name=testforeachelseinner%}
        {%$a%}
    {%/foreach%}
    ...
{%/foreach%}


{%section name=sectionelsetest loop=$undefineddata%}
    ...
{%sectionelse%}
    xxx
{%/section%}
