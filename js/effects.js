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
  
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  
      // link ativo no menu
      let current = "";
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
      });
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  
    /* ---- mouse: brilho global + spotlight nos cards (delegação, funciona nos cards dinâmicos) ---- */
    const SPOT = ".service-card, .portfolio-card, .certificate-card, .update-card, .about-profile-card, .timeline-card";
    let raf = null;
  
    document.addEventListener("mousemove", (e) => {
      if (glow) {
        glow.classList.add("on");
        if (!raf) {
          raf = requestAnimationFrame(() => {
            glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
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
    });
  
    document.addEventListener("mouseleave", () => glow && glow.classList.remove("on"));
  
    if (reduce) return;
  
    /* ---- entrada ao rolar, com pequeno atraso entre irmãos ---- */
    const revealSel = [
      ".section-title", ".section-kicker", ".tag-label",
      ".about-content p", ".about-profile-card",
      ".timeline-item", ".service-card", ".featured-card",
      ".portfolio-card", ".certificate-card", ".sub-title",
      ".updates-toolbar", ".contact-info", ".contact-form"
    ].join(",");
  
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  
    document.querySelectorAll(revealSel).forEach((el) => {
      // não aplica no hero (já visível ao carregar)
      if (el.closest(".home")) return;
      const siblings = Array.from(el.parentElement.children).filter((c) => c.matches(revealSel));
      el.style.setProperty("--d", Math.min(siblings.indexOf(el), 5) * 0.08 + "s");
      el.classList.add("reveal");
      io.observe(el);
    });
  
    if (!finePointer) return;
  
    /* ---- botões magnéticos ---- */
    document.querySelectorAll(".btn-box a").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });
  
    /* ---- inclinação 3D suave no card do TranscreveAI ---- */
    const featured = document.querySelector(".featured-card");
    if (featured) {
      featured.addEventListener("mousemove", (e) => {
        const r = featured.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        featured.style.transform =
          "perspective(1100px) rotateY(" + px * 5 + "deg) rotateX(" + -py * 5 + "deg)";
      });
      featured.addEventListener("mouseleave", () => (featured.style.transform = ""));
    }
  })();
