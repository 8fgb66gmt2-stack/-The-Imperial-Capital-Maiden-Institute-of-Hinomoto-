(() => {
  "use strict";

  const clock = document.getElementById("imperial-clock");
  const updateClock = () => {
    if (!clock) return;
    try {
      clock.textContent = new Intl.DateTimeFormat("ja-JP", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(new Date());
    } catch (error) {
      clock.textContent = "--:--:--";
    }
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("global-nav");
  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (window.innerWidth <= 760 && nav.classList.contains("is-open") &&
          !nav.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  const sealedButton = document.getElementById("sealed-button");
  const sealedMessage = document.getElementById("sealed-message");
  if (sealedButton && sealedMessage) {
    sealedButton.addEventListener("click", () => {
      const expanded = sealedButton.getAttribute("aria-expanded") === "true";
      sealedButton.setAttribute("aria-expanded", String(!expanded));
      sealedMessage.hidden = expanded;
      const mark = sealedButton.querySelector("span");
      if (mark) mark.textContent = expanded ? "＋" : "−";
    });
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".global-nav a[href*='#']")];
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.hash === "#" + entry.target.id ||
            link.hash.endsWith("#" + entry.target.id);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
})();