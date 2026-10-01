/* ==========================================================================
   APP.JS - MAIN INTERACTIVE UI LOGIC & PROJECT MODALS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCounterAnimations();
  initPhonePeDrawer();
  initEstimatorCalculator();
  initProjectModals();
  initSmoothScroll();
  initResumeButtons();
});

/* 1. STATS COUNTER ANIMATION */
function initCounterAnimations() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(el => animateSingleCounter(el));
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

function animateSingleCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = target * easeOutProgress;

    if (target % 1 !== 0) {
      el.textContent = prefix + currentValue.toFixed(1) + suffix;
    } else if (target < 10 && prefix === '0') {
      el.textContent = '0' + Math.floor(currentValue) + suffix;
    } else {
      el.textContent = prefix + Math.floor(currentValue).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* 2. PHONEPE QUICK TILE DRAWER MODAL */
function initPhonePeDrawer() {
  const toggleBtn = document.getElementById('phonepe-tile-toggle');
  const drawer = document.getElementById('phonepe-drawer');
  const closeBtn = document.getElementById('btn-close-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  const estimatorTile = document.getElementById('tile-estimator');
  const techstackTile = document.getElementById('tile-techstack');
  const resumeTile = document.getElementById('tile-resume');
  const bookingTile = document.getElementById('tile-booking');

  const estimatorPanel = document.getElementById('estimator-panel');

  function openDrawer() {
    drawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  if (estimatorTile) {
    estimatorTile.addEventListener('click', () => {
      estimatorPanel.classList.toggle('hidden');
    });
  }

  if (techstackTile) {
    techstackTile.addEventListener('click', () => {
      showGenericModal(
        '🚀 Technical Skills & Architecture Matrix',
        `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 0.95rem;">
          <div style="background:#F3F4F6; padding: 16px; border-radius: 12px;">
            <strong style="color:#2F54EB;">Languages:</strong>
            <p>Java, Kotlin, Python, C, C++, JavaScript, HTML, CSS</p>
          </div>
          <div style="background:#F3F4F6; padding: 16px; border-radius: 12px;">
            <strong style="color:#2F54EB;">Frameworks &amp; SDK:</strong>
            <p>Android SDK, Firebase, REST APIs, Retrofit, Material Design, XML</p>
          </div>
          <div style="background:#F3F4F6; padding: 16px; border-radius: 12px;">
            <strong style="color:#2F54EB;">Databases &amp; Backend:</strong>
            <p>Firebase Firestore, Realtime DB, SQLite, MySQL, Cloud Storage</p>
          </div>
          <div style="background:#F3F4F6; padding: 16px; border-radius: 12px;">
            <strong style="color:#2F54EB;">Development Tools:</strong>
            <p>Android Studio, VS Code, Git, GitHub, Postman, Figma, Gemini AI API</p>
          </div>
        </div>`
      );
    });
  }

  if (resumeTile) {
    resumeTile.addEventListener('click', showResumeModal);
  }

  if (bookingTile) {
    bookingTile.addEventListener('click', () => {
      showGenericModal(
        '📬 Direct Contact & Availability',
        `<div style="text-align: center; padding: 10px 0;">
          <p style="font-size: 1.1rem; margin-bottom: 20px;">Dadhi Shankar Sharma is available for Internships and Freelance Projects.</p>
          <div style="display:flex; flex-direction:column; gap:12px; align-items:center; margin-bottom:20px;">
            <a href="mailto:dadhishankar1@gmail.com" style="background:#2F54EB; color:#fff; padding:12px 24px; border-radius:999px; font-weight:700; text-decoration:none;">Email: dadhishankar1@gmail.com ↗</a>
            <a href="tel:+916376736849" style="background:#111827; color:#fff; padding:12px 24px; border-radius:999px; font-weight:700; text-decoration:none;">Phone: +91 6376736849 ↗</a>
          </div>
        </div>`
      );
    });
  }
}

/* 3. RESUME MODAL & DOWNLOAD */
function initResumeButtons() {
  const btnHeroResume = document.getElementById('btn-download-resume-hero');
  if (btnHeroResume) {
    btnHeroResume.addEventListener('click', showResumeModal);
  }
}

function showResumeModal() {
  showGenericModal(
    '📄 Dadhi Shankar Sharma — Resume',
    `<div style="line-height: 1.6;">
      <h4 style="font-size: 1.3rem; margin-bottom: 4px;">Dadhi Shankar Sharma</h4>
      <p style="color: #6B7280; font-size: 0.95rem; margin-bottom: 16px;">Android Developer | Java Developer | Firebase | AI Enthusiast<br />Ajmer, Rajasthan, India • dadhishankar1@gmail.com • +91 6376736849</p>
      
      <h5 style="color: #2F54EB; font-size: 1.05rem; margin-top: 12px;">Education</h5>
      <p style="margin-bottom: 12px;"><strong>Bachelor of Computer Applications (BCA)</strong> — Maharshi Dayanand Saraswati University (MDSU), Ajmer</p>

      <h5 style="color: #2F54EB; font-size: 1.05rem; margin-top: 12px;">Core Skills</h5>
      <p style="margin-bottom: 16px;">Android Development, Java, Kotlin, Firebase Firestore & Realtime DB, REST APIs (Retrofit), SQLite, MySQL, AI API Integration, Clean Architecture, Git & GitHub.</p>

      <h5 style="color: #2F54EB; font-size: 1.05rem; margin-top: 12px;">Featured Projects</h5>
      <ul style="margin-left: 20px; margin-bottom: 20px;">
        <li><strong>Sandesh:</strong> Real-time messaging Android application inspired by WhatsApp.</li>
        <li><strong>LibManage:</strong> Digital library management Android app with AI recommendation integration.</li>
        <li><strong>Departmental Store System:</strong> Desktop inventory & billing software in Java & MySQL.</li>
      </ul>

      <a href="mailto:dadhishankar1@gmail.com?subject=Resume Request - Dadhi Shankar Sharma" style="display:inline-block; background:#2F54EB; color:#fff; padding:12px 24px; border-radius:999px; font-weight:700; text-decoration:none;">Request Official PDF Resume ↗</a>
    </div>`
  );
}

/* 4. ESTIMATOR CALCULATOR LOGIC */
function initEstimatorCalculator() {
  const projectTypeSelect = document.getElementById('calc-project-type');
  const pagesRange = document.getElementById('calc-pages');
  const pagesVal = document.getElementById('pages-val');
  const totalPriceEl = document.getElementById('calc-total-price');
  const totalTimeEl = document.getElementById('calc-total-time');
  const checkboxes = document.querySelectorAll('.calc-checkboxes input[type="checkbox"]');
  const sendEstimateBtn = document.getElementById('btn-send-estimate');

  function calculate() {
    if (!projectTypeSelect || !pagesRange) return;

    let basePrice = parseInt(projectTypeSelect.value) || 500;
    let pageCount = parseInt(pagesRange.value) || 1;
    if (pagesVal) pagesVal.textContent = pageCount;

    let pagesAddon = (pageCount - 1) * 60;
    let featureSum = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) featureSum += parseInt(cb.value) || 0;
    });

    let total = basePrice + pagesAddon + featureSum;
    let days = Math.ceil(3 + (pageCount * 0.8) + (featureSum / 150));

    if (totalPriceEl) totalPriceEl.textContent = `$${total.toLocaleString()} USD`;
    if (totalTimeEl) totalTimeEl.textContent = `${days} Days`;
  }

  if (projectTypeSelect) projectTypeSelect.addEventListener('change', calculate);
  if (pagesRange) pagesRange.addEventListener('input', calculate);
  checkboxes.forEach(cb => cb.addEventListener('change', calculate));

  if (sendEstimateBtn) {
    sendEstimateBtn.addEventListener('click', () => {
      const priceText = totalPriceEl ? totalPriceEl.textContent : '';
      alert(`Project estimate of ${priceText} generated! Opening direct mail to dadhishankar1@gmail.com...`);
      window.location.href = `mailto:dadhishankar1@gmail.com?subject=Project Estimate Request - ${priceText}`;
    });
  }

  calculate();
}

/* 5. PROJECT CASE STUDY MODAL */
function initProjectModals() {
  const modalBtns = document.querySelectorAll('.btn-project-circle-arrow');
  
  const projectDetails = {
    'sandesh': {
      title: 'Sandesh — Real-Time Messaging Android App',
      category: 'Android Application',
      img: 'assets/project_mobile.png',
      desc: 'Sandesh is a real-time messaging Android application inspired by WhatsApp. Features include user authentication, instant real-time chat, image & video sharing, voice messages, Cloud Firestore synchronization, Firebase Storage, and push notifications.',
      features: ['User Authentication', 'Real-time Chat', 'Image & Video Sharing', 'Voice Messages', 'Firebase Storage', 'Cloud Firestore', 'Push Notifications'],
      tech: ['Java', 'Firebase', 'Android Studio']
    },
    'libmanage': {
      title: 'LibManage — Library Management System',
      category: 'Digital Library & AI Integration',
      img: 'assets/project_figma.png',
      desc: 'LibManage is an Android-based digital library management application designed to simplify book management and improve user experience. The project also explores AI integration for enhanced search and recommendations.',
      features: ['Library Management', 'Book Search', 'User Authentication', 'Cloud Database', 'AI Integration'],
      tech: ['Java', 'Firebase', 'Android Studio']
    },
    'store-system': {
      title: 'Departmental Store Management System',
      category: 'Desktop Application',
      img: 'assets/project_db.png',
      desc: 'Desktop application developed using Java and MySQL following MVC architecture for inventory management, billing, employee management, and customer records.',
      features: ['Billing Module', 'Inventory Tracking', 'Employee Management', 'Customer Records'],
      tech: ['Java', 'MySQL', 'JDBC']
    }
  };

  modalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      const data = projectDetails[key];
      if (data) {
        const featureList = data.features.map(f => `<li>✔ ${f}</li>`).join('');
        const techList = data.tech.map(t => `<span style="background:#E8EEFF; color:#2F54EB; font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:999px;">${t}</span>`).join(' ');

        showGenericModal(
          data.title,
          `<div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display:flex; gap:8px;">${techList}</div>
            <img src="${data.img}" style="width:100%; height:240px; object-fit:cover; border-radius:16px;" alt="${data.title}" />
            <p style="font-size:1.05rem; line-height:1.6; color:#374151;">${data.desc}</p>
            <h5 style="font-size:1rem; font-weight:700; color:#111827; margin-top:6px;">Key Features:</h5>
            <ul style="list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:8px; font-weight:600; font-size:0.9rem;">
              ${featureList}
            </ul>
            <div style="display:flex; gap:12px; margin-top:12px;">
              <a href="mailto:dadhishankar1@gmail.com?subject=Inquiry about ${data.title}" style="background:#2F54EB; color:#fff; font-weight:700; padding:12px 24px; border-radius:999px; text-decoration:none;">Inquire About Project ↗</a>
            </div>
          </div>`
        );
      }
    });
  });
}

function showGenericModal(titleText, bodyHTML) {
  const modal = document.getElementById('project-modal');
  const bodyContent = document.getElementById('modal-body-content');
  const closeBtn = document.getElementById('btn-close-modal');

  if (bodyContent) {
    bodyContent.innerHTML = `
      <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; padding-right: 30px;">${titleText}</h3>
      ${bodyHTML}
    `;
  }

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.onclick = closeModal;
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }
}

/* 6. SMOOTH SCROLL & ACTIVE LINK HIGHLIGHTING */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section, footer');

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
