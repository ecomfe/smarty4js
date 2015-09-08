(function(){var __ret={render:function(__tn, __da){if(typeof __tn=="object"){__da=__tn;__tn=undefined;}if(typeof __tn=="string"){__da=__da||{};}var __f={range:function (a, b, step) {
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
    },count:function (obj) {
        var n = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return n;
    },isset:function (any) {
        return any === undefined ? false : true;
    }};
var __h="",__cap={},__ext={},__assign,__sec={},__for={},smarty={foreach:{},capture:{},ldelim:"{%",rdelim:"%}"},__dre=/^\d+(\.\d+)?$/g,__nre=/[\.\(\)\[\]\{\}\+\-\*\?\|\^\$]/g,
__v=function(){var __va=Array.prototype.slice.call(arguments);for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){var __vd=__va[__vi];if(__vd!=undefined&&""+__vd!="NaN"){if(typeof __vd=="function"){return __vd();}else{return __vd;}}}return "";};__assign=1;__da.a=__assign;
if((__v(__da.a)>0)){
__h+=" <p>true</p>";}
else{
__h+=" <p>false</p>";}var __fc2337__d=__f.range(0,100),__fc2337fi=0,__fc2337__={},__fc2337={};
for(var __fc2337k in __fc2337__d){if(__fc2337__d.hasOwnProperty(__fc2337k)){
__fc2337__=smarty.foreach={index:__fc2337fi,key:__fc2337k.replace("__a",""),total:__f.count(__fc2337__d),first:__fc2337fi==0?1:"",last:(__fc2337fi==__f.count(__fc2337__d)-1)?1:"",show:(__fc2337__d[__fc2337k])?true:false};
__fc2337["num"]=__fc2337__d[__fc2337k];
if(((__v(__fc2337.num,__da.num)%4)==0)){
__h+=__v(__fc2337.num,__da.num);
__h+="--4--, ";}
else{
if(((__v(__fc2337.num,__da.num)%5)==0)){
__h+=__v(__fc2337.num,__da.num);
__h+="--5--, ";}
else if(((__v(__fc2337.num,__da.num)%3)==0)){
__h+=__v(__fc2337.num,__da.num);
__h+="--3--, ";}
else{
__h+=" -- ";}}__fc2337fi++;}}
if(!__f.isset(__v(__da.ssssss))){
__h+=" yes!!";}
else{
__h+=" no!!";}var __fc2338__d=__v(__da.peoples),__fc2338fi=0,__fc2338__={},__fc2338={};
for(var __fc2338k in __fc2338__d){if(__fc2338__d.hasOwnProperty(__fc2338k)){
__fc2338__=smarty.foreach={index:__fc2338fi,key:__fc2338k.replace("__a",""),total:__f.count(__fc2338__d),first:__fc2338fi==0?1:"",last:(__fc2338fi==__f.count(__fc2338__d)-1)?1:"",show:(__fc2338__d[__fc2338k])?true:false};
__fc2338["item"]=__fc2338__d[__fc2338k];
if(__fc2338__.first){
__h+=__v(__v(__fc2338["item"],{}).name,__v(__da["item"],{}).name);}
else{
__h+=" -- ";}__fc2338fi++;}}
if(__tn){return __func["__fn__"+__tn](__da);}
return __h;}};
if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}
else if (typeof define=="function" && define.amd){define(__ret);}
else {return __ret;}})();