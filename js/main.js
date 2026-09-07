/* ================= YEAR ================= */
(() => {
  const y1 = document.getElementById("year");
  const y2 = document.getElementById("year-footer");
  const nowYear = String(new Date().getFullYear());
  if (y1) y1.textContent = nowYear;
  if (y2) y2.textContent = nowYear;
})();

/* ================= HERO EDITOR — type-in + page-flip Java/PHP showcase ================= */
(function initEditorShowcase() {
  const stage = document.getElementById("editorWindow");
  const body = document.getElementById("editorBody");
  const filenameEl = document.getElementById("editorFilename");
  if (!stage || !body || !filenameEl) return;

  // Respect reduced-motion: leave the static fallback markup untouched.
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const JAVA = {
    file: "Developer.java",
    lines: [
      { plain: "public class Developer {", html: '<span class="kw">public</span> <span class="kw">class</span> <span class="tp">Developer</span> {' },
      { plain: '    private String name = "Arthur Marques";', html: '    <span class="kw">private</span> <span class="tp">String</span> <span class="pl">name</span> = <span class="str">"Arthur Marques"</span>;' },
      { plain: '    private String[] stack = { "Java", "PHP", "SQL" };', html: '    <span class="kw">private</span> <span class="tp">String[]</span> <span class="pl">stack</span> = { <span class="str">"Java"</span>, <span class="str">"PHP"</span>, <span class="str">"SQL"</span> };' },
      { plain: "", html: "" },
      { plain: "    // produto próprio, em produção", html: '    <span class="cm">// produto próprio, em produção</span>' },
      { plain: '    private String product = "TranscreveAI";', html: '    <span class="kw">private</span> <span class="tp">String</span> <span class="pl">product</span> = <span class="str">"TranscreveAI"</span>;' },
      { plain: "", html: "" },
      { plain: "    public boolean isAvailable() {", html: '    <span class="kw">public</span> <span class="tp">boolean</span> <span class="fn">isAvailable</span>() {' },
      { plain: "        return true;", html: '        <span class="kw">return</span> <span class="kw">true</span>;' },
      { plain: "    }", html: "    }" },
      { plain: "}", html: "}" }
    ]
  };

  const PHP = {
    file: "Developer.php",
    lines: [
      { plain: "<?php", html: '<span class="kw">&lt;?php</span>' },
      { plain: "", html: "" },
      { plain: "class Developer {", html: '<span class="kw">class</span> <span class="tp">Developer</span> {' },
      { plain: '    private string $name = "Arthur Marques";', html: '    <span class="kw">private</span> <span class="tp">string</span> <span class="pl">$name</span> = <span class="str">"Arthur Marques"</span>;' },
      { plain: '    private array $stack = ["Java", "PHP", "SQL"];', html: '    <span class="kw">private</span> <span class="tp">array</span> <span class="pl">$stack</span> = [<span class="str">"Java"</span>, <span class="str">"PHP"</span>, <span class="str">"SQL"</span>];' },
      { plain: "", html: "" },
      { plain: "    // produto próprio, em produção", html: '    <span class="cm">// produto próprio, em produção</span>' },
      { plain: '    private string $product = "TranscreveAI";', html: '    <span class="kw">private</span> <span class="tp">string</span> <span class="pl">$product</span> = <span class="str">"TranscreveAI"</span>;' },
      { plain: "", html: "" },
      { plain: "    public function isAvailable(): bool {", html: '    <span class="kw">public</span> <span class="kw">function</span> <span class="fn">isAvailable</span>(): <span class="tp">bool</span> {' },
      { plain: "        return true;", html: '        <span class="kw">return</span> <span class="kw">true</span>;' },
      { plain: "    }", html: "    }" },
      { plain: "}", html: "}" }
    ]
  };

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function typeLines(lines) {
    return new Promise((resolve) => {
      body.innerHTML = "";
      let i = 0;

      function nextLine() {
        if (i >= lines.length) {
          resolve();
          return;
        }

        const line = lines[i];
        const row = document.createElement("div");
        row.className = "code-line";

        const ln = document.createElement("span");
        ln.className = "ln";
        ln.textContent = String(i + 1);

        const text = document.createElement("span");
        row.appendChild(ln);
        row.appendChild(text);
        body.appendChild(row);

        if (!line.plain) {
          i++;
          setTimeout(nextLine, 90);
          return;
        }

        const cursor = document.createElement("span");
        cursor.className = "cursor-blink";
        row.appendChild(cursor);

        let c = 0;
        function typeChar() {
          if (c <= line.plain.length) {
            text.textContent = line.plain.slice(0, c);
            c++;
            setTimeout(typeChar, 12 + Math.random() * 20);
          } else {
            cursor.remove();
            row.innerHTML = `<span class="ln">${i + 1}</span>${line.html}`;
            i++;
            setTimeout(nextLine, 55);
          }
        }
        typeChar();
      }

      nextLine();
    });
  }

  function flipTo(next) {
    return new Promise((resolve) => {
      stage.classList.add("flipping");

      // swap the file tab + clear the page right as it's edge-on (invisible),
      // so the flip reveals a blank page ready to be written on
      setTimeout(() => {
        filenameEl.textContent = next.file;
        body.innerHTML = "";
      }, 350);

      setTimeout(() => {
        stage.classList.remove("flipping");
        resolve();
      }, 700);
    });
  }

  async function runShowcase() {
    let current = JAVA;
    await typeLines(current.lines);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const lastLine = body.lastElementChild;
      if (lastLine) {
        const cursor = document.createElement("span");
        cursor.className = "cursor-blink";
        lastLine.appendChild(cursor);
      }

      await wait(2600);

      const next = current === JAVA ? PHP : JAVA;
      await flipTo(next);
      current = next;
      await typeLines(current.lines);
    }
  }

  runShowcase();
})();

/* ================= HEADER SCROLL STATE ================= */
(() => {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
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

  return "pt";
}

function setSiteLang(lang) {
  const safe = lang === "en" ? "en" : "pt";
  document.documentElement.setAttribute("lang", safe === "pt" ? "pt-BR" : "en");
  window.currentLang = safe;
  localStorage.setItem("lang", safe);

  // botão mostra a PRÓXIMA opção
  if (toggleBtn) toggleBtn.textContent = safe === "pt" ? "EN" : "PT";
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

/* =========================================================================
   CHATBOT INTELIGENTE — pontuação de intenção, tolerância a erro de
   digitação, memória de contexto, indicador de "digitando..." e chips
   de sugestão clicáveis no fallback.
   ========================================================================= */
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

  /* ================= RESPOSTAS ================= */
  const responses = {
    pt: {
      greeting:
        "Olá! 👋 Eu sou o MarquesBot.\nPosso te ajudar com projetos, tecnologias, o TranscreveAI, carreira ou contato. O que você gostaria de saber?",
      greetingAgain: "Oi de novo! 😄 Em que mais posso ajudar?",
      hint: "💡 Dica: digite “ajuda” para ver tudo o que eu posso responder.",
      fallback: "Hmm, não entendi muito bem 🤔 Você pode tentar um desses assuntos:",
      thanks: "Por nada! 😄 Fico feliz em ajudar.",
      goodbye: "Até mais! 👋 Foi um prazer conversar com você.",

      portfolio:
        "🚀 Alguns projetos que já desenvolvi:\n\n" +
        "• TranscreveAI — SaaS de transcrição de reuniões com IA (produto próprio)\n" +
        "• APIs REST em Java com Spring Boot\n" +
        "• Sites institucionais para clientes\n" +
        "• Projetos Full Stack com banco de dados\n\n" +
        "Quer que eu fale mais sobre o TranscreveAI, sobre Java/PHP ou sobre os sites institucionais?",

      contact:
        "📬 Você pode entrar em contato comigo pelo formulário do site\n" +
        "ou diretamente pelo LinkedIn:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      stack:
        "🧠 Minha stack principal inclui:\n\n" +
        "• Java & Spring Boot\n" +
        "• PHP\n" +
        "• APIs REST\n" +
        "• SQL e NoSQL\n" +
        "• React\n" +
        "• Docker\n" +
        "• Git\n\n" +
        "Se quiser, pergunte sobre uma tecnologia específica, tipo “Java” ou “Docker”.",

      career:
        "💼 Sou desenvolvedor focado em Java e PHP, com evolução constante e boas práticas.\n\n" +
        "Tenho forte interesse em:\n" +
        "• Desenvolvimento de APIs\n" +
        "• Arquitetura limpa\n" +
        "• Código organizado e escalável\n\n" +
        "Também sou dono de produto: mantenho o TranscreveAI em produção sozinho, do backend ao suporte.",

      location: "📍 Atualmente estou no Brasil 🇧🇷",
      availability: "✅ Sim! Estou aberto a oportunidades freelance ou full-time, principalmente em Java e PHP.",

      java:
        "☕ Sim! Java é meu foco principal.\n\n" +
        "• APIs REST com Spring Boot\n" +
        "• Programação orientada a objetos\n" +
        "• JPA e persistência em banco relacional\n" +
        "• Arquitetura organizada em camadas",

      php:
        "🐘 Sim! Trabalho com PHP no back-end.\n\n" +
        "• Aplicações e integrações server-side\n" +
        "• Acesso e modelagem de banco de dados\n" +
        "• Lógica de negócio e rotas\n\n" +
        "Se quiser ver um projeto específico em PHP, me pergunte sobre “projetos”.",

      sql:
        "🗄️ Trabalho com banco de dados relacionais e não relacionais.\n\n" +
        "• Modelagem de dados e normalização\n" +
        "• SQL (consultas, joins, índices)\n" +
        "• Persistência com JPA/Hibernate\n" +
        "• NoSQL para casos específicos",

      docker:
        "🐳 Uso Docker para padronizar ambientes e facilitar deploy.\n\n" +
        "• Containers para apps Java/PHP\n" +
        "• Dockerfile e docker-compose\n" +
        "• Ambientes consistentes entre dev e produção",

      git:
        "🌿 Uso Git no dia a dia para versionamento.\n\n" +
        "• Fluxo com branches e pull requests\n" +
        "• Histórico organizado de commits\n" +
        "• GitHub como repositório principal",

      transcreveai:
        "🎙️ O TranscreveAI é meu produto próprio: um SaaS de transcrição de reuniões e insights com IA.\n\n" +
        "• Extensão de Chrome que grava o áudio do Google Meet\n" +
        "• Transcrição e resumo automático com IA\n" +
        "• Painel para os usuários acompanharem tudo\n" +
        "• Está no ar em produção: 👉 https://transcreveia.com",

      react:
        "⚛️ Sim! Já trabalhei com React em alguns projetos.\n\n" +
        "• Criação de interfaces responsivas\n" +
        "• Integração com APIs REST\n" +
        "• Componentização e reutilização de código",

      github: "💻 Confira meus projetos no GitHub:\n👉 https://github.com/ArthurCoode",
      linkedin: "🔗 Meu LinkedIn:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      whoareyou:
        "🙋 Eu sou o MarquesBot, o assistente virtual do portfólio do Arthur Marques.\n" +
        "Posso te contar sobre os projetos, a stack e o TranscreveAI dele. Por onde quer começar?",
      isbot: "🤖 Sou sim, um chatbot! Feito para te ajudar a navegar por este portfólio rapidinho.",
      howareyou: "😄 Tudo ótimo por aqui, obrigado por perguntar! E você, o que está buscando no portfólio?",
      joke:
        "😄 Por que o desenvolvedor Java foi ao terapeuta?\n" +
        "Porque ele tinha muitas classes abstratas e nenhuma implementação emocional. 😅",

      help:
        "📌 O que eu consigo responder:\n\n" +
        "• Projetos / Portfólio → “projetos”, “portfolio”\n" +
        "• TranscreveAI → “transcreveai”\n" +
        "• Tecnologias / Stack → “stack”, “tecnologias”\n" +
        "• Java, PHP, SQL, Docker, Git, React\n" +
        "• Carreira / Sobre → “carreira”, “sobre você”\n" +
        "• Contato → “contato”, “email”\n" +
        "• GitHub / LinkedIn\n" +
        "• Localização → “onde você está”\n" +
        "• Oportunidades → “disponível”, “freelance”\n\n" +
        "Digite “ajuda” sempre que quiser ver isso novamente.",

      followup: [
        "Quer conhecer o TranscreveAI, meu produto próprio?",
        "Posso te contar mais sobre minha experiência com Java e PHP.",
        "Quer ver alguns projetos institucionais que já entreguei?"
      ],

      clarify: (a, b) => `🤔 Você quis dizer sobre **${a}** ou **${b}**?`,

      suggestionLabels: {
        portfolio: "🚀 Projetos", stack: "🧠 Stack", transcreveai: "🎙️ TranscreveAI",
        contact: "📬 Contato", java: "☕ Java", php: "🐘 PHP", help: "❓ Ajuda"
      }
    },

    en: {
      greeting:
        "Hi! 👋 I'm MarquesBot.\nI can help you with projects, technologies, TranscreveAI, career or contact. What would you like to know?",
      greetingAgain: "Hey again! 😄 What else can I help with?",
      hint: "💡 Tip: type “help” to see everything I can answer.",
      fallback: "Sorry, I didn't quite get that 🤔 You could try one of these topics:",
      thanks: "You're welcome! 😄 Glad I could help.",
      goodbye: "See you soon! 👋 It was great talking to you.",

      portfolio:
        "🚀 Here are some projects I've worked on:\n\n" +
        "• TranscreveAI — AI meeting-transcription SaaS (own product)\n" +
        "• REST APIs in Java with Spring Boot\n" +
        "• Institutional websites for clients\n" +
        "• Full Stack projects with databases\n\n" +
        "Want to hear more about TranscreveAI, Java/PHP, or the client websites?",

      contact:
        "📬 You can contact me through the website form\n" +
        "or directly via LinkedIn:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      stack:
        "🧠 My main tech stack includes:\n\n" +
        "• Java & Spring Boot\n" +
        "• PHP\n" +
        "• REST APIs\n" +
        "• SQL & NoSQL\n" +
        "• React\n" +
        "• Docker\n" +
        "• Git\n\n" +
        "Feel free to ask about a specific one, like “Java” or “Docker”.",

      career:
        "💼 I'm a developer focused on Java and PHP, with continuous growth and best practices.\n\n" +
        "I really enjoy:\n" +
        "• API development\n" +
        "• Clean architecture\n" +
        "• Well-structured and scalable code\n\n" +
        "I'm also a product owner: I run TranscreveAI in production on my own, from backend to support.",

      location: "📍 Currently based in Brazil 🇧🇷",
      availability: "✅ Yes! I'm open to freelance or full-time opportunities, mainly in Java and PHP.",

      java:
        "☕ Yes! Java is my main focus.\n\n" +
        "• REST APIs with Spring Boot\n" +
        "• Object-oriented programming\n" +
        "• JPA and relational database persistence\n" +
        "• Layered, organized architecture",

      php:
        "🐘 Yes! I work with PHP on the back-end.\n\n" +
        "• Server-side applications and integrations\n" +
        "• Database access and modeling\n" +
        "• Business logic and routing\n\n" +
        "Ask me about “projects” if you want to see a specific PHP project.",

      sql:
        "🗄️ I work with both relational and non-relational databases.\n\n" +
        "• Data modeling and normalization\n" +
        "• SQL (queries, joins, indexes)\n" +
        "• Persistence with JPA/Hibernate\n" +
        "• NoSQL for specific use cases",

      docker:
        "🐳 I use Docker to standardize environments and simplify deployment.\n\n" +
        "• Containers for Java/PHP apps\n" +
        "• Dockerfile and docker-compose\n" +
        "• Consistent environments across dev and production",

      git:
        "🌿 I use Git daily for version control.\n\n" +
        "• Branch and pull-request workflow\n" +
        "• Clean, organized commit history\n" +
        "• GitHub as the main repository",

      transcreveai:
        "🎙️ TranscreveAI is my own product: an AI meeting-transcription and insights SaaS.\n\n" +
        "• Chrome extension that records Google Meet audio\n" +
        "• Automatic AI transcription and summaries\n" +
        "• Dashboard for users to track everything\n" +
        "• Live in production: 👉 https://transcreveia.com",

      react:
        "⚛️ Yes! I've worked with React on a few projects.\n\n" +
        "• Building responsive interfaces\n" +
        "• REST API integrations\n" +
        "• Component-based, reusable code",

      github: "💻 Check out my projects on GitHub:\n👉 https://github.com/ArthurCoode",
      linkedin: "🔗 My LinkedIn profile:\n👉 https://www.linkedin.com/in/arthur-marques-317baa38a/",

      whoareyou:
        "🙋 I'm MarquesBot, Arthur Marques' portfolio assistant.\n" +
        "I can tell you about his projects, stack and TranscreveAI. Where do you want to start?",
      isbot: "🤖 Yep, I'm a chatbot! Built to help you navigate this portfolio quickly.",
      howareyou: "😄 Doing great, thanks for asking! What are you looking for in the portfolio?",
      joke:
        "😄 Why did the Java developer need glasses?\n" +
        "Because he couldn't C#. 😅",

      help:
        "📌 What I can help you with:\n\n" +
        "• Projects / Portfolio → “projects”, “portfolio”\n" +
        "• TranscreveAI → “transcreveai”\n" +
        "• Technologies / Stack → “stack”, “technologies”\n" +
        "• Java, PHP, SQL, Docker, Git, React\n" +
        "• Career / About → “career”, “about you”\n" +
        "• Contact → “contact”, “email”\n" +
        "• GitHub / LinkedIn\n" +
        "• Location → “where are you”\n" +
        "• Opportunities → “available”, “freelance”\n\n" +
        "Type “help” anytime to see this again.",

      followup: [
        "Want to know about TranscreveAI, my own product?",
        "I can tell you more about my experience with Java and PHP.",
        "Want to see some institutional projects I've delivered?"
      ],

      clarify: (a, b) => `🤔 Did you mean **${a}** or **${b}**?`,

      suggestionLabels: {
        portfolio: "🚀 Projects", stack: "🧠 Stack", transcreveai: "🎙️ TranscreveAI",
        contact: "📬 Contact", java: "☕ Java", php: "🐘 PHP", help: "❓ Help"
      }
    }
  };

  /* ================= INTENÇÕES (com pontuação, não ordem fixa) ================= */
  // patterns: frases/palavras-chave em pt+en misturadas (a resposta é sempre no idioma da UI)
  const INTENT_RULES = [
    { id: "help", weight: 3, patterns: ["ajuda", "help", "comandos", "commands", "menu"] },
    { id: "thanks", weight: 3, patterns: ["obrigado", "obg", "valeu", "thanks", "thank you"] },
    { id: "bye", weight: 3, patterns: ["tchau", "bye", "ate mais", "see you", "falou"] },
    { id: "isbot", weight: 3, patterns: ["voce e um robo", "voce e um bot", "are you a bot", "are you real", "voce e real"] },
    { id: "whoareyou", weight: 3, patterns: ["quem e voce", "who are you", "quem e voce mesmo"] },
    { id: "howareyou", weight: 3, patterns: ["como voce esta", "tudo bem", "como vai", "how are you"] },
    { id: "joke", weight: 3, patterns: ["piada", "conte uma piada", "tell me a joke", "joke"] },
    { id: "transcreveai", weight: 3, patterns: ["transcreveai", "transcreve ai", "transcricao", "transcricao de reuniao"] },
    { id: "linkedin", weight: 3, patterns: ["linkedin", "linked in"] },
    { id: "github", weight: 2, patterns: ["github", "git hub", "repositorio", "repository", "repositories"] },
    { id: "docker", weight: 2, patterns: ["docker", "container", "containers"] },
    { id: "git", weight: 2, patterns: ["git", "versionamento", "version control"] },
    { id: "sql", weight: 2, patterns: ["sql", "banco de dados", "database", "postgres", "mysql", "nosql"] },
    { id: "php", weight: 2, patterns: ["php"] },
    { id: "java", weight: 2, patterns: ["java", "spring boot", "spring"], excludes: ["javascript"] },
    { id: "react", weight: 2, patterns: ["react", "frontend", "front end", "front-end"] },
    { id: "portfolio", weight: 2, patterns: ["projeto", "projetos", "portfolio", "project", "projects"] },
    { id: "contact", weight: 2, patterns: ["contato", "contact", "email", "e-mail", "mensagem", "message"] },
    { id: "stack", weight: 2, patterns: ["tecnologia", "tecnologias", "stack", "tech", "skills", "habilidades"] },
    { id: "career", weight: 2, patterns: ["carreira", "career", "sobre voce", "about you", "experiencia", "experience", "bio"] },
    { id: "location", weight: 2, patterns: ["onde voce esta", "where are you", "localizacao", "location", "cidade", "pais"] },
    { id: "availability", weight: 2, patterns: ["trabalho", "job", "hire", "oportunidade", "freelance", "vaga", "available", "disponivel"] },
    { id: "greeting", weight: 1, patterns: ["oi", "ola", "hello", "hi", "hey", "bom dia", "boa tarde", "boa noite", "good morning"] }
  ];

  const SUGGESTION_ORDER = ["portfolio", "stack", "transcreveai", "contact", "java", "php", "help"];
  const AFFIRM_WORDS = ["sim", "yes", "claro", "sure", "ok", "okay", "quero", "manda", "conta mais", "conta mais sobre isso", "tell me more", "more", "mais"];

  /* ================= UTILIDADES ================= */
  function normalize(text) {
    return String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function tokenize(textNorm) {
    return textNorm.split(/[^a-z0-9]+/).filter(Boolean);
  }

  // distância de Levenshtein simples, para tolerar erros de digitação
  function levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
      const row = [i];
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        row[j] = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      prev = row;
    }
    return prev[n];
  }

  function scoreRule(rule, textNorm, tokens) {
    if (rule.excludes && rule.excludes.some((e) => textNorm.includes(normalize(e)))) return 0;

    let score = 0;
    for (const raw of rule.patterns) {
      const p = normalize(raw);
      if (textNorm.includes(p)) {
        score += p.split(" ").length * 2; // frases com mais palavras pesam mais
        continue;
      }
      // fuzzy match só para palavras únicas (evita falso-positivo em frases)
      if (!p.includes(" ") && p.length >= 4) {
        for (const t of tokens) {
          if (Math.abs(t.length - p.length) <= 2) {
            const threshold = p.length <= 5 ? 1 : 2;
            if (levenshtein(t, p) <= threshold) {
              score += 1;
              break;
            }
          }
        }
      }
    }
    return score * (rule.weight || 1);
  }

  // Retorna { id } | { ambiguous: [idA, idB] } | null (sem match)
  function classifyIntent(rawText) {
    const textNorm = normalize(rawText);
    const tokens = tokenize(textNorm);

    const scored = INTENT_RULES
      .map((rule) => ({ id: rule.id, score: scoreRule(rule, textNorm, tokens) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!scored.length) return null;
    if (scored.length > 1 && scored[0].score === scored[1].score) {
      return { ambiguous: [scored[0].id, scored[1].id] };
    }
    return { id: scored[0].id };
  }

  /* ================= UI HELPERS ================= */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function addUserMessage(text) {
    messages.innerHTML += `<div class="chatbot-message user">${escapeHtml(text)}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function addBotMessage(text) {
    const div = document.createElement("div");
    div.className = "chatbot-message bot";
    div.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function addSuggestionChips(container, ids) {
    const lang = responses[getLang()];
    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.flexWrap = "wrap";
    box.style.gap = "6px";
    box.style.marginTop = "10px";

    ids.forEach((id) => {
      const label = lang.suggestionLabels[id];
      if (!label) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quickbar-chip";
      btn.style.cursor = "pointer";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        input.value = label.replace(/^\S+\s/, ""); // remove o emoji, manda o texto
        sendMessage();
      });
      box.appendChild(btn);
    });

    container.appendChild(box);
  }

  // bolha de "digitando..." antes de revelar a resposta final
  function showTypingThenReply(text, suggestionIds) {
    const bubble = document.createElement("div");
    bubble.className = "chatbot-message bot";
    bubble.textContent = "•••";
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;

    const delay = Math.min(1200, 280 + text.length * 6);
    setTimeout(() => {
      bubble.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
      if (suggestionIds && suggestionIds.length) addSuggestionChips(bubble, suggestionIds);
      messages.scrollTop = messages.scrollHeight;
    }, delay);
  }

  function getRandomFollowup(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ================= LÓGICA DE RESPOSTA (com contexto) ================= */
  let lastIntent = null;
  let hasGreeted = false;

  function botReply(rawText) {
    const lang = responses[getLang()];
    const textNorm = normalize(rawText);
    const result = classifyIntent(rawText);

    // desambiguação: duas intenções empatadas
    if (result && result.ambiguous) {
      const [a, b] = result.ambiguous;
      showTypingThenReply(lang.clarify(a, b), [a, b]);
      lastIntent = null;
      return;
    }

    // sem match direto: tenta usar o contexto (resposta curta tipo "sim"/"conta mais")
    if (!result) {
      const isShortAffirmation =
        textNorm.split(" ").length <= 4 &&
        AFFIRM_WORDS.some((w) => textNorm.includes(normalize(w)));

      if (isShortAffirmation && lastIntent && lang[lastIntent]) {
        showTypingThenReply(lang[lastIntent]);
        return;
      }

      showTypingThenReply(lang.fallback, SUGGESTION_ORDER.slice(0, 4));
      return;
    }

    const id = result.id;

    if (id === "greeting") {
      const text = hasGreeted ? lang.greetingAgain : lang.greeting + "\n\n" + getRandomFollowup(lang.followup);
      hasGreeted = true;
      showTypingThenReply(text, SUGGESTION_ORDER.slice(0, 4));
      lastIntent = null;
      return;
    }

    if (id === "help") {
      showTypingThenReply(lang.help);
      lastIntent = null;
      return;
    }

    if (lang[id] !== undefined) {
      showTypingThenReply(lang[id]);
      lastIntent = id; // guarda contexto para follow-ups tipo "conta mais"
      return;
    }

    showTypingThenReply(lang.fallback, SUGGESTION_ORDER.slice(0, 4));
    lastIntent = null;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = "";
    botReply(text);
  }

  /* ================= SINCRONIA DE IDIOMA ================= */
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
      "Qual sua stack?": { en: "What's your stack?", pt: "Qual sua stack?" },
      "Você tem experiência com Java?": { en: "Do you have experience with Java?", pt: "Você tem experiência com Java?" },
      "Você tem experiência com PHP?": { en: "Do you have experience with PHP?", pt: "Você tem experiência com PHP?" },
      "O que é o TranscreveAI?": { en: "What is TranscreveAI?", pt: "O que é o TranscreveAI?" },
      "Você está disponível para trabalho?": { en: "Are you available for work?", pt: "Você está disponível para trabalho?" },
      "Como posso entrar em contato?": { en: "How can I contact you?", pt: "Como posso entrar em contato?" },
      "Qual seu GitHub?": { en: "What's your GitHub?", pt: "Qual seu GitHub?" },
      "Qual seu LinkedIn?": { en: "What's your LinkedIn?", pt: "Qual seu LinkedIn?" },

      "Hi! How are you?": { en: "Hi! How are you?", pt: "Oi, tudo bem?" },
      "help": { en: "help", pt: "ajuda" },
      "What projects have you built?": { en: "What projects have you built?", pt: "Quais projetos você realizou?" },
      "What's your stack?": { en: "What's your stack?", pt: "Qual sua stack?" },
      "Do you have experience with Java?": { en: "Do you have experience with Java?", pt: "Você tem experiência com Java?" },
      "Do you have experience with PHP?": { en: "Do you have experience with PHP?", pt: "Você tem experiência com PHP?" },
      "What is TranscreveAI?": { en: "What is TranscreveAI?", pt: "O que é o TranscreveAI?" },
      "Are you available for work?": { en: "Are you available for work?", pt: "Você está disponível para trabalho?" },
      "How can I contact you?": { en: "How can I contact you?", pt: "Como posso entrar em contato?" },
      "What's your GitHub?": { en: "What's your GitHub?", pt: "Qual seu GitHub?" },
      "What's your LinkedIn?": { en: "What's your LinkedIn?", pt: "Qual seu LinkedIn?" }
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

  /* ================= EVENTOS ================= */
  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.add("active");
    syncChatUI();
    syncQuickChipsLanguage();

    if (!messages.innerHTML.trim()) {
      const lang = responses[getLang()];
      addBotMessage(lang.greeting);
      hasGreeted = true;
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

  syncChatUI();
  syncQuickChipsLanguage();
})();

/* ================= UPDATES FEED ================= */
(function initUpdatesFeed() {
  const feedEl = document.getElementById("updatesFeed");
  const tagsEl = document.getElementById("updatesTags");
  const searchEl = document.getElementById("updatesSearch");
  const moreBtn = document.getElementById("updatesMore");

  if (!feedEl || !tagsEl || !searchEl || !moreBtn) return;

  const getLangSafe = () => {
    try {
      return (typeof getSiteLang === "function" ? getSiteLang() : "pt");
    } catch {
      return "pt";
    }
  };

  const POSTS = [
        {
      id: 15,
      date: "2026-09-07",
      title: {
        pt: "🚀 Meu primeiro projeto com PHP e Laravel!",
        en: "🚀 My first project with PHP and Laravel!"
      },
      text: {
        pt:
          "Finalizei meu primeiro projeto utilizando PHP, Laravel, API, JavaScript e Blade.\n" +
          "Utilizei vídeos no YouTube como referência, mas fui modificando e adaptando o projeto para realmente entender cada etapa e aprender mais durante o desenvolvimento.\n" +
          "Foi um grande aprendizado! Também mantive todo o processo organizado com Git, realizando commits a cada etapa do projeto. 💻",
        en:
          "I completed my first project using PHP, Laravel, API, JavaScript, and Blade.\n" +
          "I used YouTube videos as a reference, but I modified and adapted the project to better understand each step and learn more throughout the development process.\n" +
          "It was a great learning experience! I also kept the entire development process organized with Git, making commits at each stage of the project. 💻"
      },
      tags: ["PHP", "Laravel"],
      links: [{ label: "GitHub", url: "https://github.com/ArthurCoode/SistemaCasa" }],
      image: ""
    },
    {
      id: 14,
      date: "2026-08-31",
      title: {
        pt: "Portfólio redesenhado, agora focado em Java e PHP",
        en: "Portfolio redesigned, now focused on Java and PHP"
      },
      text: {
        pt:
          "Refiz o visual do portfólio e reorganizei os projetos para refletir onde estou focando: Java e PHP no back-end.\n" +
          "Também adicionei o TranscreveAI como projeto em destaque — é o produto que eu mais mantenho hoje, do backend ao suporte.",
        en:
          "I redesigned the portfolio and reorganized the projects to reflect where I'm focused: Java and PHP on the back-end.\n" +
          "I also added TranscreveAI as a featured project — it's the product I maintain the most today, from backend to support."
      },
      tags: ["Java", "PHP", "Design"],
      links: [{ label: "TranscreveAI", url: "https://transcreveia.com" }],
      image: ""
    },

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
          "I've just launched the beta version of the chatbot integrated directly into my portfolio.\n" +
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
          "I've been focusing my Java studies with an emphasis on practical projects.\n" +
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
          "Over the past months, I've developed and delivered websites focused on modern UI, responsiveness, and user experience.\n" +
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
              <img class="update-avatar" src="assets/images/Perfil.png" alt="Arthur Marques">
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