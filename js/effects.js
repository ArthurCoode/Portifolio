/* ================= EFEITOS ESPECIAIS ================= */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- barra de progresso + brilho do cursor (elementos criados aqui) ---- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.prepend(bar);

  let glow = null;
  if (finePointer && !reduce) {
    glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.prepend(glow);
  }

  const sections = Array.from(document.querySelectorAll("main section, body > section"));
  const navLinks = Array.from(document.querySelectorAll(".navbar a[href^='#']"));
  const timeline = document.querySelector(".timeline");
  const editorStage = document.getElementById("editorStage");

  function onScroll() {
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";

    // link ativo no menu
    let current = "";
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= vh * 0.4) current = s.id;
    });
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));

    if (reduce) return;

    // linha do tempo "desenhada" conforme rola
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0), 1);
      timeline.style.setProperty("--draw", p.toFixed(3));
    }

    // editor do hero: começa inclinado para trás e "deita" na tela ao rolar
    if (editorStage) {
      const r = editorStage.getBoundingClientRect();
      const p = Math.min(Math.max((vh - r.top) / (vh * 0.9), 0), 1);
      editorStage.style.setProperty("--sx", ((1 - p) * 22).toFixed(2) + "deg");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- mouse: brilho global + cursor + spotlight nos cards (delegação) ---- */
  const SPOT = ".service-card, .portfolio-card, .certificate-card, .update-card, .about-profile-card, .timeline-card";
  const TILT = ".service-card, .portfolio-card, .certificate-card, .about-profile-card, .timeline-card";
  let mouse = { x: -100, y: -100 };
  let raf = null;
  let tilted = null;

  function resetTilt(card) {
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
    card.classList.remove("tilting");
  }

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (glow) {
      glow.classList.add("on");
      if (!raf) {
        raf = requestAnimationFrame(() => {
          glow.style.transform = "translate(" + mouse.x + "px," + mouse.y + "px)";
          raf = null;
        });
      }
    }

    const card = e.target.closest && e.target.closest(SPOT);
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    }

    // inclinação 3D nos cards
    if (!reduce && finePointer) {
      const t = e.target.closest && e.target.closest(TILT);
      if (tilted && tilted !== t) resetTilt(tilted);
      tilted = t;
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const k = r.width > 600 ? 4 : 10; // cards largos inclinam menos
        t.classList.add("tilting");
        t.style.setProperty("--ry", (px * k).toFixed(2) + "deg");
        t.style.setProperty("--rx", (-py * k).toFixed(2) + "deg");
      }
    }
  });

  document.addEventListener("mouseleave", () => {
    if (glow) glow.classList.remove("on");
    if (tilted) resetTilt(tilted);
    tilted = null;
  });

  if (reduce) return;

  /* ---- texto "embaralhado" nas etiquetas quando entram na tela ---- */
  const GLYPHS = "abcdefghijklmnopqrstuvwxyz<>/{}=;#_01";
  function scramble(el) {
    const final = el.textContent;
    let frame = 0;
    const total = 18;
    el.dataset.scrambling = "1";
    // garantia: se os frames pararem (aba em segundo plano), o texto volta ao normal
    setTimeout(() => {
      if (el.dataset.scrambling === "1") {
        el.textContent = final;
        delete el.dataset.scrambling;
      }
    }, 900);
    (function tick() {
      // se o idioma mudar no meio, respeita o texto novo
      if (el.dataset.scrambling !== "1") return;
      el.textContent = final
        .split("")
        .map((ch, i) => (ch === " " || i < (frame / total) * final.length ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join("");
      if (++frame <= total) requestAnimationFrame(tick);
      else {
        el.textContent = final;
        delete el.dataset.scrambling;
      }
    })();
  }
  document.getElementById("langToggle")?.addEventListener("click", () => {
    document.querySelectorAll("[data-scrambling]").forEach((el) => delete el.dataset.scrambling);
  }, true);

  /* ---- entrada 3D ao rolar, com atraso entre irmãos ---- */
  const revealSel = [
    ".section-title", ".section-kicker", ".tag-label",
    ".about-content p", ".about-profile-card",
    ".timeline-item", ".service-card", ".featured-card",
    ".portfolio-card", ".certificate-card", ".sub-title",
    ".updates-toolbar", ".contact-info", ".contact-form",
    ".contact-list li"
  ].join(",");

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.classList.contains("tag-label")) scramble(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(revealSel).forEach((el) => {
    if (el.closest(".home")) return; // o hero tem animação própria de entrada
    const siblings = Array.from(el.parentElement.children).filter((c) => c.matches(revealSel));
    el.style.setProperty("--d", Math.min(siblings.indexOf(el), 6) * 0.09 + "s");
    el.classList.add("reveal");
    io.observe(el);
  });

  // cards do feed de atualizações são criados dinamicamente
  const feed = document.getElementById("updatesFeed");
  if (feed) {
    new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType === 1 && n.classList.contains("update-card")) n.classList.add("pop3d");
      }));
    }).observe(feed, { childList: true });
  }

  if (!finePointer) return;

  /* ---- botões e ícones magnéticos ---- */
  document.querySelectorAll(".btn-box a, .header-cta, .home-sci a, .contact-socials a, .footer-icons a").forEach((btn) => {
    const strength = btn.matches(".btn-box a") ? 1 : 0.6;
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.2 * strength;
      const y = (e.clientY - r.top - r.height / 2) * 0.3 * strength;
      btn.style.translate = x + "px " + y + "px";
    });
    btn.addEventListener("mouseleave", () => (btn.style.translate = ""));
  });

  /* ---- inclinação 3D no card do TranscreveAI (camadas com profundidade) ---- */
  const featured = document.querySelector(".featured-card");
  if (featured) {
    featured.addEventListener("mousemove", (e) => {
      const r = featured.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      featured.style.transform = "perspective(1200px) rotateY(" + px * 7 + "deg) rotateX(" + -py * 7 + "deg)";
    });
    featured.addEventListener("mouseleave", () => (featured.style.transform = ""));
  }

  /* ---- editor do hero acompanha o mouse em 3D ---- */
  if (editorStage) {
    window.addEventListener("mousemove", (e) => {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      editorStage.style.setProperty("--mrx", (-py * 6).toFixed(2) + "deg");
      editorStage.style.setProperty("--mry", (px * 8).toFixed(2) + "deg");
    }, { passive: true });
  }
})();
