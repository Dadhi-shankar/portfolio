/* ==========================================================================
   ANTIGRAVITY.JS - GOOGLE ANTIGRAVITY PARTICLE ENGINE & MAGNETIC HOVER
   ========================================================================== */

(function () {
  let canvas, ctx;
  let particles = [];
  let numParticles = 65;
  let mouse = { x: null, y: null, radius: 160 };
  let particlesEnabled = true;
  let animationFrameId = null;

  const googleColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#2F54EB'];

  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initMagneticCards();
    initAntigravityBar();
    window.addEventListener('resize', handleResize);
  });

  /* 1. GOOGLE ANTIGRAVITY PARTICLE CANVAS BACKGROUND */
  function initCanvas() {
    canvas = document.getElementById('antigravity-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    createParticles();
    animateParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1.5,
        color: googleColors[Math.floor(Math.random() * googleColors.length)],
        baseAlpha: Math.random() * 0.4 + 0.2,
        density: (Math.random() * 20) + 1
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particlesEnabled) {
      particles.forEach((p, index) => {
        // Antigravity drift
        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse Gravitational Attractor / Repulsor Physics
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - p.x;
          let dy = mouse.y - p.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * p.density * 0.4;
            let directionY = forceDirectionY * force * p.density * 0.4;

            p.x += directionX;
            p.y += directionY;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw subtle connecting gravity lines
        for (let j = index + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 110) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
    }

    animationFrameId = requestAnimationFrame(animateParticles);
  }

  function handleResize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }

  /* 2. 3D MAGNETIC HOVER TILT FOR CARDS (Keeps symmetric layout perfectly intact!) */
  function initMagneticCards() {
    const cards = document.querySelectorAll('.service-card, .project-row, .phonepe-tile, .portrait-card-bg, .skill-category-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -5;
        const rotateY = ((cardX - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* 3. GOOGLE ANTIGRAVITY TOOLBAR CONTROLS */
  function initAntigravityBar() {
    const btnParticles = document.getElementById('btn-toggle-particles');
    const btnTheme = document.getElementById('btn-toggle-theme');

    if (btnParticles) {
      btnParticles.addEventListener('click', () => {
        particlesEnabled = !particlesEnabled;
        btnParticles.classList.toggle('active', particlesEnabled);
      });
    }

    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        btnTheme.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i> Light' : '<i class="fa-solid fa-moon"></i> Dark';
      });
    }
  }

})();
