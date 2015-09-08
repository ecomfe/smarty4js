(function(){var __ret={render:function(__tn, __da){if(typeof __tn=="object"){__da=__tn;__tn=undefined;}if(typeof __tn=="string"){__da=__da||{};}var __f={count:function (obj) {
        var n = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                n++;
            }
        }
        return n;
    }};var __func={__fn__html_options:function (p) {
        __h += '<select name="' + (p.name || '') + '">';
        if (p.values && p.output) {
            for (var i in p.values) {
                if (p.values.hasOwnProperty(i)) {
                    var val = p.values[i];
                    var out = p.output[i];
                    __h += '<option label="' + out + '" value="' + val + '"'
                        + (val === '' + p.selected ? ' selected' : '') + '>' + out + '</option>';
                }
            }
        }
        else if (p.options) {
            var opts = p.options;
            for (var j in opts) {
                if (opts.hasOwnProperty(j)) {
                    __h += '<option label="' + opts[j] + '" value="' + j + '"'
                        + (j === '' + p.selected ? ' selected="selected"' : '') + '>' + opts[j] + '</option>';
                }
            }
        }
        __h += '</select>';
    }};
var __h="",__cap={},__ext={},__assign,__sec={},__for={},smarty={foreach:{},capture:{},ldelim:"{%",rdelim:"%}"},__dre=/^\d+(\.\d+)?$/g,__nre=/[\.\(\)\[\]\{\}\+\-\*\?\|\^\$]/g,
__v=function(){var __va=Array.prototype.slice.call(arguments);for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){var __vd=__va[__vi];if(__vd!=undefined&&""+__vd!="NaN"){if(typeof __vd=="function"){return __vd();}else{return __vd;}}}return "";};__assign={"11":"aaa","22":"bbb","33":"ccc"};__da.myOptions=__assign;__assign=22;__da.mySelect=__assign;__h+=__func["__fn__html_options"]({name:"foo",options:__v(__da.myOptions),selected:__v(__da.mySelect)});
__func["__fn__funca"]=function(__p){for(var __ in __p){if(__p.hasOwnProperty(__)&&__da[__]==undefined){__da[__]=__p[__];}}
var __func2313 = __p,__2314h="";
__func2313.p=__v(__p.p,11);
__2314h+=__v(__func2313.p,__da.p);return __2314h;
};__h+=__func["__fn__funca"]({p:123});
__func["__fn__a"]=function(__p){for(var __ in __p){if(__p.hasOwnProperty(__)&&__da[__]==undefined){__da[__]=__p[__];}}
var __func2315 = __p,__2316h="";
__2316h+=__v(__func2315.funca,__da.funca);return __2316h;
};__assign="asdsakljdlk---"+__func["__fn__a"]({funca:"asdasdas"})+"---asd;aslkd";__da.bbbb=__assign;
__h+=__v(__da.bbbb);
__func["__fn__testAssign"]=function(__p){for(var __ in __p){if(__p.hasOwnProperty(__)&&__da[__]==undefined){__da[__]=__p[__];}}
var __func2319 = __p,__2320h="";
for(var __fc2321i=1;__fc2321i<=__v(__func2319.funca,__da.funca);__fc2321i++){
var __fc2321={};__fc2321["i"]=__fc2321i;
for(var __fc2322i=1;__fc2322i<=__v(__fc2321.funcb,__func2319.funcb,__da.funcb);__fc2322i++){
var __fc2322={};__fc2322["j"]=__fc2322i;
__2320h+=__v(__fc2322.i,__fc2321.i,__func2319.i,__da.i);
__2320h+=" * ";
__2320h+=__v(__fc2322.j,__fc2321.j,__func2319.j,__da.j);
__2320h+=" = ";
__2320h+=(__v(__fc2322.i,__fc2321.i,__func2319.i,__da.i)*__v(__fc2322.j,__fc2321.j,__func2319.j,__da.j));
__2320h+=", ";}}return __2320h;
};
__da.testFuncAssign=__func["__fn__testAssign"]({funca:9,funcb:9,__s:1});
__h+=__v(__da.testFuncAssign);var __ca2323a=function(){var __ca2323="";
__ca2323+=" hello";return __ca2323;};__da.foo={"__a0":__ca2323a};
__h+="I say just";var __ca2324a=function(){var __ca2324="";
__ca2324+=" world";return __ca2324;};__da.foo["__a1"]=__ca2324a;var __fc2325__d=__v(__da.foo),__fc2325fi=0,__fc2325__={},__fc2325={};
for(var __fc2325k in __fc2325__d){if(__fc2325__d.hasOwnProperty(__fc2325k)){
__fc2325__=smarty.foreach={index:__fc2325fi,key:__fc2325k.replace("__a",""),total:__f.count(__fc2325__d),first:__fc2325fi==0?1:"",last:(__fc2325fi==__f.count(__fc2325__d)-1)?1:"",show:(__fc2325__d[__fc2325k])?true:false};
__fc2325["text"]=__fc2325__d[__fc2325k];
__h+=__v(__fc2325.text,__da.text);
__h+=", ";__fc2325fi++;}}
if(__tn){return __func["__fn__"+__tn](__da);}
return __h;}};
if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}
else if (typeof define=="function" && define.amd){define(__ret);}
else {return __ret;}})();