(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = [...document.querySelectorAll('[data-reveal]')];
  if (!prefersReduced && 'IntersectionObserver' in window) {
    reveal.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(24px)';
      element.style.transition = `opacity .72s ease ${Math.min(index * .04, .28)}s, transform .72s ease ${Math.min(index * .04, .28)}s`;
    });
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      });
    }, { threshold: .12 });
    reveal.forEach(element => observer.observe(element));

    const heroImage = document.querySelector('.hero-image');
    window.addEventListener('scroll', () => {
      if (heroImage && window.scrollY < window.innerHeight) heroImage.style.transform = `translateY(${window.scrollY * .035}px) scale(1.03)`;
    }, { passive: true });
  }

  const mobileNav = document.querySelector('#mobile-nav');
  mobileNav?.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('a[href^="#"]')) mobileNav.open = false;
  });

  const dialog = document.querySelector('#photo-dialog');
  const image = dialog?.querySelector('[data-gallery-image]');
  const counter = dialog?.querySelector('[data-gallery-counter]');
  const credit = dialog?.querySelector('[data-gallery-credit]');
  const triggers = [...document.querySelectorAll('[data-gallery-trigger]')];
  const photos = triggers.map(trigger => ({ src: trigger.dataset.photoSrc || '', alt: trigger.dataset.photoAlt || '', credit: trigger.dataset.photoCredit || '' }));
  let activeIndex = 0;
  let opener = null;
  const showPhoto = index => {
    if (!image || !counter || !credit || !photos.length) return;
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    image.src = photo.src; image.alt = photo.alt;
    counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} — ${String(photos.length).padStart(2, '0')}`;
    credit.textContent = photo.credit;
  };
  const closeDialog = () => { if (dialog?.open) dialog.close(); };
  triggers.forEach((trigger, index) => trigger.addEventListener('click', () => {
    if (!dialog) return; opener = trigger; showPhoto(index); dialog.showModal(); dialog.querySelector('[data-gallery-close]')?.focus();
  }));
  dialog?.querySelector('[data-gallery-previous]')?.addEventListener('click', () => showPhoto(activeIndex - 1));
  dialog?.querySelector('[data-gallery-next]')?.addEventListener('click', () => showPhoto(activeIndex + 1));
  dialog?.querySelector('[data-gallery-close]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
  dialog?.addEventListener('close', () => { opener?.focus(); opener = null; });
  dialog?.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activeIndex - 1); }
  });
})();
