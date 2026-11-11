/* IMPERIAL LITERARY ATLAS — book reader, catalogue, bookmarks and passport bridge */
(() => {
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const storageKey="hinomoto-maiden-institute-reader-pass-v1";
  const workMeta={
    "haru-wo-matsu-jin":{title:"春を待つ仁",author:"六條 杠葉",form:"連作歌篇",theme:"yuzuriha",keywords:"短歌 尊厳 学問 自由 女性 自立 愛 仁 春 希望 紅梅 桜"},
    circus:{title:"circus",author:"中原 壱葉",form:"自由詩・散文詩",theme:"ichiha",keywords:"詩 散文詩 孤独 仮面 本心 笑い 悲しみ 舞台 現実 芸術家 反抗 都市 雨"},
    "nihon-kaidan":{title:"日ノ本ノ怪談 — 沖の灯",author:"中原 八雲",form:"怪異譚",theme:"yakumo",keywords:"怪談 怪異 民間伝承 妖怪 神々 海 死者 生者 信仰 風習 記憶 灯 月 霧"}
  };
  const readPass=()=>{
    try{
      const v=JSON.parse(localStorage.getItem(storageKey)||"null")||{};
      return {saved:Array.isArray(v.saved)?v.saved:[],completed:Array.isArray(v.completed)?v.completed:[],opened:Array.isArray(v.opened)?v.opened:[],recent:Array.isArray(v.recent)?v.recent:[],bookmarks:Array.isArray(v.bookmarks)?v.bookmarks:[],progress:v.progress&&typeof v.progress==="object"?v.progress:{}};
    }catch(_){return {saved:[],completed:[],opened:[],recent:[],bookmarks:[],progress:{}};}
  };
  const writePass=p=>{try{localStorage.setItem(storageKey,JSON.stringify(p));return true;}catch(_){return false;}};
  const touch=(id)=>{const p=readPass();p.opened=[id,...p.opened.filter(x=>x!==id)];p.recent=[id,...p.recent.filter(x=>x!==id)].slice(0,8);writePass(p);};
  const updateFavorites=()=>{
    const p=readPass();
    $$("[data-literary-favorite]").forEach(b=>{const on=p.saved.includes(b.dataset.literaryFavorite);b.setAttribute("aria-pressed",String(on));b.textContent=on?"✓ お気に入りの書架に収蔵済み":"＋ お気に入りの書架へ";});
  };
  $$("[data-literary-favorite]").forEach(b=>b.addEventListener("click",()=>{
    const p=readPass(),id=b.dataset.literaryFavorite;
    p.saved=p.saved.includes(id)?p.saved.filter(x=>x!==id):[id,...p.saved];
    writePass(p);updateFavorites();
  }));
  const search=$("#literary-search"),results=$("#literary-search-results"),count=$("#literary-search-count");
  let activeFilter="all";
  const filterWorks=()=>{
    if(!results)return;
    const q=(search?.value||"").trim().toLocaleLowerCase("ja");
    let visible=0;
    $$("[data-catalogue-work]",results).forEach(a=>{
      const id=a.dataset.catalogueWork,meta=workMeta[id],section=$("#"+id);
      const text=(a.textContent+" "+(meta?.keywords||"")+" "+(section?.textContent||"")).toLocaleLowerCase("ja");
      const category=id==="haru-wo-matsu-jin"?"poetry":id==="circus"?"prose":"folklore";
      const show=(!q||text.includes(q))&&(activeFilter==="all"||category===activeFilter);
      a.hidden=!show;if(show)visible++;
    });
    if(count)count.textContent="検索結果 "+String(visible).padStart(2,"0")+"件";
  };
  search?.addEventListener("input",filterWorks);
  $$("[data-literary-filter]").forEach(b=>b.addEventListener("click",()=>{
    activeFilter=b.dataset.literaryFilter;
    $$("[data-literary-filter]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    filterWorks();
  }));
  filterWorks();

  const dialog=document.createElement("dialog");
  dialog.className="literary-reader-dialog";
  dialog.setAttribute("aria-label","作品文庫 書物型読書室");
  dialog.innerHTML='<div class="reader-shell"><div class="reader-topbar"><small id="reader-book-label">THE IMPERIAL LITERARY COLLECTION</small><button type="button" class="reader-close">閉じる　×</button></div><div class="reader-book" id="reader-book"><article class="reader-page" id="reader-left" aria-label="左頁"></article><article class="reader-page" id="reader-right" aria-label="右頁"></article></div><div class="reader-controls"><button type="button" id="reader-prev">← 前の頁</button><span class="reader-page-status" id="reader-page-status" aria-live="polite">01 / 01</span><button type="button" id="reader-next">次の頁 →</button><button type="button" id="reader-bookmark" aria-pressed="false">栞を挟む</button><button type="button" id="reader-font">文字を大きく</button><button type="button" id="reader-print">印刷・PDF保存</button></div><div class="reader-progress"><span id="reader-progress-bar"></span></div><p class="reader-note" id="reader-note">頁の記録は閲覧者証に保存されます。このブラウザの外へ送信されません。</p></div>';
  document.body.append(dialog);
  const shell=$(".reader-shell",dialog),left=$("#reader-left",dialog),right=$("#reader-right",dialog);
  let currentId=null,pages=[],pageIndex=0,fontLarge=false;
  const makePages=id=>{
    const source=$(".literary-volume[data-work-id='"+id+"'] .literary-text");
    if(!source)return [];
    const nodes=[...source.children];
    const chunks=[];
    let current=[];
    nodes.forEach(node=>{
      if(node.classList.contains("tanka-sequence")){
        const verses=$$(".tanka",node);
        verses.forEach(v=>{current.push(v.cloneNode(true));if(current.length>=3){chunks.push(current);current=[];}});
      }else{
        current.push(node.cloneNode(true));
        if(current.length>=3){chunks.push(current);current=[];}
      }
    });
    if(current.length)chunks.push(current);
    const paired=[];
    for(let i=0;i<chunks.length;i+=2)paired.push([chunks[i],chunks[i+1]||[]]);
    return paired.length?paired:[[[],[]]];
  };
  const renderPage=()=>{
    if(!currentId)return;
    const pair=pages[pageIndex]||[[],[]];
    const mobile=window.matchMedia("(max-width: 680px)").matches;
    [left,right].forEach((el,i)=>{
      el.replaceChildren();
      const nodes=(mobile&&i===0)?[...(pair[0]||[]),...(pair[1]||[])]:((pair[i]||[]));
      nodes.forEach(node=>el.append(node.cloneNode(true)));
      const num=document.createElement("span");num.className="reader-page-number";num.textContent=mobile?String(pageIndex+1).padStart(2,"0"):String(pageIndex*2+i+1).padStart(2,"0");el.append(num);
      el.hidden=mobile&&i===1;
      el.classList.remove("page-enter");void el.offsetWidth;el.classList.add("page-enter");
    });
    const total=pages.length;
    $("#reader-page-status",dialog).textContent=String(pageIndex+1).padStart(2,"0")+" / "+String(total).padStart(2,"0");
    $("#reader-prev",dialog).disabled=pageIndex===0;
    $("#reader-next",dialog).disabled=pageIndex>=total-1;
    $("#reader-progress-bar",dialog).style.width=((pageIndex+1)/total*100)+"%";
    const p=readPass();p.progress[currentId]={page:pageIndex+1,total,updatedAt:new Date().toISOString()};writePass(p);
    updateBookmarkButton();
  };
  const updateBookmarkButton=()=>{
    const p=readPass(),has=p.bookmarks.some(b=>b.workId===currentId&&b.page===pageIndex);
    const b=$("#reader-bookmark",dialog);b.setAttribute("aria-pressed",String(has));b.textContent=has?"✓ この頁に栞を挟みました":"栞を挟む";
  };
  const openBook=(id,requestedPage)=>{
    if(!workMeta[id])return;
    currentId=id;pages=makePages(id);
    const p=readPass(),saved=p.progress[id];
    const resumePage=Number.isInteger(requestedPage)?requestedPage:(saved?.page||1);pageIndex=Math.max(0,Math.min(pages.length-1,resumePage-1));
    shell.dataset.readerTheme=workMeta[id].theme;
    $("#reader-book-label",dialog).textContent=workMeta[id].author+"　／　"+workMeta[id].title+"　·　"+workMeta[id].form;
    touch(id);renderPage();
    if(!dialog.open)dialog.showModal();
    $(".reader-close",dialog).focus();
  };
  $$("[data-open-literary-book]").forEach(b=>b.addEventListener("click",()=>openBook(b.dataset.openLiteraryBook)));
  $("#reader-prev",dialog).addEventListener("click",()=>{if(pageIndex>0){pageIndex--;renderPage();}});
  $("#reader-next",dialog).addEventListener("click",()=>{if(pageIndex<pages.length-1){pageIndex++;renderPage();}});
  $("#reader-bookmark",dialog).addEventListener("click",()=>{
    const p=readPass(),index=p.bookmarks.findIndex(b=>b.workId===currentId&&b.page===pageIndex);
    if(index>=0)p.bookmarks.splice(index,1);
    else p.bookmarks.unshift({workId:currentId,page:pageIndex,folio:pageIndex*2+1,createdAt:new Date().toISOString()});
    writePass(p);updateBookmarkButton();
    $("#reader-note",dialog).textContent=index>=0?"この頁の栞を外しました。":"この頁を閲覧者証の栞に記録しました。";
  });
  $("#reader-print",dialog).addEventListener("click",()=>window.print());
  $("#reader-font",dialog).addEventListener("click",()=>{
    fontLarge=!fontLarge;shell.dataset.readerFont=fontLarge?"large":"standard";
    $("#reader-font",dialog).textContent=fontLarge?"標準の文字へ":"文字を大きく";
  });
  $(".reader-close",dialog).addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener("keydown",e=>{
    if(e.key==="ArrowLeft"&&pageIndex>0){e.preventDefault();pageIndex--;renderPage();}
    if(e.key==="ArrowRight"&&pageIndex<pages.length-1){e.preventDefault();pageIndex++;renderPage();}
  });
  window.addEventListener("resize",()=>{if(dialog.open)renderPage();});
  const requested=new URLSearchParams(window.location.search);
  const requestedWork=requested.get("read");
  const requestedPage=Number(requested.get("page"));
  if(workMeta[requestedWork])openBook(requestedWork,Number.isFinite(requestedPage)&&requestedPage>0?requestedPage:undefined);
  updateFavorites();
  window.addEventListener("pageshow",updateFavorites);
})();