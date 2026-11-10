/* Imperial Capital Maiden Institute — campus explorer, almanac & archive */
(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const campus = $("#campus");
  if (campus && !$("#campus-explorer")) {
    const explorer = document.createElement("section");
    explorer.className = "campus-explorer";
    explorer.id = "campus-explorer";
    explorer.setAttribute("aria-labelledby","explorer-title");
    explorer.innerHTML = `
      <header class="explorer-heading">
        <span class="explorer-kicker">INTERACTIVE CAMPUS DIRECTORY</span>
        <h3 id="explorer-title">學院鳥瞰圖 — 校内案内</h3>
        <p>校内の場所を選ぶと、その場所に伝わる小さな記録が開きます。気になる扉をひらいてみてください。</p>
      </header>
      <div class="explorer-layout">
        <div class="campus-plan" role="group" aria-label="帝都女學院の模式的な校内案内図">
          <span class="plan-title">CAMPUS PLAN　／　HINOMOTO</span><span class="plan-compass" aria-hidden="true">N</span>
          <div class="plan-path" aria-hidden="true"></div>
          <div class="plan-building" aria-hidden="true"><div><strong>帝都女學院</strong><br><small>THE MAIN BUILDING</small></div></div>
          <button class="plan-point" type="button" data-place="library" aria-pressed="true"><strong>大図書館</strong><small>LIBRARY</small></button>
          <button class="plan-point" type="button" data-place="hall" aria-pressed="false"><strong>講堂</strong><small>GREAT HALL</small></button>
          <button class="plan-point" type="button" data-place="garden" aria-pressed="false"><strong>中庭</strong><small>COURTYARD</small></button>
          <button class="plan-point" type="button" data-place="atelier" aria-pressed="false"><strong>藝術教室</strong><small>ATELIER</small></button>
          <button class="plan-point" type="button" data-place="music" aria-pressed="false"><strong>音楽室</strong><small>MUSIC ROOM</small></button>
        </div>
        <article class="explorer-detail" aria-live="polite" aria-atomic="true">
          <span class="explorer-detail-label" id="place-en">THE GRAND LIBRARY</span>
          <h4 id="place-title">薔薇窓の大図書館</h4>
          <p id="place-description">幾重もの書架と薔薇窓から差し込む光。古今の書物が静かに並び、頁をめくる音さえ大切にしたくなる、學院の知の中心です。</p>
          <p class="detail-meta" id="place-meta">開室の目安 — 静謐を尊ぶ時間</p>
        </article>
      </div>
      <p class="explorer-hint">※ 本図は學院案内のための模式図です。各標識はキーボードでも選択できます。</p>
      <div class="explorer-clock" aria-label="帝都標準時と季節">
        <div><span>帝都標準時</span><strong id="almanac-time">--:--:--</strong></div>
        <div><span>本日の暦</span><strong id="almanac-date">----</strong><small id="almanac-season">季節を読み込み中</small></div>
        <span class="season-mark" id="almanac-mark" aria-hidden="true">✧</span>
      </div>
      <div style="text-align:center"><button class="archive-book-trigger" type="button" id="open-archive-book">學院史料 — 書物をひらく　↗</button></div>`;
    const feature = $(".campus-feature",campus);
    if (feature) feature.insertAdjacentElement("afterend",explorer);
    else campus.append(explorer);

    const places = {
      library:{en:"THE GRAND LIBRARY",title:"薔薇窓の大図書館",description:"幾重もの書架と薔薇窓から差し込む光。古今の書物が静かに並び、頁をめくる音さえ大切にしたくなる、學院の知の中心です。",meta:"所蔵 — 文学・歴史・思想・藝術"},
      hall:{en:"THE GREAT HALL",title:"大講堂",description:"學院の式典や公開講義、記念演奏会が催される場所。學びの節目に、學生と教職員が同じ言葉に耳を傾けます。",meta:"用途 — 式典・講演・演奏会"},
      garden:{en:"THE ROSE COURTYARD",title:"薔薇と百合の中庭",description:"季節ごとに花の表情を変える中庭。授業の合間に散策したり、友人と語らったり、學院の日常にやわらかな余白を添えます。",meta:"見どころ — 季節の花・噴水・回廊"},
      atelier:{en:"THE ARTS ATELIER",title:"藝術教室",description:"絵画や手工藝、意匠など、手を動かして美を探るための教室。技法を学ぶだけでなく、自分だけの表現を見つける場所です。",meta:"領域 — 絵画・手工藝・意匠"},
      music:{en:"THE MUSIC ROOM",title:"音楽室",description:"声と楽器が響き合う小さな音楽室。個人練習から合奏まで、音を通して互いの感性に触れる時間が流れます。",meta:"領域 — 声楽・器楽・合奏"}
    };
    const buttons=[...explorer.querySelectorAll(".plan-point")];
    buttons.forEach(button=>button.addEventListener("click",()=>{
      const place=places[button.dataset.place]; if(!place)return;
      buttons.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));
      $("#place-en",explorer).textContent=place.en;
      $("#place-title",explorer).textContent=place.title;
      $("#place-description",explorer).textContent=place.description;
      $("#place-meta",explorer).textContent=place.meta;
    }));
    const updateAlmanac=()=>{
      const now=new Date();
      const time=new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);
      const date=new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(now);
      const month=Number(new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Tokyo",month:"numeric"}).format(now));
      const season=month>=3&&month<=5?["春","✿"]:month>=6&&month<=8?["夏","☼"]:month>=9&&month<=11?["秋","❧"]:["冬","❄"];
      $("#almanac-time",explorer).textContent=time;
      $("#almanac-date",explorer).textContent=date;
      $("#almanac-season",explorer).textContent=season[0]+"の候 — 季節の移ろいとともに";
      $("#almanac-mark",explorer).textContent=season[1];
    };
    updateAlmanac(); window.setInterval(updateAlmanac,1000);

    const pages=[
      {kicker:"ARCHIVE　／　FOLIO 01",title:"學院の理念",body:"知を愛し、己の言葉を持つ。學ぶことは、誰かの答えを覚えるだけではなく、自ら問いを立て、考え、言葉にすること。本學院は、ひとりひとりの知性と可能性を尊びます。"},
      {kicker:"ARCHIVE　／　FOLIO 02",title:"創設者・六條杠葉",body:"帝州・曙に生まれ、日ノ本帝國國立帝國大學に学ぶ。のちに帝都女學院を創設し、誰もが当たり前に学べる世を願いました。代表作に『春を待つ仁』。"},
      {kicker:"ARCHIVE　／　FOLIO 03",title:"學び舎の日々",body:"書物に親しみ、問いを交わし、美を表現する。異なる知と感性が出会う日々のなかで、學生たちはそれぞれの未来を見つけてゆきます。"}
    ];
    const dialog=document.createElement("dialog"); dialog.className="institute-dialog"; dialog.id="institute-archive-dialog";
    dialog.innerHTML='<button class="dialog-close" type="button" aria-label="閉じる">閉じる ×</button><div class="dialog-inner"><span class="dialog-kicker" id="folio-kicker"></span><h3 id="folio-title"></h3><p id="folio-body"></p><div class="dialog-controls"><button type="button" id="folio-prev">← 前の頁</button><span id="folio-count" aria-live="polite">01 / 03</span><button type="button" id="folio-next">次の頁 →</button></div></div>';
    document.body.append(dialog);
    let pageIndex=0;
    const renderPage=()=>{
      const p=pages[pageIndex];
      $("#folio-kicker",dialog).textContent=p.kicker;$("#folio-title",dialog).textContent=p.title;$("#folio-body",dialog).textContent=p.body;
      $("#folio-count",dialog).textContent=String(pageIndex+1).padStart(2,"0")+" / "+String(pages.length).padStart(2,"0");
      $("#folio-prev",dialog).disabled=pageIndex===0;$("#folio-next",dialog).disabled=pageIndex===pages.length-1;
      if(dialog.open && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        dialog.classList.remove("page-turning");void dialog.offsetWidth;dialog.classList.add("page-turning");
        window.setTimeout(()=>dialog.classList.remove("page-turning"),460);
      }
    };
    dialog.addEventListener("keydown",event=>{
      if(event.key==="ArrowLeft" && pageIndex>0){event.preventDefault();pageIndex--;renderPage();}
      if(event.key==="ArrowRight" && pageIndex<pages.length-1){event.preventDefault();pageIndex++;renderPage();}
    });
    $("#open-archive-book",explorer).addEventListener("click",()=>{pageIndex=0;renderPage();dialog.showModal();});
    $("#folio-prev",dialog).addEventListener("click",()=>{pageIndex=Math.max(0,pageIndex-1);renderPage();});
    $("#folio-next",dialog).addEventListener("click",()=>{pageIndex=Math.min(pages.length-1,pageIndex+1);renderPage();});
    $(".dialog-close",dialog).addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
  }

  /* A discoverable, keyboard-operable sealed folio: five presses on the crest. */
  const crest=$(".footer-crest");
  if(crest && !$("#hidden-folio")){
    let presses=0,timer=0;
    crest.setAttribute("title","校章を五度たどると、封緘資料がひらきます");
    crest.addEventListener("click",event=>{
      presses++;window.clearTimeout(timer);timer=window.setTimeout(()=>presses=0,2400);
      if(presses<5)return;
      presses=0;event.preventDefault();
      const note=document.createElement("dialog");note.className="institute-dialog";note.id="hidden-folio";
      note.innerHTML='<button class="dialog-close" type="button" aria-label="閉じる">閉じる ×</button><div class="dialog-inner"><span class="dialog-kicker">SEALED DOCUMENT　／　NO. 005</span><h3>封緘文書 — 花の名を継ぐ者へ</h3><p>學院の記憶は、建物や制度だけに宿るものではありません。ここで学び、問い、誰かと語り合った者たちの言葉にも、その歩みは残されています。</p><p>「時代ハ過ギル。言葉ハ遺ル。」</p><p>頁を閉じるときも、己の言葉を忘れずに。</p></div>';
      document.body.append(note);note.showModal();$(".dialog-close",note).addEventListener("click",()=>note.close());note.addEventListener("close",()=>note.remove());
    });
  }

  /* Subtle seasonal atmosphere, only on the landing page and never for reduced motion. */
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduced && campus && !window.matchMedia("(max-width: 600px)").matches){
    const month=new Date().getMonth()+1;
    const glyph=month>=3&&month<=5?"✿":month>=6&&month<=8?"✧":month>=9&&month<=11?"❧":"❄";
    let count=0;
    const spawn=()=>{
      if(document.hidden||count>=9)return;
      const mote=document.createElement("span");mote.className="seasonal-mote";mote.textContent=glyph;
      mote.style.setProperty("--x",Math.random()*100+"vw");mote.style.setProperty("--drift",(Math.random()*100-50)+"px");
      mote.style.setProperty("--duration",(9+Math.random()*8)+"s");document.body.append(mote);count++;
      mote.addEventListener("animationend",()=>{mote.remove();count=Math.max(0,count-1);},{once:true});
    };
    window.setInterval(spawn,2600);
  }
})();
