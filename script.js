/**
 * PRASHANT SONI — PORTFOLIO JAVASCRIPT ENGINE
 * Micro-interactions, Canvas Constellation, Typewriter, Tilt, Lightbox & Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCustomCursor();
  initParticleCanvas();
  initTypewriter();
  initStatsCounter();
  initHeroTilt();
  initSkillsFilter();
  initLightbox();
  initContactForm();
  initScrollReveal();
  initYear();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateScrollSpy();
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ScrollSpy active link highlighting
  function updateScrollSpy() {
    let currentId = 'home';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id') || currentId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. CUSTOM GLOW CURSOR (DESKTOP)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  if (!dot || !glow || window.innerWidth <= 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth lerp for glow cursor
  function renderGlow() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(renderGlow);
  }
  requestAnimationFrame(renderGlow);

  // Hover expansion on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, select, .skill-card, .project-card, .graphic-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   3. AMBIENT DYNAMIC PARTICLE CANVAS
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  const particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 1.8 + 0.8;
      this.baseColor = Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 2;
          const dirY = (dy / dist) * force * 2;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor}0.65)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#6366f1';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect near particles with faint cyber lines
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   4. DYNAMIC HERO TYPEWRITER
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Full-Stack Web Developer',
    'Creative Graphic Designer',
    'B.Tech CSE Engineer',
    'Figma UI/UX Craftsman',
    'Modern Visual Artist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      el.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/* --------------------------------------------------------------------------
   5. STATS NUMBER COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(num => {
          const target = +num.getAttribute('data-target');
          const duration = 1800; // ms
          const start = 0;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(start + (target - start) * easeOut);
            num.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              num.textContent = target;
            }
          }
          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) observer.observe(statsRow);
}

/* --------------------------------------------------------------------------
   6. 3D PERSPECTIVE TILT ON HERO CARD
   -------------------------------------------------------------------------- */
function initHeroTilt() {
  const card = document.getElementById('heroTiltCard');
  if (!card || window.innerWidth <= 992) return;

  const wrapper = card.querySelector('.visual-card-wrapper');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 10;
    const rotY = (x / (rect.width / 2)) * 10;

    wrapper.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    wrapper.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --------------------------------------------------------------------------
   7. SKILLS FILTER TABS
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. GRAPHIC DESIGN LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const modalImg = document.getElementById('lightboxImage');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalCategory = document.getElementById('lightboxCategory');
  const modalDesc = document.getElementById('lightboxDesc');
  const modalTools = document.getElementById('lightboxTools');
  const graphicCards = document.querySelectorAll('.graphic-card');

  if (!modal) return;

  graphicCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-image');
      const title = card.getAttribute('data-title');
      const category = card.getAttribute('data-category');
      const tools = card.getAttribute('data-tools');
      const desc = card.getAttribute('data-desc');

      modalImg.src = imgSrc;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalCategory.textContent = category;
      modalTools.textContent = tools;
      modalDesc.textContent = desc;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   9. INTERACTIVE CONTACT FORM & TOAST ALERTS
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitBtn');
  const formAlert = document.getElementById('formAlert');
  const toast = document.getElementById('toastNotification');

  if (!form) return;

  // Character counter for message field
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const count = messageInput.value.length;
      charCounter.textContent = `${count} / 500`;
      if (count > 500) {
        charCounter.style.color = '#f43f5e';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // Real-time error removal on input
  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const errorSpan = input.parentElement.querySelector('.error-msg');
      if (errorSpan) errorSpan.classList.remove('visible');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'nameError');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'emailError');
      isValid = false;
    }

    // Validate Message
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'messageError');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Show success alert
      formAlert.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been received. I will reach out promptly.`;
      formAlert.className = 'form-status-alert success';

      // Trigger toast popup
      triggerToast(`Hello ${nameInput.value.trim()}`, 'Your message was sent successfully to Prashant Soni.');

      // Reset form
      form.reset();
      if (charCounter) charCounter.textContent = '0 / 500';

      setTimeout(() => {
        formAlert.style.display = 'none';
      }, 7000);
    }, 1200);
  });

  function showError(input, errorId) {
    input.classList.add('invalid');
    const err = document.getElementById(errorId);
    if (err) err.classList.add('visible');
  }

  function triggerToast(title, message) {
    if (!toast) return;
    const titleEl = document.getElementById('toastTitle');
    const msgEl = document.getElementById('toastMsg');
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);
  }
}

/* --------------------------------------------------------------------------
   10. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-item');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el, idx) => {
    // Optional stagger delay
    el.style.transitionDelay = `${(idx % 4) * 0.08}s`;
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   11. CURRENT YEAR IN FOOTER
   -------------------------------------------------------------------------- */
function initYear() {
  const yr = document.getElementById('currentYear');
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }
}
