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

  // State
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Smooth interpolation factor (lower = smoother)
  const lerp = 0.08;
  const dragLerp = 0.15;

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

    // Smooth lerp towards target
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
    viewport.style.cursor = 'grabbing';
    hideHint();
  };

  // Pointer move
  const onPointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const point = e.touches ? e.touches[0] : e;
    targetX = point.clientX - startX;
    targetY = point.clientY - startY;
  };

  // Pointer up
  const onPointerUp = () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
  };

  // Wheel scroll with smooth animation
  const onWheel = (e) => {
    e.preventDefault();

    // Apply scroll with multiplier
    targetY -= e.deltaY * 2.5;
    targetX -= e.deltaX * 2.5;

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
