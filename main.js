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
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

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