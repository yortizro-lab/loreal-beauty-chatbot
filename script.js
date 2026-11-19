const WORKER_URL = "https://loreal-beauty-chatbot-yortizro-workers-dev.yortizro.workers.dev";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");
const languageSelect = document.getElementById("languageSelect");
const refreshButton = document.getElementById("refreshButton");
const welcomeMessage = document.getElementById("welcomeMessage");

if (
  !chatForm ||
  !userInput ||
  !chatMessages ||
  !sendButton ||
  !languageSelect ||
  !refreshButton ||
  !welcomeMessage
) {
  console.error("Beauty Guide: Required HTML elements are missing.");
} else {
  const translations = {
    en: {
      headerGuide: "BEAUTY GUIDE",
      headerAssistant: "AI ASSISTANT",
      eyebrow: "DISCOVER YOUR BEAUTY",
      heroTitle: "Beauty begins with you.",
      heroDescription:
        "Explore personalized skincare, makeup, and haircare recommendations with your AI beauty assistant.",
      guideName: "Beauty Guide",
      guideDescription: "Your personal beauty assistant",
      you: "You",
      online: "● Online",
      refreshChat: "Refresh chat",
      welcome:
        "Welcome to Beauty Guide! ✨<br><br>I'm here to help you explore skincare, makeup, and haircare. What would you like to discover today?",
      languageLabel: "Response language",
      placeholder: "Ask your beauty question...",
      send: "SEND →",
      wait: "WAIT...",
      loading: "Your Beauty Guide is preparing a response...",
      noAnswer: "No answer was returned.",
      connectionError: "Connection error. Please try again.",
      serverError: "The server returned an error.",
      invalidResponse:
        "The server returned an invalid response. Please try again.",
      note:
        "AI-generated beauty guidance. Always check official product information.",
      footerMotto: "BEAUTY • SCIENCE • INNOVATION",
      footerDisclaimer:
        "Independent AI demonstration project. Not affiliated with L'Oréal."
    },
    es: {
      headerGuide: "GUÍA DE BELLEZA",
      headerAssistant: "ASISTENTE DE IA",
      eyebrow: "DESCUBRE TU BELLEZA",
      heroTitle: "La belleza comienza contigo.",
      heroDescription:
        "Explora recomendaciones personalizadas de cuidado de la piel, maquillaje y cabello con tu asistente de belleza con IA.",
      guideName: "Guía de Belleza",
      guideDescription: "Tu asistente personal de belleza",
      you: "Tú",
      online: "● En línea",
      refreshChat: "Reiniciar chat",
      welcome:
        "¡Te damos la bienvenida a Guía de Belleza! ✨<br><br>Estoy aquí para ayudarte a explorar el cuidado de la piel, el maquillaje y el cabello. ¿Qué te gustaría descubrir hoy?",
      languageLabel: "Idioma de respuesta",
      placeholder: "Haz tu pregunta de belleza...",
      send: "ENVIAR →",
      wait: "ESPERA...",
      loading: "Tu Guía de Belleza está preparando una respuesta...",
      noAnswer: "No se recibió ninguna respuesta.",
      connectionError: "Error de conexión. Inténtalo de nuevo.",
      serverError: "El servidor devolvió un error.",
      invalidResponse:
        "El servidor devolvió una respuesta no válida. Inténtalo de nuevo.",
      note:
        "Consejos de belleza generados por IA. Consulta siempre la información oficial del producto.",
      footerMotto: "BELLEZA • CIENCIA • INNOVACIÓN",
      footerDisclaimer:
        "Proyecto independiente de demostración de IA. No está afiliado a L'Oréal."
    },
    zh: {
      headerGuide: "美妆指南",
      headerAssistant: "AI 助手",
      eyebrow: "探索你的美丽",
      heroTitle: "美丽从你开始。",
      heroDescription:
        "借助你的 AI 美妆助手，探索个性化的护肤、彩妆和护发建议。",
      guideName: "美妆指南",
      guideDescription: "你的专属美妆助手",
      you: "你",
      online: "● 在线",
      refreshChat: "刷新聊天",
      welcome:
        "欢迎使用美妆指南！✨<br><br>我可以帮助你了解护肤、彩妆和护发。今天你想探索什么？",
      languageLabel: "回复语言",
      placeholder: "请输入你的美妆问题...",
      send: "发送 →",
      wait: "请稍候...",
      loading: "你的美妆指南正在准备回复...",
      noAnswer: "未收到回复。",
      connectionError: "连接错误。请重试。",
      serverError: "服务器返回了错误。",
      invalidResponse: "服务器返回了无效响应。请重试。",
      note: "美妆建议由 AI 生成。请始终核实官方产品信息。",
      footerMotto: "美丽 • 科学 • 创新",
      footerDisclaimer: "独立 AI 演示项目。与欧莱雅无关联。"
    },
    pt: {
      headerGuide: "GUIA DE BELEZA",
      headerAssistant: "ASSISTENTE DE IA",
      eyebrow: "DESCUBRA SUA BELEZA",
      heroTitle: "A beleza começa com você.",
      heroDescription:
        "Explore recomendações personalizadas de cuidados com a pele, maquiagem e cabelo com seu assistente de beleza com IA.",
      guideName: "Guia de Beleza",
      guideDescription: "Seu assistente pessoal de beleza",
      you: "Você",
      online: "● Online",
      refreshChat: "Atualizar conversa",
      welcome:
        "Bem-vinda ao Guia de Beleza! ✨<br><br>Estou aqui para ajudar você a explorar cuidados com a pele, maquiagem e cabelo. O que gostaria de descobrir hoje?",
      languageLabel: "Idioma da resposta",
      placeholder: "Faça sua pergunta de beleza...",
      send: "ENVIAR →",
      wait: "AGUARDE...",
      loading: "Seu Guia de Beleza está preparando uma resposta...",
      noAnswer: "Nenhuma resposta foi recebida.",
      connectionError: "Erro de conexão. Tente novamente.",
      serverError: "O servidor retornou um erro.",
      invalidResponse:
        "O servidor retornou uma resposta inválida. Tente novamente.",
      note:
        "Orientações de beleza geradas por IA. Sempre verifique as informações oficiais do produto.",
      footerMotto: "BELEZA • CIÊNCIA • INOVAÇÃO",
      footerDisclaimer:
        "Projeto independente de demonstração de IA. Não afiliado à L'Oréal."
    }
  };

  let currentLanguage = "en";
  const conversationHistory = [];
  const MAX_HISTORY_MESSAGES = 12;
  chatMessages.setAttribute("role", "log");
  chatMessages.setAttribute("aria-live", "polite");
  chatMessages.setAttribute("aria-relevant", "additions text");

  function labelMessage(message, sender) {
    const text = message.querySelector(".message-text");
    const label = message.querySelector(".message-author");

    if (!text && !label) {
      const content = message.innerHTML;
      message.replaceChildren();

      const author = document.createElement("span");
      author.className = "message-author";
      author.textContent =
        sender === "user" ? copy("you") : copy("guideName");
      message.appendChild(author);

      const body = document.createElement("span");
      body.className = "message-text";
      body.innerHTML = content;
      message.appendChild(body);
    } else if (label) {
      label.textContent =
        sender === "user" ? copy("you") : copy("guideName");
    }

    message.dataset.sender = sender;
    message.setAttribute("role", "listitem");
  }

  function translatePage(language) {
    const copy = translations[language] || translations.en;
    currentLanguage = translations[language] ? language : "en";

    document.documentElement.lang = currentLanguage;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = copy[element.dataset.i18n];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      element.innerHTML = copy[element.dataset.i18nHtml];
    });

    userInput.placeholder = copy.placeholder;
    languageSelect.setAttribute("aria-label", copy.languageLabel);
    refreshButton.setAttribute("aria-label", copy.refreshChat);
    refreshButton.title = copy.refreshChat;

    chatMessages.querySelectorAll(".message").forEach((message) => {
      labelMessage(message, message.classList.contains("user") ? "user" : "bot");
    });
  }

  function copy(key) {
    return translations[currentLanguage][key];
  }

  languageSelect.addEventListener("change", () => {
    translatePage(languageSelect.value);
  });

  refreshButton.addEventListener("click", () => {
    conversationHistory.length = 0;
    chatMessages.replaceChildren(welcomeMessage);
    userInput.value = "";
    userInput.focus();
  });

  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    labelMessageWithText(message, sender, text);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return message;
  }

  function labelMessageWithText(message, sender, text) {
    message.replaceChildren();

    const author = document.createElement("span");
    author.className = "message-author";
    author.textContent = sender === "user" ? copy("you") : copy("guideName");
    message.appendChild(author);

    const body = document.createElement("span");
    body.className = "message-text";
    body.textContent = text;
    message.appendChild(body);
    message.dataset.sender = sender;
  }

  function showTypingIndicator(message) {
    message.classList.add("typing");
    message.setAttribute("aria-label", copy("loading"));
    const body = message.querySelector(".message-text");
    if (!body) return;

    body.replaceChildren();
    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement("span");
      dot.className = "typing-dot";
      dot.setAttribute("aria-hidden", "true");
      body.appendChild(dot);
    }
  }


  async function sendMessage(message, language, history) {
    let response;

    try {
      response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          language,
          history
        })
      });
    } catch (error) {
      throw new Error(copy("connectionError"));
    }

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(copy("invalidResponse"));
    }

    if (!response.ok) {
      throw new Error(data.error || copy("connectionError"));
    }

    return data;
  }

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, "user");
    conversationHistory.push({ role: "user", content: userMessage });

    if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
      conversationHistory.shift();
    }

    userInput.value = "";
    sendButton.disabled = true;
    sendButton.textContent = copy("wait");

    const botMessage = addMessage("", "bot");
    showTypingIndicator(botMessage);

    try {
      const response = await sendMessage(
        userMessage,
        languageSelect.value,
        conversationHistory
      );

      if (!response.answer) {
        throw new Error(copy("noAnswer"));
      }

      conversationHistory.push({ role: "assistant", content: response.answer });

      if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
        conversationHistory.shift();
      }

      labelMessageWithText(botMessage, "bot", response.answer);
      botMessage.classList.remove("typing");
    } catch (error) {
      labelMessageWithText(botMessage, "bot", error.message);
      botMessage.classList.remove("typing");
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = copy("send");
      userInput.focus();
    }
  });

  translatePage(currentLanguage);
}

