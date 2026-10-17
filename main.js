// header scroll state
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  // mobile menu
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));


  // typewriter letra por letra - resaltado amarillo, lento como teclado manual
  const typeEl = document.getElementById('aboutTitle');
  if (typeEl && !typeEl.dataset.split) {
    const text = typeEl.textContent;
    typeEl.textContent = '';
    typeEl.setAttribute('aria-label', text);
    const words = text.split(' ');
    let charIndex = 0;
    words.forEach((word, wi) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      [...word].forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        const delay = (charIndex * 55) + 'ms';
        span.style.transitionDelay = delay;
        // highlight slightly after letter appears
        const beforeDelay = (charIndex * 55 + 60) + 'ms';
        span.style.setProperty('--before-delay', beforeDelay);
        // inject per-char ::before delay via inline style element
        wordSpan.appendChild(span);
        charIndex++;
      });
      typeEl.appendChild(wordSpan);
      if (wi < words.length - 1) {
        typeEl.appendChild(document.createTextNode(' '));
        charIndex++; // space counts as pause
      }
    });
    // apply ::before delays
    const chars = typeEl.querySelectorAll('.char');
    chars.forEach((c, i) => {
      const sheet = document.createElement('style');
      // Use nth-child to set delay for ::before
    });
    // Set via CSS: each char ::before delay = char delay + 80ms
    const style = document.createElement('style');
    let css = '';
    typeEl.querySelectorAll('.char').forEach((_, i) => {
      css += `#aboutTitle .char:nth-child(${i+1})::after{ transition-delay: ${i*55+60}ms; }\n`;
    });
    // But char are inside word spans, nth-child not flat - use word+char index
    // Simpler: set inline style for ::before via custom property not possible, so inject per char
    typeEl.querySelectorAll('.char').forEach((charEl, i) => {
      charEl.style.setProperty('transition-delay', (i*55)+'ms');
      // ::before delay via separate rule - we already generated css above but nth-child wrong due to word wrappers
      // Instead set directly: create style per char using data-index
      charEl.dataset.index = i;
    });
    // Override: use JS to set ::before delay via element style not possible, so add global style with attribute selector
    let globalCss = '';
    typeEl.querySelectorAll('.char').forEach((_, i) => {
      globalCss += `#aboutTitle .char[data-index="${i}"]::after{ transition-delay: ${i*55+60}ms; }\n`;
    });
    style.textContent = globalCss;
    document.head.appendChild(style);
    typeEl.dataset.split = 'true';
  }

  // stagger children — landing simple: 60ms, no bloqueo de interacción
  document.querySelectorAll('.services-grid, .about-points, .catalog-grid, .gallery-grid, .contact-cards').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 60) + 'ms';
    });
  });

  // gallery lightbox — abrir imagen en tamaño original
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    let lastFocused = null;
    let closeTimer = null;

    const openLightbox = (src, alt) => {
      if (!src) return;
      clearTimeout(closeTimer);
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => lightbox.classList.add('show'));
      lastFocused = document.activeElement;
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
      closeTimer = setTimeout(() => {
        if (!lightbox.classList.contains('show')) {
          lightbox.classList.remove('open');
          lightboxImg.src = '';
        }
      }, 220);
    };

    document.querySelectorAll('.gallery-item img').forEach(img => {
      const item = img.closest('.gallery-item');
      if (!item || item.classList.contains('empty')) return;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Ampliar imagen: ' + (img.alt || 'proyecto'));
      const open = () => openLightbox(img.currentSrc || img.src, img.alt);
      item.addEventListener('click', open);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }