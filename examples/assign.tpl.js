(function(){var __ret={render:function(__tn, __da){if(typeof __tn=="object"){__da=__tn;__tn=undefined;}if(typeof __tn=="string"){__da=__da||{};}var __f={json_encode:function (obj) {
        function isArray(o) {
            return {}.toString.call(o) === '[object Array]';
        }
        function isObj(o) {
            return {}.toString.call(o) === '[object Object]';
        }
        function isOA(o) {
            return (isArray(o) || isObj(o)) ? true : false;
        }
        function isRealArr(o) {
            for (var p in o) {
                if (o.hasOwnProperty(p) && p.indexOf('__a') !== 0) {
                    return false;
                }
            }
            return true;
        }
        function pa(o) {
            var type = (isArray(o) || (isRealArr(o) && isObj(o))) ? 0 : ((isObj(o) && !isRealArr(o)) ? 1 : 2);
            var __enc = type === 0 ? '[' : '{';
            for (var p in o) {
                if (o.hasOwnProperty(p)) {
                    var to = o[p];
                    __enc += (type === 0 ? '' : ('"' + p + '":')) + (isOA(to)
                        ? pa(to)
                        : (typeof to === 'string' ? '"' + to + '"' : to)) + ',';
                }
            }
            __enc = __enc.slice(0, __enc.length - 1) + (type === 0 ? ']' : '}');
            return __enc;
        }
        return pa(obj).replace(/__a/g, '');
    },pow:function (x, y) {
        return (typeof x === 'number' && typeof y === 'number') ? Math.pow(x, y) : false;
    }};
var __h="",__cap={},__ext={},__assign,__sec={},__for={},smarty={foreach:{},capture:{},ldelim:"{%",rdelim:"%}"},__dre=/^\d+(\.\d+)?$/g,__nre=/[\.\(\)\[\]\{\}\+\-\*\?\|\^\$]/g,
__v=function(){var __va=Array.prototype.slice.call(arguments);for(var __vi=0,__vl=__va.length;__vi<__vl;__vi++){var __vd=__va[__vi];if(__vd!=undefined&&""+__vd!="NaN"){if(typeof __vd=="function"){return __vd();}else{return __vd;}}}return "";};__assign=1;__da.test=__assign;
__h+=__v(__da.test);__assign=[1,2,3,[1,2],4,5];__da.arr=__assign;
__h+=__f.json_encode(__v(__da.arr));__da.testAssign="test assign";
__h+=__v(__da.testAssign);__assign=1;__da["a"]=__da["a"]?__da["a"]:{};__da["a"].b=__da["a"].b?__da["a"].b:{};__da["a"].b["c"]=__da["a"].b["c"]?__da["a"].b["c"]:{};__da["a"].b["c"].d=__assign;
__h+=__f.json_encode(__v(__da.a));
__h+=__v(__v(__v(__v(__da["a"],{}).b,{}).c,{}).d);__da.foo=[1,[9,8],3];
__h+=__f.json_encode(__v(__da.foo));__assign=5;__da.num=__assign;__assign=((__dre.test(""+__v(__da.num))?parseFloat(""+__v(__da.num),10):__v(__da.num))+(__dre.test(""+3)?parseFloat(""+3,10):3));__da.aa=__assign;
__h+=__v(__da.aa);__assign=4;__da.x=__assign;__assign=10;__da.y=__assign;__assign=__f.pow(__v(__da.x),__v(__da.y));__da.ret=__assign;
__h+=__v(__da.ret);
if(__tn){return __func["__fn__"+__tn](__da);}
return __h;}};
if (typeof exports=="object" && typeof module=="object"){exports=module.exports=__ret;}
else if (typeof define=="function" && define.amd){define(__ret);}
else {return __ret;}})();