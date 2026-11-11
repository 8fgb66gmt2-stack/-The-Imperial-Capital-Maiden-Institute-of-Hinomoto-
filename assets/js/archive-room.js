/* IMPERIAL ARCHIVE ROOM — searchable, connected, keyboard-operable catalogue */
(() => {
  "use strict";
  const root = document.getElementById("archive-record-grid");
  if (!root) return;
  const records = [
    {id:"philosophy",title:"知を愛し、己の言葉を持つ。",category:"理念 · PHILOSOPHY",description:"學院が大切にする、問いを持ち、自ら考え、言葉にするという教育の姿勢。",note:"学問は、誰かの答えを覚えるためだけにあるのではありません。問いを持ち、考え、言葉にし、他者の言葉にも耳を澄ます。その積み重ねが、ひとりの人間の眼差しを育てます。",href:"#philosophy",related:["founder","curriculum"]},
    {id:"founder",title:"創設者・六條 杠葉",category:"人物 · FOUNDER",description:"帝國大學初の女性學生であり、帝都女學院を創設した文学者の人物記録。",note:"帝州・曙に生まれ、日ノ本帝國國立帝國大學初の女性學生として学問の門をくぐり、のちに帝都女學院を創設。誰もが当たり前に学べる世を望みました。",href:"#founder",related:["haruakari","philosophy"]},
    {id:"curriculum",title:"學びの四つの領域",category:"教育 · CURRICULUM",description:"言葉と文学、歴史と思想、芸術と教養、自然と学術。四領域の教育課程。",note:"異なる領域に触れることで、知識は互いにつながり、考える力は深まってゆきます。自ら問いを立て、自らの言葉を見つけること。それが本學院の學びの姿勢です。",href:"curriculum.html",related:["philosophy","ichiha","yakumo"]},
    {id:"ichiha",title:"中原 壱葉",category:"人物 · PERSONNEL",description:"國語教師。衣世出身。代表作『circus』を持つ教員の人物資料。",note:"衣世出身。日ノ本帝國國立帝都女學院にて國語を教える。代表作に『circus』。一人称は「俺」。",href:"#faculty-ichiha",related:["yakumo","curriculum"]},
    {id:"yakumo",title:"中原 八雲",category:"人物 · PERSONNEL",description:"央語教師。日ノ本の歴史や妖怪、神々を愛する教員の人物資料。",note:"日ノ本帝國國立帝都女學院にて央語を教える。日ノ本の歴史や妖怪、神々を好み、代表作に『日ノ本ノ怪談』があります。",href:"#faculty-yakumo",related:["ichiha","curriculum"]},
    {id:"haruakari",title:"春燈",category:"文学 · LITERARY RECORD",description:"六條杠葉と有栖川劉ノ介。創設者夫妻の暮らしと、互いの自由を尊ぶ姿を描く独立した読み物。",note:"春の雨が降る帝都のある一日。學院での出来事を語る杠葉と、その言葉に耳を傾ける劉ノ介。本文は独立した読み物として、原資料の頁でお読みいただけます。",href:"haruakari.html",related:["founder","philosophy"]},
    {id:"campus",title:"學び舎の施設案内",category:"施設 · CAMPUS",description:"學院の施設と、校内案内に収められた場所ごとの紹介。",note:"校内案内では、大図書館、講堂、中庭、藝術教室、音楽室など、學院の日々を支える場所を紹介しています。",href:"#campus",related:["gallery","philosophy"]},
    {id:"gallery",title:"校内風景・圖版",category:"施設 · VISUAL RECORDS",description:"薔薇窓の図書館、中庭、サロン、藝術教室。學び舎の風景を収めた圖版。",note:"學院の風景を描いた圖版は、各場面を拡大して鑑賞できます。",href:"#library",related:["campus","philosophy"]},
    {id:"circus",title:"『circus』",category:"文学 · BIBLIOGRAPHY",description:"中原壱葉の教職員録に記載される代表作。人物記録と結び付く書名索引。",note:"教職員録に代表作として記載された『circus』。中原壱葉の人物記録と書名を結び付ける書誌索引として収録しています。",href:"literature.html#circus",related:["ichiha","curriculum"]},
    {id:"nihon-kaidan",title:"『日ノ本ノ怪談』",category:"文学 · BIBLIOGRAPHY",description:"中原八雲の代表作として教職員録に記載される作品の書名索引。",note:"教職員録に代表作として記載された『日ノ本ノ怪談』。中原八雲の人物記録と書名を結び付ける書誌索引として収録しています。",href:"literature.html#nihon-kaidan",related:["yakumo","curriculum"]},
    {id:"haru-wo-matsu-jin",title:"『春を待つ仁』",category:"文学 · FOUNDER'S WORK",description:"創設者・六條杠葉の代表作として人物記録に記載される書名索引。",note:"創設者・六條杠葉の代表作として記載される『春を待つ仁』。人物記録と結び付けた書名索引として収録しています。",href:"literature.html#haru-wo-matsu-jin",related:["founder","haruakari"]}
  ];
  const byId = new Map(records.map((record,index)=>[record.id,{...record,index}]));
  const storageKey = "hinomoto-maiden-institute-reader-pass-v1";
  const emptyPass = () => ({saved:[],completed:[],opened:[],recent:[]});
  let pass = emptyPass();
  let storageAvailable = true;
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (stored && typeof stored === "object") {
      const valid = list => Array.isArray(list) ? [...new Set(list.filter(id=>byId.has(id)))] : [];
      pass = {saved:valid(stored.saved),completed:valid(stored.completed),opened:valid(stored.opened),recent:valid(stored.recent)};
    }
  } catch (_) { storageAvailable = false; }
  const persist = () => {
    try { window.localStorage.setItem(storageKey,JSON.stringify(pass)); }
    catch (_) { storageAvailable = false; }
    const note = document.getElementById("passport-storage-note");
    if (note) note.textContent = storageAvailable ? "記録はこのブラウザ内に保存されます。外部へ送信されません。" : "このブラウザでは保存領域を利用できません。閲覧機能はそのままお使いいただけます。";
  };
  const addRecent = id => {
    pass.opened = [id,...pass.opened.filter(item=>item!==id)];
    pass.recent = [id,...pass.recent.filter(item=>item!==id)].slice(0,8);
    persist();
    renderPassport();
  };
  const passportOpen = document.getElementById("passport-open-count");
  const passportSaved = document.getElementById("passport-saved-count");
  const passportComplete = document.getElementById("passport-complete-count");
  const savedList = document.getElementById("passport-saved-list");
  const recentList = document.getElementById("passport-recent-list");
  const makePassportItem = (id,kind) => {
    const record = byId.get(id);
    if (!record) return null;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "passport-item";
    const title = document.createElement("strong");
    title.textContent = record.title;
    const meta = document.createElement("small");
    meta.textContent = kind === "saved" ? "MY COLLECTION　·　収蔵資料" : "RECENT　·　最近ひらいた頁";
    button.append(title,meta);
    button.addEventListener("click",()=>openRecord(record.id));
    return button;
  };
  const renderList = (container,ids,kind,message) => {
    if (!container) return;
    container.replaceChildren();
    const filtered = ids.filter(id=>byId.has(id));
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "passport-empty";
      empty.textContent = message;
      container.append(empty);
      return;
    }
    filtered.slice(0,5).forEach(id=>{
      const item = makePassportItem(id,kind);
      if (item) container.append(item);
    });
  };
  const renderPassport = () => {
    if (passportOpen) passportOpen.textContent = String(pass.opened.length).padStart(2,"0");
    if (passportSaved) passportSaved.textContent = String(pass.saved.length).padStart(2,"0");
    if (passportComplete) passportComplete.textContent = String(pass.completed.length).padStart(2,"0");
    renderList(savedList,pass.saved,"saved","書架はまだ空です。資料をひらいて「書架へ収蔵」を選んでください。");
    renderList(recentList,pass.recent,"recent","資料をひらくと、ここに閲覧の足跡が残ります。");
    const note = document.getElementById("passport-storage-note");
    if (note) note.textContent = storageAvailable ? "記録はこのブラウザ内に保存されます。外部へ送信されません。" : "保存領域を利用できません。現在の閲覧は引き続き可能です。";
  };
  const exportButton = document.getElementById("passport-export");
  exportButton?.addEventListener("click",()=>{
    const payload = {title:"日ノ本帝國國立帝都女學院 閲覧者証",exportedAt:new Date().toISOString(),...pass};
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "hinomoto-reader-passport.json";
    document.body.append(link); link.click(); link.remove(); window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  document.getElementById("passport-clear")?.addEventListener("click",()=>{
    pass = emptyPass(); persist(); renderPassport();
    const note = document.getElementById("passport-storage-note");
    if (note) note.textContent = "閲覧者証の記録を初期化しました。";
  });

  const cards = [...root.querySelectorAll(".archive-record")];
  const search = document.getElementById("archive-search");
  const filters = [...document.querySelectorAll("[data-archive-filter]")];
  const count = document.getElementById("archive-result-count");
  const empty = document.getElementById("archive-empty");
  let category = "all";
  const render = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase("ja");
    let visible = 0;
    cards.forEach(card => {
      const matchCategory = category === "all" || card.dataset.category === category;
      const matchQuery = !query || (card.textContent + " " + card.dataset.search).toLocaleLowerCase("ja").includes(query);
      const show = matchCategory && matchQuery;
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = "公開目録　" + String(visible).padStart(2,"0") + "件";
    if (empty) empty.hidden = visible !== 0;
  };
  filters.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.archiveFilter || "all";
    filters.forEach(item => item.setAttribute("aria-pressed",String(item===button)));
    render();
  }));
  search?.addEventListener("input",render);
  document.addEventListener("keydown",event => {
    if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey &&
        !["INPUT","TEXTAREA"].includes(document.activeElement?.tagName) &&
        !document.querySelector("dialog[open]")) {
      event.preventDefault(); search?.focus();
    }
  });

  const dialog = document.getElementById("archive-book-dialog");
  const title = document.getElementById("archive-book-title");
  const klass = document.getElementById("archive-book-class");
  const description = document.getElementById("archive-book-description");
  const note = document.getElementById("archive-book-note");
  const number = document.getElementById("archive-book-number");
  const pageCount = document.getElementById("archive-book-count");
  const source = document.getElementById("archive-book-source");
  const related = document.getElementById("archive-book-related-list");
  const prev = document.getElementById("archive-book-prev");
  const next = document.getElementById("archive-book-next");
  let current = 0;
  const saveButton = document.getElementById("archive-book-save");
  const completeButton = document.getElementById("archive-book-complete");
  const feedback = document.getElementById("archive-book-feedback");
  const updateBookActions = record => {
    const saved = pass.saved.includes(record.id);
    const complete = pass.completed.includes(record.id);
    if (saveButton) {
      saveButton.setAttribute("aria-pressed",String(saved));
      saveButton.textContent = saved ? "✓ 書架から取り出す" : "＋ 書架へ収蔵";
    }
    if (completeButton) {
      completeButton.setAttribute("aria-pressed",String(complete));
      completeButton.textContent = complete ? "✓ 読了を取り消す" : "読了として記録";
    }
    if (feedback) feedback.textContent = saved ? "この資料は、あなたの書架に収蔵されています。" : "この資料を、あなたの閲覧者証に記録できます。";
  };
  const openRecord = id => {
    const record = byId.get(id);
    if (!record || !dialog) return;
    renderRecord(record.index);
    if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
  };
  saveButton?.addEventListener("click",()=>{
    const record = records[current]; if(!record)return;
    pass.saved = pass.saved.includes(record.id) ? pass.saved.filter(id=>id!==record.id) : [record.id,...pass.saved];
    persist(); renderPassport(); updateBookActions(record);
  });
  completeButton?.addEventListener("click",()=>{
    const record = records[current]; if(!record)return;
    pass.completed = pass.completed.includes(record.id) ? pass.completed.filter(id=>id!==record.id) : [record.id,...pass.completed];
    persist(); renderPassport(); updateBookActions(record);
    if(feedback) feedback.textContent = pass.completed.includes(record.id) ? "読了の記録を閲覧者証に綴じました。" : "読了の記録を取り消しました。";
  });
  const renderRecord = index => {
    current = Math.max(0,Math.min(records.length-1,index));
    const record = records[current];
    if (!record || !dialog) return;
    addRecent(record.id);
    title.textContent = record.title;
    klass.textContent = record.category + "　·　OPEN COLLECTION";
    description.textContent = record.description;
    note.textContent = record.note;
    number.textContent = "COLLECTION " + String(current+1).padStart(2,"0") + " / " + String(records.length).padStart(2,"0");
    pageCount.textContent = String(current+1).padStart(2,"0") + " / " + String(records.length).padStart(2,"0");
    source.href = record.href;
    related.replaceChildren();
    record.related.forEach(id => {
      const item = byId.get(id);
      if (!item) return;
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = item.title;
      link.addEventListener("click",event=>{event.preventDefault();renderRecord(item.index);});
      related.append(link);
    });
    updateBookActions(record);
    prev.disabled = current === 0;
    next.disabled = current === records.length-1;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.classList.remove("page-turning");
      void dialog.offsetWidth;
      dialog.classList.add("page-turning");
    }
  };
  cards.forEach(card => card.addEventListener("click",event => {
    const record = byId.get(card.dataset.record);
    if (!record || !dialog || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    renderRecord(record.index);
    dialog.showModal();
  }));
  prev?.addEventListener("click",()=>renderRecord(current-1));
  next?.addEventListener("click",()=>renderRecord(current+1));
  dialog?.querySelector(".archive-book-close")?.addEventListener("click",()=>dialog.close());
  dialog?.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
  dialog?.addEventListener("keydown",event=>{
    if(event.key==="ArrowLeft" && current>0){event.preventDefault();renderRecord(current-1);}
    if(event.key==="ArrowRight" && current<records.length-1){event.preventDefault();renderRecord(current+1);}
  });

  /* Portrait enlargement reuses the exact published source; no substitute asset is introduced. */
  const viewer = document.getElementById("portrait-viewer");
  const viewerImage = viewer?.querySelector("img");
  const viewerCaption = viewer?.querySelector("figcaption");
  if (viewer && viewerImage && typeof viewer.showModal === "function") {
    const openPortrait = image => {
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerCaption.textContent = image.alt;
      viewer.showModal();
    };
    document.querySelectorAll(".faculty-portrait-frame img").forEach(image => {
      image.tabIndex = 0;
      image.setAttribute("role","button");
      image.setAttribute("aria-haspopup","dialog");
      image.setAttribute("aria-label",image.alt + "を拡大して鑑賞");
      image.addEventListener("click",()=>openPortrait(image));
      image.addEventListener("keydown",event=>{
        if(event.key==="Enter" || event.key===" "){event.preventDefault();openPortrait(image);}
      });
    });
    viewer.querySelector(".portrait-viewer-close")?.addEventListener("click",()=>viewer.close());
    viewer.addEventListener("click",event=>{if(event.target===viewer)viewer.close();});
  }
  render();
  renderPassport();
})();