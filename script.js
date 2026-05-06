/* ================================================================
   GANESH — DATA ANALYST PORTFOLIO
   script.js
   Features:
     1. Sticky navbar highlight on scroll
     2. Mobile hamburger menu toggle
     3. Smooth active nav link highlighting
     4. Contact form validation + success message
     5. Scroll-reveal animation for sections
     6. Navbar hide/show on scroll direction
================================================================ */

(function () {
  'use strict';

  /* ── DOM references ── */
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('section[id]');
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  /* ══════════════════════════════════
     1. MOBILE HAMBURGER TOGGLE
  ══════════════════════════════════ */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    /* Close menu when a nav link is clicked */
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    /* Close menu on outside click */
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ══════════════════════════════════
     2. ACTIVE NAV LINK ON SCROLL
  ══════════════════════════════════ */
  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 90;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* Add active style dynamically */
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: #111; } .nav-links a.active::after { width: 100%; }`;
  document.head.appendChild(style);

  /* ══════════════════════════════════
     3. NAVBAR SHADOW ON SCROLL
  ══════════════════════════════════ */
  let lastScrollY = 0;

  function handleNavbar() {
    const currentScrollY = window.scrollY;

    /* Add shadow after scrolling 50px */
    if (currentScrollY > 50) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastScrollY = currentScrollY;
    setActiveLink();
  }

  /* ══════════════════════════════════
     4. SCROLL-REVEAL ANIMATION
  ══════════════════════════════════ */
  /* Add .reveal class to animatable elements */
  const revealTargets = [
    '.service-card',
    '.project-card',
    '.info-card',
    '.direct-item',
    '.skills-group',
    '.about-body',
    '.tools-row',
    '.section-title',
    '.section-sub',
  ];

  revealTargets.forEach((selector, selectorIndex) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      /* Stagger delay within groups */
      const delay = (i % 4) * 0.1;
      el.style.transitionDelay = delay + 's';
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); /* animate once */
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════════
     5. CONTACT FORM VALIDATION
  ══════════════════════════════════ */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function showError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.classList.add('invalid');
    if (error) error.classList.add('visible');
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.classList.remove('invalid');
    if (error) error.classList.remove('visible');
  }

  /* Live clearing of errors as user types */
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        clearError(id, id + '-error');
      });
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      // e.preventDefault();

      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');

      let valid = true;

      /* Name validation */
      if (!name || name.value.trim() === '') {
        showError('name', 'name-error');
        valid = false;
      } else {
        clearError('name', 'name-error');
      }

      /* Email validation */
      if (!email || !validateEmail(email.value)) {
        showError('email', 'email-error');
        valid = false;
      } else {
        clearError('email', 'email-error');
      }

      /* Message validation */
      if (!message || message.value.trim() === '') {
        showError('message', 'message-error');
        valid = false;
      } else {
        clearError('message', 'message-error');
      }

      if (!valid) return;

      /* Simulate sending (replace with your backend/formspree endpoint) */
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        /* Reset form */
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message →';

        /* Show success message */
        if (successMsg) {
          successMsg.classList.add('visible');
          setTimeout(() => successMsg.classList.remove('visible'), 5000);
        }

        /*
          EDIT: To actually send this form, integrate with:
          - Formspree: https://formspree.io  (free, no backend needed)
          - EmailJS: https://www.emailjs.com
          - Or your own backend endpoint via fetch()
        */
      }, 1200);
    });
  }

  /* ══════════════════════════════════
     6. SMOOTH SCROLL (polyfill for old browsers)
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 72; /* navbar height */
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════
     7. BIND SCROLL EVENT
  ══════════════════════════════════ */
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar(); /* run once on load */

  /* ══════════════════════════════════
     8. YEAR AUTO-UPDATE IN FOOTER
  ══════════════════════════════════ */
  const yearSpans = document.querySelectorAll('.year');
  yearSpans.forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
