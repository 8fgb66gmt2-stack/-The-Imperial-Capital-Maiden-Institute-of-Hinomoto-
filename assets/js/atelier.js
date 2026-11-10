/* REIRO ROMANTIC ATELIER — quiet reading-progress and header polish */
(() => {
  "use strict";
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const progress = document.createElement("div");
  progress.className = "atelier-reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  let frame = 0;
  const update = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const amount = Math.min(1, Math.max(0, window.scrollY / max));
      progress.style.transform = `scaleX(${amount})`;
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
    });
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();
