(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const whatsapp = document.createElement('a');
  whatsapp.className = 'whatsapp-float';
  whatsapp.href = 'https://wa.me/4917622657308?text=Hello%20COVA%2C%20I%27d%20like%20to%20make%20an%20enquiry.';
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener noreferrer';
  whatsapp.setAttribute('aria-label', 'Chat with COVA on WhatsApp (opens in a new tab)');
  whatsapp.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 3.2A12.4 12.4 0 0 0 5.3 21.9L3.7 28l6.3-1.6A12.4 12.4 0 1 0 16 3.2Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12.1 10.1c-.3-.7-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.4-1.5 1.5-1.5 3.6s1.5 4.1 1.7 4.4c.2.3 2.9 4.6 7.1 6.2 3.5 1.4 4.2 1.1 5 .9.8-.1 2.5-1 2.8-2.1.3-1 .3-1.9.2-2.1-.1-.2-.4-.3-.9-.6-.5-.2-2.5-1.2-2.9-1.4-.4-.1-.7-.2-1 .3-.3.5-1.1 1.4-1.3 1.7-.2.3-.5.3-.9.1-.5-.2-1.9-.7-3.6-2.2-1.3-1.1-2.2-2.5-2.5-2.9-.3-.5 0-.7.2-.9.2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8l-1.1-2.7Z" fill="currentColor"/>
    </svg>
    <span>WhatsApp</span>
  `;
  document.body.append(whatsapp);

  const cursor = document.createElement('span');
  cursor.className = 'leaf-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <svg viewBox="0 0 32 34" focusable="false">
      <defs>
        <linearGradient id="leaf-metal" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#756b5b"/>
          <stop offset=".48" stop-color="#e6ddcd"/>
          <stop offset="1" stop-color="#9b8666"/>
        </linearGradient>
      </defs>
      <path class="leaf-shape" d="M2 30C9 23 18 8 29 3 26 15 16 26 2 30Z"/>
      <path class="leaf-vein" d="M2 30C11 22 21 12 29 3M8 24c3-4 5-7 7-11m-2 16c5-4 9-8 12-13"/>
    </svg>
  `;
  document.body.append(cursor);

  let pointerEnabled = false;
  let pointerVisible = false;
  let frame = 0;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let tilt = 0;

  function moveCursor() {
    if (reducedMotion.matches) {
      x = targetX;
      y = targetY;
      tilt = 0;
    } else {
      x += (targetX - x) * 0.38;
      y += (targetY - y) * 0.38;
    }
    cursor.style.transform = `translate3d(${x - 3}px, ${y - 42}px, 0) rotate(${tilt}deg)`;

    if (!reducedMotion.matches && (Math.abs(targetX - x) > 0.2 || Math.abs(targetY - y) > 0.2)) {
      frame = window.requestAnimationFrame(moveCursor);
    } else {
      frame = 0;
    }
  }

  function handlePointerMove(event) {
    if (event.pointerType !== 'mouse') return;

    const previousX = targetX;
    targetX = event.clientX;
    targetY = event.clientY;
    tilt = Math.max(-18, Math.min(18, (targetX - previousX) * 0.9));

    if (!pointerVisible) {
      x = targetX;
      y = targetY;
      document.body.classList.add('has-leaf-cursor');
      cursor.classList.add('is-visible');
      pointerVisible = true;
    }

    if (!frame) {
      if (reducedMotion.matches) {
        moveCursor();
      } else {
        frame = window.requestAnimationFrame(moveCursor);
      }
    }

    const interactive = event.target instanceof Element &&
      event.target.closest('a, button, summary, input, select, textarea, label');
    cursor.classList.toggle('is-hovering', Boolean(interactive));
  }

  function hideCursor() {
    pointerVisible = false;
    document.body.classList.remove('has-leaf-cursor');
    cursor.classList.remove('is-visible', 'is-hovering', 'is-pressed');
  }

  function handlePointerDown() {
    cursor.classList.add('is-pressed');
  }

  function handlePointerUp() {
    cursor.classList.remove('is-pressed');
  }

  function enablePointer() {
    if (pointerEnabled || !finePointer.matches) return;
    pointerEnabled = true;
    document.body.classList.add('has-leaf-cursor');
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', hideCursor);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('blur', hideCursor);
  }

  function disablePointer() {
    if (!pointerEnabled) return;
    pointerEnabled = false;
    document.body.classList.remove('has-leaf-cursor');
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerleave', hideCursor);
    document.removeEventListener('pointerdown', handlePointerDown);
    document.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('blur', hideCursor);
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    hideCursor();
  }

  function updatePointer() {
    if (!finePointer.matches) {
      disablePointer();
      return;
    }
    enablePointer();
  }

  reducedMotion.addEventListener('change', updatePointer);
  finePointer.addEventListener('change', updatePointer);
  updatePointer();

  const sectionMotionQuery = 'main > section';
  const sectionMotionSections = document.querySelectorAll(sectionMotionQuery);
  let sectionMotionObserver = null;
  const sectionMotionVideos = new Map();

  function removeSectionMotion(section, video) {
    section.classList.remove('has-section-motion');
    section.style.removeProperty('--section-motion-tint');
    sectionMotionVideos.delete(section);
    video.removeEventListener('error', handleSectionVideoError);
    video.remove();
  }

  function handleSectionPlaybackFailure(section, video, error) {
    if (!sectionMotionVideos.has(section)) return;
    console.error('COVA section background playback was blocked; the static background will be shown.', error);
    removeSectionMotion(section, video);
  }

  function handleSectionVideoError(event) {
    const video = event.currentTarget;
    const section = video.parentElement;
    console.error('COVA section background video failed to load; the static background will be shown.', video.error);
    if (section) removeSectionMotion(section, video);
  }

  function startSectionMotion() {
    if (document.querySelector('.hero-scroll') || reducedMotion.matches || !sectionMotionSections.length) return;
    if ('IntersectionObserver' in window) {
      sectionMotionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = sectionMotionVideos.get(entry.target);
          if (!video) return;

          if (entry.isIntersecting && !document.hidden) {
            video.play().catch(error => {
              handleSectionPlaybackFailure(entry.target, video, error);
            });
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.01 });
    }

    sectionMotionSections.forEach(section => {
      const originalBackground = getComputedStyle(section).backgroundColor;
      const background = originalBackground === 'rgba(0, 0, 0, 0)'
        ? getComputedStyle(document.body).backgroundColor
        : originalBackground;
      const channels = background.match(/[\d.]+/g);
      if (!channels || channels.length < 3) {
        console.error('Unable to determine the COVA section background color for its motion overlay.');
        return;
      }

      const video = document.createElement('video');
      video.className = 'section-motion-video';
      video.src = 'assets/ANIMATION%20WEBSITE.mp4';
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      video.setAttribute('aria-hidden', 'true');
      video.setAttribute('tabindex', '-1');
      video.addEventListener('error', handleSectionVideoError);

      section.style.setProperty('--section-motion-tint', `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, .72)`);
      section.classList.add('has-section-motion');
      section.prepend(video);
      sectionMotionVideos.set(section, video);
      if (sectionMotionObserver) sectionMotionObserver.observe(section);
      else {
        video.play().catch(error => {
          handleSectionPlaybackFailure(section, video, error);
        });
      }
    });
  }

  function stopSectionMotion() {
    if (sectionMotionObserver) {
      sectionMotionObserver.disconnect();
      sectionMotionObserver = null;
    }
    sectionMotionVideos.forEach((video, section) => {
      video.pause();
      removeSectionMotion(section, video);
    });
  }

  document.addEventListener('visibilitychange', () => {
    sectionMotionVideos.forEach((video, section) => {
      if (document.hidden) video.pause();
      else {
        const bounds = section.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
        video.play().catch(error => handleSectionPlaybackFailure(section, video, error));
      }
    });
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stopSectionMotion();
    else startSectionMotion();
  });
  startSectionMotion();

  const heroTrack = document.querySelector('.hero-scroll');
  const heroStage = heroTrack?.querySelector('.hero-stage');
  const heroContent = heroTrack?.querySelector('.hero-content');
  const heroVideo = heroTrack?.querySelector('.hero-film');
  const heroScrubMedia = window.matchMedia('(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)');

  if (heroTrack && heroStage && heroContent && heroVideo) {
    let heroAnimationFrame = 0;
    let heroVideoReady = false;
    let heroScrubbing = false;
    let scrollStart = 0;
    let scrollDistance = 1;
    let resizeObserver = null;

    function measureHero() {
      const bounds = heroTrack.getBoundingClientRect();
      const stickyTop = Number.parseFloat(window.getComputedStyle(heroStage).top) || 0;
      scrollStart = window.scrollY + bounds.top - stickyTop;
      scrollDistance = Math.max(1, heroTrack.offsetHeight - heroStage.offsetHeight);
      scheduleHeroFrame();
    }

    function renderHeroFrame() {
      heroAnimationFrame = 0;
      if (!heroScrubbing) return;

      const progress = Math.max(0, Math.min(1, (window.scrollY - scrollStart) / scrollDistance));
      const reveal = Math.max(0, Math.min(1, (progress - 0.42) / 0.42));
      heroContent.style.opacity = (0.62 + reveal * 0.38).toFixed(3);
      heroContent.style.transform = `translate3d(0, ${(1 - reveal) * 10}px, 0)`;

      if (heroVideoReady && !heroVideo.seeking) {
        const finalFrameOffset = 1 / 60;
        const targetTime = progress === 1
          ? Math.max(0, heroVideo.duration - finalFrameOffset)
          : progress * heroVideo.duration;
        if (Math.abs(heroVideo.currentTime - targetTime) > finalFrameOffset) {
          heroVideo.currentTime = targetTime;
        }
      }
    }

    function scheduleHeroFrame() {
      if (!heroAnimationFrame) {
        heroAnimationFrame = window.requestAnimationFrame(renderHeroFrame);
      }
    }

    function enableHeroScrubbing() {
      if (heroScrubbing || !heroVideoReady || !heroScrubMedia.matches || heroVideo.error) return;
      heroScrubbing = true;
      heroVideo.loop = false;
      heroVideo.pause();
      heroTrack.classList.add('is-scrubbing');
      window.addEventListener('scroll', scheduleHeroFrame, { passive: true });
      window.addEventListener('resize', measureHero);
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(measureHero);
        resizeObserver.observe(heroTrack);
        resizeObserver.observe(heroStage);
      }
      measureHero();
    }

    function disableHeroScrubbing() {
      if (!heroScrubbing) return;
      heroScrubbing = false;
      heroTrack.classList.remove('is-scrubbing');
      window.removeEventListener('scroll', scheduleHeroFrame);
      window.removeEventListener('resize', measureHero);
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (heroAnimationFrame) {
        window.cancelAnimationFrame(heroAnimationFrame);
        heroAnimationFrame = 0;
      }
      heroContent.style.removeProperty('opacity');
      heroContent.style.removeProperty('transform');
      heroVideo.pause();
      if (heroVideoReady && heroVideo.currentTime !== 0) heroVideo.currentTime = 0;
    }

    function updateHeroScrubbing() {
      if (heroScrubMedia.matches && heroVideoReady && !heroVideo.error) {
        enableHeroScrubbing();
      } else {
        disableHeroScrubbing();
        if (heroVideoReady && !heroVideo.error && !reducedMotion.matches) {
          heroVideo.loop = true;
          if (heroVideo.paused) {
            heroVideo.play().catch(error => {
              console.error('COVA hero video playback was blocked; the static hero fallback will be shown.', error);
            });
          }
        } else {
          heroVideo.pause();
        }
      }
    }

    function handleHeroMetadata() {
      if (!Number.isFinite(heroVideo.duration) || heroVideo.duration <= 0) {
        console.error('COVA hero video has invalid duration metadata.');
        return;
      }
      heroVideoReady = true;
      heroVideo.pause();
      updateHeroScrubbing();
    }

    function handleHeroSeeked() {
      if (heroScrubbing) scheduleHeroFrame();
    }

    function handleHeroVideoError() {
      console.error('COVA hero video failed to load; the static hero fallback will be shown.', heroVideo.error);
      heroVideoReady = false;
      updateHeroScrubbing();
    }

    function cleanupHeroScrubbing() {
      disableHeroScrubbing();
      heroScrubMedia.removeEventListener('change', updateHeroScrubbing);
      reducedMotion.removeEventListener('change', updateHeroScrubbing);
      heroVideo.removeEventListener('loadedmetadata', handleHeroMetadata);
      heroVideo.removeEventListener('seeked', handleHeroSeeked);
      heroVideo.removeEventListener('error', handleHeroVideoError);
    }

    heroVideo.pause();
    heroVideo.addEventListener('loadedmetadata', handleHeroMetadata);
    heroVideo.addEventListener('seeked', handleHeroSeeked);
    heroVideo.addEventListener('error', handleHeroVideoError);
    heroScrubMedia.addEventListener('change', updateHeroScrubbing);
    reducedMotion.addEventListener('change', updateHeroScrubbing);
    window.addEventListener('pagehide', cleanupHeroScrubbing, { once: true });
    if (heroVideo.readyState >= HTMLMediaElement.HAVE_METADATA) handleHeroMetadata();
  }

  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll([
    'main > section:not(.hero-scroll)',
    '.brand-grid article',
    '.standards-grid article',
    '.package-grid article',
    '.product',
    '.shipping-content details',
    '.cart-line',
    '.quote-section',
    '.contact .socials > *',
    '.site-footer'
  ].join(','));

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach((target, index) => {
    target.classList.add('motion-reveal');
    target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    observer.observe(target);
  });
})();
