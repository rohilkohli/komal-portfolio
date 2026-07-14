/* ═══════════════════════════════════════════════════════════
   KOMAL PANESAR — Portfolio Scripts
   Smooth scroll, animations, cursor, filters, nav, galleries
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // ── Custom Cursor ──
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && finePointer && !prefersReducedMotion) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .masonry-item, .cg-card, .expand-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.width = '12px';
        dot.style.height = '12px';
        ring.style.width = '60px';
        ring.style.height = '60px';
        ring.style.opacity = '0.8';
        ring.style.borderColor = '#D4BC8A';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.width = '8px';
        dot.style.height = '8px';
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.opacity = '0.5';
        ring.style.borderColor = '#C8A96E';
      });
    });
  }

  // ── Navigation Scroll Effect ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  // ── Mobile Nav Toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll Reveal (Staggered Fade-Up) ──
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Smooth Scroll for same-page Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ── Counter Animation for About Stats ──
  const statNumbers = document.querySelectorAll('.about-stat-number');
  const aboutSection = document.querySelector('.about');
  let statsCounted = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const original = stat.textContent.trim();
      const match = original.match(/(\d+)/);
      if (!match || prefersReducedMotion) return;

      const target = parseInt(match[1], 10);
      const suffix = original.slice(match.index + match[1].length);
      const prefix = original.slice(0, match.index);
      const start = performance.now();
      const duration = 2000;

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        stat.textContent = prefix + Math.round(easeOut(progress) * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  if (aboutSection && 'IntersectionObserver' in window) {
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

  // ── Active Nav Link Highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  if (sections.length && navLinksAll.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
      });

      navLinksAll.forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', href === '#' + current || href.endsWith('#' + current));
      });
    }, { passive: true });
  }

  // ── Portfolio Filters ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterables = document.querySelectorAll('.masonry-item, .cg-card, .expand-card');

  filterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;
      filterables.forEach(item => {
        const category = item.dataset.category || item.querySelector('.cg-card-tag, .expand-card-tag')?.textContent.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-');
        const visible = filter === 'all' || category === filter;
        item.classList.toggle('hidden', !visible);
        item.setAttribute('aria-hidden', String(!visible));
      });
    });
  });

  // ── Circular Gallery ──
  const gallery = document.getElementById('circularGallery');
  const scene = document.getElementById('cgScene');
  if (gallery && scene) {
    const cards = scene.querySelectorAll('.cg-card');
    const angleStep = 360 / Math.max(cards.length, 1);
    let currentAngle = 0;
    let targetAngle = 0;
    let dragging = false;
    let paused = prefersReducedMotion;
    let lastX = 0;
    let lastY = 0;
    let galleryInView = true;

    function getRadius() {
      const w = gallery.offsetWidth;
      return Math.max(240, Math.min(520, w * 0.42));
    }

    function pauseMedia(card, shouldPause) {
      const video = card.querySelector('video');
      if (!video) return;
      video.muted = true;
      if (shouldPause) video.pause();
      else video.play().catch(() => {});
    }

    function positionCards() {
      const radius = getRadius();
      let maxDepth = -1;
      let frontIndex = -1;
      const data = [];

      cards.forEach((card, i) => {
        if (card.classList.contains('hidden')) {
          card.style.opacity = '0';
          pauseMedia(card, true);
          return;
        }
        const angle = (i * angleStep + currentAngle) * Math.PI / 180;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const depth = (z + radius) / (2 * radius);
        if (depth > maxDepth) {
          maxDepth = depth;
          frontIndex = i;
        }
        data[i] = { x, z, depth };
      });

      cards.forEach((card, i) => {
        if (!data[i]) return;
        const { x, z, depth } = data[i];
        const scale = 0.72 + 0.28 * depth;
        const isFront = i === frontIndex && depth > 0.88;
        card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        card.style.opacity = String(0.38 + 0.62 * depth);
        card.style.zIndex = String(Math.round(depth * 100));
        card.classList.toggle('cg-card--active', isFront);
        pauseMedia(card, !isFront || !galleryInView || prefersReducedMotion);
      });
    }

    function tick() {
      if (!dragging && !paused) targetAngle += 0.05;
      currentAngle += (targetAngle - currentAngle) * 0.07;
      positionCards();
      if (!prefersReducedMotion) requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        galleryInView = entries.some(entry => entry.isIntersecting);
        positionCards();
      }, { threshold: 0.1 });
      observer.observe(gallery);
    }

    gallery.addEventListener('mouseenter', () => { paused = true; });
    gallery.addEventListener('mouseleave', () => { paused = prefersReducedMotion; });
    gallery.addEventListener('mousedown', e => {
      dragging = true;
      lastX = e.clientX;
      gallery.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      targetAngle += (e.clientX - lastX) * 0.35;
      lastX = e.clientX;
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
      gallery.style.cursor = 'grab';
    });
    gallery.addEventListener('touchstart', e => {
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      paused = true;
    }, { passive: true });
    gallery.addEventListener('touchmove', e => {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (e.cancelable) e.preventDefault();
        targetAngle += dx * 0.45;
      }
      lastX = clientX;
      lastY = clientY;
    }, { passive: false });
    gallery.addEventListener('touchend', () => { paused = prefersReducedMotion; });
    gallery.addEventListener('wheel', e => {
      if (!gallery.matches(':hover') && document.activeElement !== gallery) return;
      e.preventDefault();
      targetAngle += e.deltaY * 0.18;
    }, { passive: false });

    document.querySelector('[data-gallery-control="prev"]')?.addEventListener('click', () => { targetAngle -= angleStep; positionCards(); });
    document.querySelector('[data-gallery-control="next"]')?.addEventListener('click', () => { targetAngle += angleStep; positionCards(); });
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); targetAngle -= angleStep; positionCards(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); targetAngle += angleStep; positionCards(); }
    });
    cards.forEach(card => card.addEventListener('focus', () => { paused = true; }));
    window.addEventListener('resize', positionCards);
    positionCards();
    tick();
  }

  // ── Expand Cards: keyboard/touch support ──
  const expandContainer = document.getElementById('expandCards');
  if (expandContainer) {
    const cards = expandContainer.querySelectorAll('.expand-card');
    function activate(card) {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    }
    cards.forEach(card => {
      card.addEventListener('click', () => activate(card));
      card.addEventListener('focus', () => activate(card));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(card);
        }
      });
    });
  }


  // ── Portfolio Lightbox ──
  const lightbox = document.getElementById('portfolioLightbox');
  const lightboxMedia = document.getElementById('lightboxMedia');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxDescription = document.getElementById('lightboxDescription');
  let lastFocusedElement = null;

  function openLightbox(card) {
    if (!lightbox || !lightboxMedia || !lightboxTitle || !lightboxTag || !lightboxDescription) return;

    const media = card.querySelector('img, video');
    const title = card.querySelector('h4')?.textContent.trim() || 'Artwork preview';
    const tag = card.querySelector('.cg-card-tag, .expand-card-tag, .collab-type')?.textContent.trim() || 'Selected Work';
    if (!media) return;

    lastFocusedElement = document.activeElement;
    lightboxMedia.replaceChildren();

    const preview = media.cloneNode(true);
    preview.removeAttribute('style');
    preview.removeAttribute('loading');
    preview.setAttribute('aria-label', title);
    if (preview.tagName.toLowerCase() === 'video') {
      preview.controls = true;
      preview.muted = true;
      preview.loop = true;
      preview.playsInline = true;
      preview.preload = 'metadata';
    }

    lightboxMedia.appendChild(preview);
    lightboxTitle.textContent = title;
    lightboxTag.textContent = tag;
    lightboxDescription.textContent = `A closer look at ${title}, part of Komal Panesar's ${tag.toLowerCase()} portfolio.`;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('[data-lightbox-close]')?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxMedia) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxMedia.querySelectorAll('video').forEach(video => video.pause());
    lightboxMedia.replaceChildren();
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll('.cg-card, .expand-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  lightbox?.querySelectorAll('[data-lightbox-close]').forEach(control => {
    control.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();
