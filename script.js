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
    let lightbox = null;
    let currentSlide = 0;
    let slideInterval = null;

    const syncBodyScroll = () => {
        const menuOpen = navLinks ? navLinks.classList.contains('active') : false;
        const lightboxOpen = lightbox ? lightbox.style.display === 'block' : false;
        body.style.overflow = menuOpen || lightboxOpen ? 'hidden' : '';
    };

    const setMenuState = (isOpen) => {
        if (!hamburger || !navLinks) {
            return;
        }

        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        navLinks.classList.toggle('active', isOpen);
        syncBodyScroll();
    };

    const showSlide = (index) => {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === currentSlide;
            slide.classList.toggle('active', isActive);

            if (dots[slideIndex]) {
                dots[slideIndex].classList.toggle('active', isActive);
                dots[slideIndex].setAttribute('aria-pressed', String(isActive));
            }
        });
    };

    const startSlideTimer = () => {
        if (!slides.length) {
            return;
        }

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
        startSlideTimer();
    }

    const handleScroll = () => {
        if (!navbar) {
            return;
        }

        navbar.classList.toggle('scrolled', window.scrollY > 60);

        if (backToTop) {
            backToTop.classList.toggle('show', window.scrollY > 800);
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            setMenuState(!navLinks.classList.contains('active'));
        });
    }

    links.forEach((link) => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 769 && navLinks && navLinks.classList.contains('active')) {
            setMenuState(false);
            return;
        }

        syncBodyScroll();
    });

    const setupScrollAnimations = () => {
        const revealSelector = [
            '#about-hrg .subtitle',
            '#about-hrg .home-about-figure',
            '#about-hrg .home-about-metric',
            '#about-hrg .home-about-content h2',
            '#about-hrg .home-about-content p',
            '#about-hrg .home-about-pillar',
            '#about-hrg .page-cta-actions',
            '#city-section .city-content',
            '#contact-hrg .contact-header-hrg > *',
            '#contact-hrg .detail-item',
            '#contact-hrg .contact-form-hrg',
            '.page-header .page-hero-copy > *',
            '.page-header .page-hero-panel',
            '.page-header .contact-hero-panel',
            '.about-story-figure',
            '.about-story-copy > *',
            '.about-stat-card',
            '.about-value-card',
            '.milestone-card-redesign',
            '.leadership-card-redesign',
            '.contact-page-copy > *',
            '.contact-form-panel',
            '.contact-step-card',
            '.contact-side-note',
            '.projects-feature-media',
            '.projects-feature-copy > *',
            '.project-showcase-card',
            '.page-cta-band',
            '.help-banner',
            '.footer-col'
        ].join(',');

        const revealElements = Array.from(new Set(document.querySelectorAll(revealSelector)));

        if (!revealElements.length) {
            return;
        }

        if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
            revealElements.forEach((element) => {
                element.classList.add('is-visible');
            });
            return;
        }

        const revealCounts = new WeakMap();
        revealElements.forEach((element) => {
            element.classList.add('reveal-on-scroll');

            const parent = element.parentElement;
            const revealIndex = parent ? (revealCounts.get(parent) || 0) : 0;
            element.style.setProperty('--reveal-delay', `${Math.min(revealIndex, 5) * 90}ms`);

            if (parent) {
                revealCounts.set(parent, revealIndex + 1);
            }
        });

        const observer = new IntersectionObserver((entries, animationObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                animationObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.14,
            rootMargin: '0px 0px -10% 0px'
        });

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    };

    setupScrollAnimations();

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

    const setFormMessage = (message, state) => {
        if (!formMessage) {
            return;
        }

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

            if (!gmailWindow) {
                window.location.href = gmailLink;
            }

            contactForm.reset();
        });
    }

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

            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };

        const updateLightboxImage = () => {
            const allImages = Array.from(lightboxSlider.querySelectorAll('img'));

            if (!allImages.length) {
                return;
            }

            allImages.forEach((image, imageIndex) => {
                image.classList.toggle('active', imageIndex === lightboxCurrentIndex);
            });

            lightboxCaption.textContent = `${lightboxCurrentIndex + 1} / ${allImages.length} - ${currentProjectTitle}`;
            const disableNavigation = allImages.length <= 1;
            lightboxPrev.disabled = disableNavigation;
            lightboxNext.disabled = disableNavigation;
        };

        const openLightbox = (card) => {
            const cardImages = Array.from(card.querySelectorAll('.project-img-container img'));

            if (!cardImages.length) {
                return;
            }

            currentProjectTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project';
            lightboxSlider.innerHTML = '';

            cardImages.forEach((image, index) => {
                const lightboxImage = document.createElement('img');
                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;
                lightboxImage.classList.toggle('active', index === 0);
                lightboxSlider.appendChild(lightboxImage);
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
            if (event.type === 'click' && (event.target.closest('.btn') || event.target.closest('a'))) {
                return;
            }

            if (event.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                }

                event.preventDefault();
            }

            openLightbox(event.currentTarget);
        };

        projectCards.forEach((card) => {
            card.addEventListener('click', activateProjectCard);
            card.addEventListener('keydown', activateProjectCard);
        });

        lightboxClose.addEventListener('click', closeLightbox);

        lightboxPrev.addEventListener('click', () => {
            const allImages = lightboxSlider.querySelectorAll('img');

            if (!allImages.length) {
                return;
            }

            lightboxCurrentIndex = (lightboxCurrentIndex - 1 + allImages.length) % allImages.length;
            updateLightboxImage();
        });

        lightboxNext.addEventListener('click', () => {
            const allImages = lightboxSlider.querySelectorAll('img');

            if (!allImages.length) {
                return;
            }

            lightboxCurrentIndex = (lightboxCurrentIndex + 1) % allImages.length;
            updateLightboxImage();
        });

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (lightbox.style.display === 'block') {
                    closeLightbox();
                } else if (navLinks && navLinks.classList.contains('active')) {
                    setMenuState(false);
                }
            }

            if (lightbox.style.display === 'block') {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    lightboxPrev.click();
                }

                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    lightboxNext.click();
                }
            }
        });
    } else {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
                setMenuState(false);
            }
        });
    }
});
