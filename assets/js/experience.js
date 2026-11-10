/* Institute experience layer — progressive enhancement */
(() => {
 "use strict";
 const root=document.documentElement;
 const month=Number(new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Tokyo",month:"numeric"}).format(new Date()));
 root.dataset.instituteSeason=month>=3&&month<=5?"spring":month>=6&&month<=8?"summer":month>=9&&month<=11?"autumn":"winter";
 const page=location.pathname.split("/").pop()||"index.html";
 document.querySelectorAll(".global-nav a").forEach(link=>{
   const target=(link.getAttribute("href")||"").split("#")[0];
   if(target&&target===page&&!link.hash)link.setAttribute("aria-current","page");
 });
 document.body.classList.add("is-ready");
 document.querySelectorAll("dialog").forEach(dialog=>{
   dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
 });
})();