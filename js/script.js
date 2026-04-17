document.addEventListener('DOMContentLoaded', () => {

    // 1. Advanced Scroll Animations with Stagger
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a container with staggered children, animate them one by one
                if (entry.target.classList.contains('stagger-container')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100); // 100ms delay between each item
                    });
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all individual fade elements AND containers used for staggering
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .stagger-container');
    animatedElements.forEach(el => animateObserver.observe(el));

    // 2. 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.card, .pricing-card, .testimonial-card, .feature-item, .contact-box');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Disable on mobile

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max -5deg to 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            // Apply transformation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Add dynamic sheen/glare
            // Check if glare exists, if not create it
            let glare = card.querySelector('.glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.classList.add('glare');
                card.appendChild(glare);
            }

            // Move glare
            glare.style.left = `${x}px`;
            glare.style.top = `${y}px`;
            glare.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            // Reset state
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            const glare = card.querySelector('.glare');
            if (glare) glare.style.opacity = '0';
        });
    });

    // 3. Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.classList.add('ripple');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // 4. Mobile Menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // 5. Smooth Scroll — only for same-page anchors (href="#...")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        // Only intercept pure hash links (e.g. #services), not cross-page ones (e.g. index.html#services)
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
                // Close mobile menu if open
                if (navLinks) navLinks.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            });
        }
    });

    // 6. Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // 7. Animated Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        // Ensure starting from zero
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

    // 8. Interactive FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question') || item.querySelector('h4');
        if (question) {
            question.style.cursor = 'pointer';
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });

    // 9. Sticky Navbar CTA - changes to "Call Now" after scrolling past hero
    const navbarCta = document.getElementById('navbar-cta');
    if (navbarCta) {
        window.addEventListener('scroll', () => {
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 500;
            if (window.scrollY > heroHeight * 0.6) {
                navbarCta.href = 'tel:+918310962174';
                navbarCta.textContent = '📞 Call Now';
                navbarCta.classList.add('scrolled');
            } else {
                navbarCta.href = '#contact';
                navbarCta.textContent = 'Contact Us';
                navbarCta.classList.remove('scrolled');
            }
        });
    }

    // 10. App Launch Notify Form
    const notifyBtn = document.getElementById('notify-btn');
    const notifyResponse = document.getElementById('notify-response');
    const notifyInput = document.querySelector('.notify-input');
    const notifyInputGroup = document.querySelector('.notify-input-group');

    if (notifyBtn && notifyResponse) {
        notifyBtn.addEventListener('click', () => {
            const val = notifyInput?.value.trim();
            if (val) {
                // Show processing indicator
                const originalText = notifyBtn.innerHTML;
                notifyBtn.disabled = true;
                notifyBtn.classList.add('loading');
                notifyBtn.innerHTML = '<div class="spinner"></div> Processing...';
                notifyResponse.classList.remove('visible');

                // Simulate processing delay
                setTimeout(() => {
                    notifyBtn.disabled = false;
                    notifyBtn.classList.remove('loading');
                    notifyBtn.innerHTML = originalText;
                    
                    // Fade out the input group
                    if (notifyInputGroup) {
                        notifyInputGroup.classList.add('success-hide');
                        // Optional: completely remove from layout after animation
                        setTimeout(() => {
                            notifyInputGroup.style.display = 'none';
                        }, 500);
                    }

                    notifyResponse.textContent = "Thanks! We'll keep you updated.";
                    notifyResponse.classList.add('visible');
                    if (notifyInput) notifyInput.value = '';
                }, 1000);
            } else {
                notifyResponse.textContent = "Please enter your email or number.";
                notifyResponse.classList.add('visible');
                notifyResponse.style.color = "#ef4444"; // Error color
                
                setTimeout(() => {
                    notifyResponse.classList.remove('visible');
                    setTimeout(() => {
                        notifyResponse.style.color = "#0d9488"; // Reset color
                    }, 300);
                }, 3000);
            }
        });
    }

});
