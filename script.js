document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    const projectCards = Array.from(document.querySelectorAll('.project-card-hrg'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const loader = document.getElementById('loader');
    const scrollProgressBar = document.getElementById('scrollProgress');
    const heroCounter = document.querySelector('.hero-counter .current');
    const carouselProgressBar = document.getElementById('carouselProgress');
    let lightbox = null;
    let currentSlide = 0;
    let slideInterval = null;

    // ============================================================
    // GSAP + SCROLL TRIGGER SETUP
    // ============================================================
    const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    if (hasGSAP) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ============================================================
    // GSAP ANIMATIONS
    // ============================================================
    function initGSAPAnimations() {
        if (!hasGSAP) return;

        // --- Scroll Progress Bar ---
        if (scrollProgressBar) {
            gsap.to(scrollProgressBar, {
                width: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.3
                }
            });
        }

        // --- Parallax on Hero Background ---
        const heroSlides = document.querySelectorAll('.hero-slide');
        heroSlides.forEach((slide) => {
            gsap.to(slide, {
                backgroundPositionY: '30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // --- Parallax + Zoom on City Section Background ---
        const cityBg = document.querySelector('.city-bg');
        if (cityBg) {
            // Parallax vertical movement
            gsap.to(cityBg, {
                y: -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#city-section',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // Cinematic zoom effect as section comes into view
            gsap.fromTo(cityBg,
                { scale: 1 },
                {
                    scale: 1.15,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#city-section',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }

        // --- Parallax on Page Headers ---
        const pageHeaders = document.querySelectorAll('.page-header');
        pageHeaders.forEach((header) => {
            gsap.to(header, {
                backgroundPositionY: '40%',
                ease: 'none',
                scrollTrigger: {
                    trigger: header,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // --- Section Reveal Animations ---
        // Headings - slide up with stagger (exclude hero which has its own animation)
        gsap.utils.toArray('section:not(#hero) h2').forEach((el) => {
            gsap.fromTo(el, 
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Paragraphs (exclude hero)
        gsap.utils.toArray('section:not(#hero) > .container p, .page-header p').forEach((el) => {
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // --- Image Reveals (clip-path wipe from left) ---
        gsap.utils.toArray('.home-about-figure, .about-story-figure, .projects-feature-media, .leadership-image-wrap').forEach((el) => {
            gsap.fromTo(el,
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.4,
                    ease: 'power4.inOut',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // --- Staggered Cards ---
        const cardGroups = [
            '.about-values-grid-redesign .about-value-card',
            '.milestone-track-redesign .milestone-card-redesign',
            '.projects-showcase-grid .project-showcase-card',
            '.projects-grid-hrg .project-card-hrg',
            '.home-about-metrics .home-about-metric'
        ];

        cardGroups.forEach((selector) => {
            const cards = gsap.utils.toArray(selector);
            if (!cards.length) return;

            gsap.fromTo(cards,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cards[0].parentElement,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // --- Section Separator Lines ---
        gsap.utils.toArray('.section-separator').forEach((line) => {
            gsap.fromTo(line,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    transformOrigin: 'left center',
                    duration: 1.2,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // --- Horizontal Scroll Parallax on About Pillars ---
        const pillars = gsap.utils.toArray('.home-about-pillar');
        if (pillars.length) {
            gsap.fromTo(pillars,
                { x: -40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.home-about-pillars',
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // --- Horizontal Scroll Parallax for Projects ---
        const projectsGrid = document.querySelector('.projects-showcase-grid');
        if (projectsGrid) {
            const projectShowcaseCards = gsap.utils.toArray('.projects-showcase-grid .project-showcase-card');
            
            if (projectShowcaseCards.length > 1) {
                // Convert grid to horizontal layout
                projectsGrid.style.display = 'flex';
                projectsGrid.style.flexWrap = 'nowrap';
                projectsGrid.style.gap = '1.5rem';
                projectsGrid.style.width = 'max-content';
                projectsGrid.style.alignItems = 'stretch';
                
                // Card width: smaller on mobile so full card is visible
                const isMobile = window.innerWidth <= 768;
                const cardWidth = isMobile ? '160px' : '320px';
                const cardMax = isMobile ? '180px' : '350px';

                projectShowcaseCards.forEach((card) => {
                    card.style.minWidth = cardWidth;
                    card.style.maxWidth = cardMax;
                    card.style.flex = '0 0 auto';
                });

                ScrollTrigger.refresh();

                const scrollDistance = projectsGrid.scrollWidth - window.innerWidth + 60;

                gsap.to(projectsGrid, {
                    x: -scrollDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.projects-showcase-section',
                        start: 'bottom 155%',
                        end: () => `+=${scrollDistance}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });
            }
        }

        // --- Leadership Cards Slide In ---
        gsap.utils.toArray('.leadership-card-redesign').forEach((card, i) => {
            gsap.fromTo(card,
                { x: i % 2 === 0 ? -80 : 80, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // --- Contact Form Panel Reveal ---
        const contactFormEl = document.querySelector('.contact-form-hrg');
        if (contactFormEl) {
            gsap.fromTo(contactFormEl,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contactFormEl,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // --- Stat Number Count-Up ---
        gsap.utils.toArray('.about-stat-card strong, .home-about-metric strong').forEach((el) => {
            const text = el.textContent.trim();
            const match = text.match(/^(\d+)(\+?)$/);
            if (!match) return;

            const target = parseInt(match[1], 10);
            const suffix = match[2] || '';
            const obj = { val: 0 };

            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            el.textContent = Math.floor(obj.val) + suffix;
                        }
                    });
                },
                once: true
            });
        });

        // --- Buttons Magnetic Effect ---
        document.querySelectorAll('.btn').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });

        // --- CTA Band Parallax ---
        gsap.utils.toArray('.page-cta-band').forEach((band) => {
            gsap.fromTo(band,
                { scale: 0.95, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: band,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // --- Footer Columns Stagger ---
        const footerCols = gsap.utils.toArray('.footer-col');
        if (footerCols.length) {
            gsap.fromTo(footerCols,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#footer',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // --- Hero Gold Line Animation (skip - can't animate pseudo elements) ---

        // --- Subtitle Typewriter Effect ---
        gsap.utils.toArray('.subtitle').forEach((el) => {
            const text = el.textContent;
            el.textContent = '';
            
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => {
                    let i = 0;
                    el.style.borderRight = '1px solid var(--accent)';
                    const typeInterval = setInterval(() => {
                        el.textContent += text[i];
                        i++;
                        if (i >= text.length) {
                            clearInterval(typeInterval);
                            gsap.to(el, { borderRightColor: 'transparent', duration: 0.5, delay: 0.5 });
                        }
                    }, 40);
                },
                once: true
            });
        });

        // --- Help Banner Entrance ---
        const helpBanner = document.querySelector('.help-banner');
        if (helpBanner) {
            gsap.fromTo(helpBanner,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: helpBanner,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // --- Pin hero counter while scrolling through hero ---
        const heroCounterEl = document.querySelector('.hero-counter');
        if (heroCounterEl) {
            gsap.to(heroCounterEl, {
                opacity: 0,
                scrollTrigger: {
                    trigger: '#hero',
                    start: '80% top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }

    // ============================================================
    // SCROLL PROGRESS (fallback if GSAP doesn't handle it)
    // ============================================================
    const updateScrollProgress = () => {
        if (!scrollProgressBar || hasGSAP) return; // GSAP handles this
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollProgressBar.style.width = progress + '%';
    };

    if (!hasGSAP) {
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
    }

    // ============================================================
    // HERO CAROUSEL
    // ============================================================
    const updateHeroCounter = () => {
        if (!heroCounter) return;
        heroCounter.textContent = String(currentSlide + 1).padStart(2, '0');
    };

    const updateCarouselProgress = () => {
        if (!carouselProgressBar || !slides.length) return;
        const segmentWidth = 100 / slides.length;
        carouselProgressBar.style.width = segmentWidth + '%';
        carouselProgressBar.style.marginLeft = (currentSlide * segmentWidth) + '%';
    };

    const syncBodyScroll = () => {
        const menuOpen = navLinks ? navLinks.classList.contains('active') : false;
        const lightboxOpen = lightbox ? lightbox.style.display === 'block' : false;
        body.style.overflow = menuOpen || lightboxOpen ? 'hidden' : '';
    };

    const setMenuState = (isOpen) => {
        if (!hamburger || !navLinks) return;
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        navLinks.classList.toggle('active', isOpen);
        syncBodyScroll();
    };

    const showSlide = (index) => {
        if (!slides.length) return;
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === currentSlide;
            slide.classList.toggle('active', isActive);
            if (dots[slideIndex]) {
                dots[slideIndex].classList.toggle('active', isActive);
                dots[slideIndex].setAttribute('aria-pressed', String(isActive));
            }
        });

        updateHeroCounter();
        updateCarouselProgress();
    };

    const startSlideTimer = () => {
        if (!slides.length) return;
        window.clearInterval(slideInterval);
        slideInterval = window.setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000);
    };

    if (slides.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startSlideTimer();
            });
        });
        showSlide(0);
        // Don't start auto-slide here — it starts after the loader dismisses
    }

    // ============================================================
    // SCROLL HANDLER (Navbar + Back to Top)
    // ============================================================
    const handleScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        if (backToTop) {
            backToTop.classList.toggle('show', window.scrollY > 800);
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ============================================================
    // HAMBURGER MENU
    // ============================================================
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            setMenuState(!navLinks.classList.contains('active'));
        });
    }

    links.forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 769 && navLinks && navLinks.classList.contains('active')) {
            setMenuState(false);
        }
    });

    // ============================================================
    // PROJECT IMAGE CAROUSELS
    // ============================================================
    const projectCarousels = document.querySelectorAll('.project-carousel');
    projectCarousels.forEach((carousel) => {
        const carouselImages = carousel.querySelectorAll('img');
        let currentImageIndex = 0;
        const interval = Number.parseInt(carousel.getAttribute('data-interval'), 10) || 5000;

        if (carouselImages.length > 1) {
            window.setInterval(() => {
                carouselImages[currentImageIndex].classList.remove('active');
                currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
                carouselImages[currentImageIndex].classList.add('active');
            }, interval);
        }
    });

    // ============================================================
    // CONTACT FORM
    // ============================================================
    const setFormMessage = (message, state) => {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = state ? state : '';
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !phone || !message) {
                setFormMessage('Please complete all fields before sending your inquiry.', 'error');
                return;
            }

            const subject = `Project Inquiry from ${name}`;
            const bodyLines = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${phone}`,
                '',
                'Inquiry:',
                message
            ];
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent('genkinenterprises@gmail.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
            const gmailWindow = window.open(gmailLink, '_blank', 'noopener');

            setFormMessage('Opening Gmail with your inquiry.', 'info');
            if (!gmailWindow) window.location.href = gmailLink;
            contactForm.reset();
        });
    }

    // ============================================================
    // LIGHTBOX
    // ============================================================
    lightbox = document.getElementById('projectLightbox');

    if (lightbox) {
        const lightboxSlider = lightbox.querySelector('.lightbox-slider');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let lightboxCurrentIndex = 0;
        let currentProjectTitle = '';
        let lastFocusedElement = null;

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
            syncBodyScroll();
            if (lastFocusedElement) lastFocusedElement.focus();
        };

        const updateLightboxImage = () => {
            const allImages = Array.from(lightboxSlider.querySelectorAll('img'));
            if (!allImages.length) return;
            allImages.forEach((image, i) => image.classList.toggle('active', i === lightboxCurrentIndex));
            lightboxCaption.textContent = `${lightboxCurrentIndex + 1} / ${allImages.length} — ${currentProjectTitle}`;
            lightboxPrev.disabled = allImages.length <= 1;
            lightboxNext.disabled = allImages.length <= 1;
        };

        const openLightbox = (card) => {
            const cardImages = Array.from(card.querySelectorAll('.project-img-container img'));
            if (!cardImages.length) return;

            currentProjectTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project';
            lightboxSlider.innerHTML = '';

            cardImages.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.alt;
                img.classList.toggle('active', index === 0);
                lightboxSlider.appendChild(img);
            });

            lightboxCurrentIndex = 0;
            updateLightboxImage();
            lastFocusedElement = document.activeElement;
            lightbox.style.display = 'block';
            lightbox.setAttribute('aria-hidden', 'false');
            syncBodyScroll();
            lightboxClose.focus();
        };

        const activateProjectCard = (event) => {
            if (event.type === 'click' && (event.target.closest('.btn') || event.target.closest('a'))) return;
            if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
            if (event.type === 'keydown') event.preventDefault();
            openLightbox(event.currentTarget);
        };

        projectCards.forEach((card) => {
            card.addEventListener('click', activateProjectCard);
            card.addEventListener('keydown', activateProjectCard);
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => {
            const allImages = lightboxSlider.querySelectorAll('img');
            if (!allImages.length) return;
            lightboxCurrentIndex = (lightboxCurrentIndex - 1 + allImages.length) % allImages.length;
            updateLightboxImage();
        });
        lightboxNext.addEventListener('click', () => {
            const allImages = lightboxSlider.querySelectorAll('img');
            if (!allImages.length) return;
            lightboxCurrentIndex = (lightboxCurrentIndex + 1) % allImages.length;
            updateLightboxImage();
        });

        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (lightbox.style.display === 'block') closeLightbox();
                else if (navLinks && navLinks.classList.contains('active')) setMenuState(false);
            }
            if (lightbox.style.display === 'block') {
                if (e.key === 'ArrowLeft') { e.preventDefault(); lightboxPrev.click(); }
                if (e.key === 'ArrowRight') { e.preventDefault(); lightboxNext.click(); }
            }
        });
    } else {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) setMenuState(false);
        });
    }

    // ============================================================
    // LOADER (3 seconds, once per session, carousel paused during)
    // ============================================================
    const dismissLoader = () => {
        if (!loader) return;
        loader.classList.add('loaded');
        body.classList.add('site-loaded');
        body.style.overflow = '';
        sessionStorage.setItem('genkin_preloader_shown', '1');
        setTimeout(() => {
            loader.style.display = 'none';
            if (!prefersReducedMotion.matches) {
                initGSAPAnimations();
            }
            startSlideTimer();
        }, 700);
    };

    const preloaderAlreadyShown = sessionStorage.getItem('genkin_preloader_shown');

    if (loader && !prefersReducedMotion.matches && !preloaderAlreadyShown) {
        body.style.overflow = 'hidden';
        setTimeout(dismissLoader, 3000);
    } else {
        if (loader) loader.style.display = 'none';
        body.classList.add('site-loaded');
        if (!prefersReducedMotion.matches) {
            initGSAPAnimations();
        }
        startSlideTimer();
    }

    // ============================================================
    // PAGE TRANSITIONS
    // ============================================================
    const pageTransition = document.getElementById('pageTransition');

    if (pageTransition) {
        const internalLinks = document.querySelectorAll('a[href]');

        internalLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href) return;
            if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
            if (link.target === '_blank') return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                pageTransition.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            });
        });
    }
});
