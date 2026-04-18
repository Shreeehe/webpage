// ============================================================
// FIXED main.js — Aksraya Health Care
// Key fixes:
//  1. Unified observer handles both .fade-in/.fade-in-up AND
//     .animate-on-scroll — adds correct class for each
//  2. Stagger children now receive 'animate-in' not 'visible'
//     (matches the CSS transitions on service/bento/review cards)
//  3. Ripple uses getBoundingClientRect() for accurate coords
//  4. Process timeline: adds 'animate-in' to #process-timeline
//     so the CSS selector `.animate-in .timeline-progress` fires
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. Scroll Animations ────────────────────────────────────────
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            if (el.classList.contains('stagger-container')) {
                // FIX #2: children need 'animate-in', not 'visible'
                Array.from(el.children).forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                        child.classList.add('visible'); // keep for any CSS using .visible
                    }, index * 120);
                });
            } else if (el.classList.contains('animate-on-scroll')) {
                // FIX #1: .animate-on-scroll needs 'animate-in'
                el.classList.add('animate-in');
            } else {
                // .fade-in and .fade-in-up use 'visible'
                el.classList.add('visible');
            }

            observer.unobserve(el);
        });
    }, observerOptions);

    // FIX #1: observe .animate-on-scroll elements too
    const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-up, .stagger-container, .animate-on-scroll'
    );
    animatedElements.forEach(el => animateObserver.observe(el));


    // ─── 2. Process Timeline Observer ───────────────────────────────
    // FIX #4: The CSS `.animate-in .timeline-progress` needs 'animate-in'
    // on the #process-timeline container, not on child elements
    const processTimeline = document.getElementById('process-timeline');
    if (processTimeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger all process-step animations via parent class
                    processTimeline.classList.add('animate-in');
                    timelineObserver.unobserve(processTimeline);
                }
            });
        }, { threshold: 0.2 });
        timelineObserver.observe(processTimeline);
    }


    // ─── 3. 3D Tilt Effect for Cards ────────────────────────────────
    const cards = document.querySelectorAll(
        '.card, .pricing-card, .testimonial-card, .feature-item, .contact-box'
    );

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            let glare = card.querySelector('.glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.classList.add('glare');
                card.appendChild(glare);
            }
            glare.style.left = `${x}px`;
            glare.style.top = `${y}px`;
            glare.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform =
                'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            const glare = card.querySelector('.glare');
            if (glare) glare.style.opacity = '0';
        });
    });


    // ─── 4. Button Ripple Effect ─────────────────────────────────────
    // FIX #3: Use getBoundingClientRect() for accurate coords inside
    // any scroll position or nested container
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;   // ← FIX
            const y = e.clientY - rect.top;    // ← FIX

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });


    // ─── 5. Mobile Menu ──────────────────────────────────────────────
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });


    // ─── 6. Smooth Scroll (same-page anchors only) ───────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
                if (navLinks) navLinks.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            });
        }
    });


    // ─── 7. Scroll Progress Bar ───────────────────────────────────────
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }, { passive: true });
    }


    // ─── 8. Animated Stats Counter ───────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        el.textContent = '0';

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        };
        updateCounter();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));


    // ─── 9. FAQ Accordion ────────────────────────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question =
            item.querySelector('.faq-question') || item.querySelector('h4');
        if (question) {
            question.style.cursor = 'pointer';
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => {
                    other.classList.remove('active');
                    const otherQuestion = other.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                } else {
                    question.setAttribute('aria-expanded', 'false');
                }
            });
            // Handle keyboard navigation
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });


    // ─── 10. Sticky Navbar CTA ────────────────────────────────────────
    const navbarCta = document.getElementById('navbar-cta');
    if (navbarCta) {
        window.addEventListener('scroll', () => {
            const heroHeight =
                document.querySelector('.hero')?.offsetHeight || 500;
            if (window.scrollY > heroHeight * 0.6) {
                navbarCta.href = 'tel:+918310962174';
                navbarCta.textContent = '📞 Call Now';
                navbarCta.classList.add('scrolled');
            } else {
                navbarCta.href = '#contact';
                navbarCta.textContent = 'Contact Us';
                navbarCta.classList.remove('scrolled');
            }
        }, { passive: true });
    }


    // ─── 11. App Launch Notify Form ───────────────────────────────────
    const notifyBtn = document.getElementById('notify-btn');
    const notifyResponse = document.getElementById('notify-response');
    const notifyInput = document.querySelector('.notify-input');
    const notifyInputGroup = document.querySelector('.notify-input-group');

    if (notifyBtn && notifyResponse) {
        notifyBtn.addEventListener('click', () => {
            const val = notifyInput?.value.trim();
            if (val) {
                const originalHTML = notifyBtn.innerHTML;
                notifyBtn.disabled = true;
                notifyBtn.classList.add('loading');
                notifyBtn.innerHTML = '<div class="spinner"></div> Processing...';
                notifyResponse.classList.remove('visible');

                setTimeout(() => {
                    notifyBtn.disabled = false;
                    notifyBtn.classList.remove('loading');
                    notifyBtn.innerHTML = originalHTML;

                    if (notifyInputGroup) {
                        notifyInputGroup.classList.add('success-hide');
                        setTimeout(() => {
                            notifyInputGroup.style.display = 'none';
                        }, 500);
                    }

                    notifyResponse.textContent = "Thanks! We'll keep you updated.";
                    notifyResponse.style.color = '';   // reset any error colour
                    notifyResponse.classList.add('visible');
                    if (notifyInput) notifyInput.value = '';
                }, 1000);

            } else {
                notifyResponse.textContent = 'Please enter your email or number.';
                notifyResponse.style.color = '#ef4444';
                notifyResponse.classList.add('visible');

                setTimeout(() => {
                    notifyResponse.classList.remove('visible');
                    setTimeout(() => {
                        notifyResponse.style.color = '';
                    }, 300);
                }, 3000);
            }
        });
    }

    // ─── Mobile Bottom Toolbar ────────────────────────────────────────
    const heroSection = document.querySelector('.hero');
    const mobileToolbar = document.getElementById('mobile-toolbar');

    if (heroSection && mobileToolbar) {
        const toolbarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Hero section has left the viewport, show toolbar
                    mobileToolbar.classList.add('visible');
                } else {
                    // Hero section is visible, hide toolbar
                    mobileToolbar.classList.remove('visible');
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0
        });

        toolbarObserver.observe(heroSection);
    }
});