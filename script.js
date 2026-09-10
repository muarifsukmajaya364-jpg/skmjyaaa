/**
 * MU'ARIF SUKMA JAYA — PRINCIPAL PORTFOLIO SCRIPT
 * Full-Featured Interactive Logic & Lanyard Physics Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Preloader & Page Initialization
  // ------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('site-ready'));
      }, 350);
    }, 700);
  } else {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('site-ready'));
    }, 100);
  }

  // ------------------------------------------------------------------------
  // 2. Theme Toggle with LocalStorage
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('portfolio_theme');

  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    // Check if light is explicitly preferred
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('portfolio_theme', isLight ? 'light' : 'dark');
      themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    });
  }

  // ------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Scroll Progress & Back to Top Indicator
  // ------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0 && scrollProgress) {
      scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 5. Active Navigation State Indicator on Scroll
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  const updateActiveNav = () => {
    const scrollY = window.scrollY;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ------------------------------------------------------------------------
  // 6. Custom Dynamic Cursor
  // ------------------------------------------------------------------------
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  if (cursor && follower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    const hoverTargets = document.querySelectorAll('a, button, .work-card, .lanyard-badge-entity, .contact-card');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 7. Scroll Reveal Animation
  // ------------------------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => revealObserver.observe(el));

  // ------------------------------------------------------------------------
  // 8. INTERACTIVE LANYARD PHYSICS & RESPONSIVE POSITION ENGINE
  // ------------------------------------------------------------------------
  const lanyardContainer = document.getElementById('lanyard-container');
  const lanyardCard = document.getElementById('lanyard-card');
  const lanyardSvg = document.getElementById('lanyard-svg');
  const cardGlare = document.getElementById('card-glare');
  const lanyardShadow = document.getElementById('lanyard-shadow');

  if (lanyardContainer && lanyardCard && lanyardSvg) {
    let isDragging = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let springVelocityX = 0;
    let springVelocityY = 0;
    let topOffset = 200;
    let animFrameId = null;

    // Responsive Top Offset:
    // On Mobile/Tablet (< 992px): locks to 0 so strap emerges flush from mount bracket!
    // On Desktop (>= 992px): measures exact distance to browser top viewport
    const calculateTopOffset = () => {
      if (window.innerWidth < 992) {
        topOffset = 0;
      } else {
        const rect = lanyardContainer.getBoundingClientRect();
        topOffset = Math.max(0, rect.top);
      }
      updateStrapSvg(currentX, currentY);
    };

    calculateTopOffset();
    window.addEventListener('resize', calculateTopOffset);
    window.addEventListener('scroll', calculateTopOffset);

    // Initial Dropping Setup (Start safely suspended above viewport)
    currentY = -520;
    applyCardTransform(0, currentY);
    updateStrapSvg(0, currentY);

    let dropVelocity = 0;
    let dropTriggered = false;
    const initialDropPhysics = () => {
      const force = -0.055 * currentY;
      dropVelocity += force;
      dropVelocity *= 0.83;
      currentY += dropVelocity;

      applyCardTransform(currentX, currentY);
      updateStrapSvg(currentX, currentY);

      if (Math.abs(currentY) > 0.5 || Math.abs(dropVelocity) > 0.5) {
        requestAnimationFrame(initialDropPhysics);
      } else {
        currentY = 0;
        applyCardTransform(0, 0);
        updateStrapSvg(0, 0);
      }
    };

    const triggerLanyardDrop = () => {
      if (dropTriggered) return;
      dropTriggered = true;
      requestAnimationFrame(initialDropPhysics);
    };

    window.addEventListener('site-ready', () => {
      setTimeout(triggerLanyardDrop, 150);
    });
    // Fallback in case event is missed
    setTimeout(triggerLanyardDrop, 1500);

    // Web Audio API Acoustic Haptic Feedback
    const playHapticSound = (freq = 520, type = 'sine', duration = 0.04) => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {}
    };

    // Pointer Drag Handling (Mouse & Touch) - UNRESTRICTED FREE DRAG
    const onPointerDown = (clientX, clientY) => {
      isDragging = true;
      startPointerX = clientX - currentX;
      startPointerY = clientY - currentY;
      lanyardCard.classList.add('is-dragging');
      if (animFrameId) cancelAnimationFrame(animFrameId);
      playHapticSound(420, 'triangle', 0.03);
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging) return;
      const rawX = clientX - startPointerX;
      const rawY = clientY - startPointerY;

      // FREE UNRESTRICTED MOVEMENT ACROSS VIEWPORT
      currentX = rawX;
      currentY = rawY;

      applyCardTransform(currentX, currentY);
      updateStrapSvg(currentX, currentY);
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      lanyardCard.classList.remove('is-dragging');
      playHapticSound(640, 'sine', 0.04);
      runSpringReturn();
    };

    // Spring return loop on release
    const runSpringReturn = () => {
      const stiffness = 0.075;
      const damping = 0.84;

      const step = () => {
        if (isDragging) return;

        const forceX = -stiffness * currentX;
        const forceY = -stiffness * currentY;

        springVelocityX += forceX;
        springVelocityY += forceY;

        springVelocityX *= damping;
        springVelocityY *= damping;

        currentX += springVelocityX;
        currentY += springVelocityY;

        applyCardTransform(currentX, currentY);
        updateStrapSvg(currentX, currentY);

        if (
          Math.abs(currentX) > 0.3 ||
          Math.abs(currentY) > 0.3 ||
          Math.abs(springVelocityX) > 0.3 ||
          Math.abs(springVelocityY) > 0.3
        ) {
          animFrameId = requestAnimationFrame(step);
        } else {
          currentX = 0;
          currentY = 0;
          applyCardTransform(0, 0);
          updateStrapSvg(0, 0);
        }
      };
      animFrameId = requestAnimationFrame(step);
    };

    // Apply 3D Transform to Badge Entity
    function applyCardTransform(x, y) {
      const rotateZ = Math.max(-24, Math.min(24, x * 0.05));
      const rotateY = Math.max(-28, Math.min(28, x * 0.07));
      const rotateX = Math.max(-22, Math.min(22, -y * 0.06));

      lanyardCard.style.transform = `translate3d(${x}px, ${y}px, 0px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;

      // Update Specular Glare position
      if (cardGlare) {
        const glareX = 50 + (rotateY * 1.5);
        const glareY = 50 - (rotateX * 1.5);
        cardGlare.style.background = `radial-gradient(circle 280px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 70%)`;
      }

      // Update shadow under badge
      if (lanyardShadow) {
        const shadowY = 25 + (y * 0.15);
        const shadowScale = 0.95 + Math.min(0.15, Math.max(-0.25, y * 0.0004));
        lanyardShadow.style.transform = `translate3d(${x * 0.4}px, ${shadowY}px, 0px) scale(${shadowScale})`;
      }
    }

    // Dynamic Bezier SVG Strap Renderer
    function updateStrapSvg(x, y) {
      const containerWidth = 400;
      const originX = containerWidth / 2; // 200px
      const isMobile = window.innerWidth < 992;
      const strapDropLength = isMobile ? 145 : 130;
      const clipEntryY = topOffset + strapDropLength + y;
      const clipX = originX + x;

      const topAnchorLeft = originX - 16;
      const topAnchorRight = originX + 16;
      const topY = isMobile ? 5 : -10;

      const lateralPull = x * 0.4;
      const sag = Math.max(8, 20 * (1 - Math.min(Math.max(0, y), 200) / 450));

      let c1LY, c2LY, c1RY, c2RY;
      if (clipEntryY > topY + 20) {
        c1LY = topY + ((clipEntryY - topY) * 0.35) + sag;
        c2LY = Math.max(c1LY + 15, clipEntryY - 32);
        c1RY = topY + ((clipEntryY - topY) * 0.35) + sag;
        c2RY = Math.max(c1RY + 15, clipEntryY - 32);
      } else {
        c1LY = topY + (clipEntryY - topY) * 0.33;
        c2LY = topY + (clipEntryY - topY) * 0.66;
        c1RY = c1LY;
        c2RY = c2LY;
      }

      // Control points for left strand
      const c1LX = topAnchorLeft + lateralPull;
      const c2LX = clipX - 6 + (x * 0.2);

      // Control points for right strand
      const c1RX = topAnchorRight + lateralPull;
      const c2RX = clipX + 6 + (x * 0.2);

      const pathL = `M ${topAnchorLeft} ${topY} C ${c1LX} ${c1LY}, ${c2LX} ${c2LY}, ${clipX - 5} ${clipEntryY}`;
      const pathR = `M ${topAnchorRight} ${topY} C ${c1RX} ${c1RY}, ${c2RX} ${c2RY}, ${clipX + 5} ${clipEntryY}`;
      const pathCenter = `M ${topAnchorLeft} ${topY} C ${c1LX} ${c1LY}, ${c2LX} ${c2LY}, ${clipX} ${clipEntryY}`;

      // Dynamic SVG canvas height expansion so strap never clips when pulled down
      const svgHeight = Math.max(700, topOffset + 680 + Math.max(0, y));
      lanyardSvg.setAttribute('viewBox', `0 0 ${containerWidth} ${svgHeight}`);
      lanyardSvg.style.top = `${-topOffset}px`;
      lanyardSvg.style.height = `${svgHeight}px`;

      const strapLeft = document.getElementById('strap-left');
      const strapRight = document.getElementById('strap-right');
      const strapLeftShadow = document.getElementById('strap-left-shadow');
      const strapRightShadow = document.getElementById('strap-right-shadow');
      const strapTextPath = document.getElementById('strap-text-path');

      if (strapLeft) strapLeft.setAttribute('d', pathL);
      if (strapRight) strapRight.setAttribute('d', pathR);
      if (strapLeftShadow) strapLeftShadow.setAttribute('d', pathL);
      if (strapRightShadow) strapRightShadow.setAttribute('d', pathR);
      if (strapTextPath) strapTextPath.setAttribute('d', pathCenter);
    }

    // Attach Mouse Events
    lanyardCard.addEventListener('mousedown', (e) => {
      // Don't drag if clicking flip button
      if (e.target.closest('#lanyard-flip-btn')) return;
      onPointerDown(e.clientX, e.clientY);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) onPointerMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', onPointerUp);

    // Attach Touch Events with smooth scroll override
    lanyardCard.addEventListener('touchstart', (e) => {
      if (e.target.closest('#lanyard-flip-btn')) return;
      if (e.touches.length > 0) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault(); // Prevent accidental scroll while pulling badge
      }
    }, { passive: false });

    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    // 3D Double-Sided Badge Flip Logic
    const badgeInner = document.getElementById('badge-inner');
    const lanyardFlipBtn = document.getElementById('lanyard-flip-btn');

    const toggleBadgeFlip = () => {
      if (!badgeInner) return;
      badgeInner.classList.toggle('flipped');
      playHapticSound(740, 'sine', 0.05);
    };

    if (lanyardFlipBtn) {
      lanyardFlipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBadgeFlip();
      });
    }

    lanyardCard.addEventListener('dblclick', (e) => {
      e.preventDefault();
      toggleBadgeFlip();
    });
  }

  // ------------------------------------------------------------------------
  // 9. Portfolio Filter Logic
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 10. Universal Lightbox Logic (Images & Videos)
  // ------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxMediaContainer = document.getElementById('lightbox-media-container');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  const openLightbox = (mediaType, mediaSrc, title, category) => {
    if (!lightboxModal || !lightboxMediaContainer) return;

    lightboxMediaContainer.innerHTML = '';

    if (mediaType === 'video') {
      const videoEl = document.createElement('video');
      videoEl.src = mediaSrc;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.className = 'lightbox-media';
      lightboxMediaContainer.appendChild(videoEl);
    } else {
      const imgEl = document.createElement('img');
      imgEl.src = mediaSrc;
      imgEl.alt = title;
      imgEl.className = 'lightbox-media';
      lightboxMediaContainer.appendChild(imgEl);
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${title}</strong> &bull; <span style="color: var(--accent-cyan);">${category}</span>`;
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    // Pause any playing video in lightbox
    const video = lightboxMediaContainer.querySelector('video');
    if (video) video.pause();
    // Reset zoom
    const img = lightboxMediaContainer.querySelector('img');
    if (img) img.classList.remove('is-zoomed');
    const zoomBtn = document.getElementById('lightbox-zoom-btn');
    if (zoomBtn) zoomBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i>';
  };

  const lightboxZoomBtn = document.getElementById('lightbox-zoom-btn');
  if (lightboxZoomBtn) {
    lightboxZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = lightboxMediaContainer.querySelector('img');
      if (img) {
        img.classList.toggle('is-zoomed');
        const isZ = img.classList.contains('is-zoomed');
        lightboxZoomBtn.innerHTML = isZ ? '<i class="fa-solid fa-magnifying-glass-minus"></i>' : '<i class="fa-solid fa-magnifying-glass-plus"></i>';
        playHapticSound(isZ ? 700 : 480, 'sine', 0.04);
      }
    });
  }

  // Bind click on work cards
  document.querySelectorAll('.work-media-wrap').forEach((wrap) => {
    wrap.addEventListener('click', () => {
      const card = wrap.closest('.work-card');
      const mediaType = card.getAttribute('data-type') || 'image';
      const title = card.querySelector('.work-card-title')?.textContent || 'Project Preview';
      const category = card.querySelector('.work-category')?.textContent || 'Portfolio';

      let mediaSrc = '';
      if (mediaType === 'video') {
        mediaSrc = wrap.querySelector('video')?.getAttribute('src') || '';
      } else {
        mediaSrc = wrap.querySelector('img')?.getAttribute('src') || '';
      }

      if (mediaSrc) {
        openLightbox(mediaType, mediaSrc, title, category);
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ------------------------------------------------------------------------
  // 11. Interactive Contact Form with WhatsApp Direct Dispatch
  // ------------------------------------------------------------------------
  // ========================================================================
  // PANDUAN GANTI NOMOR WHATSAPP FORMULIR:
  // Ubah nomor di bawah ini jika suatu saat Anda memiliki nomor WhatsApp Business baru.
  // Format internasional TANPA tanda + dan TANPA angka 0 di depan (contoh: '6281234567890')
  // ========================================================================
  const CREATOR_WHATSAPP_NUMBER = '6283813751564';
  const WHATSAPP_AVAILABLE = false;

  document.querySelectorAll('.whatsapp-unavailable').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Guest';
      const email = document.getElementById('form-email')?.value || '';
      const subject = document.getElementById('form-subject')?.value || 'Portfolio Inquiry';
      const message = document.getElementById('form-message')?.value || '';

      const fullMessage = `Hello Mu'Arif!%0A%0AMy Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0ASubject: ${encodeURIComponent(subject)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
      const waUrl = `https://wa.me/${CREATOR_WHATSAPP_NUMBER}?text=${fullMessage}`;

      if (!WHATSAPP_AVAILABLE) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-clock"></i> WhatsApp Currently Unavailable';
          submitBtn.disabled = true;
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> WhatsApp Currently Unavailable';
            submitBtn.disabled = false;
          }, 2500);
        }
        return;
      }

      // Show temporary submit confirmation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Redirecting to WhatsApp...';
        submitBtn.style.background = '#10b981';

        setTimeout(() => {
          window.open(waUrl, '_blank');
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          contactForm.reset();
        }, 800);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 12. Interactive Software Toolkit & Designer HUD Telemetry Modal
  // ------------------------------------------------------------------------
  const toolModal = document.getElementById('tool-inspector-modal');
  const toolModalClose = document.getElementById('tool-modal-close');
  const toolHeaderBadge = document.getElementById('tool-header-badge');
  const toolInspectorTitle = document.getElementById('tool-inspector-title');
  const toolInspectorSub = document.getElementById('tool-inspector-sub');
  const toolInspectorBody = document.getElementById('tool-inspector-body');
  const toolFilterBtn = document.getElementById('tool-filter-portfolio-btn');
  let activeAnimId = null;

  const toolDataset = {
    'photoshop': {
      tag: 'Ps',
      name: 'Adobe Photoshop',
      sub: 'Raster Manipulation & Commercial Color Grading',
      color: '#31a8ff',
      bgColor: '#001e36',
      filterTarget: 'social-media',
      metrics: [
        { label: 'Color Engine', val: 'CMYK / 32-bit' },
        { label: 'Layer Stacks', val: 'Non-Destructive' },
        { label: 'Retouching', val: 'Frequency Sep.' }
      ],
      tags: ['High-End Photo Manipulation', 'Visual Hierarchy', 'Social Media Ads', 'Product Retouching', 'Mockup Prototyping'],
      renderCanvas: (canvas) => {
        const ctx = canvas.getContext('2d');
        let t = 0;
        const draw = () => {
          t += 0.03;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw dark background grid
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
          for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }

          // Animated RGB Histogram
          const bars = 36;
          const barWidth = canvas.width / bars;
          for (let i = 0; i < bars; i++) {
            const h = Math.abs(Math.sin(t + i * 0.22)) * (canvas.height * 0.72) + 10;
            const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - h);
            grad.addColorStop(0, 'rgba(49, 168, 255, 0.15)');
            grad.addColorStop(1, '#31a8ff');
            ctx.fillStyle = grad;
            ctx.fillRect(i * barWidth + 2, canvas.height - h, barWidth - 4, h);
          }

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText('// HISTOGRAM: 300 DPI COMMERCIAL RASTER', 12, 20);

          activeAnimId = requestAnimationFrame(draw);
        };
        draw();
      }
    },
    'illustrator': {
      tag: 'Ai',
      name: 'Adobe Illustrator',
      sub: 'Vector Mathematics & Corporate Brand Systems',
      color: '#ff9a00',
      bgColor: '#330000',
      filterTarget: 'branding',
      metrics: [
        { label: 'Precision', val: 'Infinite Vector' },
        { label: 'Grid System', val: 'Golden Ratio / 8pt' },
        { label: 'Export', val: 'SVG / EPS / PDF' }
      ],
      tags: ['Logo Systems & Geometry', 'Vector Typography', 'Brand Guidelines', 'Commercial Packaging', 'Iconography'],
      renderCanvas: (canvas) => {
        const ctx = canvas.getContext('2d');
        let t = 0;
        const draw = () => {
          t += 0.025;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const w = canvas.width;
          const h = canvas.height;

          // Animated Bezier Curve
          const p0 = { x: 40, y: h * 0.75 };
          const p3 = { x: w - 40, y: h * 0.35 };
          const p1 = { x: w * 0.35, y: h * 0.2 + Math.sin(t) * 35 };
          const p2 = { x: w * 0.65, y: h * 0.85 + Math.cos(t) * 30 };

          // Control lines
          ctx.strokeStyle = 'rgba(255, 154, 0, 0.35)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.moveTo(p3.x, p3.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Curve
          ctx.strokeStyle = '#ff9a00';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
          ctx.stroke();

          // Anchor & handle nodes
          const drawHandle = (pt, color, isControl) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            if (isControl) {
              ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            } else {
              ctx.rect(pt.x - 4, pt.y - 4, 8, 8);
            }
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          };

          drawHandle(p0, '#ff9a00', false);
          drawHandle(p3, '#ff9a00', false);
          drawHandle(p1, '#ffd700', true);
          drawHandle(p2, '#ffd700', true);

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText('// CUBIC BEZIER VECTOR ANCHORS', 12, 20);

          activeAnimId = requestAnimationFrame(draw);
        };
        draw();
      }
    },
    'alight-motion': {
      tag: 'Am',
      isSvg: true,
      svgHtml: `<svg class="am-official-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 22px; height: 22px; display: block; color: #00e5ff;">
        <path d="M43.5 28.33a19.5 19.5 0 0 0-39 0" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.47 32.59a6.92 6.92 0 0 0 9.79-9.79" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.25 39.17a11.23 11.23 0 1 0 0-22.45" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M34.6 38.22a14.64 14.64 0 1 0-20.7-20.7" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      name: 'Alight Motion',
      sub: 'Keyframe Motion Curves & Kinetic Typography',
      color: '#00e5ff',
      bgColor: '#00222a',
      filterTarget: 'all',
      metrics: [
        { label: 'Motion Graph', val: 'Bézier Easing' },
        { label: 'Timeline Rate', val: '60 FPS Ultra-Smooth' },
        { label: 'Compositing', val: 'Multi-Layer FX' }
      ],
      tags: ['Kinetic Typography', 'Custom Velocity Curves', 'Visual Micro-Interactions', 'Video Reel Transitions'],
      renderCanvas: (canvas) => {
        const ctx = canvas.getContext('2d');
        let t = 0;
        const draw = () => {
          t += 0.035;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const w = canvas.width;
          const h = canvas.height;
          const progress = (t % (Math.PI * 2)) / (Math.PI * 2);

          // Grid
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
          ctx.lineWidth = 1;
          for (let y = 20; y < h; y += 25) {
            ctx.beginPath();
            ctx.moveTo(20, y);
            ctx.lineTo(w - 20, y);
            ctx.stroke();
          }

          // Easing Waveform Curve
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 20; x < w - 20; x++) {
            const normX = (x - 20) / (w - 40);
            const easeY = h * 0.8 - Math.sin(normX * Math.PI) * (h * 0.55);
            if (x === 20) ctx.moveTo(x, easeY);
            else ctx.lineTo(x, easeY);
          }
          ctx.stroke();

          // Animated Playhead & Bouncing Particle
          const ballX = 20 + progress * (w - 40);
          const normBallX = (ballX - 20) / (w - 40);
          const ballY = h * 0.8 - Math.sin(normBallX * Math.PI) * (h * 0.55);

          ctx.fillStyle = '#00e5ff';
          ctx.shadowColor = '#00e5ff';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Vertical Scrubber Line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(ballX, 10);
          ctx.lineTo(ballX, h - 10);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText(`// KEYFRAME VELOCITY & TIMING: ${(progress * 100).toFixed(0)}%`, 12, 20);

          activeAnimId = requestAnimationFrame(draw);
        };
        draw();
      }
    }
  };

  const openToolModal = (toolKey) => {
    const data = toolDataset[toolKey];
    if (!data || !toolModal) return;

    if (activeAnimId) cancelAnimationFrame(activeAnimId);

    if (data.isSvg && data.svgHtml) {
      toolHeaderBadge.innerHTML = data.svgHtml;
    } else {
      toolHeaderBadge.textContent = data.tag;
    }
    toolHeaderBadge.style.background = data.bgColor;
    toolHeaderBadge.style.color = data.color;
    toolHeaderBadge.style.border = `1.5px solid ${data.color}`;

    toolInspectorTitle.textContent = data.name;
    toolInspectorSub.textContent = data.sub;

    // Populate Body
    let metricsHtml = '<div class="telemetry-grid">';
    data.metrics.forEach((m) => {
      metricsHtml += `
        <div class="telemetry-item">
          <div class="telemetry-label">${m.label}</div>
          <div class="telemetry-val" style="color: ${data.color};">${m.val}</div>
        </div>
      `;
    });
    metricsHtml += '</div>';

    let tagsHtml = `
      <div class="telemetry-tag-section">
        <h4>// APPLIED COMMERCIAL SKILLS</h4>
        <div class="telemetry-tags">
          ${data.tags.map(t => `<span class="telemetry-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;

    toolInspectorBody.innerHTML = `
      ${metricsHtml}
      <div class="interactive-preview-canvas">
        <canvas id="tool-canvas" class="canvas-element" width="520" height="130"></canvas>
      </div>
      ${tagsHtml}
    `;

    // Start Canvas Animation
    const canvas = document.getElementById('tool-canvas');
    if (canvas && data.renderCanvas) {
      data.renderCanvas(canvas);
    }

    // Set filter button behavior
    if (toolFilterBtn) {
      toolFilterBtn.onclick = () => {
        closeToolModal();
        const targetFilter = document.querySelector(`.filter-btn[data-filter="${data.filterTarget}"]`) || document.querySelector('.filter-btn[data-filter="all"]');
        if (targetFilter) targetFilter.click();
        const worksSection = document.getElementById('works');
        if (worksSection) worksSection.scrollIntoView({ behavior: 'smooth' });
      };
    }

    toolModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playHapticSound(540, 'triangle', 0.05);
  };

  const closeToolModal = () => {
    if (!toolModal) return;
    toolModal.classList.remove('active');
    document.body.style.overflow = '';
    if (activeAnimId) cancelAnimationFrame(activeAnimId);
  };

  document.querySelectorAll('.software-card').forEach((card) => {
    card.addEventListener('click', () => {
      const toolKey = card.getAttribute('data-tool');
      if (toolKey) openToolModal(toolKey);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const toolKey = card.getAttribute('data-tool');
        if (toolKey) openToolModal(toolKey);
      }
    });
  });

  if (toolModalClose) toolModalClose.addEventListener('click', closeToolModal);
  if (toolModal) {
    toolModal.addEventListener('click', (e) => {
      if (e.target === toolModal) closeToolModal();
    });
  }

  // ------------------------------------------------------------------------
  // 13. Creative Typewriter Loop Controller
  // ------------------------------------------------------------------------
  const typewriterText = document.getElementById('typewriter-text');
  const heroSubtitle = document.getElementById('hero-subtitle');

  if (typewriterText) {
    const sequence = [
      { text: "Mu'Arif Sukma Jaya.", sub: "Product & Visual Designer" },
      { text: "Visual Designer.", sub: "All Marketing Product Specialist" },
      { text: "Marketing Creatives.", sub: "Commercial Posters & Social Media Visuals" },
      { text: "Motion Graphics.", sub: "Kinetic Curves & Visual Storytelling" }
    ];

    let seqIndex = 0;
    let charIndex = sequence[0].text.length;
    let isDeleting = false;
    let isWaiting = true;

    // Formatting with gradient accent & layout stability
    const formatHeadline = (str) => {
      if (!str) return "&nbsp;";
      if (str.startsWith("Mu'Arif ")) {
        const prefix = "Mu'Arif ";
        const rest = str.slice(prefix.length);
        if (rest) {
          return `${prefix}<span class="gradient-text">${rest}</span>`;
        }
        return prefix;
      }
      return str;
    };

    typewriterText.innerHTML = formatHeadline(sequence[0].text);

    const typeStep = () => {
      const currentObj = sequence[seqIndex];
      const fullText = currentObj.text;

      if (isWaiting) {
        setTimeout(() => {
          isWaiting = false;
          isDeleting = true;
          typeStep();
        }, seqIndex === 0 ? 3200 : 2200);
        return;
      }

      if (isDeleting) {
        charIndex--;
        const currentSlice = fullText.substring(0, charIndex);
        typewriterText.innerHTML = formatHeadline(currentSlice);

        if (charIndex <= 0) {
          isDeleting = false;
          seqIndex = (seqIndex + 1) % sequence.length;

          // Smooth fade transition for subheadline
          if (heroSubtitle) {
            heroSubtitle.style.opacity = '0';
            heroSubtitle.style.transform = 'translateY(6px)';
            setTimeout(() => {
              heroSubtitle.textContent = sequence[seqIndex].sub;
              heroSubtitle.style.opacity = '1';
              heroSubtitle.style.transform = 'translateY(0)';
            }, 300);
          }

          setTimeout(typeStep, 350);
          return;
        }

        setTimeout(typeStep, 38);
      } else {
        charIndex++;
        const currentSlice = fullText.substring(0, charIndex);
        typewriterText.innerHTML = formatHeadline(currentSlice);

        if (charIndex === fullText.length) {
          isWaiting = true;
          typeStep();
          return;
        }

        // Slight organic variation (65ms - 100ms)
        const speed = 65 + Math.random() * 35;
        setTimeout(typeStep, speed);
      }
    };

    // Begin loop after 2.8 seconds initial showcase
    setTimeout(() => {
      isWaiting = false;
      isDeleting = true;
      typeStep();
    }, 2800);
  }

  // ------------------------------------------------------------------------
  // 14. Chameleon Live Designer Palette Tuner (Presets + Custom Hex Color)
  // ------------------------------------------------------------------------
  const applyCustomAccent = (hex, playSound = false) => {
    if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    document.documentElement.style.setProperty('--accent-cyan', hex);
    document.documentElement.style.setProperty('--accent-cyan-glow', `rgba(${r}, ${g}, ${b}, 0.25)`);
    document.documentElement.style.setProperty('--border-active', `rgba(${r}, ${g}, ${b}, 0.45)`);
    localStorage.setItem('portfolio_custom_accent', hex);

    document.querySelectorAll('.tuner-preset-chip').forEach((chip) => {
      chip.classList.toggle('active', chip.getAttribute('data-color').toLowerCase() === hex.toLowerCase());
    });
    const picker = document.getElementById('custom-hex-picker');
    if (picker) picker.value = hex;

    if (playSound) {
      try { playHapticSound(640, 'triangle', 0.05); } catch (_) {}
    }
  };

  const paletteToggleBtn = document.getElementById('palette-toggle-btn');
  const palettePopover = document.getElementById('palette-tuner-popover');
  const customHexPicker = document.getElementById('custom-hex-picker');
  const tunerResetBtn = document.getElementById('tuner-reset-btn');

  // Restore saved custom accent on page load
  const savedAccent = localStorage.getItem('portfolio_custom_accent');
  if (savedAccent) {
    applyCustomAccent(savedAccent, false);
  }

  if (paletteToggleBtn && palettePopover) {
    paletteToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      palettePopover.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!palettePopover.contains(e.target) && !paletteToggleBtn.contains(e.target)) {
        palettePopover.classList.remove('open');
      }
    });
  }

  document.querySelectorAll('.tuner-preset-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const color = chip.getAttribute('data-color');
      applyCustomAccent(color, true);
    });
  });

  if (customHexPicker) {
    customHexPicker.addEventListener('input', (e) => {
      applyCustomAccent(e.target.value, false);
    });
  }

  if (tunerResetBtn) {
    tunerResetBtn.addEventListener('click', () => {
      localStorage.removeItem('portfolio_custom_accent');
      document.documentElement.style.removeProperty('--accent-cyan');
      document.documentElement.style.removeProperty('--accent-cyan-glow');
      document.documentElement.style.removeProperty('--border-active');
      document.querySelectorAll('.tuner-preset-chip').forEach((chip) => chip.classList.remove('active'));
      if (customHexPicker) customHexPicker.value = '#06b6d4';
      try { playHapticSound(520, 'sine', 0.08); } catch (_) {}
    });
  }

  // ------------------------------------------------------------------------
  // 15. Interactive Brand Color Swatch Copy Engine
  // ------------------------------------------------------------------------
  const swatchChips = document.querySelectorAll('.color-swatch-chip');
  let toastEl = null;

  const showSwatchToast = (hex) => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'swatch-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = `
      <span class="swatch-toast-dot" style="background: ${hex}; box-shadow: 0 0 10px ${hex};"></span>
      <span>COPIED <strong>${hex}</strong> TO CLIPBOARD</span>
    `;
    toastEl.classList.add('show');
    playHapticSound(640, 'sine', 0.05);

    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2000);
  };

  swatchChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent opening lightbox
      const hex = chip.getAttribute('data-hex');
      if (hex) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hex).catch(() => {});
        }
        showSwatchToast(hex);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 16. Content Protection Shield (Anti-Download & Anti-Theft)
  // ------------------------------------------------------------------------
  let protectionToast = null;
  const showProtectionNotice = () => {
    if (!protectionToast) {
      protectionToast = document.createElement('div');
      protectionToast.className = 'swatch-toast';
      protectionToast.innerHTML = `
        <i class="fa-solid fa-shield-halved" style="color: var(--accent-cyan);"></i>
        <span>CONTENT PROTECTED &bull; REPRODUCTION RESTRICTED</span>
      `;
      document.body.appendChild(protectionToast);
    }
    protectionToast.classList.add('show');
    clearTimeout(protectionToast._timer);
    protectionToast._timer = setTimeout(() => {
      protectionToast.classList.remove('show');
    }, 2200);
  };

  // Block right-click contextmenu on media
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.work-media-wrap, .lightbox-media, img, video, .portrait-photo')) {
      e.preventDefault();
      showProtectionNotice();
    }
  });

  // Block dragging media
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.closest('.work-media-wrap')) {
      e.preventDefault();
    }
  });

  // Block Ctrl+S / Ctrl+U webpage inspection shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      showProtectionNotice();
    }
  });
});
