/* 帝都女學院・學院公報 / progressive enhancement */
(() => {
  "use strict";
  const grid = document.getElementById("bulletin-grid");
  if (!grid) return;
  const records = [
    {id:"B-0001",title:"帝都女學院 公式ウェブサイト開設のご案内",category:"general",categoryLabel:"學院案内",summary:"日ノ本帝國國立帝都女學院の公式ウェブサイトを公開いたしました。",body:"日ノ本帝國國立帝都女學院の公式ウェブサイトを開設いたしました。學院案内、教育課程、教職員録、施設案内、史料室および作品文庫を通じ、本學院の理念と記録をご案内いたします。\n\n本頁は公開案内を整理する公報目録です。",href:"index.html",keywords:"公式 開設 学院案内 ホームページ"},
    {id:"B-0002",title:"デジタル資料館 公開目録のご案内",category:"archive",categoryLabel:"史料・文庫",summary:"學院に連なる人物、理念、施設、文学資料を主題から辿る公開目録。",body:"帝都女學院デジタル資料館では、學院の理念、創設者・六條杠葉、教職員、學び舎の施設、収蔵作品などを公開目録として整理しています。資料カードから関連する記録へお進みください。",href:"index.html#archives",keywords:"史料室 デジタル資料館 アーカイブ 目録 記録"},
    {id:"B-0003",title:"作品文庫・収蔵作品の閲覧について",category:"culture",categoryLabel:"文化・刊行",summary:"六條杠葉『春を待つ仁』、中原壱葉『circus』、中原八雲『日ノ本ノ怪談』。",body:"作品文庫では、六條杠葉『春を待つ仁』、中原壱葉『circus』、中原八雲『日ノ本ノ怪談』を収蔵作品として公開しています。書誌情報、本文、作品研究の頁を通じてご覧いただけます。",href:"literature.html",keywords:"文学 作品 文庫 春を待つ仁 circus 怪談"},
    {id:"B-0004",title:"教育課程・學びの四領域",category:"education",categoryLabel:"教育・學び",summary:"言葉と文学、歴史と思想、芸術と教養、自然と学術。",body:"帝都女學院の教育課程は、言葉と文学、歴史と思想、芸術と教養、自然と学術の四領域を中心に構成されています。各領域の紹介は教育課程の頁に掲載しています。",href:"curriculum.html",keywords:"教育課程 学習 カリキュラム 四領域"},
    {id:"B-0005",title:"創設理念「知を愛し、己の言葉を持つ。」",category:"education",categoryLabel:"教育・學び",summary:"知性を尊び、個性を育み、自ら問いを立てる學びの姿勢。",body:"本學院は、知識を授けるだけでなく、ひとりひとりが自ら問いを立て、自らの言葉を見つけるための學び舎を志します。身分や性別によって知の門を閉ざすことなく、それぞれの可能性を尊びます。",href:"index.html#philosophy",keywords:"理念 自由 知性 個性 六條杠葉"},
    {id:"B-0006",title:"學院の施設・校内案内",category:"general",categoryLabel:"學院案内",summary:"図書館、講堂、中庭、研究室、藝術教室など、學びを支える空間。",body:"學院案内では、校内の各施設と風景圖版をご紹介しています。施設名を選び、學び舎の構造や日々の活動をお読みください。",href:"index.html#campus",keywords:"校舎 施設 図書館 講堂 中庭 研究室"},
    {id:"B-0007",title:"創設者・六條杠葉 人物記録",category:"archive",categoryLabel:"史料・文庫",summary:"帝國大學初の女性學生、詩歌人、帝都女學院の創設者。",body:"六條杠葉の人物記録には、出身、學院創設の理念、文学活動、教育史上の歩みを収めています。人物記録と関連作品は相互に参照できます。",href:"index.html#founder",keywords:"六條 杠葉 創設者 人物 伝記"},
    {id:"B-0008",title:"創設者夫妻の逸話『春燈』",category:"culture",categoryLabel:"文化・刊行",summary:"六條杠葉と有栖川劉ノ介。春の雨の日に交わされた言葉と暮らし。",body:"『春燈』は、創設者夫妻・六條杠葉と有栖川劉ノ介のある一日を描く読み物です。互いの自由を尊び、同じ家へ帰る二人の暮らしを収めています。",href:"haruakari.html",keywords:"春燈 逸話 夫妻 有栖川 劉ノ介"},
    {id:"B-0009",title:"公報目録の閲覧・栞機能について",category:"general",categoryLabel:"學院案内",summary:"資料を栞として保存し、次回の閲覧時に分類から探せます。",body:"公報目録の栞機能は、このブラウザの保存領域に資料番号を記録します。記録は本端末・本ブラウザ内に保存され、学院のサーバーへ送信されません。ブラウザの保存データを消去すると、栞も失われます。",href:"#catalog-title",keywords:"栞 保存 お気に入り ブラウザ ローカル"}
  ];
  const categoryButtons = [...document.querySelectorAll("[data-bulletin-filter]")];
  const search = document.getElementById("bulletin-search");
  const count = document.getElementById("bulletin-result-count");
  const total = document.getElementById("bulletin-total");
  const empty = document.getElementById("bulletin-empty");
  const reset = document.getElementById("bulletin-reset");
  const storageKey = "hinomoto-institute-bulletin-bookmarks-v1";
  let category = "all";
  let saved = [];
  try { const value = JSON.parse(localStorage.getItem(storageKey) || "[]"); if(Array.isArray(value)) saved = [...new Set(value.filter(id=>records.some(r=>r.id===id)))]; } catch (_) {}
  if(total) total.textContent=String(records.length).padStart(2,"0");
  const dialog=document.getElementById("bulletin-dialog");
  const dialogTitle=document.getElementById("bulletin-dialog-title");
  const dialogMeta=document.getElementById("bulletin-dialog-meta");
  const dialogNumber=document.getElementById("bulletin-dialog-number");
  const dialogBody=document.getElementById("bulletin-dialog-body");
  const dialogLink=document.getElementById("bulletin-dialog-link");
  const copyButton=document.getElementById("bulletin-dialog-copy");
  const printButton=document.getElementById("bulletin-dialog-print");
  const copyStatus=document.getElementById("bulletin-copy-status");
  let activeRecord=null;
  const saveBookmarks=()=>{try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch(_){}};
  const makeCard=record=>{
    const article=document.createElement("article");article.className="bulletin-card";article.dataset.id=record.id;
    const top=document.createElement("div");top.className="bulletin-card-top";
    const badge=document.createElement("span");badge.className="bulletin-category";badge.textContent=record.categoryLabel;
    const number=document.createElement("span");number.textContent=record.id;top.append(badge,number);
    const title=document.createElement("h3");title.textContent=record.title;
    const summary=document.createElement("p");summary.textContent=record.summary;
    const bottom=document.createElement("div");bottom.className="bulletin-card-bottom";
    const open=document.createElement("button");open.type="button";open.className="bulletin-open";open.textContent="資料を閲覧　↗";open.addEventListener("click",()=>openRecord(record));
    const bookmark=document.createElement("button");bookmark.type="button";bookmark.className="bulletin-save";bookmark.textContent=saved.includes(record.id)?"★":"☆";bookmark.setAttribute("aria-label",saved.includes(record.id)?"栞を解除":"栞を挟む");bookmark.setAttribute("aria-pressed",String(saved.includes(record.id)));bookmark.addEventListener("click",()=>{saved=saved.includes(record.id)?saved.filter(id=>id!==record.id):[record.id,...saved];saveBookmarks();render();});
    bottom.append(open,bookmark);article.append(top,title,summary,bottom);return article;
  };
  const render=()=>{
    const query=(search?.value||"").trim().toLocaleLowerCase("ja");
    const matches=records.filter(record=>{
      const matchCategory=category==="all"||(category==="saved"?saved.includes(record.id):record.category===category);
      const text=[record.id,record.title,record.categoryLabel,record.summary,record.body,record.keywords].join(" ").toLocaleLowerCase("ja");
      return matchCategory&&(!query||text.includes(query));
    });
    grid.replaceChildren(...matches.map(makeCard));
    if(count)count.textContent="検索結果　"+String(matches.length).padStart(2,"0")+" / "+String(records.length).padStart(2,"0")+"件";
    if(empty)empty.hidden=matches.length!==0;
  };
  const openRecord=record=>{
    activeRecord=record;dialogTitle.textContent=record.title;dialogMeta.textContent=record.categoryLabel+"　·　OFFICIAL RECORD";dialogNumber.textContent="REGISTER No. "+record.id;
    dialogBody.textContent=record.body;dialogLink.href=record.href;copyStatus.textContent="";
    if(dialog.showModal)dialog.showModal();else location.href=record.href;
    history.replaceState(null,"","#"+record.id);
  };
  categoryButtons.forEach(button=>button.addEventListener("click",()=>{category=button.dataset.bulletinFilter||"all";categoryButtons.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));render();}));
  search?.addEventListener("input",render);
  reset?.addEventListener("click",()=>{if(search)search.value="";category="all";categoryButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.bulletinFilter==="all")));render();search?.focus();});
  document.addEventListener("keydown",event=>{if(event.key==="/"&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)){event.preventDefault();search?.focus();}});
  document.getElementById("bulletin-dialog-close")?.addEventListener("click",()=>dialog.close());
  dialog?.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
  copyButton?.addEventListener("click",async()=>{if(!activeRecord)return;const url=new URL(location.href);url.hash=activeRecord.id;try{await navigator.clipboard.writeText(url.href);copyStatus.textContent="資料へのリンクをコピーしました。";}catch(_){copyStatus.textContent="コピーできませんでした。ブラウザのアドレス欄から資料番号を含むURLをご利用ください。";}});
  printButton?.addEventListener("click",()=>window.print());
  const hash=decodeURIComponent(location.hash.slice(1));const initial=records.find(record=>record.id===hash);if(initial)openRecord(initial);else render();
})();
