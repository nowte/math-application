/* Üçgenin Yardımcı Elemanları – tanıtım turu (v5)
   - Ana turun içinde kısa bir ispat bölümü var
   - İlerleme çubuğu adımlar arasında akarak ilerler
   Kullanım: ana <script> bloğundan SONRA, </body> öncesine ekle:
   <script src="tour.js"></script>
*/
(function(){
'use strict';
var KEY='ucgen-tur-v1';
var $=function(s){return document.querySelector(s)};
var mob=matchMedia('(max-width:600px)');
var coarse=matchMedia('(pointer:coarse)');
var RM=matchMedia('(prefers-reduced-motion:reduce)');

/* ---------- Sayfa yardımcıları (ispat turu bunları kullanır) ---------- */
function click(sel){var e=$(sel);if(e)e.click();return !!e}
function tab(m){click('#tabs [data-m="'+m+'"]')}
function proofOpen(){return !!$('#facts .pf')}
function proofClose(){if(proofOpen())click('#facts [data-a="close"]')}
function proofPlaying(){var b=$('#facts [data-a="auto"]');return !!b&&/Durdur/.test(b.textContent)}
function proofStop(){if(proofPlaying())click('#facts [data-a="auto"]')}
function ensureProof(fresh){
  if(fresh||!proofOpen()){proofClose();tab('bis');click('#facts .why[data-pf="bis3"]')}
}
function isFixed(el){
  for(var n=el;n&&n!==document.documentElement;n=n.parentElement){
    if(getComputedStyle(n).position==='fixed')return true;
  }
  return false;
}

/* ---------- Adımlar (xm: sadece mobilde metin, a: adım açılırken çalışan eylem, up: mobilde panel üstte) ---------- */
var STEPS=[
 {t:'Hoş geldin ',
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
  xm:'Köşeleri oynattıkça formüller ve ölçülen değerler değişir. Eşit çıkan değerler özelliğin her üçgende geçerli olduğunu gösterir. “Neden böyle?” ile ispatı adım adım izle. Kaydırarak hepsini görebilirsin.',
  a:function(){proofStop();proofClose()}},
 {s:'#facts',t:'İspatı adım adım izle',up:1,
  x:'İşte örnek bir ispat. “Oynat” adımları kendiliğinden ilerletir; çubuk bir sonraki adıma doğru akarak dolar. Önceki ve Sonraki düğmeleriyle kendin de geçebilirsin, Kapat ✕ ispatı kapatır.',
  xm:'İşte örnek bir ispat. “Oynat” adımları kendiliğinden ilerletir; çubuk akarak dolar. Önceki ve Sonraki ile kendin de geçebilirsin.',
  a:function(){proofStop();ensureProof(true);click('#facts [data-a="auto"]')}},
 {s:'#tourBtn',t:'Turu istediğin zaman aç',
  x:'Bu düğmeyle turu yeniden izleyebilirsin. İyi keşifler!',
  xm:'Bu düğmeyle turu yeniden izleyebilirsin. İyi keşifler!',
  a:function(){proofStop();proofClose();tab('bis')}}
];

/* ---------- Stil ---------- */
var EZ='cubic-bezier(.4,0,.2,1)';
var css=
/* ortak */
'.tour{position:fixed;inset:0;z-index:1000;display:none;opacity:0;transition:opacity .35s ease;-webkit-tap-highlight-color:transparent}'+
'.tour.on{display:block}'+
'.tour.vis{opacity:1}'+
'.tour .tp{position:fixed;background:rgba(0,0,0,.34);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px)}'+
'.tour .tr{position:fixed;border-radius:14px;box-shadow:0 0 0 2px var(--blue),0 0 26px color-mix(in srgb,var(--blue) 50%,transparent);transition:opacity .25s ease;pointer-events:none}'+
'.tour .tt{position:fixed;width:360px;max-width:calc(100vw - 24px);background:var(--card);color:var(--ink);border-radius:20px;padding:18px 18px 14px;box-shadow:0 14px 44px rgba(0,0,0,.38);transition:left .55s '+EZ+',top .55s '+EZ+',height .38s '+EZ+',opacity .2s ease}'+
'.tour .tt.sw{opacity:0}'+
'.tour .tc{transition:opacity .18s ease,transform .18s ease}'+
'.tour .tc.sw{opacity:0;transform:translateY(8px)}'+
/* animasyonlu ilerleme çubuğu */
'.tour .td{position:relative;height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin-bottom:14px}'+
'.tour .td b{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:3px;background:var(--blue);transition:width .6s '+EZ+'}'+
'.tour .td u{position:absolute;top:0;bottom:0;width:2px;margin-left:-1px;background:var(--card)}'+
'.tour h2{margin:0 0 6px;font-size:19px;letter-spacing:-.01em;font-weight:700}'+
'.tour p{margin:0 0 16px;font-size:14.5px;line-height:1.55;color:var(--mute)}'+
'.tour .tb{display:flex;align-items:center;gap:8px}'+
'.tour .tb .sp{flex:1}'+
'.tour .tb button{font:inherit;font-size:14px;border-radius:980px;padding:9px 16px;min-height:40px;cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--ink);touch-action:manipulation;transition:transform .12s ease,opacity .12s ease}'+
'.tour .tb button:active{transform:scale(.96)}'+
'.tour .tb button.nx{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600}'+
'.tour .tb button.sk{border:0;background:none;color:var(--mute);padding-left:4px;padding-right:4px}'+
'.tour .tb button:focus-visible{outline:2px solid var(--blue);outline-offset:2px}'+
'.tour .grab,.tour .cnt{display:none}'+
/* karşılama kartı (masaüstü) */
'.tour .tt.ctr{text-align:center}'+
'.tour .tt.ctr h2{font-size:24px}'+
/* ===== MOBİL: alttan açılan panel ===== */
'.tour .tt.sheet{left:8px;right:8px;width:auto;max-width:none;top:auto;bottom:calc(8px + env(safe-area-inset-bottom,0px));border-radius:24px;padding:24px 16px 14px;max-height:50vh;max-height:50dvh;overflow-y:auto;overscroll-behavior:contain;transition:height .38s '+EZ+',opacity .2s ease;box-shadow:0 -6px 40px rgba(0,0,0,.42);text-align:left}'+
/* hedef ekranın altındaki sabit panelse, panel üstte açılır */
'.tour .tt.sheet.up{top:calc(8px + env(safe-area-inset-top,0px));bottom:auto;box-shadow:0 6px 40px rgba(0,0,0,.42)}'+
'.tour .tt.sheet .grab{display:block;position:absolute;top:8px;left:50%;width:40px;height:4px;margin-left:-20px;border-radius:2px;background:var(--line)}'+
'.tour .tt.sheet .td{height:4px;margin:0 0 10px}'+
'.tour .tt.sheet .cnt{display:block;font-size:12.5px;font-weight:600;color:var(--blue);margin:0 0 4px}'+
'.tour .tt.sheet h2{font-size:20px;padding-right:64px}'+
'.tour .tt.sheet p{font-size:15px;margin-bottom:14px}'+
'.tour .tt.sheet .tb{gap:10px}'+
'.tour .tt.sheet .tb .sp{display:none}'+
'.tour .tt.sheet .tb button{min-height:50px;font-size:15.5px;flex:1}'+
'.tour .tt.sheet .tb button.pv{flex:0 0 34%}'+
'.tour .tt.sheet .tb button.sk{position:absolute;top:14px;right:8px;flex:none;min-height:44px;padding:0 14px;font-size:14px}'+
/* mobil + ortada (karşılama) */
'.tour .tt.ctr.sheet{left:50%;right:auto;top:50%;bottom:auto;transform:translate(-50%,-50%);width:calc(100vw - 28px);max-height:calc(100vh - 28px);padding:26px 18px 16px;text-align:center}'+
'.tour .tt.ctr.sheet .grab,.tour .tt.ctr.sheet .td,.tour .tt.ctr.sheet .cnt{display:none}'+
'.tour .tt.ctr.sheet h2{font-size:26px;padding-right:0}'+
'.tour .tt.ctr.sheet .tb{flex-direction:column}'+
'.tour .tt.ctr.sheet .tb button.nx{order:1;width:100%;flex:none}'+
'.tour .tt.ctr.sheet .tb button.sk{position:static;order:2;width:100%;flex:none;padding:0}'+
/* başlık ile üst butonlar çakışmasın */
'@media(min-width:601px){body:not(.pres) h1{padding-right:400px!important}}'+
'@media(max-width:600px){body:not(.pres) h1{padding-right:104px!important}}'+
'@media(prefers-reduced-motion:reduce){.tour,.tour *{transition:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ---------- DOM ---------- */
var root=document.createElement('div');
root.className='tour';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','tourT');
root.innerHTML='<div class="tp"></div><div class="tp"></div><div class="tp"></div><div class="tp"></div><div class="tr"></div>'+
 '<div class="tt"><div class="grab"></div><div class="td"></div>'+
 '<div class="tc"><div class="cnt" id="tourC"></div><h2 id="tourT"></h2><p id="tourX"></p></div>'+
 '<div class="tb"><button type="button" class="sk" data-a="skip">Atla</button><span class="sp"></span>'+
 '<button type="button" class="pv" data-a="prev">Geri</button><button type="button" class="nx" data-a="next"></button></div></div>';
document.body.appendChild(root);

var tps=[].slice.call(root.querySelectorAll('.tp')),ring=root.querySelector('.tr'),tip=root.querySelector('.tt'),
    tc=root.querySelector('.tc'),bar=root.querySelector('.td'),tT=$('#tourT'),tX=$('#tourX'),cnt=$('#tourC'),
    bPrev=root.querySelector('.pv'),bNext=root.querySelector('.nx'),bSkip=root.querySelector('.sk'),fill=null;

var btn=document.createElement('button');
btn.className='theme';btn.id='tourBtn';btn.type='button';btn.setAttribute('aria-label','Turu başlat');
btn.innerHTML='<span aria-hidden="true">?</span><span class="tl">&nbsp;Tur</span>';
var acts=$('.acts'),themeBtn=$('#theme');
if(acts)acts.insertBefore(btn,themeBtn||null);

/* ---------- Yardımcılar ---------- */
var S=STEPS;
var i=-1,anim=0,raf=0,cur=null,swT=0,mT=0,endT=0,ro=null;
var ease=function(k){return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2};
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function setBox(e,l,t,w,h){e.style.left=Math.round(l)+'px';e.style.top=Math.round(t)+'px';e.style.width=Math.max(0,Math.round(w))+'px';e.style.height=Math.max(0,Math.round(h))+'px'}
function centerBox(){var x=innerWidth/2,y=innerHeight/2;return{l:x,t:y,r:x,b:y,none:1}}

/* ilerleme çubuğu: dolgu genişliği CSS geçişiyle akıcı büyür */
function buildBar(){
  var h='<b></b>';
  for(var k=1;k<S.length;k++)h+='<u style="left:'+(k/S.length*100)+'%"></u>';
  bar.innerHTML=h;fill=bar.firstChild;
}
function setBar(snap){
  if(!fill)return;
  var pct=((i+1)/S.length*100)+'%';
  if(RM.matches){fill.style.width=pct;return}
  if(snap){fill.style.transition='none';fill.style.width='0%';void fill.offsetWidth;fill.style.transition=''}
  fill.style.width=pct;
}

/* hedef elemanın (dy kadar kaydırılmış) dolgulu, ekrana sığdırılmış kutusu */
function rectOf(el,dy){
  var b=el.getBoundingClientRect(),p=mob.matches?6:8,vw=innerWidth,vh=innerHeight;
  var l=Math.max(0,b.left-p),t=Math.max(0,b.top-p-dy),r=Math.min(vw,b.right+p),bt=Math.min(vh,b.bottom+p-dy);
  return{l:l,t:t,r:Math.max(l,r),b:Math.max(t,bt)};
}
function paint(q){
  var vw=innerWidth,vh=innerHeight;
  if(q.full){
    setBox(tps[0],0,0,vw,vh);setBox(tps[1],0,0,0,0);setBox(tps[2],0,0,0,0);setBox(tps[3],0,0,0,0);
    ring.style.opacity=0;return;
  }
  setBox(tps[0],0,0,vw,q.t);
  setBox(tps[1],0,q.b,vw,vh-q.b);
  setBox(tps[2],0,q.t,q.l,q.b-q.t);
  setBox(tps[3],q.r,q.t,vw-q.r,q.b-q.t);
  setBox(ring,q.l,q.t,q.r-q.l,q.b-q.t);
  ring.style.opacity=q.none?0:1;
}
function tipPos(E,th,tw){
  var vw=innerWidth,vh=innerHeight,g=14,L,T;
  if(E.none)return{L:(vw-tw)/2,T:(vh-th)/2};
  var cx=(E.l+E.r)/2;
  if(E.b+g+th<=vh-12){T=E.b+g;L=cx-tw/2}
  else if(E.t-g-th>=12){T=E.t-g-th;L=cx-tw/2}
  else if(E.r+g+tw<=vw-12){L=E.r+g;T=E.t}
  else if(E.l-g-tw>=12){L=E.l-g-tw;T=E.t}
  else{L=cx-tw/2;T=vh-th-16}
  return{L:clamp(L,12,vw-tw-12),T:clamp(T,12,vh-th-12)};
}

/* anlık yerleştirme (yeniden boyutlandırma, kullanıcı kaydırması, içerik değişimi) */
function place(){
  if(i<0||anim)return;
  var s=S[i],el=s.s&&$(s.s),E=el?rectOf(el,0):centerBox();
  paint(E.none?{full:1}:E);cur=E;
  if(!mob.matches){
    var p=tipPos(E,tip.offsetHeight,tip.offsetWidth);
    tip.style.left=p.L+'px';tip.style.top=p.T+'px';
  }
}

/* sayfa kaydırması + vurgu kutusunu birlikte, aynı eğriyle akıt */
function run(Sx,el,y0,y1,dur){
  cancelAnimationFrame(raf);anim=1;
  var t0=performance.now();
  function f(now){
    var k=Math.min(1,(now-t0)/dur),e=ease(k);
    scrollTo(0,y0+(y1-y0)*e);
    var E=el?rectOf(el,0):centerBox();
    paint({l:Sx.l+(E.l-Sx.l)*e,t:Sx.t+(E.t-Sx.t)*e,r:Sx.r+(E.r-Sx.r)*e,b:Sx.b+(E.b-Sx.b)*e,none:E.none});
    if(k<1)raf=requestAnimationFrame(f);
    else{anim=0;cur=E;if(E.none)paint({full:1})}
  }
  raf=requestAnimationFrame(f);
}
function settle(){if(!anim)return;cancelAnimationFrame(raf);anim=0;place()}

/* ---------- Adım gösterimi ---------- */
function show(n,first,keep){
  clearTimeout(swT);cancelAnimationFrame(raf);anim=0;
  i=clamp(n,0,S.length-1);
  var s=S[i],m=mob.matches,isCtr=!s.s,wasCtr=tip.classList.contains('ctr');
  var whole=m&&!first&&isCtr!==wasCtr;
  setBar(first&&!keep);
  if(first||RM.matches){swap(s,isCtr,m,first,false);return}
  (whole?tip:tc).classList.add('sw');
  swT=setTimeout(function(){swap(s,isCtr,m,false,whole)},150);
}

function swap(s,isCtr,m,first,whole){
  /* adıma özel eylem (sekme değiştir, ispat aç…) hedef ölçülmeden önce çalışır */
  if(s.a){try{s.a()}catch(e){}}
  var el=s.s&&$(s.s);
  var last=S.length-1,txt=m&&s.xm?s.xm:s.x,up=m&&s.up&&!isCtr;
  tT.textContent=s.t;
  tX.textContent=typeof txt==='function'?txt():txt;
  cnt.textContent='Adım '+(i+1)+' / '+S.length;
  bPrev.style.display=i===0?'none':'';
  bSkip.style.display=i===last?'none':'';
  bNext.textContent=i===0?'Turu başlat':i===last?'Bitir':'İleri';

  /* kart yüksekliği: eski → yeni yumuşak geçiş */
  var h0=tip.offsetHeight;
  tip.className='tt'+(m?' sheet':'')+(isCtr?' ctr':'')+(up?' up':'');
  tip.style.height='';tip.style.overflow='';
  var h1=tip.offsetHeight,sheetTop=m?tip.getBoundingClientRect().top:0;
  tc.classList.remove('sw');
  clearTimeout(mT);
  if(!first&&!whole&&!RM.matches&&Math.abs(h1-h0)>1){
    tip.style.overflow='hidden';tip.style.height=h0+'px';void tip.offsetHeight;tip.style.height=h1+'px';
    mT=setTimeout(function(){tip.style.height='';tip.style.overflow=''},420);
  }

  /* hedef kaydırma konumu (sabit konumlu panelde sayfa kaydırılmaz) */
  var y0=window.pageYOffset,y1=el?y0:0,vh=innerHeight;
  if(el&&!isFixed(el)){
    var b=el.getBoundingClientRect(),want;
    if(m){var avail=sheetTop-24;want=b.height<=avail?12+(avail-b.height)/2:12}
    else want=b.height>vh*.7?12:(vh-b.height)/2;
    y1=clamp(y0+b.top-want,0,Math.max(0,document.documentElement.scrollHeight-vh));
  }
  var E1=el?rectOf(el,y1-y0):centerBox();

  /* masaüstü: kartı hedefin yanına kaydır (CSS geçişi) */
  if(!m){
    var pp=tipPos(E1,h1,tip.offsetWidth);
    if(first){tip.style.transition='none'}
    tip.style.left=pp.L+'px';tip.style.top=pp.T+'px';
    if(first){void tip.offsetHeight;tip.style.transition=''}
  }else{tip.style.left='';tip.style.top=''}

  if(first||RM.matches){
    scrollTo(0,y1);
    var E=el?rectOf(el,0):centerBox();
    paint(E.none?{full:1}:E);cur=E;
  }else run(cur||centerBox(),el,y0,y1,620);
  try{bNext.focus({preventScroll:true})}catch(e){}
}

function lockPage(on){
  if(mob.matches){
    document.body.style.overflow='';
    document.body.style.paddingBottom=on?Math.round(innerHeight*.55)+'px':'';
  }else{
    document.body.style.overflow=on?'hidden':'';
    document.body.style.paddingBottom='';
  }
}

function start(){
  if(i>=0)return;
  if(typeof PRES!=='undefined'&&PRES&&typeof exitPres==='function')exitPres();
  if(typeof stopPlay==='function')stopPlay();
  clearTimeout(endT);
  buildBar();
  lockPage(true);cur=null;
  tip.classList.remove('sw');tc.classList.remove('sw');
  root.classList.add('on');void root.offsetHeight;root.classList.add('vis');
  /* ispat paneli değişince vurgu kutusunu yeniden hizala */
  if(typeof ResizeObserver!=='undefined'){
    ro=new ResizeObserver(function(){if(i>=0)place()});
    var fc=$('#facts');if(fc)ro.observe(fc);
  }
  show(0,true);
}
function end(){
  clearTimeout(swT);cancelAnimationFrame(raf);anim=0;
  i=-1;
  if(ro){ro.disconnect();ro=null}
  root.classList.remove('vis');
  try{localStorage.setItem(KEY,'1')}catch(e){}
  try{proofStop();proofClose();tab('bis')}catch(e){}
  try{scrollTo({top:0,behavior:RM.matches?'auto':'smooth'})}catch(e){scrollTo(0,0)}
  endT=setTimeout(function(){
    root.classList.remove('on');
    document.body.style.overflow='';document.body.style.paddingBottom='';
  },RM.matches?0:360);
  try{btn.focus({preventScroll:true})}catch(e){}
}
function next(){i===S.length-1?end():show(i+1)}

root.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b||i<0)return;
  var a=b.dataset.a;
  if(a==='next')next();
  else if(a==='prev')show(i-1);
  else if(a==='skip')end();
});
btn.addEventListener('click',start);

/* yana kaydırma: sola = ileri, sağa = geri (mobil panel üzerinde) */
var sx=0,sy=0;
tip.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY},{passive:true});
tip.addEventListener('touchend',function(e){
  if(!mob.matches||i<0)return;
  var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
  if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){dx<0?next():show(i-1)}
},{passive:true});

/* yakalama aşamasında dinle: tur açıkken ispatın kendi ok tuşları tetiklenmesin */
addEventListener('keydown',function(e){
  if(i<0)return;
  var k=e.key;
  if(k==='ArrowRight'||k==='ArrowLeft'||k==='Escape'){
    e.preventDefault();e.stopImmediatePropagation();
    if(k==='ArrowRight')next();else if(k==='ArrowLeft')show(i-1);else end();
  }
},true);
/* kullanıcı sayfayı kendisi kaydırmaya başlarsa animasyonu bırak */
addEventListener('wheel',settle,{passive:true});
addEventListener('touchmove',function(e){if(anim&&!e.target.closest('.tt'))settle()},{passive:true});
addEventListener('resize',function(){if(i>=0){lockPage(true);place()}});
addEventListener('scroll',function(){if(i>=0&&!anim)place()},{passive:true});
/* telefon ↔ masaüstü geçişinde adımı yeniden kur */
(mob.addEventListener?mob.addEventListener.bind(mob,'change'):mob.addListener.bind(mob))(function(){
  if(i>=0){lockPage(true);cur=null;show(i,true,true)}
});

/* İlk ziyarette otomatik başlat */
var seen=null;
try{seen=localStorage.getItem(KEY)}catch(e){}
if(!seen)setTimeout(start,500);
})();
