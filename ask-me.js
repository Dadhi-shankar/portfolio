/* ==========================================================================
   ASK-ME.JS - PREMIUM PORTFOLIO AI ASSISTANT LOGIC & UI ENGINE
   ========================================================================== */

(function () {
  'use strict';

  // State management
  let isChatOpen = false;
  let isThinking = false;
  let conversationHistory = []; // { role: 'user' | 'assistant', text: string }

  // DOM Elements cache
  let floatingBtn, chatPanel, backdropOverlay, closeBtn, clearBtn;
  let messagesContainer, inputField, sendBtn, quickSuggestionsContainer;

  const SUGGESTED_QUESTIONS = [
    "Tell me about Dadhi Shankar",
    "What are his strongest skills?",
    "Show me his best projects",
    "What technologies does he work with?",
    "Tell me about his experience",
    "Why should I consider him for a role?"
  ];

  document.addEventListener('DOMContentLoaded', () => {
    renderAskMeUI();
    initAskMeEvents();
  });

  /* 1. BUILD & INJECT THE ASK ME UI ELEMENTS */
  function renderAskMeUI() {
    // 1. Floating Action Button
    floatingBtn = document.createElement('button');
    floatingBtn.id = 'ask-me-floating-btn';
    floatingBtn.className = 'ask-me-fab';
    floatingBtn.setAttribute('aria-label', 'Open Ask Me AI Assistant');
    floatingBtn.setAttribute('title', 'Ask Me — Portfolio AI Assistant');
    floatingBtn.innerHTML = `
      <div class="fab-pulse-ring"></div>
      <div class="fab-icon-box">
        <i class="fa-solid fa-sparkles fab-ai-icon"></i>
        <i class="fa-solid fa-comments fab-chat-icon"></i>
      </div>
      <span class="fab-text">Ask Me</span>
      <span class="fab-badge-ai">AI</span>
    `;
    document.body.appendChild(floatingBtn);

    // 2. Chat Panel Backdrop (for mobile/focus)
    backdropOverlay = document.createElement('div');
    backdropOverlay.id = 'ask-me-backdrop';
    backdropOverlay.className = 'ask-me-backdrop hidden';
    document.body.appendChild(backdropOverlay);

    // 3. Chat Panel Container
    chatPanel = document.createElement('div');
    chatPanel.id = 'ask-me-panel';
    chatPanel.className = 'ask-me-panel hidden';
    chatPanel.setAttribute('role', 'dialog');
    chatPanel.setAttribute('aria-label', 'Ask Me AI Assistant Panel');

    chatPanel.innerHTML = `
      <!-- Panel Header -->
      <div class="ask-me-header">
        <div class="ask-me-header-info">
          <div class="ask-me-avatar">
            <i class="fa-solid fa-sparkles"></i>
            <span class="online-indicator"></span>
          </div>
          <div>
            <div class="ask-me-title-row">
              <h3>Ask Me</h3>
              <span class="ask-me-pill">Portfolio AI</span>
            </div>
            <p class="ask-me-subtitle">Dadhi Shankar Sharma's AI Assistant</p>
          </div>
        </div>
        <div class="ask-me-header-actions">
          <button id="ask-me-clear-btn" class="ask-me-icon-btn" title="Clear Chat History" aria-label="Clear Chat History">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
          <button id="ask-me-close-btn" class="ask-me-icon-btn" title="Close Panel" aria-label="Close Panel">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Messages Body -->
      <div class="ask-me-messages" id="ask-me-messages-list">
        <!-- Welcome Card -->
        <div class="ask-me-welcome-card">
          <div class="welcome-header">
            <span class="welcome-hand">👋</span>
            <h4>Hi! I'm Ask Me</h4>
          </div>
          <p>
            I'm <strong>Dadhi Shankar Sharma's</strong> portfolio assistant. I can answer any questions about his skills, experience, projects, education, and professional background.
          </p>
          
          <div class="welcome-suggestions-label">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Suggested Questions:
          </div>
          <div class="ask-me-chips-grid" id="ask-me-quick-chips">
            ${SUGGESTED_QUESTIONS.map(q => `<button class="chip-btn" data-question="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('')}
          </div>
        </div>
      </div>

      <!-- Typing / Loading Indicator Container (Hidden by default) -->
      <div id="ask-me-typing-bar" class="ask-me-typing-bar hidden">
        <div class="typing-bubble">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span class="typing-text">Ask Me is analyzing portfolio data...</span>
      </div>

      <!-- Footer & Input Area -->
      <div class="ask-me-footer">
        <form id="ask-me-form" class="ask-me-input-form" onsubmit="return false;">
          <input 
            type="text" 
            id="ask-me-input" 
            class="ask-me-input" 
            placeholder="Ask me about this portfolio..." 
            autocomplete="off"
            aria-label="Ask me about this portfolio"
          />
          <button type="submit" id="ask-me-send-btn" class="ask-me-send-btn" aria-label="Send Message" disabled>
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
        <div class="ask-me-disclaimer">
          <i class="fa-solid fa-shield-halved"></i> Powered by Portfolio Knowledge Base • Answers restricted to candidate portfolio.
        </div>
      </div>
    `;

    document.body.appendChild(chatPanel);

    // Cache internal elements
    closeBtn = document.getElementById('ask-me-close-btn');
    clearBtn = document.getElementById('ask-me-clear-btn');
    messagesContainer = document.getElementById('ask-me-messages-list');
    inputField = document.getElementById('ask-me-input');
    sendBtn = document.getElementById('ask-me-send-btn');
    quickSuggestionsContainer = document.getElementById('ask-me-quick-chips');
  }

  /* 2. INITIALIZE EVENT LISTENERS */
  function initAskMeEvents() {
    floatingBtn.addEventListener('click', toggleChatPanel);
    closeBtn.addEventListener('click', closeChatPanel);
    backdropOverlay.addEventListener('click', closeChatPanel);

    clearBtn.addEventListener('click', resetConversation);

    // Enable/disable send button based on input
    inputField.addEventListener('input', () => {
      const text = inputField.value.trim();
      sendBtn.disabled = !text || isThinking;
    });

    // Form submit
    document.getElementById('ask-me-form').addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSubmit();
    });

    // Suggestion chips clicks
    chatPanel.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (chip) {
        const question = chip.getAttribute('data-question');
        if (question && !isThinking) {
          inputField.value = question;
          handleUserSubmit();
        }
      }
    });

    // Keyboard navigation (Escape to close)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isChatOpen) {
        closeChatPanel();
      }
    });
  }

  /* 3. OPEN / CLOSE PANEL ANIMATIONS */
  function toggleChatPanel() {
    if (isChatOpen) {
      closeChatPanel();
    } else {
      openChatPanel();
    }
  }

  function openChatPanel() {
    isChatOpen = true;
    chatPanel.classList.remove('hidden');
    backdropOverlay.classList.remove('hidden');
    floatingBtn.classList.add('active');

    // Focus input on desktop
    if (window.innerWidth > 768) {
      setTimeout(() => inputField.focus(), 300);
    }
  }

  function closeChatPanel() {
    isChatOpen = false;
    chatPanel.classList.add('hidden');
    backdropOverlay.classList.add('hidden');
    floatingBtn.classList.remove('active');
  }

  /* 4. RESET CONVERSATION */
  function resetConversation() {
    conversationHistory = [];
    messagesContainer.innerHTML = `
      <div class="ask-me-welcome-card">
        <div class="welcome-header">
          <span class="welcome-hand">👋</span>
          <h4>Hi! I'm Ask Me</h4>
        </div>
        <p>
          I'm <strong>Dadhi Shankar Sharma's</strong> portfolio assistant. I can answer any questions about his skills, experience, projects, education, and professional background.
        </p>
        
        <div class="welcome-suggestions-label">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Suggested Questions:
        </div>
        <div class="ask-me-chips-grid" id="ask-me-quick-chips">
          ${SUGGESTED_QUESTIONS.map(q => `<button class="chip-btn" data-question="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('')}
        </div>
      </div>
    `;
    inputField.value = '';
    sendBtn.disabled = true;
  }

  /* 5. USER MESSAGE SUBMISSION & HANDLING */
  async function handleUserSubmit() {
    const userQuery = inputField.value.trim();
    if (!userQuery || isThinking) return;

    // Clear input
    inputField.value = '';
    sendBtn.disabled = true;

    // Add user bubble to UI
    appendMessageBubble('user', userQuery);
    conversationHistory.push({ role: 'user', text: userQuery });

    // Show typing state
    setThinkingState(true);

    try {
      // Process query using local Portfolio Knowledge Engine
      const aiResponseText = await generatePortfolioAIResponse(userQuery, conversationHistory);
      
      setThinkingState(false);
      appendMessageBubble('assistant', aiResponseText);
      conversationHistory.push({ role: 'assistant', text: aiResponseText });

    } catch (err) {
      console.error("Ask Me AI Error:", err);
      setThinkingState(false);
      appendMessageBubble('assistant', "Sorry, I couldn't process that right now. Please try again.");
    }
  }

  /* 6. SET THINKING / LOADING INDICATOR */
  function setThinkingState(thinking) {
    isThinking = thinking;
    const typingBar = document.getElementById('ask-me-typing-bar');
    if (thinking) {
      typingBar.classList.remove('hidden');
      inputField.disabled = true;
      sendBtn.disabled = true;
    } else {
      typingBar.classList.add('hidden');
      inputField.disabled = false;
      inputField.focus();
    }
    scrollToBottom();
  }

  /* 7. APPEND MESSAGE BUBBLES TO UI */
  function appendMessageBubble(role, content) {
    const messageRow = document.createElement('div');
    messageRow.className = `ask-me-message-row ${role === 'user' ? 'user-row' : 'assistant-row'}`;

    const formattedContent = formatMarkdownResponse(content);

    if (role === 'user') {
      messageRow.innerHTML = `
        <div class="user-bubble">
          ${escapeHtml(content)}
        </div>
      `;
    } else {
      messageRow.innerHTML = `
        <div class="assistant-avatar">
          <i class="fa-solid fa-sparkles"></i>
        </div>
        <div class="assistant-bubble">
          ${formattedContent}
        </div>
      `;
    }

    messagesContainer.appendChild(messageRow);
    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
  }

  /* 8. FORMAT RESPONSE MARKDOWN/HTML SAFELY */
  function formatMarkdownResponse(text) {
    let html = escapeHtml(text);

    // Bold text: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Bullet points: * or -
    const lines = html.split('\n');
    let inList = false;
    let result = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          result.push('<ul class="ask-me-list">');
          inList = true;
        }
        const itemText = trimmed.replace(/^[•\-\*]\s+/, '');
        result.push(`<li>${itemText}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (trimmed.length > 0) {
          result.push(`<p>${line}</p>`);
        }
      }
    });

    if (inList) {
      result.push('</ul>');
    }

    return result.join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ==========================================================================
     9. STRICT PORTFOLIO KNOWLEDGE ENGINE & RESPONSE GENERATOR
     ========================================================================== */
  async function generatePortfolioAIResponse(userText, history) {
    // Artificial small delay for natural responsive UX
    await new Promise(res => setTimeout(res, 450 + Math.random() * 350));

    const q = userText.toLowerCase().trim();
    const data = typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : null;

    if (!data) {
      return "I'm sorry, portfolio data is currently unavailable. Please reach out directly to Dadhi Shankar Sharma at dadhishankar1@gmail.com.";
    }

    const p = data.person;
    const s = data.skills;
    const projects = data.projects;
    const edu = data.education[0];

    // --- SECURITY & PROMPT INJECTION CHECKS ---
    if (
      q.includes("ignore") && (q.includes("instruction") || q.includes("rule") || q.includes("prompt")) ||
      q.includes("forget") ||
      q.includes("system prompt") ||
      q.includes("api key") ||
      q.includes("secret") ||
      q.includes("act as chatgpt") ||
      q.includes("jailbreak")
    ) {
      return "I'm here strictly to answer questions about Dadhi Shankar Sharma, his skills, projects, experience, and professional background as presented in this portfolio.";
    }

    // --- REJECTION OF UNRELATED QUESTIONS ---
    const unrelatedTriggers = [
      "weather", "joke", "capital of", "football", "match", "cricket", "score",
      "recipe", "cook", "python program", "python script", "write a code for",
      "calculator code", "bitcoin", "crypto", "politics", "president", "movie",
      "song", "lyrics", "who won", "game of thrones", "tell me a story", "math problem",
      "solve 2+2", "what is 2+"
    ];

    for (let trigger of unrelatedTriggers) {
      if (q.includes(trigger)) {
        return `I'm Ask Me, Dadhi Shankar Sharma's portfolio assistant. I can only answer questions about Dadhi Shankar, his technical skills, projects, work experience, and background. Try asking me about his Android apps or Java skills!`;
      }
    }

    // General non-portfolio coding requests rejection
    if (
      (q.startsWith("write") || q.startsWith("create") || q.startsWith("generate")) &&
      (q.includes("program") || q.includes("script") || q.includes("function") || q.includes("calculator") || q.includes("game")) &&
      !q.includes("project") && !q.includes("portfolio") && !q.includes("dadhi")
    ) {
      return `I'm focused on answering questions about Dadhi Shankar Sharma and his portfolio. I can't help with general coding requests, but I'd be happy to tell you about the projects Dadhi Shankar has built!`;
    }

    // --- CONTEXT AWARENESS FOR RECENT MENTIONS ---
    // Check if user is asking follow-up about recent project
    let lastMentionedProject = null;
    for (let i = history.length - 1; i >= 0; i--) {
      const hText = history[i].text.toLowerCase();
      if (hText.includes("sandesh")) { lastMentionedProject = "sandesh"; break; }
      if (hText.includes("libmanage") || hText.includes("library")) { lastMentionedProject = "libmanage"; break; }
      if (hText.includes("store") || hText.includes("departmental")) { lastMentionedProject = "store-system"; break; }
    }

    // --- HALLUCINATION CHECKS (Information NOT in Portfolio) ---
    const unsupportedKeywords = [
      "react", "angular", "vue", "node", "express", "django", "flutter", "swift",
      "ios", "aws", "docker", "kubernetes", "golang", "ruby", "php", "salary",
      "google employee", "microsoft employee", "amazon employee"
    ];

    for (let kw of unsupportedKeywords) {
      if (q.includes(kw) && !q.includes("does he know") && !q.includes("experience with")) {
        // If they ask direct question like "How good is he at React?" or "Does he know React?"
      }
    }

    if (q.includes("react") || q.includes("flutter") || q.includes("node") || q.includes("aws") || q.includes("docker")) {
      return `I don't see that specific technology listed in Dadhi Shankar's portfolio, so I don't want to make an unsupported claim. 

His verified primary tech stack includes **Java, Kotlin, Native Android SDK, Firebase (Firestore & Realtime DB), REST APIs (Retrofit), SQLite, MySQL, and AI API Integration**.`;
    }

    // --- INTENT CLASSIFICATION & KNOWLEDGE RESPONSES ---

    // 1. Who is Dadhi Shankar / About Yourself / Overview / Profile Summary
    if (
      q.includes("who is") || q.includes("about yourself") || q.includes("tell me about yourself") ||
      q.includes("about dadhi") || q.includes("bio") || q.includes("summary") || q.includes("background") ||
      q.includes("candidate") || q.includes("developer are they")
    ) {
      return `**${p.name}** is an **${p.title}** based in ${p.location}.

He holds a **Bachelor of Computer Applications (BCA)** from Maharshi Dayanand Saraswati University (MDSU), Ajmer.

**Key Highlights:**
• Specializes in Native Android development with Java, Kotlin, and Firebase.
• Experienced in building real-time apps (**Sandesh Messenger**), digital management platforms with AI (**LibManage**), and desktop management software (**Store Management System**).
• Strong foundational skills in REST API integration, cloud databases, and AI API features.
• ${p.availability}`;
    }

    // 2. Skills / Technical Expertise / Languages / Frameworks
    if (
      q.includes("skill") || q.includes("technology") || q.includes("technologies") ||
      q.includes("programming language") || q.includes("framework") || q.includes("database") ||
      q.includes("tools") || q.includes("stack")
    ) {
      return `Here is a breakdown of **${p.name}'s** technical skills based on his portfolio:

• **Languages:** ${s.languages.join(", ")}
• **Mobile & Frameworks:** ${s.frameworksAndSdk.join(", ")}
• **Databases & Cloud:** ${s.databases.join(", ")}
• **Development Tools:** ${s.tools.join(", ")}
• **Core Architectural Strengths:** Clean Architecture, Real-Time Data Sync, MVC Pattern, and AI API Integration.`;
    }

    // 3. Projects Overview & Specific Projects
    if (q.includes("sandesh") || (lastMentionedProject === "sandesh" && (q.includes("tech") || q.includes("feature") || q.includes("role") || q.includes("about")))) {
      const proj = projects.find(item => item.id === 'sandesh');
      return `**${proj.name} — Real-Time Messaging Android App**

**Description:** ${proj.description}
• **Role:** ${proj.role}
• **Technologies:** ${proj.technologies.join(", ")}
• **Key Features:**
${proj.features.map(f => `  - ${f}`).join("\n")}
• **Demonstrates:** ${proj.demonstrates}`;
    }

    if (q.includes("libmanage") || q.includes("library") || (lastMentionedProject === "libmanage" && (q.includes("tech") || q.includes("feature") || q.includes("role") || q.includes("about")))) {
      const proj = projects.find(item => item.id === 'libmanage');
      return `**${proj.name} — Digital Library & AI Integration**

**Description:** ${proj.description}
• **Role:** ${proj.role}
• **Technologies:** ${proj.technologies.join(", ")}
• **Key Features:**
${proj.features.map(f => `  - ${f}`).join("\n")}
• **Demonstrates:** ${proj.demonstrates}`;
    }

    if (q.includes("store") || q.includes("departmental") || (lastMentionedProject === "store-system" && (q.includes("tech") || q.includes("feature") || q.includes("role") || q.includes("about")))) {
      const proj = projects.find(item => item.id === 'store-system');
      return `**${proj.name} — Desktop Application**

**Description:** ${proj.description}
• **Role:** ${proj.role}
• **Technologies:** ${proj.technologies.join(", ")}
• **Key Features:**
${proj.features.map(f => `  - ${f}`).join("\n")}
• **Demonstrates:** ${proj.demonstrates}`;
    }

    if (q.includes("project") || q.includes("built") || q.includes("work") || q.includes("best work")) {
      return `**${p.name}** has engineered several key software and Android projects:

1. **Sandesh:** Real-time messaging Android app inspired by WhatsApp (Java, Firebase, Firestore, Push Notifications).
2. **LibManage:** Digital library management system with AI recommendation features (Java, Firebase, AI API).
3. **Departmental Store System:** Desktop management software using Java, MySQL, and MVC architecture.

Would you like detailed information about any specific project?`;
    }

    // 4. Experience & Career Background
    if (q.includes("experience") || q.includes("work history") || q.includes("company") || q.includes("where have they worked")) {
      return `**Work Experience:**

• **Role:** ${data.experience[0].role}
• **Location:** ${data.experience[0].location}
• **Focus:** ${data.experience[0].details}

He has hands-on practical experience developing end-to-end native Android applications and Java software systems from concept to deployment.`;
    }

    // 5. Education & Certifications
    if (q.includes("education") || q.includes("study") || q.includes("degree") || q.includes("university") || q.includes("college") || q.includes("qualification")) {
      return `**Education Details:**

• **Degree:** ${edu.degree}
• **Institution:** ${edu.institution}
• **Location:** ${edu.location}
• **Coursework:** ${edu.highlights}`;
    }

    if (q.includes("certification") || q.includes("certificate") || q.includes("award") || q.includes("achievement")) {
      return `**Certifications & Credentials:**

• ${data.certifications.map(c => `**${c.name}** (${c.issuer})`).join("\n• ")}`;
    }

    // 6. Services Offered & Hire CTA
    if (q.includes("service") || q.includes("offer") || q.includes("hire") || q.includes("why should i consider") || q.includes("contact") || q.includes("email") || q.includes("reach")) {
      return `**Services Offered by ${p.name}:**

1. **Native Android App Development** (Java, Kotlin, Android SDK)
2. **Firebase Backend & Cloud Integration** (Firestore, Realtime DB, Storage, Push Notifications)
3. **Java Desktop Software Development** (MySQL, JDBC, MVC)
4. **AI Integration & API Integration** (Gemini AI API)

**Contact & Availability:**
• **Email:** [${p.email}](mailto:${p.email})
• **Phone:** ${p.phone}
• **Location:** ${p.location}

If you'd like to discuss an opportunity or freelance project, you can use the **Contact** section at the bottom of this portfolio!`;
    }

    // 7. Standout / Why Profile Stands Out
    if (q.includes("stand out") || q.includes("why hire") || q.includes("contribution") || q.includes("role fit")) {
      return `**Why Dadhi Shankar Sharma Stands Out:**

• **Native Android Specialization:** Solid grasp of Android SDK, Java, Kotlin, and modern UI/UX design.
• **Cloud & Real-time Integration:** Demonstrated ability to build scalable backend solutions with Google Firebase.
• **AI Forward Thinking:** Practical experience adding AI capabilities (like Gemini API) into mobile and web apps.
• **Strong Fundamentals:** Computer Applications degree (BCA) paired with practical project implementations.

You can reach out directly via the contact form or email at **${p.email}**.`;
    }

    // --- DEFAULT SMART FALLBACK REDIRECT ---
    return `I can help you explore **${p.name}'s** portfolio!

You can ask me about:
• His **skills** (Java, Kotlin, Firebase, AI APIs)
• His **featured projects** (Sandesh, LibManage, Store System)
• His **education** (BCA at MDSU)
• His **contact & availability** for roles or projects.

What would you like to know?`;
  }

})();
