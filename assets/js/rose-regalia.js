/* ROSE REGALIA — Tokyo seasonal observatory and restrained ornamental motion */
(() => {
 "use strict";
 const $=(s,r=document)=>r.querySelector(s);
 const hero=$(".hero-grand");
 if(!hero)return;
 const monthNames=["睦月","如月","彌生","卯月","皐月","水無月","文月","葉月","長月","神無月","霜月","師走"];
 const seasonFor=m=>m>=3&&m<=5?{name:"春",glyph:"✿",latin:"SPRING"}:m>=6&&m<=8?{name:"夏",glyph:"☼",latin:"SUMMER"}:m>=9&&m<=11?{name:"秋",glyph:"❧",latin:"AUTUMN"}:{name:"冬",glyph:"❄",latin:"WINTER"};
 const dateOptions={timeZone:"Asia/Tokyo",year:"numeric",month:"long",day:"numeric",weekday:"long"};
 const dateFormatter=new Intl.DateTimeFormat("ja-JP",dateOptions);
 const timeFormatter=new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
 const now=new Date();
 const tokyoMonth=Number(new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Tokyo",month:"numeric"}).format(now));
 const season=seasonFor(tokyoMonth);
 const seal=document.createElement("div");
 seal.className="hero-season-seal";
 seal.setAttribute("aria-label","本日の季節："+season.name);
 seal.innerHTML='<span>SEASONAL NOTE</span><strong></strong><small></small>';
 $("strong",seal).textContent=season.glyph;
 $("small",seal).textContent=season.latin;
 const visual=$(".hero-visual");
 if(visual)visual.append(seal);
 const front=document.createElement("section");
 front.className="frontispiece";
 front.setAttribute("aria-labelledby","frontispiece-title");
 front.innerHTML=
 '<div class="frontispiece-index"><p class="frontispiece-kicker">THE IMPERIAL CAPITAL · A GUIDE TO THE INSTITUTE</p>'+
 '<h2 id="frontispiece-title">學び舎の扉を、<em>ひとつずつ。</em></h2>'+
 '<nav class="frontispiece-links" aria-label="學院の主要案内">'+
 '<a class="frontispiece-link" href="#about"><b>01 / INTRODUCTION</b><strong>學院案内</strong><span>理念と學び舎について ↗</span></a>'+
 '<a class="frontispiece-link" href="#founder"><b>02 / FOUNDER</b><strong>創設者・六條杠葉</strong><span>人物と創設の記録 ↗</span></a>'+
 '<a class="frontispiece-link" href="#faculty"><b>03 / PERSONNEL</b><strong>教職員録</strong><span>教壇に立つ人々 ↗</span></a>'+
 '<a class="frontispiece-link" href="#archives"><b>04 / ARCHIVES</b><strong>史料室・作品文庫</strong><span>記録と文学をひらく ↗</span></a>'+
 '</nav></div>'+
 '<aside class="frontispiece-observatory" aria-label="帝都標準時・季節暦">'+
 '<span class="observatory-label">THE IMPERIAL ALMANAC · TOKYO STANDARD TIME</span>'+
 '<div class="observatory-season"><strong></strong><span aria-hidden="true"></span></div>'+
 '<div><div class="observatory-date"></div><p class="observatory-note">帝都の時刻と、今日の季節をお知らせします。</p></div>'+
 '<time class="observatory-time" aria-live="off"></time></aside>';
 const ribbon=$(".announcement-ribbon");
 if(ribbon)ribbon.insertAdjacentElement("afterend",front);
 const seasonName=$(".observatory-season strong",front);
 const seasonGlyph=$(".observatory-season span",front);
 seasonName.textContent=season.name;
 seasonGlyph.textContent=season.glyph;
 $(".observatory-date",front).textContent=dateFormatter.format(now)+" · "+monthNames[tokyoMonth-1];
 const clock=$(".observatory-time",front);
 const update=()=>{clock.textContent=timeFormatter.format(new Date());};
 update();
 window.setInterval(update,1000);
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(!reduced){
  const petals=document.createElement("div");
  petals.className="regalia-petals";
  petals.setAttribute("aria-hidden","true");
  for(let i=0;i<7;i++){const p=document.createElement("i");p.style.setProperty("--petal-index",String(i));petals.append(p);}
  hero.append(petals);
 }
})();
