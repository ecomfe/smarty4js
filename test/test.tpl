{%*include file="../../../work/views/loan/index.tpl"*%}

{%*$a = "{%$name|cat: '1111'%} is {%$what%}"*%}

{%strip%}
<div class="ctn-list" id="ctn-list">
    {%if isset($tplData.dataList) && count($tplData.dataList)%}
    <div class="result">
        <div class="list-summary">
            百度二手房为您找到 <em>{%$tplData.total|escape:'html'%}</em> 套<em class="cityPath"></em>待售房源
        </div>
        <div class="list-wrap">
            {%foreach $tplData.dataList as $item%}
                <div class="list-item {%if $item@index eq count($tplData.dataList)-1%}item-last{%/if%}">
                    <div class="item-td item-left col4">
                        <a href="{%$item.url|escape:'html'%}" rel="nofollow" target="_blank">
                            <img src="{%$item.pic|escape:'html'%}" alt="{%$item.title|escape:'html'%}">
                        </a>
                    </div>
                    <div class="item-td item-middle col16">
                        <h4>
                            <a href="{%$item.url|escape:'html'%}"  rel="nofollow" target="_blank">
                                {%$item.title|escape:'html'%}
                            </a>
                        </h4>
                        <div class="item-info">
                             <div class="info-item">
                                <span class="info-title col2">位置：</span>
                                <span class="info-cont col20">{%$item.location|escape:'html'%}</span>
                            </div>
                        </div>
                        <div class="item-info">
                             <div class="info-item">
                                <span class="info-title">特点：</span>
                                <span class="info-cont">
                                    <span>{%$item.square|escape:'html'%}</span>
                                    <span>{%if isset($item.decoration)%}{%$item.decoration|escape:'html'%}</span>
                                    <span>{%$item.square|escape:'html'%}</span>
                                    <span>{%$item.square|escape:'html'%}</span>
                                    <span>{%$item.square|escape:'html'%}</span>
                                    <span>{%$item.square|escape:'html'%}</span>
                                m2－－{%/if%}{%$item.floor|escape:'html'%}－{%$item.direction|escape:'html'%}通透
                                </span>
                            </div>
                        </div>
                        <div class="item-info">
                             <div class="info-item">
                                <span class="info-title">方式：</span>
                                <span class="info-cont">{%$item.fangshi|escape:'html'%}</span>
                            </div>
                        </div>
                        {%*
                        <div class="item-info">
                             <div class="info-item">
                                <span class="info-title">交通：</span>
                                <span class="info-cont">{%$item.location|escape:'html'%}</span>
                            </div>
                        </div>
                        *%}
                        
                    </div>
                    <div class="item-td item-right col4">
                        
                        <div class="item-inner">
                            <div class="info-item info-price">
                                {%if $item.price%}
                                    <em>{%$item.price|escape:'html'%}</em>元/月
                                {%else%}
                                    <em>面议</em>
                                {%/if%}
                            </div>
                            <div class="info-item info-bed">
                            {%$item.beds|escape:'html'%}室{%$item.livingrooms|escape:'html'%}厅{%$item.baths|escape:'html'%}卫
                            </div>
                        </div>
                        
                    </div>
                </div>
            {%/foreach%}
        </div>
    </div>
    {%else%}
    <div class="no-result">
        抱歉，没有找到符合的产品，再挑挑看吧：）
    </div>
    {%/if%}
</div>
<div class="kxiding back-to-top " id="back-to-top" >
    <span class="back-to-top-text" >返回顶部</span>
</div>
{%/strip%}