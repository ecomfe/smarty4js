{%* 工具函数 params *%}
{%function name="util_params"%}{%strip%}
    {%$str = ""%}
    
    {%foreach $data as $index => $item%}
        {%$str = $str|cat: $index|cat: "="|cat: $item%}

        {%if !$item@last%}
            {%$str = $str|cat: '&'%}
        {%/if%}
    {%/foreach%}

    {%$str%}
{%/strip%}{%/function%}

{%* 生成翻页控件 *%}
{%function name="util_pager" total pageSize page%}{%strip%}
    {%$prefix = "auto-index-pager-"%}
    {%$showCount = 5%}

    {%if empty($param)%}
        {%$param = 'page'%}
    {%/if%}

    {%$pageTotal = ($total / $pageSize)|ceil%}

    {%if $pageTotal > 1%}
        <div class="auto-index-pager">

        {%if $page > 1%}
            {%call name="util_pager_echo_special" i=$page - 1 mark="prev"%}
        {%/if%}

        {%$start = 1%}
        {%$end = $pageTotal%}
        {%$wing = ($showCount - $showCount % 2) / 2%}

        {%$showCount = $wing * 2 + 1%}

        {%if $showCount < $pageTotal%}
            {%$end = $showCount%}
            {%if $page > $wing + 1%}
                {%if $page + $wing > $pageTotal%}
                    {%$start = $pageTotal - $wing * 2%}
                    {%$end = $pageTotal%}
                {%else%}
                    {%$start = $page - $wing%}
                    {%$end = $page + $wing%}
                {%/if%}
            {%/if%}
        {%/if%}
        
        {%* echo start padding *%}
        {%if $start > 1%}
            {%call name="util_pager_echo_num" i=1%}
        {%/if%}
        
        {%if $start > 3%}
            {%call name="util_pager_echo_special" i=2 mark="ellipsis"%}
        {%/if%}

        {%if $start === 3%}
            {%call name="util_pager_echo_num" i=2%}
        {%/if%}

        {%for $var = $start to $end%}
            {%if $var == $page%}
                {%call name="util_pager_echo_special" i=$var mark="current"%}
            {%else%}
                {%call name="util_pager_echo_num" i=$var%}
            {%/if%}
        {%/for%}

        {%$pos = $pageTotal - 2%}

        {%if $end < $pos%}
            {%call name="util_pager_echo_special" i=$pageTotal - 1 mark="ellipsis"%}
        {%/if%}
        
        {%if $end == $pos%}
            {%call name="util_pager_echo_num" i=$pageTotal - 1%}
        {%/if%}

        {%if $pageTotal > $end%}
            {%call name="util_pager_echo_num" i=$pageTotal%}
        {%/if%}

        {%if $page < $pageTotal%}
            {%call name="util_pager_echo_special" i=$page + 1 mark="next"%}
        {%/if%}

    </div>
    {%/if%}
{%/strip%}{%/function%}

{%function name="util_pager_echo_num" i%}{%strip%}
    <a href="#~{%$param%}={%$i%}" data-page="{%$i%}">{%$i%}</a>
{%/strip%}{%/function%}

{%function name="util_pager_echo_special" i mark%}{%strip%}
    {%$lang = [
        "prev" => "上一页",
        "next" => "下一页",
        "ellipsis" => ".."
    ]%}

    <a href="#~{%$param%}={%$i%}" data-page="{%$i%}" class="{%$prefix%}{%$mark%}">
        {%if empty($lang[$mark])%}
            {%$i%}
        {%else%}
            {%$lang[$mark]%}
        {%/if%}
    </a>
{%/strip%}{%/function%}

{%call name="util_pager" total=$data.cars.total page=$data.cars.page pageSize=$data.cars.pageSize%}