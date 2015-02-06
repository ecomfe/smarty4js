{%*smarty comments*%}

hello, {%$name|upper%}. 
welecom to {%$peoples[1].name|cat: "'s home"%}, 
this is in {%$peoples[1]->city%}

{%$info.location.street%}

{%$tmp = 'location'%}
{%$info.{%$tmp%}.street%}

{%$tmp1 = 'hello, {%$info.location.street%}'%}
{%$tmp1%}

{%$info['location']->city|upper%}

{%$abcdefghijk = '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'%}
{%$s1 = 'cde'%}
{%$s2 = 'ghi'%}
{%$ab{%$s1%}f{%$s2%}jk%}

{%$tmpa = 2%}
{%$tmpb = 10%}
{%"-----testtesttesttes~~`$tmpa + $tmpb`~~ttesttesttesttesttest-----"%}

{%time()%}

{%$num = 5%}
{%$num + 20%}

{%$smarty.ldelim%}

{%$arr = [1,2,3,4, 'a' => [1,2,3,4, 'aa' => 'aaa'], [1,2,3]]%}
{%json_encode($arr)%}