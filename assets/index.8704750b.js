var H=(t,e,n)=>{if(!e.has(t))throw TypeError("Cannot "+n)};var s=(t,e,n)=>(H(t,e,"read from private field"),n?n.call(t):e.get(t)),a=(t,e,n)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,n)},m=(t,e,n,i)=>(H(t,e,"write to private field"),i?i.call(t,n):e.set(t,n),n);var E=(t,e,n)=>(H(t,e,"access private method"),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerpolicy&&(l.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?l.credentials="include":r.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(r){if(r.ep)return;r.ep=!0;const l=n(r);fetch(r.href,l)}})();function S(t,{content:e="",classes:n=[],id:i="",parent:r,children:l=[]}={}){const o=document.createElement(t);return e.length>0&&(o.textContent=e),i.length>0&&(o.id=i),r instanceof HTMLElement&&r.appendChild(o),n.length>0&&o.classList.add(...n),l.length>0&&o.append(...l),o}var A;class Ce{constructor(){a(this,A,new Map)}id(e){if(s(this,A).has(e))return s(this,A).get(e);{const n=document.getElementById(e);return s(this,A).set(e,n),n}}}A=new WeakMap;const ye=3,Le=2;function C(t,e,n=null,i={bubbles:!1,cancelable:!1,composed:!1}){let r;return n!==null?r=new CustomEvent(t,{...i,detail:n}):r=new Event(t,i),e.dispatchEvent(r)}const le="worker-ready",oe="populate-ingredient-list",ae="ingredient-search-result",ce="calculate-potion-result",de="worker-error",Se=t=>C(le,t,null,{bubbles:!0}),ve=(t,e)=>C(oe,t,{payload:e},{bubbles:!0}),we=(t,e)=>C(ae,t,{payload:e},{bubbles:!0,cancelable:!0}),Me=(t,e)=>C(ce,t,{payload:e},{bubbles:!0,cancelable:!0}),ke=(t,e)=>C(de,t,{payload:e},{bubbles:!0,cancelable:!0}),ue="list-cleared",he="ingredient-selected",Y="ingredient-deselected",ge="max-ingredients-selected",Ne=(t,e)=>C(he,t,{ingredientName:e},{bubbles:!0,cancelable:!0}),fe=(t,e)=>C(Y,t,{ingredientName:e},{bubbles:!0,cancelable:!0}),Re=t=>C(ge,t,null,{bubbles:!0}),pe=(t,e)=>C(ue,t,e,{bubbles:!0,cancelable:!0});function J(t,e={}){return{type:t,payload:e}}function Te(t,e,n){return J("search",{effectSearchTerm:t,effectOrder:e,dlc:n})}function Ae(){return J("populate")}function De(t,e=15,n=0,i=!1,r=!1,l=!1,o=0){return J("calculate",{names:t,skill:e,alchemist:n,hasBenefactor:r,hasPhysician:i,hasPoisoner:l,fortifyAlchemy:o})}const k={target:null,["worker-ready"](){Se(this.target)},["search-result"](t){we(this.target,t)},["populate-result"](t){console.assert(Array.isArray(t),"Message handler switch docs need updating."),ve(this.target,t)},["calculate-result"](t){console.dir(t),Me(this.target,t)},["worker-error"](t){ke(this.target,t)},default(t){this.onUnknownMessage(t)},onUnknownMessage:null};var D,c;class xe{constructor(){a(this,D,void 0);a(this,c,void 0);m(this,D,new Worker(new URL("/SkyrimAlchemyJS/assets/alchemy-worker-script.4cc2e223.js",self.location),{type:"module",name:"mixer"}));const e=new MessageChannel;m(this,c,e.port1),this.onUnknownMessage=i=>console.debug(`${i} is not a valid message type.`),k.target=s(this,c),k["calculate-result"].bind(s(this,c)),k["populate-result"].bind(s(this,c)),k.onUnknownMessage=this.onUnknownMessage;const n=i=>{console.log(`Message ${i.type}`);const{type:r,payload:l}=i.data;let o=String(r);o in k?k[o](l):k.default(r)};s(this,c).addEventListener("message",n),s(this,c).start(),s(this,D).postMessage({type:"init"},[e.port2])}onWorkerReady(e){typeof e=="function"&&s(this,c).addEventListener(le,e)}onIngredientSearchResult(e){typeof e=="function"&&s(this,c).addEventListener(ae,e)}onPopulateIngredientList(e){typeof e=="function"&&s(this,c).addEventListener(oe,e)}onCalculateResult(e){typeof e=="function"&&s(this,c).addEventListener(ce,e)}onWorkerError(e){typeof e=="function"&&s(this,c).addEventListener(de,e)}postMessage(e){s(this,c).postMessage(e)}sendSearchMessage(e,n,i){const r=Te(e,n,i);s(this,c).postMessage(r)}sendPopulateMessage(){const e=Ae();s(this,c).postMessage(e)}sendCalculateMessage(e,n=15,i=0,r=!1,l=!1,o=!1,g=0){const f=De(e,n,i,r,l,o,g);s(this,c).postMessage(f)}terminate(){s(this,D).terminate()}static get WORKER_READY(){return"worker-ready"}static get POPULATE_INGREDIENT_LIST(){return"populate-ingredient-list"}static get INGREDIENT_SEARCH_RESULT(){return"ingredient-search-result"}static get CALCULATE_POTION_RESULT(){return"calculate-potion-result"}static get WORKER_ERROR(){return"worker-error"}}D=new WeakMap,c=new WeakMap;var b;const ee=class{constructor(e=new Set){a(this,b,void 0);m(this,b,e)}static get MAX_INGREDIENTS(){return ye}get selectedIngredients(){return s(this,b)}selectIngredient(e){s(this,b).add(e)}unselectIngredient(e){return s(this,b).delete(e)}hasIngredient(e){return s(this,b).has(e)}clear(){s(this,b).clear()}canSelectMore(){return s(this,b).size<ee.MAX_INGREDIENTS}};let W=ee;b=new WeakMap;function Pe(t,e){t.isConnected&&t.setAttribute("form",e)}function _e(t){const e=document.createElement("li"),n=document.createElement("button");n.type="button",n.value=t,n.textContent=t;const i=document.createElement("input");return i.type="hidden",i.name="selected-ingredients",i.id=t.replace(" ","-").toLowerCase(),i.value=t,e.appendChild(n),e.appendChild(i),e}var p,I;class Oe{constructor(e,n=new Set){a(this,p,void 0);a(this,I,void 0);m(this,p,e),m(this,I,n),s(this,p).addEventListener("click",this)}hasIngredient(e){return s(this,I).has(e)}addIngredient(e){if(typeof e!="string")throw new TypeError(`ingredientName must be a string, not ${typeof e}`);s(this,I).has(e)&&e.length===0||(s(this,I).add(e),this.addToList(e))}removeIngredient(e){s(this,I).delete(e)&&this.removeFromList(e)}addToList(e){const n=_e(e);s(this,p).appendChild(n),Pe(n.lastElementChild,"brew-potion")}removeFromList(e){const n=s(this,p).children.length;for(let i=0;i<n;i++){const r=s(this,p).children[i];if(r.textContent===e){s(this,p).removeChild(r);break}}}addAll(e){for(let n of e)this.addIngredient(n)}clear(){s(this,p).replaceChildren(),s(this,I).clear(),pe(s(this,p),[])}handleEvent(e){const n=e.target,{value:i}=n;this.hasIngredient(i)&&(this.removeIngredient(i),fe(s(this,p),i))}}p=new WeakMap,I=new WeakMap;const Fe=new Intl.ListFormat(navigator.language);function We(t){return Fe.format(t)}function K(t){return typeof t>"u"||t===null}const $e=new Map([["Dawnguard","DG"],["Dragonborn","DB"],["Hearthfire","HF"]]);function te(t,e){const n=Array.from(t.values());pe(e,n)}function ne(t){let e=t.split(" ").join("-");for(;e.includes("'");)e=e.replace("'","");return e}function se(t,e){const n=document.createElement("li");n.ariaSelected=!1,n.id=`${ne(t.name)}-item`,n.tabIndex=-1,n.setAttribute("role","option");const i=document.createElement("input");i.type="checkbox",i.name="selected-ingredients",i.value=t.name,i.id=ne(t.name),i.tabIndex=-1;const r=document.createElement("label");r.htmlFor=i.id;const l=document.createElement("span");if(l.textContent=t.name,e!==null&&typeof e<"u"&&e.effectSearchTerm!=="All"){if(t.effectNames[0]===e.effectSearchTerm&&l.classList.add("first-effect"),t.dlc!=="Vanilla"){const o=document.createElement("sup");o.textContent=$e.get(t.dlc),o.tabIndex=-1,o.classList.add("pill","dlc"),l.appendChild(o)}if(e.effectSearchTerm!=="All"){const o=t.effects[t.effectNames.indexOf(e.effectSearchTerm)],{cost:{multiplier:g},duration:{multiplier:f},magnitude:{multiplier:L}}=o;if(!Number.isInteger(g)){const u=document.createElement("sup");u.textContent=`${g}x Cost`,u.tabIndex=-1,u.classList.add("pill","multiplier"),l.appendChild(u)}if(!Number.isInteger(f)){const u=document.createElement("sup");u.textContent=`${f}x Dur`,u.tabIndex=-1,u.classList.add("pill","multiplier"),l.appendChild(u)}if(!Number.isInteger(L)){const u=document.createElement("sup");u.textContent=`${L}x Mag`,u.tabIndex=-1,u.classList.add("pill","multiplier"),l.appendChild(u)}}}return n.append(i,r,l),n}var d,h,_,v,w,O,X,M,T,z,Ge,q,Ve,U,me,G,Ee,V,be;class Ue{constructor(e,n=new W){a(this,O);a(this,M);a(this,z);a(this,q);a(this,U);a(this,G);a(this,V);a(this,d,void 0);a(this,h,void 0);a(this,_,void 0);a(this,v,new Map);a(this,w,void 0);m(this,h,n),m(this,d,e),m(this,_,new MutationObserver(i=>{for(const r of i)if(r.type==="childList"){const{addedNodes:l,removedNodes:o}=r;if(o.length>0){for(const g of o.values())if(g.hasChildNodes()){const f=g.childNodes[0].value;s(this,v).delete(f)}}if(l.length>0)for(const g of l.values()){const f=g.childNodes[0],L=f.value;s(this,v).set(L,f)}console.dir(s(this,v))}})),s(this,_).observe(s(this,d),{childList:!0}),s(this,d).addEventListener("click",this),s(this,d).addEventListener("keydown",this)}replaceWithNoResults(){const e=document.createDocumentFragment(),n=S("p",{content:"No results."});e.appendChild(n),s(this,d).replaceChildren(e)}select(e){let n=e;typeof e=="string"&&(n=s(this,v).get(e)),n.checked=!0,n.parentElement.ariaSelected=!0,s(this,h).selectIngredient(n.value)}deselect(e){let n=e;typeof e=="string"&&(n=s(this,v).get(e)),s(this,h).unselectIngredient(n.value),n.checked=!1,n.parentElement.ariaSelected=!1}addAll(e,n=null){const i=new DocumentFragment;for(let r of e){const l=se(r,n);s(this,h).hasIngredient(r.name)&&this.select(l.firstElementChild),i.appendChild(l)}te(s(this,h).selectedIngredients,s(this,d)),s(this,d).appendChild(i)}replaceChildrenWith(e=[],n=null){const i=new DocumentFragment;for(let r of e){const l=se(r,n);s(this,h).hasIngredient(r.name)&&this.select(l.firstElementChild),i.appendChild(l)}te(s(this,h).selectedIngredients,s(this,d)),s(this,d).replaceChildren(i)}reset(){s(this,h).clear()}handleEvent(e){switch(e.type){case"click":e.preventDefault();const n=e.target.closest('[role="option"]');E(this,M,T).call(this,n);const i=n.firstElementChild;E(this,O,X).call(this,i);break;case"keydown":E(this,V,be).call(this,e);break}}}d=new WeakMap,h=new WeakMap,_=new WeakMap,v=new WeakMap,w=new WeakMap,O=new WeakSet,X=function(e){const{value:n}=e;!s(this,h).hasIngredient(n)&&s(this,h).canSelectMore()?(s(this,h).selectIngredient(n),Ne(e,n)):s(this,h).hasIngredient(n)?(s(this,h).unselectIngredient(n),fe(e,n)):(e.checked=!1,Re(e))},M=new WeakSet,T=function(e){m(this,w,e.id),s(this,d).setAttribute("aria-activedescendant",s(this,w)),e.focus()},z=new WeakSet,Ge=function(){m(this,w,null),s(this,d).setAttribute("aria-activedescendant",null)},q=new WeakSet,Ve=function(){},U=new WeakSet,me=function(e){let n=null;return!K(e.nextElementSibling)&&e.nextElementSibling.hasAttribute("role")&&e.nextElementSibling.getAttribute("role")==="option"&&(n=e.nextElementSibling),n},G=new WeakSet,Ee=function(e){let n=null;return!K(e.previousElementSibling)&&e.previousElementSibling.hasAttribute("role")&&e.previousElementSibling.getAttribute("role")==="option"&&(n=e.previousElementSibling),n},V=new WeakSet,be=function(e){const n=s(this,d).querySelectorAll('[role="option"]'),i=s(this,d).querySelector(`#${s(this,d).getAttribute("aria-activedescendant")}`);let r=i;if(!!i)switch(e.key){case"ArrowDown":if(!s(this,w)){E(this,M,T).call(this,n[0]);break}r=E(this,U,me).call(this,i),r&&(E(this,M,T).call(this,r),e.preventDefault());break;case"ArrowUp":if(!s(this,w)){E(this,M,T).call(this,n[0]);break}r=E(this,G,Ee).call(this,i),r&&(E(this,M,T).call(this,r),e.preventDefault());break;case" ":const l=i.firstElementChild;E(this,O,X).call(this,l),e.preventDefault();break}};const y=new xe("scripts/infrastructure/worker/alchemy-worker-script.js"),R=new Ce;y.onWorkerReady(Ze);y.onIngredientSearchResult(ze);y.onPopulateIngredientList(Je);y.onCalculateResult(je);y.onWorkerError(Xe);window.addEventListener("beforeunload",t=>{console.info("Terminating Worker"),y.terminate()});const x=R.id("brew-potion");x.addEventListener("submit",et);const P=R.id("ingredient-filter");P.addEventListener("submit",Ye);const Be=R.id("query-interpretation"),F=R.id("ingredient-list"),Q=R.id("chosen-ingredients"),$=R.id("possible-potions"),He=R.id("hit-count"),j=[],Z=new W,N=new Ue(F,Z),B=new Oe(Q),ie=x.elements[x.elements.length-2],Ke=3;P.elements[Ke].addEventListener("change",t=>{t.target.ariaChecked=t.target.checked});P.addEventListener("reset",t=>{N.reset(),B.clear(),j.length=0,setTimeout(()=>P.requestSubmit(),0)},{passive:!0});x.addEventListener("reset",t=>{const e=S("li",{children:[S("p",{content:"Choose two to three ingredients."})]});$.replaceChildren(e)});F.addEventListener(he,t=>{const e=t.detail.ingredientName;let n=t.target;console.assert(n instanceof HTMLInputElement,"Exepected an input element."),ie.validationMessage.length>0&&ie.setCustomValidity(""),N.select(n),console.info(`${e} selected`),B.addIngredient(e)});F.addEventListener(Y,t=>{const e=t.detail.ingredientName;let n=t.target;N.deselect(n),console.info(`${e} deselected`),B.removeIngredient(e)});Q.addEventListener(ue,t=>{const e=t.detail;console.info("Ingredients to keep in chosen: ",e,t.target),B.addAll(e)});Q.addEventListener(Y,t=>{const e=t.detail.ingredientName;console.debug(`chosen ingredient deselected evt listener: Ingredient ${e} deselected.`),Z.unselectIngredient(e),N.deselect(e)});F.addEventListener(ge,Qe);function Xe({detail:{payload:t}}){console.error(`Error: ${t}`)}function je({detail:{payload:t}}){console.info("Worker calculation results: ",t);let e=[];if(t.size>0)t.forEach((n,i)=>{let r=re(n,i);e.push(r)});else{const n=re({name:"Potion Failed",didSucceed:!1});e.push(n)}$.replaceChildren(...e)}function re({name:t,didSucceed:e,effects:n,gold:i},r=""){const l=document.createDocumentFragment(),o=S("li"),g=S("h2",{content:t});if(o.appendChild(g),e){const f=S("p",{content:`Description: ${n}`});o.appendChild(f);const L=S("p",{content:`Gold: ${i}`});o.appendChild(L);const u=S("i",{content:`Recipe: ${r}`});o.appendChild(u)}return l.appendChild(o),l}function ze({detail:{payload:t}}){console.debug("Search result incoming",t),Array.isArray(t.results)&&(t.results.length>0?(N.replaceChildrenWith(t.results,t.query),Ie(t.results.length)):N.replaceWithNoResults())}function qe(t,e,n){return`Showing ingredients sharing "${t}", sorted by ${e}, and part of ${We(n)}`}function Ye(t){t.preventDefault(),console.assert(t.defaultPrevented),console.debug("Ingredient Search submitted.");const e=new FormData(P);let n=["Vanilla"],i=e.get("by-effect"),r=e.get("effect-sort-order");n.push(...e.getAll("installed-dlc")),console.debug("Ingredient search form submitting ",Array.from(e.entries())),Be.textContent=qe(i,r,n),F.ariaSort=r==="asc"?"ascending":"descending",y.sendSearchMessage(i,r,n)}function Je({detail:{payload:t}}){console.assert(Array.isArray(t),"Populate results payload was not an array"),N.replaceChildrenWith(t),Ie(t.length)}function Ie(t){He.textContent=`${t}`}function Qe(t){const e=t.target;j.push(e),e.setCustomValidity("Too many ingredients were selected. Unselect some please."),e.reportValidity(),setTimeout(()=>{let n=j.pop();K(n)||n.setCustomValidity("")},1e3)}function Ze(){y.sendPopulateMessage()}function et(t){t.preventDefault();const e=t.submitter;if(Array.from(Z.selectedIngredients).length<Le){e.setCustomValidity("Expected 2 to 3 ingredients to be selected."),e.reportValidity();return}const i=new FormData(x);e.setCustomValidity(""),tt(i),$.hasChildNodes()&&(console.debug("Attempting to remove default text"),$.replaceChildren())}function tt(t){let e=t.has("physician-perk"),n=t.has("benefactor-perk"),i=t.has("poisoner-perk"),r=t.getAll("selected-ingredients");console.assert(r.length>0,"Selected ingredients can't be empty.");let l=Number(t.get("alchemist-perk")),o=Number(t.get("skill-level")),g=Number(t.get("fortify-alchemy"));t.forEach(([f,L])=>console.debug(`Debugging Send Calculate Message: ${L}, ${f}`)),y.sendCalculateMessage(r,o,l,e,n,i,g)}
