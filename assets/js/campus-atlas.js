/* CAMPUS ATLAS — guided, keyboard-operable exploration of existing places */
(() => {
  "use strict";
  const explorer = document.getElementById("campus-explorer");
  if (!explorer) return;
  const map = explorer.querySelector(".campus-plan");
  const detail = explorer.querySelector(".explorer-detail");
  const points = Array.from(explorer.querySelectorAll(".plan-point"));
  if (!map || !detail || !points.length) return;

  const tour = document.createElement("nav");
  tour.className = "campus-journey";
  tour.setAttribute("aria-label","校内案内の場所目録");
  tour.innerHTML =
    '<div class="campus-journey-head"><div><p>THE FIVE GATES OF THE INSTITUTE</p><strong>五つの場所を巡る</strong></div><span class="campus-journey-status" id="campus-journey-status" aria-live="polite">PLACE 01 / 05</span></div>' +
    '<div class="campus-journey-steps" id="campus-journey-steps"></div>' +
    '<div class="campus-journey-controls"><button type="button" id="campus-journey-prev" disabled>← 前の場所</button><p>目録の名を選ぶと、鳥瞰図の標識と紹介が切り替わります。</p><button type="button" id="campus-journey-next">次の場所 →</button></div>';
  const heading = explorer.querySelector(".explorer-heading");
  if (heading) heading.insertAdjacentElement("afterend",tour);
  else explorer.insertBefore(tour,explorer.firstChild);

  const stepsRoot = tour.querySelector("#campus-journey-steps");
  const status = tour.querySelector("#campus-journey-status");
  const previous = tour.querySelector("#campus-journey-prev");
  const next = tour.querySelector("#campus-journey-next");
  const artLinks = {
    library:{href:"#library",label:"大図書館の圖版を鑑賞する"},
    garden:{href:"#garden",label:"中庭の圖版を鑑賞する"},
    atelier:{href:"#atelier",label:"藝術教室の圖版を鑑賞する"},
    music:{href:"#atelier",label:"音楽と藝術の圖版を鑑賞する"}
  };
  let active = Math.max(0,points.findIndex(point=>point.getAttribute("aria-pressed")==="true"));
  const stepButtons = points.map((point,index) => {
    const title = point.querySelector("strong")?.textContent?.trim() || "施設";
    const control = document.createElement("button");
    control.type = "button";
    control.className = "campus-journey-step";
    control.innerHTML = "<b>" + String(index+1).padStart(2,"0") + "</b><span></span>";
    control.querySelector("span").textContent = title;
    control.addEventListener("click",()=>point.click());
    stepsRoot.append(control);
    point.setAttribute("aria-label",title+"の紹介を表示");
    point.addEventListener("click",()=>setActive(index));
    return control;
  });

  function setActive(index) {
    active = Math.max(0,Math.min(points.length-1,index));
    stepButtons.forEach((button,i)=>{
      if(i===active) button.setAttribute("aria-current","step");
      else button.removeAttribute("aria-current");
    });
    status.textContent = "PLACE " + String(active+1).padStart(2,"0") + " / " + String(points.length).padStart(2,"0");
    previous.disabled = active===0;
    next.disabled = active===points.length-1;
    const key = points[active].dataset.place;
    detail.querySelector(".campus-detail-art")?.remove();
    const art = artLinks[key];
    if(art && document.querySelector(art.href)){
      const link = document.createElement("a");
      link.className = "campus-detail-art";
      link.href = art.href;
      link.textContent = art.label + "　↗";
      detail.append(link);
    }
  }
  previous.addEventListener("click",()=>points[Math.max(0,active-1)].click());
  next.addEventListener("click",()=>points[Math.min(points.length-1,active+1)].click());
  stepButtons.forEach((button,index)=>{
    button.addEventListener("keydown",event=>{
      if(event.key==="ArrowRight" || event.key==="ArrowDown"){event.preventDefault();stepButtons[Math.min(stepButtons.length-1,index+1)].focus();}
      else if(event.key==="ArrowLeft" || event.key==="ArrowUp"){event.preventDefault();stepButtons[Math.max(0,index-1)].focus();}
    });
  });
  setActive(active);
})();