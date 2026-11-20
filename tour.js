/* Üçgenin Yardımcı Elemanları – tanıtım turu
   Kullanım: ana <script> bloğundan SONRA, </body> öncesine ekle:
   <script src="tour.js"></script>
*/
(function(){
'use strict';
var KEY='ucgen-tur-v1';
var $=function(s){return document.querySelector(s)};
var mob=matchMedia('(max-width:600px)');
var coarse=matchMedia('(pointer:coarse)');

/* ---------- Adımlar ---------- */
var STEPS=[
 {t:'Hoş geldin 👋',
  x:'Bu sayfada üçgenin dört yardımcı elemanını canlı olarak keşfedeceksin: açıortay, kenarortay, kenar orta dik ve yükseklik. Kısa bir turla nasıl çalıştığına bakalım.'},
 {s:'#tabs',t:'Bir eleman seç',
  x:'Buradan dört yardımcı elemandan birine geç. Çizim ve yandaki bilgiler seçtiğine göre değişir.'},
 {s:'.svw',t:'Köşeleri sürükle',
  x:function(){return coarse.matches
    ?'A, B ve C köşelerini parmağınla sürükle. İki parmakla yakınlaştırabilir, sağ alttaki düğmelerle de büyütüp küçültebilirsin.'
    :'A, B ve C köşelerini fareyle sürükle. Tekerlekle ya da sağ üstteki + − düğmeleriyle yakınlaştırabilirsin.'}},
 {s:'#presets',t:'Hazır üçgenler',
  x:'Dar, dik, geniş açılı ve eşkenar üçgene tek dokunuşla geç. Hareket düğmesi köşeleri kendiliğinden oynatır; özellikler hep geçerli kalır.'},
 {s:'#ctrls',t:'Görünümü ayarla',
  x:'Anahtarlarla çizimdeki öğeleri aç ya da kapat. Her satırdaki i düğmesi o öğenin ne anlama geldiğini açıklar.'},
 {s:'#facts',t:'Sayılar canlı güncellenir',
  x:'Formüller ve ölçülen değerler, köşeleri oynattıkça değişir. İki değerin hep eşit çıkması, özelliğin her üçgende geçerli olduğunu gösterir. “Neden böyle?” düğmesiyle ispatı adım adım izleyebilirsin.'},
 {s:'#tourBtn',t:'Turu istediğin zaman aç',
  x:'Bu düğmeyle turu yeniden izleyebilirsin. İyi keşifler!'}
];

/* ---------- Stil ---------- */
var css=
'.tour{position:fixed;inset:0;z-index:1000;display:none}'+
'.tour.on{display:block}'+
'.tour .tp{position:fixed;background:rgba(0,0,0,.34);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);transition:left .3s ease,top .3s ease,width .3s ease,height .3s ease}'+
'.tour .tr{position:fixed;border-radius:14px;box-shadow:0 0 0 2px var(--blue),0 0 26px color-mix(in srgb,var(--blue) 50%,transparent);transition:left .3s ease,top .3s ease,width .3s ease,height .3s ease}'+
'.tour .tt{position:fixed;width:340px;max-width:calc(100vw - 24px);background:var(--card);color:var(--ink);border-radius:20px;padding:18px 18px 14px;box-shadow:0 14px 44px rgba(0,0,0,.38);transition:left .3s ease,top .3s ease}'+
'.tour .tt.ctr{left:50%;top:50%;transform:translate(-50%,-50%);width:380px;text-align:center}'+
'.tour .tt.sheet{left:10px;right:10px;width:auto;max-width:none;top:auto;bottom:calc(10px + env(safe-area-inset-bottom,0px));border-radius:22px;transition:none}'+
'.tour .tt.ctr.sheet{left:50%;right:auto;top:50%;bottom:auto;width:calc(100vw - 28px)}'+
'.tour .td{display:flex;gap:5px;margin-bottom:12px}'+
'.tour .tt.ctr .td{justify-content:center}'+
'.tour .td i{width:7px;height:7px;border-radius:50%;background:var(--line);transition:background .2s,width .2s}'+
'.tour .td i.on{background:var(--blue);width:20px;border-radius:4px}'+
'.tour h2{margin:0 0 6px;font-size:19px;letter-spacing:-.01em;font-weight:700}'+
'.tour .tt.ctr h2{font-size:24px}'+
'.tour p{margin:0 0 16px;font-size:14.5px;line-height:1.55;color:var(--mute)}'+
'.tour .tb{display:flex;align-items:center;gap:8px}'+
'.tour .tt.ctr .tb{justify-content:center;flex-direction:row-reverse}'+
'.tour .tb .sp{flex:1}'+
'.tour .tt.ctr .tb .sp{display:none}'+
'.tour .tb button{font:inherit;font-size:14px;border-radius:980px;padding:9px 16px;min-height:40px;cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--ink);touch-action:manipulation}'+
'.tour .tb button.nx{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600}'+
'.tour .tb button.sk{border:0;background:none;color:var(--mute);padding-left:4px;padding-right:4px}'+
'.tour .tb button:focus-visible{outline:2px solid var(--blue);outline-offset:2px}'+
'@media(min-width:601px){h1{padding-right:400px!important}}'+
'@media(max-width:600px){h1{padding-right:104px!important}}'+
'@media(prefers-reduced-motion:reduce){.tour *{transition:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ---------- DOM ---------- */
var root=document.createElement('div');
root.className='tour';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','tourT');
root.innerHTML='<div class="tp"></div><div class="tp"></div><div class="tp"></div><div class="tp"></div><div class="tr"></div>'+
 '<div class="tt"><div class="td"></div><h2 id="tourT"></h2><p id="tourX"></p>'+
 '<div class="tb"><button type="button" class="sk" data-a="skip">Atla</button><span class="sp"></span>'+
 '<button type="button" class="pv" data-a="prev">Geri</button><button type="button" class="nx" data-a="next"></button></div></div>';
document.body.appendChild(root);

var tps=[].slice.call(root.querySelectorAll('.tp')),ring=root.querySelector('.tr'),tip=root.querySelector('.tt'),
    dots=root.querySelector('.td'),tT=$('#tourT'),tX=$('#tourX'),bPrev=root.querySelector('.pv'),bNext=root.querySelector('.nx'),bSkip=root.querySelector('.sk');

var btn=document.createElement('button');
btn.className='theme';btn.id='tourBtn';btn.type='button';btn.setAttribute('aria-label','Turu başlat');
btn.innerHTML='<span aria-hidden="true">?</span><span class="tl">&nbsp;Tur</span>';
var acts=$('.acts'),th=$('#theme');
if(acts)acts.insertBefore(btn,th||null);

/* ---------- Mantık ---------- */
var i=-1;
function setBox(e,l,t,w,h){e.style.left=Math.round(l)+'px';e.style.top=Math.round(t)+'px';e.style.width=Math.max(0,Math.round(w))+'px';e.style.height=Math.max(0,Math.round(h))+'px'}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

function place(){
  if(i<0)return;
  var s=STEPS[i],vw=innerWidth,vh=innerHeight,el=s.s&&$(s.s),r=null;
  if(el){
    var b=el.getBoundingClientRect(),p=8,
        l=Math.max(0,b.left-p),t=Math.max(0,b.top-p),rr=Math.min(vw,b.right+p),bb=Math.min(vh,b.bottom+p);
    r={left:l,top:t,right:rr,bottom:bb,width:rr-l,height:bb-t};
  }
  if(r){
    setBox(tps[0],0,0,vw,r.top);
    setBox(tps[1],0,r.bottom,vw,vh-r.bottom);
    setBox(tps[2],0,r.top,r.left,r.height);
    setBox(tps[3],r.right,r.top,vw-r.right,r.height);
    setBox(ring,r.left,r.top,r.width,r.height);
    ring.style.display='block';
  }else{
    setBox(tps[0],0,0,vw,vh);
    setBox(tps[1],0,0,0,0);setBox(tps[2],0,0,0,0);setBox(tps[3],0,0,0,0);
    ring.style.display='none';
  }
  tip.className='tt';tip.style.left='';tip.style.top='';
  if(!r){tip.classList.add('ctr');if(mob.matches)tip.classList.add('sheet');return}
  if(mob.matches){tip.classList.add('sheet');return}
  var tw=tip.offsetWidth,th2=tip.offsetHeight,g=14,L,T;
  if(r.bottom+g+th2<=vh-12){T=r.bottom+g;L=r.left+r.width/2-tw/2}
  else if(r.top-g-th2>=12){T=r.top-g-th2;L=r.left+r.width/2-tw/2}
  else if(r.right+g+tw<=vw-12){L=r.right+g;T=r.top}
  else if(r.left-g-tw>=12){L=r.left-g-tw;T=r.top}
  else{L=r.left+r.width/2-tw/2;T=vh-th2-16}
  tip.style.left=clamp(L,12,vw-tw-12)+'px';
  tip.style.top=clamp(T,12,vh-th2-12)+'px';
}

function show(n){
  i=clamp(n,0,STEPS.length-1);
  var s=STEPS[i],last=STEPS.length-1;
  tT.textContent=s.t;
  tX.textContent=typeof s.x==='function'?s.x():s.x;
  dots.innerHTML=STEPS.map(function(_,k){return '<i class="'+(k===i?'on':'')+'"></i>'}).join('');
  bPrev.style.display=i===0?'none':'';
  bSkip.style.display=i===last?'none':'';
  bNext.textContent=i===0?'Turu başlat':i===last?'Bitir':'İleri';
  var el=s.s&&$(s.s);
  if(el){
    var b=el.getBoundingClientRect(),tall=b.height>innerHeight*.7;
    el.scrollIntoView({block:(mob.matches||tall)?'start':'center'});
    if(mob.matches)scrollBy(0,-14);
  }
  place();
  try{bNext.focus({preventScroll:true})}catch(e){}
}

function start(){
  if(typeof PRES!=='undefined'&&PRES&&typeof exitPres==='function')exitPres();
  if(typeof stopPlay==='function')stopPlay();
  document.body.style.overflow='hidden';
  root.classList.add('on');
  show(0);
}
function end(){
  i=-1;root.classList.remove('on');document.body.style.overflow='';
  try{localStorage.setItem(KEY,'1')}catch(e){}
  scrollTo(0,0);
  try{btn.focus({preventScroll:true})}catch(e){}
}

root.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  var a=b.dataset.a;
  if(a==='next'){i===STEPS.length-1?end():show(i+1)}
  else if(a==='prev')show(i-1);
  else if(a==='skip')end();
});
btn.addEventListener('click',start);
addEventListener('keydown',function(e){
  if(i<0)return;
  if(e.key==='ArrowRight'){e.preventDefault();i===STEPS.length-1?end():show(i+1)}
  else if(e.key==='ArrowLeft'){e.preventDefault();show(i-1)}
  else if(e.key==='Escape'){e.preventDefault();end()}
});
addEventListener('resize',place);
addEventListener('scroll',place,{passive:true});

/* İlk ziyarette otomatik başlat */
var seen=null;
try{seen=localStorage.getItem(KEY)}catch(e){}
if(!seen)setTimeout(start,500);
})();
