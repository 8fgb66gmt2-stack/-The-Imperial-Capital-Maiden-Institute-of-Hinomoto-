(() => {
  const clock = document.getElementById("imperial-clock");
  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("global-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
  }

  const sealedButton = document.getElementById("sealed-button");
  const sealedMessage = document.getElementById("sealed-message");
  if (sealedButton && sealedMessage) {
    sealedButton.addEventListener("click", () => {
      const expanded = sealedButton.getAttribute("aria-expanded") === "true";
      sealedButton.setAttribute("aria-expanded", String(!expanded));
      sealedMessage.hidden = expanded;
      sealedButton.querySelector("span").textContent = expanded ? "＋" : "−";
    });
  }
})();