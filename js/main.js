 document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("year-footer").textContent = new Date().getFullYear();

  let currentLang = "en";

  const toggleBtn = document.getElementById("langToggle");
  const elements = document.querySelectorAll("[data-pt]");

  toggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "pt" : "en";
    toggleBtn.textContent = currentLang === "en" ? "PT" : "EN";

    elements.forEach((el) => {
      el.textContent = el.dataset[currentLang];
    });
  });

  emailjs.init("eNCDz_pll4chDHtMl");

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("mesage").value,
      };

      const serviceID = "service_ceqthpt";
      const templateID = "template_yziexyv";
      const submit_button = document.getElementById("submit_button");
      const status = document.getElementById("form-status");

      submit_button.textContent =
        currentLang === "pt" ? "Enviando..." : "Sending...";
      submit_button.disabled = true;

      emailjs
        .send(serviceID, templateID, formData)
        .then(() => {
          status.textContent = status.dataset[currentLang];
          status.className = "form-status success";
          document.getElementById("contact-form").reset();
        })
        .catch(() => {
          status.textContent =
            currentLang === "pt"
              ? "Erro ao enviar a mensagem. Tente novamente."
              : "Failed to send message. Please try again.";
          status.className = "form-status error";
        })
        .finally(() => {
          submit_button.textContent =
            currentLang === "pt" ? "Enviar Mensagem" : "Send Message";
          submit_button.disabled = false;
        });
    });