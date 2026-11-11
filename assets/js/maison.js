/* MAISON — discreet reading instrument and page identity */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".global-nav a").forEach(link => {
    const href = link.getAttribute("href") || "";
    const target = href.split("#")[0];
    if (target && target === path && !href.includes("#")) {
      link.setAttribute("aria-current", "page");
    }
  });

  const progress = document.createElement("div");
  progress.className = "maison-reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  let scheduled = false;
  const paint = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = "scaleX(" + value + ")";
    scheduled = false;
  };
  const requestPaint = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(paint);
  };
  window.addEventListener("scroll", requestPaint, { passive: true });
  window.addEventListener("resize", requestPaint, { passive: true });
  paint();

  if (!reduce) {
    document.body.classList.add("maison-ready");
  }
})();
