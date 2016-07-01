(function(){var __ret={render:function(__tn, __da){if(typeof __tn=="object"){__da=__tn;__tn=undefined;}if(typeof __tn=="string"){__da=__da||{};}var __f={count:function (obj) {
        var n = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return n;
    },range:function (a, b, step) {
        var arr = [];
        step = step || 1;
        if (typeof a === 'number' && typeof b === 'number' && a < b) {
            for (var i = a; i <= b; i += step) {
                arr[(i - a) / step] = i;
            }
        }
        if (typeof a === 'string' && typeof b === 'string') {
            a = ('' + a).charCodeAt(0);
            b = ('' + b).charCodeAt(0);
            if (a < b) {
                for (i = a; i <= b; i += step) {
                    arr[(i - a) / step] = String.fromCharCode('' + i);
                }
            }
        }
        return arr;
    }};
var __h="",__cap={},__ext={},__assign,__sec={},__for={},smarty={foreach:{},capture:{},ldelim:"{%",rdelim:"%}"},__dre=/^\d+(\.\d+)?$/g,__nre=/[\.\(\)\[\]\{\}\+\-\*\?\|\^\$]/g,
__v=function(){var __va=Array.prototype.slice.call(arguments);for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){var __vd=__va[__vi];if(__vd!=undefined&&""+__vd!="NaN"){if(typeof __vd=="function"){return __vd();}else{return __vd;}}}return "";};
for(var __fc2328i=1;__fc2328i<=9;__fc2328i++){
var __fc2328={};__fc2328["i"]=__fc2328i;
for(var __fc2329i=1;__fc2329i<=9;__fc2329i++){
var __fc2329={};__fc2329["j"]=__fc2329i;
__h+=__v(__fc2329.i,__fc2328.i,__da.i);
__h+=" * ";
__h+=__v(__fc2329.j,__fc2328.j,__da.j);
__h+=" = ";
__h+=(__v(__fc2329.i,__fc2328.i,__da.i)*__v(__fc2329.j,__fc2328.j,__da.j));
__h+=", ";}}var __fc2330__d=__v(__da.peoples),__fc2330fi=0,__fc2330__={},__fc2330={};
for(var __fc2330k in __fc2330__d){if(__fc2330__d.hasOwnProperty(__fc2330k)){
__fc2330__=smarty.foreach={index:__fc2330fi,key:__fc2330k.replace("__a",""),total:__f.count(__fc2330__d),first:__fc2330fi==0?1:"",last:(__fc2330fi==__f.count(__fc2330__d)-1)?1:"",show:(__fc2330__d[__fc2330k])?true:false};
__fc2330["item"]=__fc2330__d[__fc2330k];
__h+=__v(__v(__fc2330["item"],{}).name,__v(__da["item"],{}).name);
__h+=", ";
__h+=__v(__v(__fc2330["item"],{}).age,__v(__da["item"],{}).age);
__h+=", ";
__h+=__v(__v(__fc2330["item"],{}).city,__v(__da["item"],{}).city);
__h+=", ";
__h+=__fc2330__.total;
__h+=" -- ";
__h+=smarty.foreach.index;
__h+=" ++";__fc2330fi++;}}var __fc2331__d=__v(__da.peoples),__fc2331fi=0,__fc2331__={},__fc2331={};
for(var __fc2331k in __fc2331__d){if(__fc2331__d.hasOwnProperty(__fc2331k)){
__fc2331__=__for["getPeopleInfo"]=smarty.foreach={index:__fc2331fi,key:__fc2331k.replace("__a",""),total:__f.count(__fc2331__d),first:__fc2331fi==0?1:"",last:(__fc2331fi==__f.count(__fc2331__d)-1)?1:"",show:(__fc2331__d[__fc2331k])?true:false};
__fc2331["aaa"]=__fc2331k.replace(/__a/g,"");__fc2331["item"]=__fc2331__d[__fc2331k];
__h+=__v(__v(__fc2331["item"],{}).name,__v(__da["item"],{}).name);
__h+=", ";
__h+=__v(__v(__fc2331["item"],{}).age,__v(__da["item"],{}).age);
__h+=", ";
__h+=__v(__v(__fc2331["item"],{}).city,__v(__da["item"],{}).city);
__h+=", ";
__h+=smarty.foreach.total;
__h+=" -- ";
__h+=__v(__fc2331.aaa,__da.aaa);__fc2331fi++;}}
__h+=__for.getPeopleInfo.total;__assign=0;__da.num=__assign;
while((__v(__da.num)<10)){
__h+=__v(__da.num);
__h+=", ";__v(__da.num++)}
var __fc2332l,__fc2332n=0,__fc2332={},__fc2332t=0,__fc2332o=__v(__da.peoples);
if(typeof __fc2332o==="number"){__fc2332o=__f.range(0, __fc2332o-1);__fc2332t=1;}1<0&&__fc2332o.reverse();__fc2332l=__f.count(__fc2332o);
for(var __fc2332i=0;__fc2332i<__fc2332l;__fc2332i+=Math.abs(1)){
if(__fc2332n>=__fc2332l){break;}__sec["n"]={index:__fc2332t===0?__fc2332i:__fc2332o[__fc2332i],index_prev:__fc2332i-Math.abs(1),index_next:__fc2332i+Math.abs(1),first:__fc2332n===0?1:"",last:__fc2332n===(__fc2332l-0)/1-1?1:"",rownum:__fc2332n+1,total:__fc2332l/1,show:true,loop:__fc2332l};
__h+=" name:";
__h+=__v(__v(__v(__fc2332["peoples"],{})[__sec.n.index],{}).name,__v(__v(__da["peoples"],{})[__sec.n.index],{}).name);__fc2332n++;
}
var __fc2333l,__fc2333n=0,__fc2333={},__fc2333t=0,__fc2333o=20;
if(typeof __fc2333o==="number"){__fc2333o=__f.range(0, __fc2333o-1);__fc2333t=1;}-2<0&&__fc2333o.reverse();__fc2333l=__f.count(__fc2333o);
for(var __fc2333i=0;__fc2333i<__fc2333l;__fc2333i+=Math.abs(-2)){
if(__fc2333n>=7){break;}__sec["sss"]={index:__fc2333t===0?__fc2333i:__fc2333o[__fc2333i],index_prev:__fc2333i-Math.abs(-2),index_next:__fc2333i+Math.abs(-2),first:__fc2333n===0?1:"",last:__fc2333n===(__fc2333l-0)/-2-1?1:"",rownum:__fc2333n+1,total:__fc2333l/-2,show:true,loop:__fc2333l};
__h+=__sec.sss.index;
__h+=", ";__fc2333n++;
}__assign="test foreachelse";__da.b=__assign;var __fc2334__d=__v(__da.aaa),__fc2334fi=0,__fc2334__={},__fc2334={};
if(__fc2334__d) {for(var __fc2334k in __fc2334__d){if(__fc2334__d.hasOwnProperty(__fc2334k)){
__fc2334__=smarty.foreach={index:__fc2334fi,key:__fc2334k.replace("__a",""),total:__f.count(__fc2334__d),first:__fc2334fi==0?1:"",last:(__fc2334fi==__f.count(__fc2334__d)-1)?1:"",show:(__fc2334__d[__fc2334k])?true:false};
__fc2334["item"]=__fc2334__d[__fc2334k];
__h+=__v(__fc2334.item,__da.item);
__h+=", ";__fc2334fi++;}}}else{
__h+=__v(__fc2334.b,__da.b);
__h+=", ";var __fc2335__d=[1,2,3,4,5],__fc2335fi=0,__fc2335__={},__fc2335={};
for(var __fc2335k in __fc2335__d){if(__fc2335__d.hasOwnProperty(__fc2335k)){
__fc2335__=__for["testforeachelseinner"]=smarty.foreach={index:__fc2335fi,key:__fc2335k.replace("__a",""),total:__f.count(__fc2335__d),first:__fc2335fi==0?1:"",last:(__fc2335fi==__f.count(__fc2335__d)-1)?1:"",show:(__fc2335__d[__fc2335k])?true:false};
__fc2335["a"]=__fc2335__d[__fc2335k];
__h+=__v(__fc2335.a,__fc2334.a,__da.a);__fc2335fi++;}}
__h+=" ...";}
var __fc2336l,__fc2336n=0,__fc2336={},__fc2336t=0,__fc2336o=__v(__da.undefineddata);
if(typeof __fc2336o==="number"){__fc2336o=__f.range(0, __fc2336o-1);__fc2336t=1;}if(__fc2336o) {1<0&&__fc2336o.reverse();__fc2336l=__f.count(__fc2336o);
for(var __fc2336i=0;__fc2336i<__fc2336l;__fc2336i+=Math.abs(1)){
if(__fc2336n>=__fc2336l){break;}__sec["sectionelsetest"]={index:__fc2336t===0?__fc2336i:__fc2336o[__fc2336i],index_prev:__fc2336i-Math.abs(1),index_next:__fc2336i+Math.abs(1),first:__fc2336n===0?1:"",last:__fc2336n===(__fc2336l-0)/1-1?1:"",rownum:__fc2336n+1,total:__fc2336l/1,show:true,loop:__fc2336l};
__h+=" ...";__fc2336n++;
}}else{
__h+=" xxx";}
if(__tn){return __func["__fn__"+__tn](__da);}
return __h;}};
if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}
else if (typeof define=="function" && define.amd){define(__ret);}
else {return __ret;}})();