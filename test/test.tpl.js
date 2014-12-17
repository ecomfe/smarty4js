(function(){var __ret={render:function(__da){
var __f={isset:function (any) {
        return any ? true : false;
    },count:function (obj) {
        var n = 0;
        for(var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return n;
    },escape:function (str, format) {
        if (typeof str == 'number') {
            return str;
        }
        else if (typeof str != 'string') {
            return '';
        }
        // format: html,htmlall,url,quotes,hex,hexentity,javascript
        switch (format) {
            case 'html': // escape & " ' < > *
                var obj = {
                    '<': '&#60;',
                    '>': '&#62;',
                    '\'': '&#039;',
                    '"': '&#034;',
                    '&': '&#038;'
                };
                return str.replace(/[\'\"<>&']/g, function (item) {
                    return obj[item];
                });
                break;
            case 'htmlall':
                break;
            case 'url':
                return encodeURIComponent(str);
                break;
            case 'quotes':
                return str.replace(/[\'\"]/g, function (item) {
                    return '\\' + item;
                });
                break;
            case 'hex':
                break;
            case 'hexentity':
                break;
            case 'javascript':
                return str; 
                break;
            default:
                return str;
                break;
        }
    }};var __h="";var __dre=/^\d+(\.\d+)?$/g;var __v=function(){var __va=Array.prototype.slice.call(arguments);for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){var __vd=__va[__vi];if(__vd!=undefined)return __vd;}};
__h+="\n\n";
__h+="\n\n";
__h+="<div class=\"ctn-list\" id=\"ctn-list\">";
if ((__f.isset(__v(__v(__da["tplData"],{}).dataList))&&__f.count(__v(__v(__da["tplData"],{}).dataList)))) {
__h+="<div class=\"result\"><div class=\"list-summary\">百度二手房为您找到<em>";
__h+=__f.escape(__v(__v(__da["tplData"],{}).total),"html");
__h+="</em>套<em class=\"cityPath\"></em>待售房源</div><div class=\"list-wrap\">";__fc2313__d=__v(__v(__da["tplData"],{}).dataList);
for (var __fc2313k in __fc2313__d) { 
if (__fc2313__d.hasOwnProperty(__fc2313k)) {
var __fc2313 = {};var __fc2313__ = {index: __fc2313k, key: __fc2313k, total: __f.count(__fc2313__d),first: __fc2313k == 0 ? true : false, last: __fc2313k == __f.count(__fc2313__d) - 1 ? true : false,show: (__fc2313__d[__fc2313k]) ? true : false};
__fc2313["item"] = __fc2313__d[__fc2313k];
__h+="<div class=\"list-item ";
if ((__fc2313__.index==(__f.count(__v(__v(__fc2313["tplData"],{}).dataList,__v(__da["tplData"],{}).dataList))-1))) {
__h+="item-last";}
__h+="\"><div class=\"item-td item-left col4\"><a href=\"";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).url,__v(__da["item"],{}).url),"html");
__h+="\" rel=\"nofollow\" target=\"_blank\"><img src=\"";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).pic,__v(__da["item"],{}).pic),"html");
__h+="\" alt=\"";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).title,__v(__da["item"],{}).title),"html");
__h+="\"></a></div><div class=\"item-td item-middle col16\"><h4><a href=\"";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).url,__v(__da["item"],{}).url),"html");
__h+="\"  rel=\"nofollow\" target=\"_blank\">";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).title,__v(__da["item"],{}).title),"html");
__h+="</a></h4><div class=\"item-info\"><div class=\"info-item\"><span class=\"info-title col2\">位置：</span><span class=\"info-cont col20\">";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).location,__v(__da["item"],{}).location),"html");
__h+="</span></div></div><div class=\"item-info\"><div class=\"info-item\"><span class=\"info-title\">特点：</span><span class=\"info-cont\"><span>";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).square,__v(__da["item"],{}).square),"html");
__h+="</span><span>";
if (__f.isset(__v(__v(__fc2313["item"],{}).decoration,__v(__da["item"],{}).decoration))) {
__h+=__f.escape(__v(__v(__fc2313["item"],{}).decoration,__v(__da["item"],{}).decoration),"html");
__h+="</span><span>";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).square,__v(__da["item"],{}).square),"html");
__h+="</span><span>";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).square,__v(__da["item"],{}).square),"html");
__h+="</span><span>";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).square,__v(__da["item"],{}).square),"html");
__h+="</span><span>";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).square,__v(__da["item"],{}).square),"html");
__h+="</span>m2－－";}
__h+=__f.escape(__v(__v(__fc2313["item"],{}).floor,__v(__da["item"],{}).floor),"html");
__h+="－";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).direction,__v(__da["item"],{}).direction),"html");
__h+="通透</span></div></div><div class=\"item-info\"><div class=\"info-item\"><span class=\"info-title\">方式：</span><span class=\"info-cont\">";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).fangshi,__v(__da["item"],{}).fangshi),"html");
__h+="</span></div></div>";
__h+="</div><div class=\"item-td item-right col4\"><div class=\"item-inner\"><div class=\"info-item info-price\">";
if (__v(__v(__fc2313["item"],{}).price,__v(__da["item"],{}).price)) {
__h+="<em>";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).price,__v(__da["item"],{}).price),"html");
__h+="</em>元/月";}
else {
__h+="<em>面议</em>";}
__h+="</div><div class=\"info-item info-bed\">";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).beds,__v(__da["item"],{}).beds),"html");
__h+="室";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).livingrooms,__v(__da["item"],{}).livingrooms),"html");
__h+="厅";
__h+=__f.escape(__v(__v(__fc2313["item"],{}).baths,__v(__da["item"],{}).baths),"html");
__h+="卫</div></div></div></div>";}}
__h+="</div></div>";}
else {
__h+="<div class=\"no-result\">抱歉，没有找到符合的产品，再挑挑看吧：）</div>";}
__h+="</div><div class=\"kxiding back-to-top \" id=\"back-to-top\" ><span class=\"back-to-top-text\" >返回顶部</span></div>";
return __h;
}};
if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}
else if (typeof define=="function" && define.amd){define(__ret);}
else {return __ret;}})();