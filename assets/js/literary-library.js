/* LITERARY LIBRARY — reading controls and integration with the local reader's pass */
(() => {
  "use strict";
  const body = document.body;
  const sizeButtons = [...document.querySelectorAll("[data-reader-size]")];
  const setSize = size => {
    body.dataset.readerSize = size;
    sizeButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.readerSize===size)));
  };
  sizeButtons.forEach(button=>button.addEventListener("click",()=>setSize(button.dataset.readerSize)));
  setSize("standard");

  const progress = document.getElementById("literary-progress");
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1,Math.max(0,window.scrollY/max)) : 0;
    progress.style.width = (ratio*100).toFixed(2) + "%";
  };
  window.addEventListener("scroll",updateProgress,{passive:true});
  window.addEventListener("resize",updateProgress);
  updateProgress();

  const key = "hinomoto-maiden-institute-reader-pass-v1";
  const workIds = new Set(["haru-wo-matsu-jin","circus","nihon-kaidan"]);
  const readPass = () => {
    try {
      const value = JSON.parse(window.localStorage.getItem(key) || "null");
      if (!value || typeof value !== "object") return {saved:[],completed:[],opened:[],recent:[]};
      const list = name => Array.isArray(value[name]) ? [...new Set(value[name].filter(id=>typeof id==="string"))] : [];
      return {saved:list("saved"),completed:list("completed"),opened:list("opened"),recent:list("recent")};
    } catch (_) { return {saved:[],completed:[],opened:[],recent:[]}; }
  };
  const writePass = pass => {
    try { window.localStorage.setItem(key,JSON.stringify(pass)); return true; }
    catch (_) { return false; }
  };
  const addOpened = id => {
    if (!workIds.has(id)) return;
    const pass = readPass();
    pass.opened = [id,...pass.opened.filter(item=>item!==id)];
    pass.recent = [id,...pass.recent.filter(item=>item!==id)].slice(0,8);
    writePass(pass);
  };
  const updateReadButtons = () => {
    const pass = readPass();
    document.querySelectorAll("[data-mark-read]").forEach(button=>{
      const done = pass.completed.includes(button.dataset.markRead);
      button.setAttribute("aria-pressed",String(done));
      button.textContent = done ? "✓ 閲覧者証に読了を記録済み" : "読了として閲覧者証に記録";
    });
  };
  document.querySelectorAll("[data-mark-read]").forEach(button=>{
    button.addEventListener("click",()=>{
      const id = button.dataset.markRead;
      if (!workIds.has(id)) return;
      const pass = readPass();
      pass.completed = pass.completed.includes(id) ? pass.completed.filter(item=>item!==id) : [id,...pass.completed];
      const ok = writePass(pass);
      updateReadButtons();
      if (!ok) button.textContent = "保存できませんでした";
    });
  });

  const works = [...document.querySelectorAll("[data-work-id]")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting && entry.intersectionRatio > 0.08) {
          addOpened(entry.target.dataset.workId);
        }
      });
    },{rootMargin:"-18% 0px -55% 0px",threshold:[0,.08,.2]});
    works.forEach(work=>observer.observe(work));
  } else {
    const target = decodeURIComponent(location.hash.slice(1));
    if (workIds.has(target)) addOpened(target);
  }
  document.querySelectorAll('.literary-index-card[href^="#"]').forEach(link=>{
    link.addEventListener("click",()=>{
      const id = link.getAttribute("href").slice(1);
      if (workIds.has(id)) addOpened(id);
    });
  });
  window.addEventListener("pageshow",updateReadButtons);
  updateReadButtons();
})();