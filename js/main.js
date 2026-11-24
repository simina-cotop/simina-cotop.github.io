// Professional website animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in animation
    document.querySelectorAll('.card, .list-group-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Add subtle parallax effect to profile image on index.html
    const profileImg = document.querySelector('.profile-image');
    if (profileImg) {
        window.addEventListener('scroll', function() {
            if (window.innerWidth > 768) {
                const scrolled = window.pageYOffset;
                profileImg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Add subtle hover effects to book/movie cards
    document.querySelectorAll('.book-card, .movie-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Button click ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                background: rgba(255, 255, 255, 0.4);
                width: ${size}px;
                height: ${size}px;
                left: ${x - size/2}px;
                top: ${y - size/2}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            requestAnimationFrame(() => {
                ripple.animate([
                    { transform: 'scale(4)', opacity: 0 },
                    { transform: 'scale(8)', opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'ease-out'
                }).onfinish = () => ripple.remove();
            });
        });
    });

    // Smooth navigation click handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100 && lastScrollY < currentScrollY) {
                // Scrolling down - darken navbar
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - lighten navbar
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = 'none';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Print page functionality for sharing as PDF/resume
    window.printPortfolio = function() {
        window.print();
    };

    // Dynamic greeting based on time of day (for index.html)
    const introText = document.querySelector('h1');
    if (introText && introText.textContent.includes('Hello')) {
        const hour = new Date().getHours();
        if (hour < 12) {
            introText.innerHTML = introText.innerHTML.replace('Hello', 'Good morning');
        } else if (hour < 17) {
            introText.innerHTML = introText.innerHTML.replace('Hello', 'Good afternoon');
        } else {
            introText.innerHTML = introText.innerHTML.replace('Hello', 'Good evening');
        }
    }

    // Print-specific styles injection
    const originalStyles = document.querySelector('style[type="text/css"]') || null;
    
});
