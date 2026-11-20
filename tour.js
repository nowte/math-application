/* Üçgenin Yardımcı Elemanları – tanıtım turu (v2: masaüstü + ayrı mobil düzen)
   Kullanım: ana <script> bloğundan SONRA, </body> öncesine ekle:
   <script src="tour.js"></script>
*/
(function(){
'use strict';
var KEY='ucgen-tur-v1';
var $=function(s){return document.querySelector(s)};
var mob=matchMedia('(max-width:600px)');
var coarse=matchMedia('(pointer:coarse)');

/* ---------- Adımlar (xm: sadece mobilde gösterilen metin) ---------- */
var STEPS=[
 {t:'Hoş geldin 👋',
  x:'Bu sayfada üçgenin dört yardımcı elemanını canlı olarak keşfedeceksin: açıortay, kenarortay, kenar orta dik ve yükseklik. Kısa bir turla nasıl çalıştığına bakalım.',
  xm:'Üçgenin dört yardımcı elemanını (açıortay, kenarortay, kenar orta dik, yükseklik) canlı olarak keşfedeceksin. 30 saniyelik kısa bir tur yapalım.'},
 {s:'#tabs',t:'Bir eleman seç',
  x:'Buradan dört yardımcı elemandan birine geç. Çizim ve yandaki bilgiler seçtiğine göre değişir.',
  xm:'Dört yardımcı elemandan birine dokun. Çizim ve aşağıdaki bilgiler seçtiğine göre değişir.'},
 {s:'.svw',t:'Köşeleri sürükle',
  x:function(){return coarse.matches
    ?'A, B ve C köşelerini parmağınla sürükle. İki parmakla yakınlaştırabilir, sağ alttaki düğmelerle de büyütüp küçültebilirsin.'
    :'A, B ve C köşelerini fareyle sürükle. Tekerlekle ya da sağ üstteki + − düğmeleriyle yakınlaştırabilirsin.'},
  xm:'A, B ve C köşelerini parmağınla sürükle. İki parmakla yakınlaştır; sağ alttaki düğmelerle de büyütüp küçültebilirsin. Sayfayı kaydırmak için çizimin dışına dokun.'},
 {s:'#presets',t:'Hazır üçgenler',
  x:'Dar, dik, geniş açılı ve eşkenar üçgene tek dokunuşla geç. Hareket düğmesi köşeleri kendiliğinden oynatır; özellikler hep geçerli kalır.',
  xm:'Dar, dik, geniş açılı ve eşkenar üçgene tek dokunuşla geç. Hareket düğmesi köşeleri kendiliğinden oynatır.'},
 {s:'#ctrls',t:'Görünümü ayarla',
  x:'Anahtarlarla çizimdeki öğeleri aç ya da kapat. Her satırdaki i düğmesi o öğenin ne anlama geldiğini açıklar.',
  xm:'Anahtarlarla çizimdeki öğeleri aç ya da kapat. i düğmesi her öğeyi açıklar. Listenin tamamını görmek için yukarı aşağı kaydırabilirsin.'},
 {s:'#facts',t:'Sayılar canlı güncellenir',
  x:'Formüller ve ölçülen değerler, köşeleri oynattıkça değişir. İki değerin hep eşit çıkması, özelliğin her üçgende geçerli olduğunu gösterir. “Neden böyle?” düğmesiyle ispatı adım adım izleyebilirsin.',
  xm:'Köşeleri oynattıkça formüller ve ölçülen değerler değişir. Eşit çıkan değerler özelliğin her üçgende geçerli olduğunu gösterir. “Neden böyle?” ile ispatı adım adım izle. Kaydırarak hepsini görebilirsin.'},
 {s:'#tourBtn',t:'Turu istediğin zaman aç',
  x:'Bu düğmeyle turu yeniden izleyebilirsin. İyi keşifler!',
  xm:'Bu düğmeyle turu yeniden izleyebilirsin. İyi keşifler!'}
];

/* ---------- Stil ---------- */
var css=
/* ortak */
'.tour{position:fixed;inset:0;z-index:1000;display:none;-webkit-tap-highlight-color:transparent}'+
'.tour.on{display:block}'+
'.tour .tp{position:fixed;background:rgba(0,0,0,.34);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);transition:left .3s ease,top .3s ease,width .3s ease,height .3s ease}'+
'.tour .tr{position:fixed;border-radius:14px;box-shadow:0 0 0 2px var(--blue),0 0 26px color-mix(in srgb,var(--blue) 50%,transparent);transition:left .3s ease,top .3s ease,width .3s ease,height .3s ease;pointer-events:none}'+
'.tour.ns .tp,.tour.ns .tr{transition:none}'+
'.tour .tt{position:fixed;width:340px;max-width:calc(100vw - 24px);background:var(--card);color:var(--ink);border-radius:20px;padding:18px 18px 14px;box-shadow:0 14px 44px rgba(0,0,0,.38);transition:left .3s ease,top .3s ease}'+
'.tour .td{display:flex;gap:5px;margin-bottom:12px}'+
'.tour .td i{width:7px;height:7px;border-radius:50%;background:var(--line);transition:background .2s,width .2s}'+
'.tour .td i.on{background:var(--blue);width:20px;border-radius:4px}'+
'.tour h2{margin:0 0 6px;font-size:19px;letter-spacing:-.01em;font-weight:700}'+
'.tour p{margin:0 0 16px;font-size:14.5px;line-height:1.55;color:var(--mute)}'+
'.tour .tb{display:flex;align-items:center;gap:8px}'+
'.tour .tb .sp{flex:1}'+
'.tour .tb button{font:inherit;font-size:14px;border-radius:980px;padding:9px 16px;min-height:40px;cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--ink);touch-action:manipulation}'+
'.tour .tb button.nx{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600}'+
'.tour .tb button.sk{border:0;background:none;color:var(--mute);padding-left:4px;padding-right:4px}'+
'.tour .tb button:focus-visible{outline:2px solid var(--blue);outline-offset:2px}'+
'.tour .grab,.tour .cnt{display:none}'+
/* ortada karşılama kartı (masaüstü) */
'.tour .tt.ctr{left:50%;top:50%;transform:translate(-50%,-50%);width:380px;text-align:center;transition:none}'+
'.tour .tt.ctr h2{font-size:24px}'+
'.tour .tt.ctr .td{justify-content:center}'+
'.tour .tt.ctr .tb{justify-content:center;flex-direction:row-reverse}'+
'.tour .tt.ctr .tb .sp{display:none}'+
/* ===== MOBİL: alttan açılan panel ===== */
'.tour .tt.sheet{left:8px;right:8px;width:auto;max-width:none;top:auto;bottom:calc(8px + env(safe-area-inset-bottom,0px));border-radius:24px;padding:24px 16px 14px;max-height:50vh;max-height:50dvh;overflow-y:auto;overscroll-behavior:contain;transition:none;box-shadow:0 -6px 40px rgba(0,0,0,.42);text-align:left}'+
'.tour .tt.sheet .grab{display:block;position:absolute;top:8px;left:50%;width:40px;height:4px;margin-left:-20px;border-radius:2px;background:var(--line)}'+
'.tour .tt.sheet .td{gap:4px;margin:0 0 10px}'+
'.tour .tt.sheet .td i,.tour .tt.sheet .td i.on{flex:1;width:auto;height:4px;border-radius:2px}'+
'.tour .tt.sheet .cnt{display:block;font-size:12.5px;font-weight:600;color:var(--blue);margin:0 0 4px}'+
'.tour .tt.sheet h2{font-size:20px;padding-right:64px}'+
'.tour .tt.sheet p{font-size:15px;margin-bottom:14px}'+
'.tour .tt.sheet .tb{gap:10px}'+
'.tour .tt.sheet .tb .sp{display:none}'+
'.tour .tt.sheet .tb button{min-height:50px;font-size:15.5px;flex:1}'+
'.tour .tt.sheet .tb button.pv{flex:0 0 34%}'+
'.tour .tt.sheet .tb button.sk{position:absolute;top:14px;right:8px;flex:none;min-height:44px;padding:0 14px;font-size:14px}'+
/* mobil + ortada (karşılama) */
'.tour .tt.ctr.sheet{left:50%;right:auto;top:50%;bottom:auto;width:calc(100vw - 28px);max-height:calc(100vh - 28px);padding:26px 18px 16px;text-align:center}'+
'.tour .tt.ctr.sheet .grab,.tour .tt.ctr.sheet .td,.tour .tt.ctr.sheet .cnt{display:none}'+
'.tour .tt.ctr.sheet h2{font-size:26px;padding-right:0}'+
'.tour .tt.ctr.sheet .tb{flex-direction:column}'+
'.tour .tt.ctr.sheet .tb button.nx{order:1;width:100%;flex:none}'+
'.tour .tt.ctr.sheet .tb button.sk{position:static;order:2;width:100%;flex:none;padding:0}'+
/* başlık ile üst butonlar çakışmasın */
'@media(min-width:601px){h1{padding-right:400px!important}}'+
'@media(max-width:600px){h1{padding-right:104px!important}}'+
'@media(prefers-reduced-motion:reduce){.tour *{transition:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ---------- DOM ---------- */
var root=document.createElement('div');
root.className='tour';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','tourT');
root.innerHTML='<div class="tp"></div><div class="tp"></div><div class="tp"></div><div class="tp"></div><div class="tr"></div>'+
 '<div class="tt"><div class="grab"></div><div class="td"></div><div class="cnt" id="tourC"></div><h2 id="tourT"></h2><p id="tourX"></p>'+
 '<div class="tb"><button type="button" class="sk" data-a="skip">Atla</button><span class="sp"></span>'+
 '<button type="button" class="pv" data-a="prev">Geri</button><button type="button" class="nx" data-a="next"></button></div></div>';
document.body.appendChild(root);

var tps=[].slice.call(root.querySelectorAll('.tp')),ring=root.querySelector('.tr'),tip=root.querySelector('.tt'),
    dots=root.querySelector('.td'),tT=$('#tourT'),tX=$('#tourX'),tC=$('#tourC'),
    bPrev=root.querySelector('.pv'),bNext=root.querySelector('.nx'),bSkip=root.querySelector('.sk');

var btn=document.createElement('button');
btn.className='theme';btn.id='tourBtn';btn.type='button';btn.setAttribute('aria-label','Turu başlat');
btn.innerHTML='<span aria-hidden="true">?</span><span class="tl">&nbsp;Tur</span>';
var acts=$('.acts'),themeBtn=$('#theme');
if(acts)acts.insertBefore(btn,themeBtn||null);

/* ---------- Mantık ---------- */
var i=-1,nsT=0;
function setBox(e,l,t,w,h){e.style.left=Math.round(l)+'px';e.style.top=Math.round(t)+'px';e.style.width=Math.max(0,Math.round(w))+'px';e.style.height=Math.max(0,Math.round(h))+'px'}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

function place(){
  if(i<0)return;
  var s=STEPS[i],vw=innerWidth,vh=innerHeight,el=s.s&&$(s.s),r=null;
  if(el){
    var b=el.getBoundingClientRect(),p=mob.matches?6:8,
        l=Math.max(0,b.left-p),t=Math.max(0,b.top-p),rr=Math.min(vw,b.right+p),bb=Math.min(vh,b.bottom+p);
    r={left:l,top:t,right:rr,bottom:bb,width:Math.max(0,rr-l),height:Math.max(0,bb-t)};
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
  if(mob.matches)return; /* mobilde panel CSS ile sabit */
  tip.className='tt';tip.style.left='';tip.style.top='';
  if(!r){tip.classList.add('ctr');return}
  var tw=tip.offsetWidth,th=tip.offsetHeight,g=14,L,T;
  if(r.bottom+g+th<=vh-12){T=r.bottom+g;L=r.left+r.width/2-tw/2}
  else if(r.top-g-th>=12){T=r.top-g-th;L=r.left+r.width/2-tw/2}
  else if(r.right+g+tw<=vw-12){L=r.right+g;T=r.top}
  else if(r.left-g-tw>=12){L=r.left-g-tw;T=r.top}
  else{L=r.left+r.width/2-tw/2;T=vh-th-16}
  tip.style.left=clamp(L,12,vw-tw-12)+'px';
  tip.style.top=clamp(T,12,vh-th-12)+'px';
}

function show(n){
  i=clamp(n,0,STEPS.length-1);
  var s=STEPS[i],last=STEPS.length-1,m=mob.matches,el=s.s&&$(s.s);
  tT.textContent=s.t;
  var txt=m&&s.xm?s.xm:s.x;
  tX.textContent=typeof txt==='function'?txt():txt;
  tC.textContent='Adım '+(i+1)+' / '+STEPS.length;
  dots.innerHTML=STEPS.map(function(_,k){return '<i class="'+(k<=i?'on':'')+'"></i>'}).join('');
  bPrev.style.display=i===0?'none':'';
  bSkip.style.display=i===last?'none':'';
  bNext.textContent=i===0?'Turu başlat':i===last?'Bitir':'İleri';

  if(m){
    /* panel sınıfını önce ver ki yüksekliği ölçebilelim */
    tip.className='tt sheet'+(el?'':' ctr');tip.style.left='';tip.style.top='';
    if(el){
      var b=el.getBoundingClientRect(),sheetTop=tip.getBoundingClientRect().top,
          avail=sheetTop-24, /* üstten 12 + panelden 12 boşluk */
          want=b.height<=avail?12+(avail-b.height)/2:12;
      scrollBy(0,b.top-want);
    }else scrollTo(0,0);
  }else if(el){
    var bb=el.getBoundingClientRect(),tall=bb.height>innerHeight*.7;
    el.scrollIntoView({block:tall?'start':'center'});
  }
  place();
  try{bNext.focus({preventScroll:true})}catch(e){}
}

function lockPage(on){
  if(mob.matches){
    /* mobilde kaydırma serbest; alt panelin altında kalmasın diye boşluk ekle */
    document.body.style.overflow='';
    document.body.style.paddingBottom=on?Math.round(innerHeight*.55)+'px':'';
  }else{
    document.body.style.overflow=on?'hidden':'';
    document.body.style.paddingBottom='';
  }
}

function start(){
  if(typeof PRES!=='undefined'&&PRES&&typeof exitPres==='function')exitPres();
  if(typeof stopPlay==='function')stopPlay();
  lockPage(true);
  root.classList.add('on');
  show(0);
}
function end(){
  i=-1;root.classList.remove('on');
  document.body.style.overflow='';document.body.style.paddingBottom='';
  try{localStorage.setItem(KEY,'1')}catch(e){}
  scrollTo(0,0);
  try{btn.focus({preventScroll:true})}catch(e){}
}
function next(){i===STEPS.length-1?end():show(i+1)}

root.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  var a=b.dataset.a;
  if(a==='next')next();
  else if(a==='prev')show(i-1);
  else if(a==='skip')end();
});
btn.addEventListener('click',start);

/* yana kaydırma hareketi: sola = ileri, sağa = geri (mobil panel üzerinde) */
var sx=0,sy=0;
tip.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY},{passive:true});
tip.addEventListener('touchend',function(e){
  if(!mob.matches||i<0)return;
  var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
  if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){dx<0?next():show(i-1)}
},{passive:true});

addEventListener('keydown',function(e){
  if(i<0)return;
  if(e.key==='ArrowRight'){e.preventDefault();next()}
  else if(e.key==='ArrowLeft'){e.preventDefault();show(i-1)}
  else if(e.key==='Escape'){e.preventDefault();end()}
});
addEventListener('resize',function(){if(i>=0){lockPage(true);place()}});
addEventListener('scroll',function(){
  if(i<0)return;
  root.classList.add('ns');clearTimeout(nsT);nsT=setTimeout(function(){root.classList.remove('ns')},140);
  place();
},{passive:true});
/* telefon ↔ masaüstü geçişinde (döndürme, pencere boyutu) adımı yeniden kur */
(mob.addEventListener?mob.addEventListener.bind(mob,'change'):mob.addListener.bind(mob))(function(){
  if(i>=0){lockPage(true);show(i)}
});

/* İlk ziyarette otomatik başlat */
var seen=null;
try{seen=localStorage.getItem(KEY)}catch(e){}
if(!seen)setTimeout(start,500);
})();
