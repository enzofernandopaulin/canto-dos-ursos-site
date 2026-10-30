(() => {
  const stage = document.querySelector('[data-vinyl-stage]');
  const model = stage?.querySelector('.vinyl-model');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced';
  if (!stage || !model || !window.gsap) return;

  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  gsap.set(stage, { transformPerspective: 1100, transformOrigin: '50% 50%' });

  if (reduced) {
    gsap.set(stage, { opacity: 1, y: 0, scale: 1, rotateX: 0, rotateY: 0 });
    model.removeAttribute('auto-rotate');
    return;
  }

  gsap.fromTo(stage,
    { opacity: 0, y: 36, scale: .92, rotateX: 8 },
    { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.15, ease: 'power3.out',
      scrollTrigger: window.ScrollTrigger ? { trigger: stage, start: 'top 82%', once: true } : undefined }
  );

  gsap.to('.vinyl-orbit--one', { rotate: 380, duration: 18, repeat: -1, ease: 'none' });
  gsap.to('.vinyl-orbit--two', { rotate: -360, duration: 24, repeat: -1, ease: 'none' });
  gsap.to('.vinyl-glow', { scale: 1.12, opacity: .72, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  const reset = () => gsap.to(stage, { rotateX: 0, rotateY: 0, duration: .65, ease: 'power3.out', overwrite: true });
  stage.addEventListener('pointermove', event => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    gsap.to(stage, { rotateY: x * 12, rotateX: y * -10, duration: .55, ease: 'power2.out', overwrite: true });
  });
  stage.addEventListener('pointerleave', reset);
})();
