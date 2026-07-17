/* ═══════════════════════════════════════════════════════════
   COVER ART - Premium Infinite Drag Gallery
   Smooth physics-based scrolling with momentum
   ═══════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const viewport = document.getElementById('galleryViewport');
  const container = document.getElementById('galleryContainer');
  const hint = document.getElementById('dragHint');

  if (!viewport || !container) return;

  // Detect mobile
  const isMobile = () => window.innerWidth < 768;

  // State
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let velocityY = 0;
  let lastY = 0;
  let lastTime = 0;

  // Smooth interpolation factor (lower = smoother)
  const lerp = 0.08;
  const dragLerp = 0.15;
  const mobileLerp = 0.1;
  const friction = 0.95;

  // Wrap function - infinite loop
  const wrap = (min, max, value) => {
    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
  };

  // Get dimensions for wrapping
  const getDimensions = () => {
    const rect = container.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };

  // Animation loop - smooth interpolation
  let rafId;
  const animate = () => {
    const dims = getDimensions();
    const mobile = isMobile();

    if (mobile) {
      // Mobile: vertical only with momentum
      if (!isDragging) {
        targetY += velocityY;
        velocityY *= friction;
        if (Math.abs(velocityY) < 0.5) velocityY = 0;
      }

      y += (targetY - y) * mobileLerp;

      // Wrap for infinite vertical scroll
      const gridHeight = dims.height / 4; // 4 grids
      y = wrap(-gridHeight, 0, y);
      targetY = wrap(-gridHeight, 0, targetY);

      container.style.transform = `translate3d(0, ${y}px, 0)`;
    } else {
      // Desktop: free 2D drag
      const currentLerp = isDragging ? dragLerp : lerp;
      x += (targetX - x) * currentLerp;
      y += (targetY - y) * currentLerp;

      // Wrap for infinite scroll
      x = wrap(-dims.width / 2, 0, x);
      y = wrap(-dims.height / 2, 0, y);

      // Also wrap targets to prevent huge jumps
      targetX = wrap(-dims.width / 2, 0, targetX);
      targetY = wrap(-dims.height / 2, 0, targetY);

      container.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    rafId = requestAnimationFrame(animate);
  };

  // Start animation loop
  animate();

  // Pointer down
  const onPointerDown = (e) => {
    isDragging = true;
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX - targetX;
    startY = point.clientY - targetY;
    lastY = point.clientY;
    lastTime = Date.now();
    velocityY = 0;
    viewport.style.cursor = 'grabbing';
    hideHint();
  };

  // Pointer move
  const onPointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const point = e.touches ? e.touches[0] : e;
    const now = Date.now();
    const deltaTime = now - lastTime;

    if (isMobile()) {
      // Mobile: vertical only with velocity tracking
      targetY = point.clientY - startY;
      if (deltaTime > 0) {
        velocityY = (point.clientY - lastY) / deltaTime * 16;
      }
    } else {
      // Desktop: full 2D
      targetX = point.clientX - startX;
      targetY = point.clientY - startY;
    }

    lastY = point.clientY;
    lastTime = now;
  };

  // Pointer up
  const onPointerUp = () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
  };

  // Wheel scroll with smooth animation
  const onWheel = (e) => {
    e.preventDefault();

    if (isMobile()) {
      // Mobile: vertical only
      targetY -= e.deltaY * 2;
    } else {
      // Desktop: both axes
      targetY -= e.deltaY * 2.5;
      targetX -= e.deltaX * 2.5;
    }

    hideHint();
  };

  // Hide hint
  const hideHint = () => {
    if (hint && !hint.classList.contains('hidden')) {
      hint.classList.add('hidden');
    }
  };

  // Mouse events
  viewport.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('mouseleave', onPointerUp);

  // Touch events
  viewport.addEventListener('touchstart', onPointerDown, { passive: true });
  viewport.addEventListener('touchmove', (e) => {
    if (isDragging) {
      onPointerMove(e);
    }
  }, { passive: false });
  viewport.addEventListener('touchend', onPointerUp);
  viewport.addEventListener('touchcancel', onPointerUp);

  // Wheel
  viewport.addEventListener('wheel', onWheel, { passive: false });

  // Reveal items with staggered animation
  const items = document.querySelectorAll('.gallery-item');
  setTimeout(() => {
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, Math.random() * 800 + index * 30);
    });
  }, 300);

  // Cleanup on page leave
  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
  });

})();
