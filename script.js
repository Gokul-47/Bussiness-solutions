   // Mobile Navigation Toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Header scroll effect and hide/show
        let lastScrollTop = 0;
        const header = document.getElementById('header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolling
            if (scrollTop > 50) {
                header.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
            }
            
            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Handle external links to redirect to 404 page
        document.querySelectorAll('a').forEach(link => {
            // Check if link is external or has specific class
            if (link.classList.contains('external-link') || 
                (link.href.includes('http') && !link.href.includes(window.location.hostname))) {
                
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Hide all sections and show 404 page
                    document.querySelectorAll('section, footer, header').forEach(el => {
                        el.style.display = 'none';
                    });
                    
                    document.getElementById('page404').style.display = 'flex';
                    
                    // Scroll to top
                    window.scrollTo(0, 0);
                });
            }
        });
        
        // Back to Home button for 404 page
        document.getElementById('backHome').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show all sections again and hide 404 page
            document.querySelectorAll('section, footer, header').forEach(el => {
                el.style.display = 'block';
            });
            
            document.getElementById('page404').style.display = 'none';
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
        
        // Form submission handler
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, you would send this data to a server
            // For this example, we'll just show an alert with animation
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                submitBtn.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.pointerEvents = '';
                    
                    // Reset form
                    this.reset();
                }, 2000);
            }, 1500);
        });
        
        // Animated counter for stats
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const suffix = stat.textContent.includes('%') ? '%' : '+';
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        stat.textContent = Math.floor(count) + suffix;
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target + suffix;
                    }
                };
                
                updateCount();
            });
        };
        
        // Testimonial slider
        const testimonialTrack = document.getElementById('testimonialTrack');
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentSlide = 0;
        
        const updateSlider = () => {
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        };
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        });
        
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        });
        
        // Auto slide testimonials
        let slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 5000);
        
        // Pause auto slide on hover
        const slider = document.querySelector('.testimonial-slider');
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            }, 5000);
        });
        
        // Scroll animations for elements with fade-in class
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const fadeInOnScroll = () => {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        };
        
        // Initialize animations on scroll for all animated elements
        const animatedElements = document.querySelectorAll('.service-card, .stat-card, .process-step, .team-member, .about-feature, .contact-detail, .form-group');
        
        const checkAnimation = () => {
            animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.animationPlayState = 'running';
                }
            });
            
            // Trigger counter animation when stats section is visible
            const statsSection = document.getElementById('stats');
            const statsTop = statsSection.getBoundingClientRect().top;
            
            if (statsTop < window.innerHeight - 100) {
                animateCounter();
                // Remove event listener after triggering once
                window.removeEventListener('scroll', checkAnimation);
            }
        };
        
        // Check on load and scroll
        window.addEventListener('load', () => {
            fadeInOnScroll();
            checkAnimation();
        });
        
        window.addEventListener('scroll', () => {
            fadeInOnScroll();
            checkAnimation();
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Initialize animations
        fadeInOnScroll();
        checkAnimation();