(function(){var __ret={render:function(__tn, __da){if(typeof __tn=="object"){__da=__tn;__tn=undefined;}if(typeof __tn=="string"){__da=__da||{};}var __f={truncate:function (str, num, s) {
        str = '' + str;
        return num >= str.length ? str : str.substr(0, ((num >= 0) ? num : 80)) + (s ? '' + s : '...');
    }};
var __h="",__cap={},__ext={},__assign,__sec={},__for={},smarty={foreach:{},capture:{},ldelim:"{%",rdelim:"%}"},__dre=/^\d+(\.\d+)?$/g,__nre=/[\.\(\)\[\]\{\}\+\-\*\?\|\^\$]/g,
__v=function(){var __va=Array.prototype.slice.call(arguments);for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){var __vd=__va[__vi];if(__vd!=undefined&&""+__vd!="NaN"){if(typeof __vd=="function"){return __vd();}else{return __vd;}}}};
__h+=((__dre.test(""+1)?parseFloat(""+1,10):1)+(__dre.test(""+2)?parseFloat(""+2,10):2));__assign=1;__da.x=__assign;__assign=2;__da.y=__assign;
__h+=((__dre.test(""+__v(__da.x))?parseFloat(""+__v(__da.x),10):__v(__da.x))+(__dre.test(""+__v(__da.y))?parseFloat(""+__v(__da.y),10):__v(__da.y)));__assign="abcdef";__da.foo=__assign;__assign=6;__da.count=__assign;__assign=2;__da.factor=__assign;
__h+=__f.truncate(__v(__da.foo),""+((__v(__da.count)/__v(__da.factor))-1));
if(__tn){return __func["__fn__"+__tn](__da);}
return __h;}};
if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}
else if (typeof define=="function" && define.amd){define(__ret);}
return __ret;})();