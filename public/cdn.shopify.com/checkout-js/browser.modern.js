(()=>{"use strict";const e="product_added_to_cart";function t(){return window}let n="OFF";function o(e,n,o){const{jQuery:r}=t();r&&r(e).bind?r(e).bind(n,o):e.addEventListener&&e.addEventListener(n,o)}function r(e,t){"ON"===n&&console&&console.warn&&console.warn(`[pixel_shop_events_listener] Error in ${e}:  ${t.message}`)}function i(e){o(window,"load",(()=>{for(const t of document.forms)e(t)}))}function s(e,t,n){if(t.length!==n.length)throw Error("Payload body and response have different number of items");t.forEach(((t,o)=>{let i=1;try{i=parseInt(n[o].quantity,10)||1}catch(s){r("handleBulkItemCartAddResponse",s)}a(e,t,i)}))}function a(n,o,r){const i=((null===(c=null===(l=t())||void 0===l?void 0:l.ShopifyAnalytics)||void 0===c?void 0:c.meta)||{}).currency,s={id:String(o.id),image:{src:o.image},price:{amount:o.price/100,currencyCode:i},product:{id:String(o.product_id),title:o.title,vendor:o.vendor},sku:o.sku,title:o.variant_title},a={cost:{totalAmount:{amount:s.price.amount*r,currencyCode:i}},merchandise:s,quantity:r};var c,l;n(e,{cartLine:a})}function c(e){if(!e)return 1;try{return JSON.parse(e).quantity||1}catch(t){if(e instanceof FormData){if(e.has("quantity"))return Number(e.get("quantity"))}else{const t=e.split("&");for(const e of t){const t=e.split("=");if("quantity"===t[0])return Number(t[1])}}}return 1}class l{static handleXhrOpen(){}static handleXhrDone(e){try{const t=document.createElement("a");t.href=e.url;const n=t.pathname?t.pathname:e.url;l.ADD_TO_CART_REGEX.test(n)&&l.parsePayloadResponse(e,(t=>{const n=Object.keys(t);if(1===n.length&&"items"===n[0]){const n=t.items;let r;try{r=JSON.parse(e.body).items}catch(o){r=function(e,t){const n=new Array(t);for(let o=0;o<t;o++)n[o]={};for(const o of decodeURI(e).split("&")){const e=o.split("="),t=e[0].match(/items\[(\d+)\]\[(\w+)\].*/);if(t){const o=Number(t[1]),r=t[2];"quantity"===r?n[o].quantity=e[1]:"id"===r&&(n[o].id=e[1])}}return n}(e.body,n.length)}s(e.publish,n,r)}else a(e.publish,t,c(e.body))}))}catch(t){r("handleXhrDone",t)}}static parseBlobToJson(e,t){const n=new FileReader;n.addEventListener("loadend",(()=>{t(JSON.parse(String.fromCharCode(...new Uint8Array(n.result))))})),n.readAsArrayBuffer(e)}static parsePayloadResponse(e,t){e.xhr.response instanceof Blob?l.parseBlobToJson(e.xhr.response,t):e.xhr.responseText&&t(JSON.parse(e.xhr.responseText))}constructor(e,t,n,o,r){this.oldOnReadyStateChange=void 0,this.xhr=void 0,this.url=void 0,this.method=void 0,this.body=void 0,this.publish=void 0,this.xhr=e,this.url=t,this.method=n,this.body=o,this.publish=r}onReadyStateChange(){this.xhr.readyState===XMLHttpRequest.DONE&&l.handleXhrDone({method:this.method,url:this.url,body:this.body,xhr:this.xhr,publish:this.publish}),this.oldOnReadyStateChange&&this.oldOnReadyStateChange.call(this.xhr,new Event("oldOnReadyStateChange"))}}function u(n,u){!function(e,t){const n=e.prototype.open,o=e.prototype.send;e.prototype.open=function(e,t){this._url=t,this._method=e,n.apply(this,arguments)},e.prototype.send=function(e){if(!(e instanceof Document)){const n=new l(this,this._url,this._method,e||"",t);this.addEventListener?this.addEventListener("readystatechange",n.onReadyStateChange.bind(n),!1):(n.oldOnReadyStateChange=this.onreadystatechange,this.onreadystatechange=n.onReadyStateChange)}o.call(this,e)}}(XMLHttpRequest,n),function(e,t){const n=e.fetch;function o(e,n){e.clone().json().then((e=>{const o=n.items,r=e.items;return s(t,r,o),e})).catch(u)}function i(e,n){const o=c(n);e.clone().json().then((e=>a(t,e,o))).catch(u)}function u(e){r("handleFetchRequest",e)}"function"==typeof n&&(e.fetch=function(...e){return n.apply(this,Array.prototype.slice.call(e)).then((e=>{if(!e.ok)return e;const t=document.createElement("a");t.href=e.url;const n=t.pathname?t.pathname:e.url;try{if(l.ADD_TO_CART_REGEX.test(n)){try{const t=JSON.parse(arguments[1].body);if(Object.keys(t).includes("items"))return o(e,t),e}catch(r){u(r)}i(e,arguments[1].body)}}catch(r){u(r)}return e}))})}(t(),n),i((t=>{const i=t.getAttribute("action");i&&i.indexOf("/cart/add")>=0&&o(t,"submit",(t=>{!function(t,n,o){const i=n||window.event;if(i.defaultPrevented)return;const s=i.currentTarget||i.srcElement;if(s&&s instanceof Element&&(s.getAttribute("action")||s.getAttribute("href")))try{const n=function(e){let t;const n=e.querySelector('[name="id"]');return n instanceof HTMLSelectElement&&n.options?t=n.options[n.selectedIndex]:(n instanceof HTMLOptionElement||n instanceof HTMLInputElement)&&(t=n),t}(s);if(!n)return;const r=n.value,i=function(e){const t=e.querySelector('[name="quantity"]');return t instanceof HTMLInputElement?Number(t.value):1}(s),a=function(e,t){var n;let o;const r=null===(n=t.productVariants)||void 0===n?void 0:n.filter((t=>t.id===e));if(!r||!r.length)throw new Error("Product variant not found");return o={...r[0]},o}(r,o),c={cost:{totalAmount:{amount:a.price.amount*i,currencyCode:a.price.currencyCode}},merchandise:a,quantity:i};t(e,{cartLine:c})}catch(a){r("handleSubmitCartAdd",a)}}(n,t,u)}))}))}function d(e,t,s){var a;null!=s&&s.logLevel&&(a=s.logLevel,n=a),u(e,t),function(e,t){i((n=>{const i=n.querySelector('[name="previous_step"]');i&&i instanceof HTMLInputElement&&"payment_method"===i.value&&o(document.body,"submit",(n=>{!function(e,t,n){const o=t||window.event,i=o.target||o.srcElement;if(i&&i instanceof HTMLFormElement&&i.getAttribute("action")&&null!==i.getAttribute("data-payment-form"))try{const t=n.checkout;if(!t)throw new Error("Checkout data not found");e("payment_info_submitted",{checkout:t})}catch(s){r("handleSubmitToPaymentAdd",s)}}(e,n,t)}))}))}(e,t)}l.ADD_TO_CART_REGEX=/^(?:\/[a-zA-Z]+(?:-[a-zA-Z]+)?)?\/cart\/add(?:\.js|\.json)?$/;const p="0.0.183",f={test:"edge_test_click/1.0",load:"web_pixels_manager_load/2.0",init:"web_pixels_manager_init/2.0",register:"web_pixels_manager_pixel_register/2.0",subscriberEventEmit:"web_pixels_manager_subscriber_event_emit/2.0",eventPublish:"web_pixels_manager_event_publish/1.0"};function h(e,t){return{schemaId:f[e],payload:t}}function m(e){return e.replace(/\/$/,"")}function b(e){const t={};for(const n in e)if(Object.prototype.hasOwnProperty.call(e,n)){const o=n.replace(/[A-Z]/g,(e=>`_${e}`)).toLowerCase(),r=e[n];t[o]=null!==r&&"object"==typeof r?b(r):r}return t}class y extends Error{constructor(...e){super(...e),Error.captureStackTrace&&Error.captureStackTrace(this,y)}}const g=(e,t)=>{var n,o;if(null!=t&&null!==(n=t.options)&&void 0!==n&&n.sampleRate&&!function(e){if(e<=0||e>100)throw new Error("Invalid sampling percent");return 100*Math.random()<=e}(t.options.sampleRate))return;const r={severity:"error",context:"",unhandled:!0,...t};let i="";const s={lineNumber:"1",columnNumber:"1",method:r.context,file:"browser.js"};if(e.stackTrace||e.stack||e.description){i=e.stack.split("\n")[0];const t=e.stack.match(/([0-9]+):([0-9]+)/);if(t&&t.length>2&&(s.lineNumber=t[1],s.columnNumber=t[2],parseInt(s.lineNumber,10)>1e5))return}fetch("https://notify.bugsnag.com",{method:"POST",headers:{"Content-Type":"application/json","Bugsnag-Api-Key":"bcbc9f6762da195561967577c2d74ff8","Bugsnag-Payload-Version":"5"},body:JSON.stringify({payloadVersion:5,notifier:{name:"web-pixel-manager",version:p,url:"-"},events:[{exceptions:[{errorClass:i,message:i,stacktrace:[s],type:"browserjs"}],context:r.context,severity:r.severity,unhandled:r.unhandled,app:{version:p},metaData:{device:{userAgent:null===(o=self.navigator)||void 0===o?void 0:o.userAgent},request:{shopId:r.shopId,shopUrl:self.location.href,pixelId:r.pixelId,pixelType:r.pixelType,runtimeContext:r.runtimeContext},"Additional Notes":{initConfig:JSON.stringify(r.initConfig),notes:r.notes}}}]})}).catch((()=>{}))};let w="";function v(e=""){w=m(e)}let E=C();function C(e){return e||"global"}const _=new Array;function x(e,t=!1){const n={...e,metadata:{eventCreatedAtMs:I()}};_.push(n),t&&S()}function A(e,t,n=!1){x(h(e,t),n)}function S(){const e=[..._];_.length=0,function(e){if(0===e.length)return!1;const t={metadata:{event_sent_at_ms:I()},events:e.map((e=>({schema_id:e.schemaId,payload:b(e.payload),metadata:{event_created_at_ms:e.metadata.eventCreatedAtMs}})))};!function(e){const t=`${{global:"https://monorail-edge.shopifysvc.com",wellKnown:`${w}/.well-known/shopify/monorail`,staging:"https://monorail-edge-staging.shopifycloud.com",test:"https://localhost"}[E]}/unstable/produce_batch`;try{if(self.navigator.sendBeacon.bind(self.navigator)(t,e))return!0}catch(o){}const n=new XMLHttpRequest;try{n.open("POST",t,!0),n.setRequestHeader("Content-Type","text/plain"),n.send(e)}catch(r){g(r,{context:"utilities/monorail/sendRequest",unhandled:!1})}}(JSON.stringify(t))}(e)}function I(){return(new Date).getTime()}class P extends Set{constructor(e,t){if(super(),this.maxSize=void 0,this.keep=void 0,Number.isFinite(e)&&!Number.isInteger(e)||e<=0)throw new Error("Invalid maxSize specified");this.maxSize=e,this.keep=t}push(e){if("oldest"===this.keep)this.size<this.maxSize&&this.add(e);else if("newest"===this.keep&&(this.add(e),this.size>this.maxSize))for(const t of this)if(this.delete(t),this.size<=this.maxSize)break;return this}}const R={bufferSize:50,replayKeep:"oldest",enableSubscribeAll:!1,subscribeAllKey:"all_events"};class T{constructor(e=R){this.channelSubscribers=new Map,this.replayQueue=void 0,this.options=void 0,this.options=e,this.replayQueue=new P(e.bufferSize,e.replayKeep)}publish(e,t,n={}){var o;if(this.options.enableSubscribeAll&&e===this.options.subscribeAllKey)throw new Error(`Cannot publish to ${String(e)}`);this.replayQueue.push({name:e,payload:t,options:n});const r=(e,n)=>n.apply({},[{...t}]);var i;return null===(o=this.channelSubscribers.get(e))||void 0===o||o.forEach(r),this.options.enableSubscribeAll&&(null===(i=this.channelSubscribers.get(this.options.subscribeAllKey))||void 0===i||i.forEach(r)),!0}subscribe(e,t,n={}){const o=this.channelSubscribers.get(e)||new Map;return this.channelSubscribers.set(e,o.set(t,n)),this.replayQueue.forEach((({name:n,payload:o})=>{(e===n||this.options.enableSubscribeAll&&e===this.options.subscribeAllKey)&&t.apply({},[{...o}])})),()=>o.delete(t)}}const O=["checkout_completed","checkout_started","payment_info_submitted","collection_viewed","page_viewed","product_added_to_cart","product_viewed","product_variant_viewed","search_submitted"],D=["all_events","all_standard_events","all_custom_events","checkout_completed","checkout_started","payment_info_submitted","collection_viewed","page_viewed","product_added_to_cart","product_viewed","product_variant_viewed","search_submitted"];function k(e){return O.includes(e)}function L(e){return D.includes(e)}let N,j,U,M,B,$,G,V;var K,q,z,W,X,F,H,J;(J=N||(N={})).TRACKING_ACCEPTED="trackingConsentAccepted",J.TRACKING_DECLINED="trackingConsentDeclined",J.MARKETING_ACCEPTED="marketingConsentAccepted",J.STATISTICS_ACCEPTED="statisticsConsentAccepted",J.PREFERENCES_ACCEPTED="preferencesConsentAccepted",J.ATTRIBUTION_ACCEPTED="attributionConsentAccepted",J.MARKETING_DECLINED="marketingConsentDeclined",J.STATISTICS_DECLINED="statisticsConsentDeclined",J.PREFERENCES_DECLINED="preferencesConsentDeclined",J.ATTRIBUTION_DECLINED="attributionConsentDeclined",J.CONSENT_COLLECTED="visitorConsentCollected",(H=j||(j={})).V2_0="2.0",H.V2_1="2.1",(F=U||(U={})).ACCEPTED="yes",F.DECLINED="no",F.NO_INTERACTION="no_interaction",F.NO_VALUE="",(X=M||(M={})).NO_VALUE="",X.ACCEPTED="1",X.DECLINED="0",(W=B||(B={})).GDPR="GDPR",W.CCPA="CCPA",W.NO_VALUE="",(z=$||($={})).CCPA_BLOCK_ALL="CCPA_BLOCK_ALL",z.GDPR="GDPR",z.GDPR_BLOCK_ALL="GDPR_BLOCK_ALL",z.CCPA="CCPA",(q=G||(G={})).MARKETING="m",q.STATISTICS="s",q.PREFERENCES="p",q.ATTRIBUTION="t",(K=V||(V={})).MARKETING="marketing",K.STATISTICS="statistics",K.PREFERENCES="preferences",K.ATTRIBUTION="attribution";const Y=["lim","v","con","reg"];function Q(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function Z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Q(Object(n),!0).forEach((function(t){ee(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Q(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function ee(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function te(){try{let e=function(){let e;if((document.cookie?document.cookie.split("; "):[]).forEach((t=>{const[n,o]=t.split("=");if("_tracking_consent"===decodeURIComponent(n)){var r=JSON.parse(decodeURIComponent(o));e=r}})),void 0!==e&&(t=e,[j.V2_0,j.V2_1].includes(t.v)&&function(e,t){const n=t.slice().sort();return e.length===t.length&&e.slice().sort().every(((e,t)=>e===n[t]))}(Object.keys(t),Y)))return e;var t}();if(!e)return;return e.v===j.V2_0?function(e){const t=Z(Z({},e.con),{},{GDPR:re(e)?oe(e.con.GDPR):void 0});return void 0===t.GDPR&&delete t.GDPR,{con:t,reg:e.reg,v:j.V2_1,lim:e.lim}}(e):e}catch(e){return}}function ne(e=null){return null===e&&(e=te()),void 0===e}function oe(e){return{[G.MARKETING]:e,[G.STATISTICS]:e,[G.PREFERENCES]:e,[G.ATTRIBUTION]:e}}function re(e){const t=[$.GDPR,$.GDPR_BLOCK_ALL];return e.lim.some((e=>t.includes(e)))&&B.GDPR in e.con}function ie(){if(!ae($.GDPR)&&!ae($.GDPR_BLOCK_ALL))return!0;const e=function(){const e=te();if(ne(e))return oe(M.NO_VALUE);const t=e.con;switch(typeof t.GDPR){case"undefined":return oe(M.NO_VALUE);case"string":return oe(t.GDPR);default:return t.GDPR}}();return e[G.MARKETING]===M.ACCEPTED&&e[G.STATISTICS]===M.ACCEPTED||e[G.MARKETING]!==M.DECLINED&&e[G.STATISTICS]!==M.DECLINED&&function(){const e=function(){const e=te();return ne(e)?B.NO_VALUE:e.reg}();return e in B?e:B.NO_VALUE}()!==B.GDPR}function se(){return!!ne()||ie()}function ae(e){return function(){const e=te();return ne(e)?{limit:[]}:{limit:e.lim}}().limit.includes(e)}function ce(e){document.addEventListener(N.TRACKING_ACCEPTED,e)}$.GDPR,$.GDPR_BLOCK_ALL,$.CCPA_BLOCK_ALL,$.CCPA;const le=["[object String]","[object Number]","[object Boolean]","[object Undefined]","[object Null]"];function ue(e){let t=null;function n(e){return"[object Object]"===Object.prototype.toString.call(e)}return void 0===e||n(e)?{isValid:function e(o){if(Array.isArray(o))return o.every(e);if(n(o))return Object.keys(o).every((t=>e(o[t])));const r=le.includes(Object.prototype.toString.call(o));return r||(t=`${o} must be one of the following types: ${le.join(", ")}`),r}(e),error:t}:(t=`${e} must be an object`,{isValid:!1,error:t})}const de={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let pe;const fe=new Uint8Array(16);function he(){if(!pe&&(pe="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!pe))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return pe(fe)}const me=[];for(let Me=0;Me<256;++Me)me.push((Me+256).toString(16).slice(1));const be=function(e,t,n){if(de.randomUUID&&!t&&!e)return de.randomUUID();const o=(e=e||{}).random||(e.rng||he)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=o[e];return t}return function(e,t=0){return(me[e[t+0]]+me[e[t+1]]+me[e[t+2]]+me[e[t+3]]+"-"+me[e[t+4]]+me[e[t+5]]+"-"+me[e[t+6]]+me[e[t+7]]+"-"+me[e[t+8]]+me[e[t+9]]+"-"+me[e[t+10]]+me[e[t+11]]+me[e[t+12]]+me[e[t+13]]+me[e[t+14]]+me[e[t+15]]).toLowerCase()}(o)};function ye(){return{document:{location:{href:window.location.href,hash:window.location.hash,host:window.location.host,hostname:window.location.hostname,origin:window.location.origin,pathname:window.location.pathname,port:window.location.port,protocol:window.location.protocol,search:window.location.search},referrer:document.referrer,characterSet:document.characterSet,title:document.title},navigator:{language:navigator.language,cookieEnabled:navigator.cookieEnabled,languages:navigator.languages,userAgent:navigator.userAgent},window:{innerHeight:window.innerHeight,innerWidth:window.innerWidth,outerHeight:window.outerHeight,outerWidth:window.outerWidth,pageXOffset:window.pageXOffset,pageYOffset:window.pageYOffset,location:{href:window.location.href,hash:window.location.hash,host:window.location.host,hostname:window.location.hostname,origin:window.location.origin,pathname:window.location.pathname,port:window.location.port,protocol:window.location.protocol,search:window.location.search},origin:window.origin,screenX:window.screenX,screenY:window.screenY,scrollX:window.scrollX,scrollY:window.scrollY}}}function ge(e){const t={};for(const o of e.split(/ *; */)){const e=o.split("=");try{t[decodeURIComponent(e[0])]=decodeURIComponent(e[1]||"")}catch(n){continue}}return t}const we=Symbol.for("RemoteUi::Retain"),ve=Symbol.for("RemoteUi::Release"),Ee=Symbol.for("RemoteUi::RetainedBy");class Ce{constructor(){this.memoryManaged=new Set}add(e){this.memoryManaged.add(e),e[Ee].add(this),e[we]()}release(){for(const e of this.memoryManaged)e[Ee].delete(this),e[ve]();this.memoryManaged.clear()}}function _e(e){return Boolean(e&&e[we]&&e[ve])}function xe(e,{deep:t=!0}={}){const n=_e(e);if(n&&e[we](),t){if(Array.isArray(e))return e.reduce(((e,n)=>xe(n,{deep:t})||e),n);if("object"==typeof e&&null!=e)return Object.keys(e).reduce(((n,o)=>xe(e[o],{deep:t})||n),n)}return n}const Ae="_@f";function Se(e){const t=new Map,n=new Map,o=new Map;return{encode:function o(r){if("object"==typeof r){if(null==r)return[r];if(r instanceof ArrayBuffer)return[r];const e=[];if(Array.isArray(r)){return[r.map((t=>{const[n,r=[]]=o(t);return e.push(...r),n})),e]}return[Object.keys(r).reduce(((t,n)=>{const[i,s=[]]=o(r[n]);return e.push(...s),{...t,[n]:i}}),{}),e]}if("function"==typeof r){if(t.has(r)){const e=t.get(r);return[{[Ae]:e}]}const o=e.uuid();return t.set(r,o),n.set(o,r),[{[Ae]:o}]}return[r]},decode:r,async call(e,t){const o=new Ce,i=n.get(e);if(null==i)throw new Error("You attempted to call a function that was already released.");try{const e=_e(i)?[o,...i[Ee]]:[o];return await i(...r(t,e))}finally{o.release()}},release(e){const o=n.get(e);o&&(n.delete(e),t.delete(o))},terminate(){t.clear(),n.clear(),o.clear()}};function r(t,n){if("object"==typeof t){if(null==t)return t;if(t instanceof ArrayBuffer)return t;if(Array.isArray(t))return t.map((e=>r(e,n)));if(Ae in t){const r=t["_@f"];if(o.has(r))return o.get(r);let i=0,s=!1;const a=()=>{i-=1,0===i&&(s=!0,o.delete(r),e.release(r))},c=()=>{i+=1},l=new Set(n),u=(...t)=>{if(s)throw new Error("You attempted to call a function that was already released.");if(!o.has(r))throw new Error("You attempted to call a function that was already revoked.");return e.call(r,t)};Object.defineProperties(u,{[ve]:{value:a,writable:!1},[we]:{value:c,writable:!1},[Ee]:{value:l,writable:!1}});for(const e of l)e.add(u);return o.set(r,u),u}return Object.keys(t).reduce(((e,o)=>({...e,[o]:r(t[o],n)})),{})}return t}}function Ie(){return`${Pe()}-${Pe()}-${Pe()}-${Pe()}`}function Pe(){return Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)}function Re(e,t,n,o,r,i=!1){let s={};try{s=t.configuration?JSON.parse(t.configuration):{}}catch(h){}return{analytics:{subscribe:(r,s,a)=>(i&&xe(s),e.subscribe(r,s,{...a,pixelRuntimeConfig:t,shopId:n,surface:o}))},browser:{cookie:{get:async e=>{if(e){let t="";const n=document.cookie.split("; ");for(const o of n){const[n,r]=o.split("=");if(n===e){t=r;break}}return t}return document.cookie},set:async(e,t)=>{if(t){const n=`${e}=${t}`;document.cookie=n}else document.cookie=e;return document.cookie}},sendBeacon:async(e,t="")=>{if(e.includes(self.location.origin))return!1;const n=new window.Blob([t],{type:"text/plain"});return window.navigator.sendBeacon(e,n)},localStorage:{setItem:async(e,t)=>window.localStorage.setItem(e,t),getItem:async e=>window.localStorage.getItem(e),key:async e=>window.localStorage.key(e),removeItem:async e=>window.localStorage.removeItem(e),clear:async()=>window.localStorage.clear(),length:async()=>window.localStorage.length},sessionStorage:{setItem:async(e,t)=>window.sessionStorage.setItem(e,t),getItem:async e=>window.sessionStorage.getItem(e),key:async e=>window.sessionStorage.key(e),removeItem:async e=>window.sessionStorage.removeItem(e),clear:async()=>window.sessionStorage.clear(),length:async()=>window.sessionStorage.length}},settings:s,init:(a=r,{context:ye(),data:{customer:(f=null==a?void 0:a.customer,f?{id:null==f?void 0:f.id,email:null==f?void 0:f.email,phone:null==f?void 0:f.phone}:null),cart:(c=null==a?void 0:a.cart,c?{id:null==c?void 0:c.id,cost:{totalAmount:{amount:null==c||null===(l=c.cost)||void 0===l||null===(u=l.totalAmount)||void 0===u?void 0:u.amount,currencyCode:null==c||null===(d=c.cost)||void 0===d||null===(p=d.totalAmount)||void 0===p?void 0:p.currencyCode}},lines:null==c?void 0:c.lines,totalQuantity:null==c?void 0:c.totalQuantity}:null)}}),_pixelInfo:{...t}};var a,c,l,u,d,p,f}let Te,Oe;function De({webPixelConfig:e,eventBus:t,shopId:n,storefrontBaseUrl:o,webPixelsExtensionBaseUrl:r,surface:i,initData:s}){const a=[r,"/app","/services",`/${n}`,"/web-pixels-manager",`/${e.type.toLowerCase()}`,`/web-pixel-${e.id}`,`@${e.scriptVersion}.js`].join("");let c;if(e.type===Oe.App||e.runtimeContext===Te.Strict){const e=[m(o),"/web-pixels-manager","@0.0.183","/sandbox","/worker.modern.js"];o.match(/spin\.dev\/?/)&&e.push("?fast_storefront_renderer=1"),c=new Worker(e.join(""))}else{let{search:t}=window.location;o.match(/spin\.dev\/?/)&&(t=`${t}${t.length?"&":"?"}fast_storefront_renderer=1`);const n=[m(o),"/web-pixels-manager@0.0.183","/sandbox",window.location.pathname,t].join("");c=function(e,{terminate:t=!0,targetOrigin:n="*"}={}){if("undefined"==typeof window)throw new Error("You can only run fromIframe() in a browser context, but no window was found.");const o=new WeakMap,r=new Promise((t=>{window.addEventListener("message",(n=>{n.source===e.contentWindow&&"remote-ui::ready"===n.data&&t()}))}));return{async postMessage(t,o){await r,e.contentWindow.postMessage(t,n,o)},addEventListener(t,n){const r=t=>{t.source===e.contentWindow&&n(t)};o.set(n,r),self.addEventListener(t,r)},removeEventListener(e,t){const n=o.get(t);null!=n&&(o.delete(t),self.removeEventListener(e,n))},terminate(){t&&e.remove()}}}(function({id:e,src:t,srcdoc:n,privileges:o}){const r=document.querySelector(`iframe#sandbox-${e}`);if(r&&"IFRAME"===r.tagName)return r;const i=document.createElement("iframe");if(t)i.setAttribute("src",t);else{if(!n){const e=new y("src or srcdoc must be provided");throw g(e,{context:"createIframe",unhandled:!1,severity:"warning"}),e}i.setAttribute("srcdoc",n)}return i.setAttribute("id",`sandbox-${e}`),i.setAttribute("sandbox",o.join(" ")),i.setAttribute("tabIndex","-1"),i.setAttribute("aria-hidden","true"),i.setAttribute("style","display:none; height:0; width:0; visibility: hidden;"),function(e){let t=document.querySelector("#WebPixelsManagerSandboxContainer");null==t&&(t=document.createElement("div"),t.setAttribute("id","WebPixelsManagerSandboxContainer"),document.body.appendChild(t)),t.appendChild(e)}(i),i}({id:`web-pixel-extension-${e.type}-${e.id}`,src:n,privileges:["allow-scripts","allow-forms"]}))}const l=function(e,{uuid:t=Ie,createEncoder:n=Se,callable:o}={}){let r=!1,i=e;const s=new Map,a=new Map,c=function(e,t){let n;if(null==t){if("function"!=typeof Proxy)throw new Error("You must pass an array of callable methods in environments without Proxies.");const t=new Map;n=new Proxy({},{get(n,o){if(t.has(o))return t.get(o);const r=e(o);return t.set(o,r),r}})}else{n={};for(const o of t)Object.defineProperty(n,o,{value:e(o),writable:!1,configurable:!0,enumerable:!0})}return n}(p,o),l=n({uuid:t,release(e){u(3,[e])},call(e,n,o){const r=t(),i=f(r,o),[s,a]=l.encode(n);return u(5,[r,e,s],a),i}});return i.addEventListener("message",d),{call:c,replace(e){const t=i;i=e,t.removeEventListener("message",d),e.addEventListener("message",d)},expose(e){for(const t of Object.keys(e)){const n=e[t];"function"==typeof n?s.set(t,n):s.delete(t)}},callable(...e){if(null!=o)for(const t of e)Object.defineProperty(c,t,{value:p(t),writable:!1,configurable:!0,enumerable:!0})},terminate(){u(2,void 0),h(),i.terminate&&i.terminate()}};function u(e,t,n){r||i.postMessage(t?[e,t]:[e],n)}async function d(e){const{data:t}=e;if(null!=t&&Array.isArray(t))switch(t[0]){case 2:h();break;case 0:{const e=new Ce,[o,r,i]=t[1],a=s.get(r);try{if(null==a)throw new Error(`No '${r}' method is exposed on this endpoint`);const[t,n]=l.encode(await a(...l.decode(i,[e])));u(1,[o,void 0,t],n)}catch(n){const{name:e,message:t,stack:r}=n;throw u(1,[o,{name:e,message:t,stack:r}]),n}finally{e.release()}break}case 1:{const[e]=t[1];a.get(e)(...t[1]),a.delete(e);break}case 3:{const[e]=t[1];l.release(e);break}case 6:{const[e]=t[1];a.get(e)(...t[1]),a.delete(e);break}case 5:{const[e,o,r]=t[1];try{const t=await l.call(o,r),[n,i]=l.encode(t);u(6,[e,void 0,n],i)}catch(n){const{name:t,message:o,stack:r}=n;throw u(6,[e,{name:t,message:o,stack:r}]),n}break}}}function p(e){return(...n)=>{if(r)return Promise.reject(new Error("You attempted to call a function on a terminated web worker."));if("string"!=typeof e&&"number"!=typeof e)return Promise.reject(new Error(`Can’t call a symbol method on a remote endpoint: ${e.toString()}`));const o=t(),i=f(o),[s,a]=l.encode(n);return u(0,[o,e,s],a),i}}function f(e,t){return new Promise(((n,o)=>{a.set(e,((e,r,i)=>{if(null==r)n(i&&l.decode(i,t));else{const e=new Error;Object.assign(e,r),o(e)}}))}))}function h(){var e;r=!0,s.clear(),a.clear(),null===(e=l.terminate)||void 0===e||e.call(l),i.removeEventListener("message",d)}}(c,{callable:["initialize","initWebPixelsAwaitingConsent"]}),u=Re(t,e,n,i,s,!0),d={cookieRestrictedDomains:async()=>function(){const e=[];return self.location.hostname.split(".").reverse().reduce(((t,n)=>{const o=""===t?n:`${n}.${t}`;return r=o,document.cookie=`wpm-domain-test=1; path=/; domain=${r}`,document.cookie.split(";").find((e=>e.includes("wpm-domain-test")))||e.push(o),function(e){document.cookie=`wpm-domain-test=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${e}`}(o),o;var r}),""),e}(),userCanBeTracked:async()=>se(),self:{origin:{get:async()=>self.origin}},document:{referrer:{get:async()=>document.referrer}},monorail:{register:async({status:t,errorMsg:o})=>{const r=ke(e);A("register",{version:p,pageUrl:self.location.href,shopId:n,surface:i,pixelId:e.id,pixelAppId:r,pixelSource:e.type,pixelRuntimeContext:e.runtimeContext,pixelScriptVersion:e.scriptVersion,pixelConfiguration:null==e?void 0:e.configuration,pixelEventSchemaVersion:e.eventPayloadVersion,status:t,errorMsg:o},!0)}}};l.expose({pixelRuntimeAPI:()=>u,sandboxInternalAPI:()=>d});const f=self.document.title;return l.call.initialize(f,a,e),ce((()=>{l.call.initWebPixelsAwaitingConsent()})),{config:e,endpoint:l}}function ke(e){return e.type===Oe.Custom?"-1":e.apiClientId?`${e.apiClientId}`:void 0}!function(e){e.Strict="STRICT",e.Lax="LAX"}(Te||(Te={})),function(e){e.App="APP",e.Custom="CUSTOM"}(Oe||(Oe={}));const Le="all_standard_events",Ne="all_custom_events";function je(e){try{return new URL(e),!0}catch(t){return function(e){const t=new RegExp("^(https?:\\/\\/)((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)*[a-z]{1,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i");return Boolean(t.test(e))}(e)}}const Ue=function(){const e=h("load",{version:p,pageUrl:self.location.href,status:"loading"});try{const t=new Map;return e.payload.status="loaded",x(e),{init(e){const{shopId:n,cdnBaseUrl:o,webPixelsConfigList:r,surface:i="unknown",initData:s,enabledBetaFlags:a}=e||{},c=self.location.origin;v(c),function(e){const t=new Set(e);return{isEnabled:function(e){return t.has(e)}}}(a).isEnabled("web_pixels_use_shop_domain_monorail_endpoint")&&(E=C("wellKnown"));const l=function(e){const t=new T({bufferSize:Number.POSITIVE_INFINITY,replayKeep:"oldest",enableSubscribeAll:!0,subscribeAllKey:Le}),n=new T({bufferSize:1e3,replayKeep:"oldest",enableSubscribeAll:!0,subscribeAllKey:Ne}),o=function(){const e=new Set;return ce((function(){e.forEach((t=>{e.delete(t),t()}))})),{gate(t,n={runOnAccept:!0}){se()?t():n.runOnAccept&&e.add(t)}}}();return e.initData,{publish(n,o,r){var i,s,a;if("string"!=typeof n)throw new Error("Expected event name to be a string, but got "+typeof n);if(!k(n))return!1;const c=ue(o);if(!c.isValid)return console.error(c.error),!1;const l=function(e,t,n){return{id:be(),clientId:ge(document.cookie)._shopify_y,timestamp:(new Date).toISOString(),name:e,context:ye(),data:{...n||{}}}}(n,0,o);return A("eventPublish",{version:p,pageUrl:self.location.href,shopId:e.shopId,surface:e.surface||"unknown",eventName:l.name,eventType:"standard",extensionId:null==r||null===(i=r.extension)||void 0===i?void 0:i.extensionId,extensionAppId:null==r||null===(s=r.extension)||void 0===s?void 0:s.appId,extensionType:null==r||null===(a=r.extension)||void 0===a?void 0:a.type},!0),t.publish(n,l)},publishCustomEvent(t,o,r){var i,s,a;if("string"!=typeof t)throw new Error("Expected event name to be a string, but got "+typeof t);if(k(t)||L(t))return!1;const c=ue(o);if(!c.isValid)return console.error(c.error),!1;const l=function(e,t,n=null){return{id:be(),clientId:ge(document.cookie)._shopify_y,timestamp:(new Date).toISOString(),name:e,context:ye(),customData:n}}(t,0,o);return A("eventPublish",{version:p,pageUrl:self.location.href,shopId:e.shopId,surface:e.surface||"unknown",eventName:l.name,eventType:"custom",extensionId:null==r||null===(i=r.extension)||void 0===i?void 0:i.extensionId,extensionAppId:null==r||null===(s=r.extension)||void 0===s?void 0:s.appId,extensionType:null==r||null===(a=r.extension)||void 0===a?void 0:a.type},!0),n.publish(t,l)},subscribe(e,r,i={}){const s=e=>{o.gate((()=>{var t;const n=i.schemaVersion||i.pixelRuntimeConfig.eventPayloadVersion;r(e),A("subscriberEventEmit",{version:p,pageUrl:self.location.href,shopId:i.shopId,surface:i.surface,pixelId:i.pixelRuntimeConfig.id,pixelAppId:ke(i.pixelRuntimeConfig),pixelSource:i.pixelRuntimeConfig.type,pixelRuntimeContext:i.pixelRuntimeConfig.runtimeContext,pixelScriptVersion:i.pixelRuntimeConfig.scriptVersion,pixelConfiguration:null===(t=i.pixelRuntimeConfig)||void 0===t?void 0:t.configuration,pixelEventSchemaVersion:n,eventName:e.name,eventType:k(e.name)?"standard":"custom"},!0)}))};if("all_events"===e){const e=t.subscribe(Le,s,i),o=n.subscribe(Ne,s,i);return()=>e()&&o()}return e===Ne?n.subscribe(Ne,s,i):e===Le||L(e)?t.subscribe(e,s,i):n.subscribe(e,s,i)}}}(e),u=e.webPixelsExtensionBaseUrl||e.webPixelExtensionBaseUrl,f={severity:"warning",context:"createWebPixelsManager/init",unhandled:!1,shopId:n,initConfig:e},m=h("init",{version:p,pageUrl:self.location.href,shopId:n,surface:i,status:"initializing"});try{if(!n){const e=new y("WebPixelsManager: shopId is required");throw g(e,f),e}if(!c){const e=new y("WebPixelsManager: storefrontBaseUrl is required");throw g(e,f),e}if(!je(c)){const e=new y(`WebPixelsManager: storefrontBaseUrl is not a valid absolute URL: ${c}`);throw g(e,f),e}if(!u){const e=new y("WebPixelsManager: webPixelsExtensionBaseUrl is required");throw g(e,f),e}if(!je(u)){const e=new y(`WebPixelsManager: webPixelsExtensionBaseUrl is not a valid absolute URL: ${u}`);throw g(e,f),e}if(!o){const e=new y("WebPixelsManager: cdnBaseUrl is required");throw g(e,f),e}if(!je(o)){const e=new y(`WebPixelsManager: cdnBaseUrl is not a valid absolute URL: ${o}`);throw g(e,f),e}return r.forEach((e=>{const r=(a=e.id,`${e.type.toLowerCase()}/${a}`);var a;if(!t.has(r)&&function(e){const t={eventPayloadVersion:"string",id:"number",runtimeContext:"string",scriptVersion:"string",type:"string"};return e.type===Oe.App&&(t.configuration="string"),Object.keys(e).filter((n=>Object.prototype.hasOwnProperty.call(t,n)&&typeof e[n]===t[n])).length===Object.keys(t).length}(e)){const a=De({webPixelConfig:e,eventBus:l,shopId:n,storefrontBaseUrl:c,webPixelsExtensionBaseUrl:u,cdnBaseUrl:o,surface:i,initData:s});t.set(r,a)}else console.warn("Web Pixel config is invalid or already configured")})),"checkout-one"!==i&&d(l.publish,s),m.payload.status="initialized",x(m),{publish:(e,t,n={})=>l.publish(e,t),publishCustomEvent:(e,t,n={})=>l.publishCustomEvent(e,t)}}catch(b){return b instanceof y||g(b,{context:"init",shopId:n,initConfig:e}),self.console&&console.error(b),m.payload.status="failed",m.payload.errorMsg=null==b?void 0:b.message,x(m),{publish:(...e)=>!1,publishCustomEvent:(...e)=>!1}}finally{S()}}}}catch(t){return t instanceof y||g(t,{context:"createWebPixelsManager"}),self.console&&console.error(t),e.payload.status="failed",e.payload.errorMsg=null==t?void 0:t.message,x(e,!0),{}}}();self.webPixelsManager=Ue})();