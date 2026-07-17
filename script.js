/* ═══════════════════════════════════════════════════════════
   KOMAL PANESAR — Portfolio Scripts
   Smooth scroll, animations, cursor, filters, nav
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Mark that JavaScript has loaded (for progressive enhancement)
  document.body.classList.add('js-loaded');

  // ── Custom Cursor (only on devices with fine pointer) ──
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let customCursorEnabled = false;

  // Only enable custom cursor on desktop with fine pointer (mouse)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    customCursorEnabled = true;
    document.body.classList.add('custom-cursor-enabled');

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
  } else {
    // Hide custom cursor elements on touch devices
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  // Enlarge cursor on interactive elements (only if custom cursor is enabled)
  if (customCursorEnabled && dot && ring) {
    const interactives = document.querySelectorAll('a, button, .masonry-item');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.width  = '12px';
        dot.style.height = '12px';
        ring.style.width  = '60px';
        ring.style.height = '60px';
        ring.style.opacity = '0.8';
        ring.style.borderColor = '#D4BC8A';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.width  = '8px';
        dot.style.height = '8px';
        ring.style.width  = '40px';
        ring.style.height = '40px';
        ring.style.opacity = '0.5';
        ring.style.borderColor = '#C8A96E';
      });
    });
  }


  // ── Navigation Scroll Effect & Back to Top ──
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Show/hide back to top button
    if (backToTop) {
      if (currentScroll > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    lastScroll = currentScroll;
  }, { passive: true });


  // ── Mobile Nav Toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navInner = document.querySelector('.nav-inner');

  if (navToggle && navLinks && nav && navInner) {
    navToggle.onclick = function() {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      navInner.classList.toggle('menu-expanded');
    };

    // Close mobile nav on link click
    const allNavLinks = navLinks.querySelectorAll('.nav-link');
    for (let i = 0; i < allNavLinks.length; i++) {
      allNavLinks[i].onclick = function() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navInner.classList.remove('menu-expanded');
      };
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navInner.classList.remove('menu-expanded');
      }
    });
  }


  // ── Chat Modal ──
  const chatBtn = document.getElementById('chatBtn');
  const chatModal = document.getElementById('chatModal');
  const chatModalClose = document.getElementById('chatModalClose');
  const chatForm = document.getElementById('chatForm');

  if (chatBtn && chatModal) {
    chatBtn.onclick = function() {
      chatModal.classList.toggle('open');
    };

    if (chatModalClose) {
      chatModalClose.onclick = function() {
        chatModal.classList.remove('open');
      };
    }

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
      if (!chatModal.contains(e.target) && !chatBtn.contains(e.target) && chatModal.classList.contains('open')) {
        chatModal.classList.remove('open');
      }
    });

    // Handle form submission
    if (chatForm) {
      const chatSubmitBtn = document.getElementById('chatSubmitBtn');

      chatForm.onsubmit = function(e) {
        e.preventDefault();

        // Show sending state
        chatSubmitBtn.classList.add('sending');
        chatSubmitBtn.disabled = true;

        // Simulate API call
        setTimeout(function() {
          // Show success state
          chatSubmitBtn.classList.remove('sending');
          chatSubmitBtn.classList.add('success');

          // Reset form
          chatForm.reset();

          // Close modal after showing success
          setTimeout(function() {
            chatModal.classList.remove('open');

            // Reset button after modal closes
            setTimeout(function() {
              chatSubmitBtn.classList.remove('success');
              chatSubmitBtn.disabled = false;
            }, 400);
          }, 1500);
        }, 2000);
      };
    }
  }


  // ── Scroll Reveal (Staggered Fade-Up) ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ── Portfolio Filters ──
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      masonryItems.forEach((item, index) => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';

          // Stagger the reveal
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 80);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });


  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── Counter Animation for About Stats (ease-out, 2s) ──
  const statNumbers = document.querySelectorAll('.about-stat-number');
  let statsCounted = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const text   = stat.textContent.trim();
      const match  = text.match(/(\d+)/);
      if (!match) return;

      const target   = parseInt(match[1]);
      const suffix   = text.slice(match.index + match[1].length); // e.g. "+"
      const prefix   = text.slice(0, match.index);                // before digits
      const start    = performance.now();
      const DURATION = 2000;

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); } // cubic ease-out

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const value    = Math.round(easeOut(progress) * target);
        stat.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }

  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(aboutSection);
  }


  // ── Parallax on Hero Background ──
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
  }


  // ── Active Nav Link Highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#C8A96E';
      } else {
        link.style.color = '';
      }
    });
  }, { passive: true });


  // ── Preloader fade (simple) ──
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });


  // ── Contact Form Validation & Submission ──
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const projectInput = document.getElementById('contactProject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formFeedback = document.querySelector('.form-feedback');

    // Validation functions
    function validateName(value) {
      return value.trim().length >= 2;
    }

    function validateEmail(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }

    function validateProject(value) {
      return value !== '';
    }

    function validateMessage(value) {
      return value.trim().length >= 10;
    }

    function showError(field, message) {
      const formField = field.closest('.form-field');
      const errorSpan = formField.querySelector('.form-error');
      formField.classList.remove('success');
      formField.classList.add('error');
      errorSpan.textContent = message;
    }

    function showSuccess(field) {
      const formField = field.closest('.form-field');
      const errorSpan = formField.querySelector('.form-error');
      formField.classList.remove('error');
      formField.classList.add('success');
      errorSpan.textContent = '';
    }

    function clearValidation(field) {
      const formField = field.closest('.form-field');
      formField.classList.remove('error', 'success');
      const errorSpan = formField.querySelector('.form-error');
      errorSpan.textContent = '';
    }

    function showFeedback(type, message) {
      formFeedback.textContent = message;
      formFeedback.className = 'form-feedback show ' + type;
      setTimeout(() => {
        formFeedback.classList.remove('show');
      }, 5000);
    }

    // Real-time validation
    nameInput.addEventListener('blur', () => {
      if (nameInput.value) {
        if (validateName(nameInput.value)) {
          showSuccess(nameInput);
        } else {
          showError(nameInput, 'Name must be at least 2 characters');
        }
      }
    });

    emailInput.addEventListener('blur', () => {
      if (emailInput.value) {
        if (validateEmail(emailInput.value)) {
          showSuccess(emailInput);
        } else {
          showError(emailInput, 'Please enter a valid email address');
        }
      }
    });

    projectInput.addEventListener('change', () => {
      if (validateProject(projectInput.value)) {
        showSuccess(projectInput);
      } else {
        showError(projectInput, 'Please select a project type');
      }
    });

    messageInput.addEventListener('blur', () => {
      if (messageInput.value) {
        if (validateMessage(messageInput.value)) {
          showSuccess(messageInput);
        } else {
          showError(messageInput, 'Message must be at least 10 characters');
        }
      }
    });

    // Clear validation on input
    [nameInput, emailInput, projectInput, messageInput].forEach(field => {
      field.addEventListener('input', () => {
        if (field.closest('.form-field').classList.contains('error')) {
          clearValidation(field);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all fields
      let isValid = true;

      if (!validateName(nameInput.value)) {
        showError(nameInput, 'Name must be at least 2 characters');
        isValid = false;
      } else {
        showSuccess(nameInput);
      }

      if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      } else {
        showSuccess(emailInput);
      }

      if (!validateProject(projectInput.value)) {
        showError(projectInput, 'Please select a project type');
        isValid = false;
      } else {
        showSuccess(projectInput);
      }

      if (!validateMessage(messageInput.value)) {
        showError(messageInput, 'Message must be at least 10 characters');
        isValid = false;
      } else {
        showSuccess(messageInput);
      }

      if (!isValid) {
        showFeedback('error', 'Please fix the errors above');
        return;
      }

      // Show sending state
      submitBtn.classList.add('sending');
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      // For now, using Formspree or similar service would work
      // Example: action="https://formspree.io/f/YOUR_FORM_ID"

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success state
        submitBtn.classList.remove('sending');
        submitBtn.classList.add('success');

        // Reset form
        contactForm.reset();

        // Clear all validation states
        document.querySelectorAll('.form-field').forEach(field => {
          field.classList.remove('success', 'error');
        });

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }, 3000);

      } catch (error) {
        // Error
        submitBtn.classList.remove('sending');
        submitBtn.disabled = false;
        showFeedback('error', 'Something went wrong. Please try reaching out on Instagram instead.');
      }
    });
  }

})();
