// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    if (!navbar) return;
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinksContainer = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Skill bars animation on scroll
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;

        if (barPosition < screenPosition) {
            bar.style.width = bar.style.width;
        }
    });
};

window.addEventListener('scroll', animateSkillBars);

// Contact form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const subjectEl = document.getElementById('subject');
        const messageEl = document.getElementById('message');

        if (!nameEl || !emailEl || !subjectEl || !messageEl) return;

        const formData = {
            name: nameEl.value,
            email: emailEl.value,
            subject: subjectEl.value,
            message: messageEl.value
        };

        console.log('Form submitted:', formData);
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.experience-card, .project-card, .skill-category, .publication-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero orbs
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Theme Toggle Logic
const initTheme = () => {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (!themeToggle) return;

    // Get current theme state
    const getTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Apply theme function
    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Initial application
    applyTheme(getTheme());

    // Toggle event
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
};

// Handle readiness
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// ===== Project Gallery Carousel =====
class Carousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.track = this.container.querySelector('.carousel-track');
        this.images = this.track.querySelectorAll('.carousel-image');
        this.prevBtn = this.container.querySelector('.prev-btn');
        this.nextBtn = this.container.querySelector('.next-btn');
        this.dotsContainer = this.container.querySelector('.carousel-dots');

        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        if (!this.track || this.images.length === 0) return;

        // Create dots
        this.createDots();

        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Add click event for full image view
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => {
                openImageModal(img.src, img.alt);
            });
        });

        // Start autoplay
        this.startAutoPlay();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateDots() {
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
        if (!dots) return;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        this.currentIndex = index;
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.goToSlide(this.currentIndex);
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToSlide(this.currentIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), 3000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize project gallery carousel
const projectCarousel = new Carousel('.gallery-carousel');

// ===== Certificates Carousel =====
class CertificatesCarousel {
    constructor() {
        this.carousel = document.querySelector('.certificates-carousel');
        if (!this.carousel) return;

        this.track = this.carousel.querySelector('.certificates-track');
        this.cards = this.track?.querySelectorAll('.certificate-card');
        this.prevBtn = this.carousel.querySelector('.cert-prev-btn');
        this.nextBtn = this.carousel.querySelector('.cert-next-btn');
        this.dotsContainer = document.getElementById('cert-dots');

        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        this.autoPlayInterval = null;

        this.init();
    }

    getCardsToShow() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 992) return 2;
        return 3;
    }

    init() {
        if (!this.track || !this.cards || this.cards.length === 0) return;

        this.createDots();

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Add click handlers for view buttons
        this.cards.forEach((card) => {
            const viewBtn = card.querySelector('.view-btn');
            const img = card.querySelector('.certificate-image');
            const title = card.querySelector('.certificate-title');

            if (viewBtn && img) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openImageModal(img.src, title?.textContent || img.alt);
                });
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const newCardsToShow = this.getCardsToShow();
            if (newCardsToShow !== this.cardsToShow) {
                this.cardsToShow = newCardsToShow;
                this.currentIndex = 0;
                this.goToSlide(0);
                this.updateDots();
            }
        });

        // Start autoplay
        this.startAutoPlay();

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    createDots() {
        if (!this.dotsContainer || !this.cards) return;

        const totalSlides = Math.ceil(this.cards.length / this.cardsToShow);

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
        if (!dots) return;

        const totalSlides = Math.ceil(this.cards.length / this.cardsToShow);
        const currentSlide = Math.floor(this.currentIndex / this.cardsToShow);

        dots.forEach((dot, index) => {
            if (index < totalSlides) {
                dot.style.display = 'block';
                dot.classList.toggle('active', index === currentSlide);
            } else {
                dot.style.display = 'none';
            }
        });
    }

    goToSlide(slideIndex) {
        this.currentIndex = slideIndex * this.cardsToShow;
        const cardWidth = this.cards[0].offsetWidth + 24; // card width + gap
        const offset = -this.currentIndex * cardWidth;
        this.track.style.transform = `translateX(${offset}px)`;
        this.updateDots();
    }

    next() {
        const totalSlides = Math.ceil(this.cards.length / this.cardsToShow);
        const currentSlide = Math.floor(this.currentIndex / this.cardsToShow);
        const nextSlide = (currentSlide + 1) % totalSlides;
        this.goToSlide(nextSlide);
    }

    prev() {
        const totalSlides = Math.ceil(this.cards.length / this.cardsToShow);
        const currentSlide = Math.floor(this.currentIndex / this.cardsToShow);
        const prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        this.goToSlide(prevSlide);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize certificates carousel
const certificatesCarousel = new CertificatesCarousel();

// ===== Image Modal =====
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeBtn = document.querySelector('.modal-close');

function openImageModal(src, alt) {
    if (modal && modalImg && modalCaption) {
        modal.classList.add('active');
        modalImg.src = src;
        modalCaption.textContent = alt || '';
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on click
if (closeBtn) {
    closeBtn.addEventListener('click', closeImageModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

// ===== CV Dropdown Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.cv-dropdown');

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-toggle');

        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Close other open dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) other.classList.remove('active');
                });

                dropdown.classList.toggle('active');
            });
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});
