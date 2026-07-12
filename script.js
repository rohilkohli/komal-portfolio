/* ═══════════════════════════════════════════════════════════
   KOMAL PANESAR — Portfolio Scripts
   Smooth scroll, animations, cursor, filters, nav
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Custom Cursor ──
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

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

  // Enlarge cursor on interactive elements
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


  // ── Navigation Scroll Effect ──
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });


  // ── Mobile Nav Toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
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

})();
