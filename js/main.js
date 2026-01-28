/* ================= YEAR ================= */
(() => {
  const y1 = document.getElementById("year");
  const y2 = document.getElementById("year-footer");
  const nowYear = String(new Date().getFullYear());
  if (y1) y1.textContent = nowYear;
  if (y2) y2.textContent = nowYear;
})();

/* ================= LANGUAGE (SYNC + LOCALSTORAGE + data-en/data-pt) ================= */
const toggleBtn = document.getElementById("langToggle");

function getSiteLang() {
  const stored = (localStorage.getItem("lang") || "").toLowerCase();
  if (stored === "en" || stored === "pt") return stored;

  const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
  if (htmlLang.startsWith("en")) return "en";
  if (htmlLang.startsWith("pt")) return "pt";

  if (window.currentLang === "en" || window.currentLang === "pt") return window.currentLang;

  return "en";
}

function setSiteLang(lang) {
  const safe = lang === "pt" ? "pt" : "en";
  document.documentElement.setAttribute("lang", safe);
  window.currentLang = safe;
  localStorage.setItem("lang", safe);

  // botão mostra a PRÓXIMA opção
  if (toggleBtn) toggleBtn.textContent = safe === "en" ? "PT" : "EN";
}

function applyTranslations(lang) {
  document.querySelectorAll("[data-en][data-pt]").forEach((el) => {
    const value = el.getAttribute(lang === "en" ? "data-en" : "data-pt");
    if (!value) return;

    const tag = el.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") {
      el.setAttribute("placeholder", value);
    } else {
      el.textContent = value;
    }
  });
}

// init language
(function initLanguage() {
  const initialLang = getSiteLang();
  setSiteLang(initialLang);
  applyTranslations(initialLang);
})();

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const next = getSiteLang() === "en" ? "pt" : "en";
    setSiteLang(next);
    applyTranslations(next);

    // atualiza UI do chat (se existir)
    if (typeof window.__syncChatUI === "function") window.__syncChatUI();
    if (typeof window.__syncQuickChipsLanguage === "function") window.__syncQuickChipsLanguage();
  });
}

/* ================= EMAILJS (SAFE) ================= */
(function initEmail() {
  try {
    if (typeof emailjs !== "undefined") {
      emailjs.init("eNCDz_pll4chDHtMl");
    } else {
      console.warn("EmailJS não carregou (emailjs undefined).");
    }
  } catch (e) {
    console.warn("Falha ao inicializar EmailJS:", e);
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submit_button");
    const status = document.getElementById("form-status");
    const lang = getSiteLang();

    if (!submitBtn || !status) return;

    submitBtn.textContent = lang === "pt" ? "Enviando..." : "Sending...";
    submitBtn.disabled = true;

    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const subjectEl = document.getElementById("subject");
    const messageEl = document.getElementById("mesage");

    try {
      if (typeof emailjs === "undefined") throw new Error("EmailJS não disponível.");

      emailjs
        .send("service_ceqthpt", "template_yziexyv", {
          name: nameEl ? nameEl.value : "",
          email: emailEl ? emailEl.value : "",
          subject: subjectEl ? subjectEl.value : "",
          message: messageEl ? messageEl.value : "",
        })
        .then(() => {
          status.textContent =
            status.dataset[lang] || (lang === "pt" ? "Mensagem enviada!" : "Message sent!");
          status.className = "form-status success";
          form.reset();
        })
        .catch(() => {
          status.textContent = lang === "pt" ? "Erro ao enviar. Tente novamente." : "Failed to send message.";
          status.className = "form-status error";
        })
        .finally(() => {
          submitBtn.textContent = lang === "pt" ? "Enviar Mensagem" : "Send Message";
          submitBtn.disabled = false;
        });
    } catch (err) {
      console.warn(err);
      status.textContent = lang === "pt" ? "Erro ao enviar. Tente novamente." : "Failed to send message.";
      status.className = "form-status error";
      submitBtn.textContent = lang === "pt" ? "Enviar Mensagem" : "Send Message";
      submitBtn.disabled = false;
    }
  });
})();

(function initChatbot() {
  const chatbot = document.getElementById("chatbot");
  const chatbotToggle = document.getElementById("chatbotToggle");
  const closeChat = document.getElementById("closeChat");
  const messages = document.getElementById("chatbotMessages");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendMessage");

  const quickTrack = document.getElementById("quickTrack");
  const quickLeft = document.getElementById("quickLeft");
  const quickRight = document.getElementById("quickRight");

  if (!chatbot || !chatbotToggle || !messages || !input || !sendBtn || !closeChat) {
    console.warn("Chatbot não inicializado: algum elemento não foi encontrado no DOM.");
    return;
  }

  const getLang = () => getSiteLang();

  const responses = {
    pt: {
      greeting:
        "Olá! 👋 Eu sou o MarquesBot.\nPosso te ajudar com projetos, tecnologias, carreira ou contato. O que você gostaria de saber?",
      hint: "💡 Dica: digite “ajuda” para ver tudo o que eu posso responder.",
      fallback:
        "Hmm, não entendi muito bem 🤔\nVocê pode perguntar sobre projetos, tecnologias, carreira, contato ou digitar “ajuda”.",
      thanks: "Por nada! 😄 Fico feliz em ajudar.",
      goodbye: "Até mais! 👋 Foi um prazer conversar com você.",

      portfolio:
        "🚀 Alguns projetos que já desenvolvi:\n\n" +
        "• Sistema de Login e Registro com Java + Spring Security\n" +
        "• APIs REST com Spring Boot\n" +
        "• Aplicações Front-end em React\n" +
        "• Projetos Full Stack com banco de dados\n\n" +
        "Quer que eu fale mais sobre Back-end (Java/Spring) ou Front-end (React)?",

      contact:
        "📬 Você pode entrar em contato comigo pelo formulário do site\n" +
        "ou diretamente pelo LinkedIn:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      stack:
        "🧠 Minha stack principal inclui:\n\n" +
        "• Java & Spring Boot\n" +
        "• APIs REST\n" +
        "• React\n" +
        "• SQL e NoSQL\n" +
        "• Docker\n" +
        "• Git\n\n" +
        "Se quiser, pergunte: “Qual tecnologia você domina mais?”",

      career:
        "💼 Sou desenvolvedor focado em evolução constante e boas práticas.\n\n" +
        "Tenho forte interesse em:\n" +
        "• Desenvolvimento de APIs\n" +
        "• Arquitetura limpa\n" +
        "• Código organizado e escalável",

      location: "📍 Atualmente estou no Brasil 🇧🇷",
      availability: "✅ Sim! Estou aberto a oportunidades freelance ou full-time.",

      react:
        "⚛️ Sim! Já trabalhei com React em diversos projetos.\n\n" +
        "• Criação de interfaces modernas e responsivas\n" +
        "• Integração com APIs REST\n" +
        "• Componentização e reutilização de código\n" +
        "• Boas práticas de organização e performance",

      github: "💻 Confira meus projetos no GitHub:\n👉 https://github.com/ArthurCoode",
      linkedin: "🔗 Meu LinkedIn:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      help:
        "📌 O que eu consigo responder:\n\n" +
        "• Projetos / Portfólio → “projetos”, “portfolio”, “quais projetos você fez?”\n" +
        "• Tecnologias / Stack → “stack”, “tecnologias”, “skills”\n" +
        "• Carreira / Sobre → “carreira”, “sobre você”, “experiência”\n" +
        "• Contato → “contato”, “email”\n" +
        "• GitHub → “github”, “repositórios”\n" +
        "• LinkedIn → “linkedin”\n" +
        "• Localização → “onde você está”, “local”\n" +
        "• Oportunidades → “disponível”, “trabalho”, “freelance”\n\n" +
        "✅ Exemplos rápidos:\n" +
        "• “Quais projetos você realizou?”\n" +
        "• “Qual sua stack?”\n" +
        "• “Você já trabalhou com React?”\n" +
        "• “Qual seu LinkedIn?”\n" +
        "• “Você está disponível para trabalho?”\n\n" +
        "Digite “ajuda” sempre que quiser ver isso novamente.",

      followup: [
        "Quer conhecer meus projetos mais recentes?",
        "Posso te contar mais sobre minha experiência com Java e Spring Boot.",
        "Quer ver alguns projetos de Front-end em React?"
      ]
    },

    en: {
      greeting:
        "Hi! 👋 I'm MarquesBot.\nI can help you with projects, technologies, career or contact. What would you like to know?",
      hint: "💡 Tip: type “help” to see everything I can answer.",
      fallback:
        "Sorry, I didn't quite get that 🤔\nYou can ask about projects, technologies, career, contact or type “help”.",
      thanks: "You're welcome! 😄 Glad I could help.",
      goodbye: "See you soon! 👋 It was great talking to you.",

      portfolio:
        "🚀 Here are some projects I've worked on:\n\n" +
        "• Login & Register system with Java + Spring Security\n" +
        "• REST APIs using Spring Boot\n" +
        "• Front-end applications with React\n" +
        "• Full Stack projects with databases\n\n" +
        "Would you like to focus on Back-end (Java/Spring) or Front-end (React)?",

      contact:
        "📬 You can contact me through the website form\n" +
        "or directly via LinkedIn:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      stack:
        "🧠 My main tech stack includes:\n\n" +
        "• Java & Spring Boot\n" +
        "• REST APIs\n" +
        "• React\n" +
        "• SQL & NoSQL\n" +
        "• Docker\n" +
        "• Git\n\n" +
        "Feel free to ask: “Which technologies are you strongest in?”",

      career:
        "💼 I'm a developer focused on continuous growth and best practices.\n\n" +
        "I really enjoy:\n" +
        "• API development\n" +
        "• Clean architecture\n" +
        "• Well-structured and scalable code",

      location: "📍 Currently based in Brazil 🇧🇷",
      availability: "✅ Yes! I'm open to freelance or full-time opportunities.",

      react:
        "⚛️ Yes! I’ve worked with React on several projects.\n\n" +
        "• Building modern and responsive interfaces\n" +
        "• REST API integrations\n" +
        "• Component-based architecture\n" +
        "• Clean and maintainable code",

      github: "💻 Check out my projects on GitHub:\n👉 https://github.com/ArthurCoode",
      linkedin: "🔗 My LinkedIn profile:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      help:
        "📌 What I can help you with:\n\n" +
        "• Projects / Portfolio → “projects”, “portfolio”\n" +
        "• Technologies / Stack → “stack”, “technologies”, “skills”\n" +
        "• Career / About → “career”, “about you”, “experience”\n" +
        "• Contact → “contact”, “email”\n" +
        "• GitHub → “github”, “repositories”\n" +
        "• LinkedIn → “linkedin”\n" +
        "• Location → “where are you”, “location”\n" +
        "• Opportunities → “available”, “job”, “freelance”\n\n" +
        "✅ Quick examples:\n" +
        "• “What projects have you built?”\n" +
        "• “What’s your stack?”\n" +
        "• “Have you worked with React?”\n" +
        "• “What’s your LinkedIn?”\n" +
        "• “Are you available for work?”\n\n" +
        "Type “help” anytime to see this again.",

      followup: [
        "Would you like to see my latest projects?",
        "Want to know more about my experience with Java and Spring Boot?",
        "I can show you some React front-end projects."
      ]
    }
  };

  function syncChatUI() {
    input.placeholder = getLang() === "en" ? "Type your message..." : "Digite sua mensagem...";
  }
  window.__syncChatUI = syncChatUI;

  function syncQuickChipsLanguage() {
    const lang = getLang();
    const chips = document.querySelectorAll(".quickbar-chip");

    const map = {
      "Oi, tudo bem?": { en: "Hi! How are you?", pt: "Oi, tudo bem?" },
      "ajuda": { en: "help", pt: "ajuda" },
      "Quais projetos você realizou?": { en: "What projects have you built?", pt: "Quais projetos você realizou?" },
      "Qual sua stack?": { en: "What’s your stack?", pt: "Qual sua stack?" },
      "Você tem experiência com Spring Boot?": { en: "Do you have experience with Spring Boot?", pt: "Você tem experiência com Spring Boot?" },
      "Você tem projetos fullstack?": { en: "Do you have fullstack projects?", pt: "Você tem projetos fullstack?" },
      "Você já trabalhou com React?": { en: "Have you worked with React?", pt: "Você já trabalhou com React?" },
      "Você está disponível para trabalho?": { en: "Are you available for work?", pt: "Você está disponível para trabalho?" },
      "Como posso entrar em contato?": { en: "How can I contact you?", pt: "Como posso entrar em contato?" },
      "Qual seu GitHub?": { en: "What’s your GitHub?", pt: "Qual seu GitHub?" },
      "Qual seu LinkedIn?": { en: "What’s your LinkedIn?", pt: "Qual seu LinkedIn?" },

      "Hi! How are you?": { en: "Hi! How are you?", pt: "Oi, tudo bem?" },
      "help": { en: "help", pt: "ajuda" },
      "What projects have you built?": { en: "What projects have you built?", pt: "Quais projetos você realizou?" },
      "What’s your stack?": { en: "What’s your stack?", pt: "Qual sua stack?" },
      "Do you have experience with Spring Boot?": { en: "Do you have experience with Spring Boot?", pt: "Você tem experiência com Spring Boot?" },
      "Do you have fullstack projects?": { en: "Do you have fullstack projects?", pt: "Você tem projetos fullstack?" },
      "Have you worked with React?": { en: "Have you worked with React?", pt: "Você já trabalhou com React?" },
      "Are you available for work?": { en: "Are you available for work?", pt: "Você está disponível para trabalho?" },
      "How can I contact you?": { en: "How can I contact you?", pt: "Como posso entrar em contato?" },
      "What’s your GitHub?": { en: "What’s your GitHub?", pt: "Qual seu GitHub?" },
      "What’s your LinkedIn?": { en: "What’s your LinkedIn?", pt: "Qual seu LinkedIn?" }
    };

    chips.forEach((btn) => {
      const current = (btn.getAttribute("data-msg") || "").trim();
      if (!current) return;

      if (map[current]) btn.setAttribute("data-msg", map[current][lang]);

      const msg = (btn.getAttribute("data-msg") || "").toLowerCase();
      if (msg === "ajuda" || msg === "help") {
        btn.textContent = lang === "en" ? "❓ Help" : "❓ Ajuda";
      }
    });
  }
  window.__syncQuickChipsLanguage = syncQuickChipsLanguage;

  function updateQuickArrows() {
    if (!quickTrack || !quickLeft || !quickRight) return;

    const maxScrollLeft = quickTrack.scrollWidth - quickTrack.clientWidth;
    const current = Math.round(quickTrack.scrollLeft);

    quickLeft.disabled = current <= 0;
    quickRight.disabled = current >= Math.round(maxScrollLeft);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function includesAny(text, keywords) {
    return keywords.some((word) => text.includes(word));
  }

  function getRandomFollowup(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function addUserMessage(text) {
    messages.innerHTML += `<div class="chatbot-message user">${escapeHtml(text)}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function addBotMessage(text) {
    const safe = escapeHtml(text).replace(/\n/g, "<br>");
    messages.innerHTML += `<div class="chatbot-message bot">${safe}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function botReply(textNorm) {
    const lang = responses[getLang()];
    let reply = "";

    if (includesAny(textNorm, ["ajuda", "help", "comandos", "commands", "/help", "/ajuda", "menu"])) {
      addBotMessage(lang.help);
      return;
    }

    if (includesAny(textNorm, ["oi", "ola", "hello", "hi", "hey"])) {
      reply = lang.greeting + "\n\n" + getRandomFollowup(lang.followup);
    }

    else if (includesAny(textNorm, ["react", "front end", "frontend", "front-end"])) {
      reply = lang.react;
    }

    else if (includesAny(textNorm, ["linkedin", "linked in"])) {
      reply = lang.linkedin;
    }

    else if (
      includesAny(textNorm, [
        "projeto", "projetos", "portfolio", "portfólio",
        "project", "projects", "repo", "repositorio", "repositório",
        "repository", "repositories"
      ])
    ) {
      reply = lang.portfolio;
    }
    // CONTACT (SEM "linkedin" AQUI)
    else if (includesAny(textNorm, ["contato", "contact", "email", "e-mail", "mensagem", "message"])) {
      reply = lang.contact;
    }
    // STACK
    else if (includesAny(textNorm, ["tecnologia", "tecnologias", "stack", "tech", "skills", "habilidades"])) {
      reply = lang.stack;
    }
    // CAREER / ABOUT
    else if (includesAny(textNorm, ["carreira", "career", "about", "sobre", "experiencia", "experiência", "bio"])) {
      reply = lang.career;
    }
    // LOCATION
    else if (includesAny(textNorm, ["onde", "where", "local", "location", "cidade", "pais", "país"])) {
      reply = lang.location;
    }
    // AVAILABILITY (AGORA NÃO ROUBA "trabalhou com react")
    else if (includesAny(textNorm, ["trabalho", "job", "hire", "oportunidade", "freelance", "vaga", "available"])) {
      reply = lang.availability;
    }
    // GITHUB
    else if (includesAny(textNorm, ["github", "git hub"])) {
      reply = lang.github;
    }
    // THANKS
    else if (includesAny(textNorm, ["obrigado", "obg", "valeu", "thanks", "thank you"])) {
      reply = lang.thanks;
    }
    // BYE
    else if (includesAny(textNorm, ["tchau", "bye", "ate mais", "até mais", "see you"])) {
      reply = lang.goodbye;
    }
    // FALLBACK
    else {
      reply = lang.fallback;
    }

    addBotMessage(reply);
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = "";

    setTimeout(() => botReply(normalize(text)), 250);
  }

  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.add("active");
    syncChatUI();
    syncQuickChipsLanguage();

    if (!messages.innerHTML.trim()) {
      const lang = responses[getLang()];
      addBotMessage(lang.greeting);
      setTimeout(() => addBotMessage(lang.hint), 450);
    }

    setTimeout(updateQuickArrows, 50);
  });

  closeChat.addEventListener("click", () => chatbot.classList.remove("active"));

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });


  if (quickTrack) {
    quickTrack.addEventListener("click", (e) => {
      const chip = e.target.closest(".quickbar-chip");
      if (!chip) return;

      const msg = chip.getAttribute("data-msg");
      if (!msg) return;

      input.value = msg;
      sendMessage();
    });

    quickTrack.addEventListener("scroll", updateQuickArrows);
    window.addEventListener("resize", updateQuickArrows);
  }

  if (quickLeft && quickTrack) {
    quickLeft.addEventListener("click", () => {
      const step = Math.max(180, Math.floor(quickTrack.clientWidth * 0.6));
      quickTrack.scrollBy({ left: -step, behavior: "smooth" });
      setTimeout(updateQuickArrows, 250);
    });
  }

  if (quickRight && quickTrack) {
    quickRight.addEventListener("click", () => {
      const step = Math.max(180, Math.floor(quickTrack.clientWidth * 0.6));
      quickTrack.scrollBy({ left: step, behavior: "smooth" });
      setTimeout(updateQuickArrows, 250);
    });
  }

  document.addEventListener("click", (e) => {
    if (
      chatbot.classList.contains("active") &&
      !chatbot.contains(e.target) &&
      !chatbotToggle.contains(e.target)
    ) {
      chatbot.classList.remove("active");
    }
  });

    (function initUpdatesFeed() {
        const feedEl = document.getElementById("updatesFeed");
        const tagsEl = document.getElementById("updatesTags");
        const searchEl = document.getElementById("updatesSearch");
        const moreBtn = document.getElementById("updatesMore");

        if (!feedEl || !tagsEl || !searchEl || !moreBtn) return;

        const getLangSafe = () => {
            try {
                return (typeof getSiteLang === "function" ? getSiteLang() : "en");
            } catch {
                return "en";
            }
        };

        const POSTS = [
            {
                id: 10,
                date: "2026-01-28",
                title: {
                    pt: "Versão beta do chatbot do meu portfólio está no ar",
                    en: "Beta version of my portfolio chatbot is live"
                },
                text: {
                    pt:
                        "Acabei de lançar a versão beta do chatbot integrado diretamente ao meu portfólio.\n" +
                        "A ideia é tornar a navegação mais interativa, ajudando visitantes a encontrarem rapidamente informações sobre meus projetos, serviços e tecnologias.\n" +
                        "O projeto também reforça meu foco em soluções modernas e escaláveis com atenção à experiência do usuário (UX).",
                    en:
                        "I’ve just launched the beta version of the chatbot integrated directly into my portfolio.\n" +
                        "The goal is to make navigation more interactive, helping visitors quickly find information about my projects, services, and technologies.\n" +
                        "This project also reflects my focus on building modern, scalable solutions with UX in mind."
                },
                tags: ["Chatbot", "JavaScript", "UX"],
                links: [{ label: "Portfolio", url: "https://marquescode.com" }],
                image: ""
            },

            {
                id: 11,
                date: "2026-01-26",
                title: {
                    pt: "Novo projeto no GitHub: API de autenticação com JWT",
                    en: "New GitHub project: authentication API with JWT"
                },
                text: {
                    pt:
                        "Publiquei uma API completa de autenticação utilizando Spring Boot, Spring Security e JWT.\n" +
                        "O foco foi aplicar boas práticas de segurança e uma arquitetura bem organizada, com fluxo de Register e Login.\n" +
                        "Inclui: JWT, BCrypt e rotas protegidas.",
                    en:
                        "I published a complete authentication API using Spring Boot, Spring Security, and JWT.\n" +
                        "The focus was on applying security best practices and a well-organized architecture, including Register and Login.\n" +
                        "Includes: JWT, BCrypt, and protected routes."
                },
                tags: ["Java", "Spring Boot", "JWT"],
                links: [{ label: "GitHub", url: "https://lnkd.in/e7XYzpRj" }],
                image: ""
            },

            {
                id: 12,
                date: "2026-01-22",
                title: {
                    pt: "Evolução contínua com Java na prática",
                    en: "Continuous growth with practical Java projects"
                },
                text: {
                    pt:
                        "Tenho focado meus estudos em Java com ênfase em projetos práticos.\n" +
                        "Meu objetivo é fortalecer fundamentos técnicos, aplicar clean code e melhorar organização e legibilidade do código.\n" +
                        "Sempre conectando teoria e prática para construir soluções funcionais e escaláveis.",
                    en:
                        "I’ve been focusing my Java studies with an emphasis on practical projects.\n" +
                        "My goal is to strengthen fundamentals, apply clean code, and improve code organization and readability.\n" +
                        "Always connecting theory with practice to build functional and scalable solutions."
                },
                tags: ["Java", "Learning", "Clean Code"],
                links: [],
                image: ""
            },

            {
                id: 13,
                date: "2026-01-10",
                title: {
                    pt: "Projetos Web entregues: sites institucionais e corporativos",
                    en: "Delivered web projects: institutional and corporate websites"
                },
                text: {
                    pt:
                        "Nos últimos meses, desenvolvi e entreguei alguns sites com foco em visual moderno, responsividade e experiência do usuário.\n" +
                        "Aqui estão alguns projetos publicados:\n" +
                        "• Demolay Caetité\n" +
                        "• PNCSB\n" +
                        "• NextDev",
                    en:
                        "Over the past months, I’ve developed and delivered websites focused on modern UI, responsiveness, and user experience.\n" +
                        "Here are some live projects:\n" +
                        "• Demolay Caetité\n" +
                        "• PNCSB\n" +
                        "• NextDev"
                },
                tags: ["Web", "Frontend", "Deploy"],
                links: [
                    { label: "Demolay", url: "https://demolaycaetite.com.br" },
                    { label: "PNCSB", url: "https://pncsb.com.br" },
                    { label: "NextDev", url: "https://nextdev.company" }
                ],
                image: ""
            }
        ];

        let selectedTag = "All";
        let visibleCount = 4;

        const formatDate = (iso, lang) => {
            const [y, m, d] = iso.split("-").map(Number);
            const dateObj = new Date(y, m - 1, d);
            return dateObj.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
            });
        };

        const getText = (obj, lang) => (obj && (obj[lang] || obj.en || obj.pt)) || "";

        const buildTags = () => {
            const allTags = new Set();
            POSTS.forEach(p => (p.tags || []).forEach(t => allTags.add(t)));
            const tags = ["All", ...Array.from(allTags).sort((a, b) => a.localeCompare(b))];

            const lang = getLangSafe();
            tagsEl.innerHTML = tags.map(tag => {
                const label = (tag === "All") ? (lang === "pt" ? "Todos" : "All") : tag;
                const active = tag === selectedTag ? "active" : "";
                return `<button class="updates-tag ${active}" data-tag="${tag}">${label}</button>`;
            }).join("");

            tagsEl.querySelectorAll(".updates-tag").forEach(btn => {
                btn.addEventListener("click", () => {
                    selectedTag = btn.dataset.tag;
                    visibleCount = 4;
                    render();
                    buildTags();
                });
            });
        };

        const applyLangToSearchPlaceholder = () => {
            const lang = getLangSafe();
            const pt = searchEl.getAttribute("data-pt");
            const en = searchEl.getAttribute("data-en");
            searchEl.placeholder = (lang === "pt" ? pt : en) || searchEl.placeholder;
            moreBtn.textContent = (lang === "pt"
                ? (moreBtn.getAttribute("data-pt") || "Carregar mais")
                : (moreBtn.getAttribute("data-en") || "Load more"));
        };

        const render = () => {
            const lang = getLangSafe();
            const q = (searchEl.value || "").trim().toLowerCase();

            const filtered = POSTS
                .slice()
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .filter(p => {
                    const matchesTag = selectedTag === "All" ? true : (p.tags || []).includes(selectedTag);
                    const text = (getText(p.title, lang) + " " + getText(p.text, lang) + " " + (p.tags || []).join(" ")).toLowerCase();
                    const matchesSearch = q ? text.includes(q) : true;
                    return matchesTag && matchesSearch;
                });

            const visible = filtered.slice(0, visibleCount);

            feedEl.innerHTML = visible.map(p => {
                const title = getText(p.title, lang);
                const text = getText(p.text, lang);
                const date = formatDate(p.date, lang);
                const pills = (p.tags || []).map(t => `<span class="update-pill">#${t}</span>`).join("");

                const links = (p.links || []).map(l => `
        <a class="update-pill update-link" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>
      `).join("");

                const media = p.image ? `
        <div class="update-media">
          <img src="${p.image}" alt="${title}">
        </div>
      ` : "";

                return `
        <article class="update-card">
          <div class="update-header">
            <div class="update-author">
              <img class="update-avatar" src="assets/images/Perfil.png" alt="Arthur">
              <div>
                <strong>Arthur Marques</strong>
                <span class="update-meta">${lang === "pt" ? "Atualização" : "Update"}</span>
              </div>
            </div>
            <div class="update-date">${date}</div>
          </div>

          <div class="update-body">
            <h3 class="update-title">${title}</h3>
            <p class="update-text">${text.replace(/\n/g, "<br>")}</p>
            ${media}
            <div class="update-actions">
              ${pills}
              ${links}
            </div>
          </div>
        </article>
      `;
            }).join("");

            moreBtn.style.display = (filtered.length <= visibleCount) ? "none" : "block";
        };

        searchEl.addEventListener("input", () => {
            visibleCount = 4;
            render();
        });

        moreBtn.addEventListener("click", () => {
            visibleCount += 4;
            render();
        });

        const langToggle = document.getElementById("langToggle");
        if (langToggle) {
            langToggle.addEventListener("click", () => {
                setTimeout(() => {
                    applyLangToSearchPlaceholder();
                    buildTags();
                    render();
                }, 30);
            });
        }

        applyLangToSearchPlaceholder();
        buildTags();
        render();
    })();


    syncChatUI();
  syncQuickChipsLanguage();
})();
