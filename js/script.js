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
        let rafId;
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
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


    // ─── 7. Scroll Progress Bar + Sticky Navbar CTA (merged, RAF-throttled) ──
    const scrollProgress = document.getElementById('scrollProgress');


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


    const navbarCta = document.getElementById('navbar-cta');

    if (scrollProgress || navbarCta) {
        let scrollRafId;
        const heroEl = document.querySelector('.hero');

        window.addEventListener('scroll', () => {
            cancelAnimationFrame(scrollRafId);
            scrollRafId = requestAnimationFrame(() => {
                // Progress bar
                if (scrollProgress) {
                    const scrollTop = window.scrollY;
                    const docHeight =
                        document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = (scrollTop / docHeight) * 100;
                    scrollProgress.style.width = scrollPercent + '%';
                }

                // Sticky navbar CTA
                if (navbarCta) {
                    const heroHeight = heroEl?.offsetHeight || 500;
                    if (window.scrollY > heroHeight * 0.6) {
                        navbarCta.href = 'tel:+918310962174';
                        navbarCta.textContent = '📞 Call Now';
                        navbarCta.classList.add('scrolled');
                    } else {
                        navbarCta.href = '#contact';
                        navbarCta.textContent = 'Contact Us';
                        navbarCta.classList.remove('scrolled');
                    }
                }
            });
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
                    mobileToolbar.classList.add('visible');
                } else {
                    mobileToolbar.classList.remove('visible');
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0 });
        toolbarObserver.observe(heroSection);
    }

    // ─── Hero Typewriter Effect ───────────────────────────────────────
    const typewriterEl = document.getElementById('heroTypewriter');
    if (typewriterEl) {
        const phrases = [
            'Your Family',
            'Elderly Parents',
            'Recovery Patients',
            'Bedridden Care',
            'Post-Surgery Care',
            'Stroke Survivors',
            'Who Raised You',     // emotional
            'Amma & Appa',        // cultural hook
            'Your Second Home',   // brand positioning
            'Peace of Mind',      // always last
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typePause = false;

        function typeStep() {
            const current = phrases[phraseIdx];
            if (!isDeleting) {
                typewriterEl.textContent = current.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    typePause = true;
                    setTimeout(() => { typePause = false; isDeleting = true; typeStep(); }, 1800);
                    return;
                }
                setTimeout(typeStep, 68);
            } else {
                typewriterEl.textContent = current.slice(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(typeStep, 400);
                    return;
                }
                setTimeout(typeStep, 36);
            }
        }
        setTimeout(typeStep, 1200);
    }

    // ─── Pricing Tabs ─────────────────────────────────────────────────
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricing12 = document.getElementById('pricing-12hr');
    const pricing24 = document.getElementById('pricing-24hr');

    pricingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            pricingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            if (pricing12 && pricing24) {
                if (target === '12hr') {
                    pricing12.style.display = 'grid';
                    pricing24.style.display = 'none';
                } else {
                    pricing12.style.display = 'none';
                    pricing24.style.display = 'grid';
                }
            }
        });
    });
});

// =============================================
// =============================================
// =============================================
// =============================================
// Premium Consultative Drawer Logic (4-STEP)
// =============================================
(function() {
    const SB_URL = 'https://blpypcuicxugpqwqskbq.supabase.co';
    const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscHlwY3VpY3h1Z3Bxd3Fza2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NDkyMjksImV4cCI6MjA5NjIyNTIyOX0.4OiKJE0aOHG3blLCI9Suv2Iy3RP0ETe3jopmhoCH7oc';
    let sb = null;
    function initSB() { if (typeof supabase !== 'undefined') sb = supabase.createClient(SB_URL, SB_KEY); else setTimeout(initSB, 1000); }
    initSB();

    const overlay = document.getElementById('enquiryDrawerOverlay');
    const drawer = document.getElementById('enquiryDrawer');
    const steps = document.querySelectorAll('.drawer-step');
    const segments = document.querySelectorAll('.progress-segment');
    const title = document.getElementById('drawerStepTitle');
    const backBtn = document.getElementById('drawerBackBtn');
    const nextBtn = document.getElementById('drawerNextBtn');
    const submitBtn = document.getElementById('submitDrawer');
    const closeBtn = document.getElementById('closeDrawer');

    let currentStep = 1;
    let leadId = null;
    let data = { condition: '', careType: '', urgency: '', name: '', phone: '' };

    const titles = {
        1: "Who are you caring for?",
        2: "What type of care is needed?",
        3: "Finalize Your Care Plan",
        4: "Consultation Confirmed"
    };

    function updateUI() {
        title.textContent = titles[currentStep];
        segments.forEach((s, i) => {
            s.classList.toggle('completed', i + 1 < currentStep);
            s.classList.toggle('active', i + 1 === currentStep);
        });
        steps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === currentStep));
        
        if (backBtn) backBtn.style.visibility = (currentStep > 1 && currentStep < 4) ? 'visible' : 'hidden';
        if (nextBtn) nextBtn.style.display = (currentStep >= 3) ? 'none' : 'block';
        
        validate();
    }

    function validate() {
        let ok = false;
        if (currentStep === 1) ok = !!data.condition;
        else if (currentStep === 2) ok = !!data.careType;
        else if (currentStep === 3) {
            const p = document.getElementById('drawerPhone').value.trim();
            const u = document.getElementById('drawerUrgency').value;
            ok = p.length >= 10 && !!u;
        }
        if (nextBtn) {
            nextBtn.disabled = !ok;
            nextBtn.style.opacity = ok ? '1' : '0.5';
        }
    }

    function goTo(s) {
        currentStep = s;
        updateUI();
        document.querySelector('.drawer-content').scrollTop = 0;
    }

    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            const step = parseInt(card.closest('.drawer-step').dataset.step);
            card.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (step === 1) data.condition = card.dataset.value;
            if (step === 2) data.careType = card.dataset.value;
            validate();
        });
    });

    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentStep < 3) goTo(currentStep + 1); });
    if (backBtn) backBtn.addEventListener('click', () => { if (currentStep > 1) goTo(currentStep - 1); });
    
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.getElementById('finishDrawer').addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Unified Submit
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const n = document.getElementById('drawerName').value.trim();
            const p = document.getElementById('drawerPhone').value.trim();
            const u = document.getElementById('drawerUrgency').value;
            
            if (p.length < 10 || !u) return;

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Securing lead...';

            try {
                if (sb) {
                    await sb.from('enquiries').insert([{
                        condition: data.condition,
                        care_type: data.careType,
                        urgency: u,
                        name: n,
                        phone: p
                    }]);
                }
                goTo(4);
            } catch (e) { console.error(e); goTo(4); }
            finally { submitBtn.disabled = false; submitBtn.innerHTML = 'Confirm & Schedule Call'; }
        });
    }

    // Dynamic Logic for existing page buttons
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('a[href*="tally.so/r/xXP829"]');
        if (!target) return;
        e.preventDefault();

        // Reset
        data = { condition: '', careType: '', urgency: '', name: '', phone: '' };
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        document.getElementById('drawerName').value = '';
        document.getElementById('drawerPhone').value = '';
        document.getElementById('drawerUrgency').value = '';

        const pricingCard = target.closest('.pricing-v2-card');
        if (pricingCard) {
            const planName = pricingCard.querySelector('.pricing-v2-name').textContent.trim();
            let type = "";
            if (planName.includes('Care Assistant')) type = 'Caretaker';
            else if (planName.includes('Nursing Assistant')) type = 'Nursing Assistant';
            else if (planName.includes('Nursing Service')) type = 'Nursing Staff';
            
            if (type) {
                data.careType = type;
                document.querySelectorAll('[data-step="2"] .option-card').forEach(c => {
                    c.classList.toggle('selected', c.dataset.value === type);
                });
            }
        }
        
        goTo(1);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Real-time validation for inputs
    ['drawerName', 'drawerPhone', 'drawerUrgency'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', validate);
        if (el && el.tagName === 'SELECT') el.addEventListener('change', validate);
    });

})();
