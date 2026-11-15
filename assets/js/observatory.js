/* IMPERIAL INSTITUTE — universal observatory, search and seasonal clock */
(() => {
  "use strict";
  if (document.documentElement.dataset.instituteEnhancements === "ready") return;
  document.documentElement.dataset.instituteEnhancements = "ready";
  const $ = (s, r=document) => r.querySelector(s);
  const links = [
    ["首頁","index.html","トップページ・學院の入口","首頁 首頁 学院 帝都女學院"],
    ["學院案内","index.html#about","學院の理念と教育環境","理念 教育思想"],
    ["創設者・六條杠葉","index.html#founder","創設者の人物記録","六條 杠葉 創設者"],
    ["教育課程","curriculum.html","四つの学問領域","言葉と文学 歴史と思想 芸術と教養 自然と学術"],
    ["教職員録","index.html#faculty","教壇に立つ教職員の記録","中原 壱葉 中原 八雲 教師"],
    ["學院生活","index.html#life","學び舎の日々","生活 授業 学生"],
    ["校内案内","index.html#campus","建物と庭園をめぐる","施設 図書館 講堂 中庭 藝術 音楽"],
    ["史料室","index.html#archives","學院の記録と閲覧者証","史料 資料 アーカイブ"],
    ["作品文庫","literature.html","學院ゆかりの文学作品","春を待つ仁 circus 日ノ本ノ怪談 文学"],
    ["春燈","haruakari.html","六條杠葉と有栖川劉ノ介の読み物","春燈 杠葉 劉ノ介"],
    ["封緘資料","index.html#sealed-button","封緘された特別資料","封緘 封蝋 隠し資料"],
    ["帝國教育廳","https://8fgb66gmt2-stack.github.io/-Ministry-of-Education-of-the-Empire-of-Hinomoto/","帝國の教育制度を司る行政機關","教育廳 帝國 教育制度"]
  ];
  const root=document.documentElement;
  const month=Number(new Intl.DateTimeFormat("en",{timeZone:"Asia/Tokyo",month:"numeric"}).format(new Date()));
  root.dataset.season=month>=3&&month<=5?"spring":month>=6&&month<=8?"summer":month>=9&&month<=11?"autumn":"winter";
  const updateClock=()=>{
    const now=new Date();
    const time=new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);
    const date=new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(now);
    document.querySelectorAll("#imperial-clock,.observatory-clock-time").forEach(el=>el.textContent=time);
    document.querySelectorAll(".observatory-clock-date").forEach(el=>el.textContent=date);
  };
  updateClock(); window.setInterval(updateClock,1000);
  const dock=document.createElement("aside");dock.className="observatory-dock";dock.setAttribute("aria-label","學院浮遊操作盤");
  dock.innerHTML='<button class="observatory-dock-toggle" type="button" aria-expanded="false" aria-controls="observatory-dock-links" aria-label="浮遊操作盤を開く"><span aria-hidden="true">✥</span><small>操作盤</small></button><nav id="observatory-dock-links" class="observatory-dock-links" aria-label="學院への近道" hidden><a href="index.html">首頁</a><button type="button" data-open-search>総合検索</button><a href="index.html#campus">校内案内</a><a href="curriculum.html">教育課程</a><a href="index.html#faculty">教職員録</a><a href="literature.html">作品文庫</a><a href="index.html#archives">史料室</a><button type="button" data-top>頁の先頭へ</button></nav>';
  document.body.append(dock);
  const toggle=$(".observatory-dock-toggle",dock),dockLinks=$("#observatory-dock-links",dock);
  toggle.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")!=="true";toggle.setAttribute("aria-expanded",String(open));dockLinks.hidden=!open;});
  $("[data-top]",dock).addEventListener("click",()=>window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
  const dialog=document.createElement("dialog");dialog.className="observatory-search";dialog.setAttribute("aria-labelledby","observatory-search-title");
  dialog.innerHTML='<form method="dialog" class="observatory-search-head"><div><span class="observatory-kicker">THE IMPERIAL INDEX</span><h2 id="observatory-search-title">學院総合索引</h2><p>人物・教育・施設・史料・作品を横断して探します。</p></div><button class="observatory-close" aria-label="閉じる">×</button></form><label class="observatory-search-label" for="observatory-search-input">検索語</label><input id="observatory-search-input" type="search" placeholder="例：六條杠葉、図書館、文学…" autocomplete="off"><p class="observatory-search-hint">Enterで先頭の資料を開く · Escで閉じる</p><div class="observatory-search-results" aria-live="polite"></div><footer>日ノ本帝國國立帝都女學院　·　総合索引</footer>';
  document.body.append(dialog);
  const input=$("#observatory-search-input",dialog),results=$(".observatory-search-results",dialog);
  const openSearch=()=>{if(!dialog.open)dialog.showModal();input.focus();render("");};
  const render=q=>{
    const query=q.trim().toLocaleLowerCase();
    const matches=links.filter(x=>(x[0]+" "+x[2]+" "+x[3]).toLocaleLowerCase().includes(query)).slice(0,12);
    results.replaceChildren();
    if(!query){const p=document.createElement("p");p.className="observatory-empty";p.textContent="探したい人物名・学問領域・施設名・作品名を入力してください。";results.append(p);return;}
    if(!matches.length){const p=document.createElement("p");p.className="observatory-empty";p.textContent="該当する資料は見つかりませんでした。別の言葉でもう一度お探しください。";results.append(p);return;}
    matches.forEach((item,i)=>{const a=document.createElement("a");a.className="observatory-result";a.href=item[1];const n=document.createElement("span");n.textContent=String(i+1).padStart(2,"0");const box=document.createElement("span");const strong=document.createElement("strong");strong.textContent=item[0];const small=document.createElement("small");small.textContent=item[2];box.append(strong,small);a.append(n,box);results.append(a);});
  };
  input.addEventListener("input",()=>render(input.value));
  input.addEventListener("keydown",e=>{if(e.key==="Enter"){const first=$(".observatory-result",results);if(first){e.preventDefault();location.href=first.href;}}});
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  document.querySelectorAll("[data-open-search]").forEach(b=>b.addEventListener("click",openSearch));
  const searchTrigger=document.createElement("button");searchTrigger.type="button";searchTrigger.className="observatory-search-trigger";searchTrigger.textContent="⌕　総合検索";searchTrigger.addEventListener("click",openSearch);
  const nav=$(".global-nav");if(nav){const holder=document.createElement("span");holder.className="observatory-nav-search";holder.append(searchTrigger);nav.append(holder);}
  document.addEventListener("keydown",e=>{if((e.key==="k"&&(e.metaKey||e.ctrlKey))||(!e.metaKey&&!e.ctrlKey&&!e.altKey&&e.key==="/")){e.preventDefault();openSearch();}});
  // Keep the shared navigation useful when viewed from a subpage.
  document.querySelectorAll(".global-nav a[href^='#']").forEach(a=>{const id=a.getAttribute("href").slice(1);if(!document.getElementById(id))a.href="index.html#"+id;});
  // A compact, accessible seasonal annotation; existing page content remains untouched.
  const seasonNames={spring:"春の候 · 桜と春霞",summer:"夏の候 · 藤と青葉",autumn:"秋の候 · 紅葉と古金",winter:"冬の候 · 雪と乳白"};
  const seasonMark={spring:"✿",summer:"❀",autumn:"❧",winter:"❄"};
  const ribbon=document.createElement("div");ribbon.className="observatory-season";ribbon.setAttribute("aria-label","季節の意匠");ribbon.innerHTML='<span aria-hidden="true"></span><span></span>';
  ribbon.children[0].textContent=seasonMark[root.dataset.season];ribbon.children[1].textContent=seasonNames[root.dataset.season];document.body.append(ribbon);
})();
