/**
 * Armor Consulting & Training - Interactive Application Logic
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
    // ── NAVBAR SCROLL EFFECT ──
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ── STORM DATA & CATASTROPHE IMPACT TRACKER ──
    // ── STORM CAROUSEL ELEMENTS ──
    const carouselTrack = document.querySelector('.storm-carousel-track');
    const slides = document.querySelectorAll('.storm-carousel-slide');
    const prevBtn = document.querySelector('.carousel-arrow-prev');
    const nextBtn = document.querySelector('.carousel-arrow-next');
    const dots = document.querySelectorAll('.carousel-dot');
    
    const resultsPanelTitle = document.getElementById('results-panel-title');
    const statDamage = document.getElementById('stat-damage');
    const statClaims = document.getElementById('stat-claims');
    const statState = document.getElementById('stat-state');
    const statDriver = document.getElementById('stat-driver');

    // Catastrophe database
    const stormDb = {
        milton: {
            name: "Hurricane Milton (2024)",
            damage: "$30 Billion+",
            claims: "~250,000 Claims",
            state: "Florida (West/Central)",
            driver: "Surge, Wind & Tornadoes"
        },
        helene: {
            name: "Hurricane Helene (2024)",
            damage: "$15 Billion+",
            claims: "~150,000 Claims",
            state: "Florida (Big Bend) & SE",
            driver: "Storm Surge & Inland Flood"
        },
        idalia: {
            name: "Hurricane Idalia (2023)",
            damage: "$3.5 Billion+",
            claims: "~85,000 Claims",
            state: "Florida (Big Bend)",
            driver: "Storm Surge & Wind"
        },
        ian: {
            name: "Hurricane Ian (2022)",
            damage: "$54 Billion+",
            claims: "~700,000 Claims",
            state: "Florida (SB 2-D / 4-A)",
            driver: "Wind & Storm Surge"
        },
        nicole: {
            name: "Hurricane Nicole (2022)",
            damage: "$1 Billion+",
            claims: "~50,000 Claims",
            state: "Florida (East Coast)",
            driver: "Coastal Erosion & Surge"
        },
        ida: {
            name: "Hurricane Ida (2021)",
            damage: "$36 Billion+",
            claims: "~480,000 Claims",
            state: "Louisiana / NY / NJ",
            driver: "Wind, Rain & Flood"
        },
        michael: {
            name: "Hurricane Michael (2018)",
            damage: "$25 Billion+",
            claims: "~150,000 Claims",
            state: "Florida (Panhandle)",
            driver: "Catastrophic Wind & Surge"
        },
        harvey: {
            name: "Hurricane Harvey (2017)",
            damage: "$30 Billion+",
            claims: "~765,000 Claims",
            state: "Texas",
            driver: "Inland Torrential Flood"
        },
        irma: {
            name: "Hurricane Irma (2017)",
            damage: "$30 Billion+",
            claims: "~1.13 Million Claims",
            state: "Florida",
            driver: "Statewide Wind & Surge"
        },
        matthew: {
            name: "Hurricane Matthew (2016)",
            damage: "$10 Billion+",
            claims: "~110,000 Claims",
            state: "Florida East Coast (Brush)",
            driver: "Wind & Storm Surge"
        },
        hermine: {
            name: "Hurricane Hermine (2016)",
            damage: "$500 Million+",
            claims: "~20,000 Claims",
            state: "Florida (Big Bend)",
            driver: "Wind & Inland Flood"
        },
        sandy: {
            name: "Superstorm Sandy (2012)",
            damage: "$30 Billion+",
            claims: "~1.58 Million Claims",
            state: "New York / New Jersey",
            driver: "Storm Surge & Inundation"
        }
    };

    function selectStorm(stormId) {
        const data = stormDb[stormId];
        if (!data) return;

        resultsPanelTitle.textContent = `${data.name} Metrics`;
        statDamage.textContent = data.damage;
        statClaims.textContent = data.claims;
        statState.textContent = data.state;
        statDriver.textContent = data.driver;
    }

    // ── STORM CAROUSEL INTERACTION & AUTO-ROTATION ──
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoRotateTimer = null;
    const autoRotateDelay = 5500; // Rotate every 5.5 seconds for motion

    function updateCarousel(index) {
        if (index < 0) {
            index = slideCount - 1;
        } else if (index >= slideCount) {
            index = 0;
        }
        
        currentIndex = index;
        
        // Slide track by transforming percentage
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        // Update active class on slides
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update active class on indicator dots
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update selection in catastrophe tracker
        const activeSlide = slides[currentIndex];
        if (activeSlide) {
            const stormId = activeSlide.getAttribute('data-storm');
            selectStorm(stormId);
        }
    }
    
    function startAutoRotate() {
        if (autoRotateTimer) clearInterval(autoRotateTimer);
        autoRotateTimer = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, autoRotateDelay);
    }
    
    function stopAutoRotate() {
        if (autoRotateTimer) {
            clearInterval(autoRotateTimer);
            autoRotateTimer = null;
        }
    }
    
    // Bind click events for navigation
    if (prevBtn && nextBtn && carouselTrack) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stopAutoRotate();
            updateCarousel(currentIndex - 1);
            startAutoRotate(); // Resume after manual navigation
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stopAutoRotate();
            updateCarousel(currentIndex + 1);
            startAutoRotate(); // Resume after manual navigation
        });
        
        // Bind dot clicks
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoRotate();
                updateCarousel(idx);
                startAutoRotate(); // Resume after manual navigation
            });
        });
        
        // Touch gesture swiping support for mobile phones
        let startX = 0;
        let isSwiping = false;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            stopAutoRotate();
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            const diffX = startX - e.changedTouches[0].clientX;
            if (Math.abs(diffX) > 40) { // Touch drag swipe threshold
                if (diffX > 0) {
                    updateCarousel(currentIndex + 1);
                } else {
                    updateCarousel(currentIndex - 1);
                }
            }
            startAutoRotate();
        }, { passive: true });
        
        // Start automatic rotation
        startAutoRotate();
    }

    // Default load: Hurricane Milton
    selectStorm('milton');

    // ── SERVICES TAB SELECTION ──
    const serviceBtns = document.querySelectorAll('.service-tab-btn');
    const serviceSlides = document.querySelectorAll('.service-content-slide');

    if (serviceBtns.length > 0 && serviceSlides.length > 0) {
        serviceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetService = btn.getAttribute('data-service');

                // Toggle active class on buttons
                serviceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle active class on content slides
                serviceSlides.forEach(slide => {
                    if (slide.getAttribute('id') === `service-${targetService}`) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });
            });
        });
    }

    // ── CAPABILITIES TAB SELECTION ──
    const capabilityBtns = document.querySelectorAll('.capability-tab-btn');
    const capabilitySlides = document.querySelectorAll('.capability-content-slide');

    if (capabilityBtns.length > 0 && capabilitySlides.length > 0) {
        capabilityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetCap = btn.getAttribute('data-capability');

                // Toggle active class on buttons
                capabilityBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle active class on content slides
                capabilitySlides.forEach(slide => {
                    if (slide.getAttribute('id') === `cap-${targetCap}`) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });
            });
        });
    }

    // ── CONTACT FORM INTERACTION ──
    const contactForm = document.getElementById('consultation-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            const spinner = submitBtn.querySelector('.spinner');
            const btnText = submitBtn.querySelector('.btn-text');
            
            if (spinner && btnText) {
                spinner.style.display = 'inline-block';
                btnText.textContent = 'Transmitting Securely...';
            }
            
            submitBtn.disabled = true;
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            console.log('Secure transmission initiated:', { name, email, message });

            setTimeout(() => {
                if (spinner && btnText) {
                    spinner.style.display = 'none';
                    btnText.textContent = 'Submit Request';
                }
                submitBtn.disabled = false;
                
                contactForm.reset();
                if (successMsg) {
                    successMsg.style.display = 'block';
                    successMsg.textContent = `Thank you, ${name}. Your consultation request has been securely queued. A Catastrophe Operations Manager will contact you shortly.`;
                    
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 8000);
                }
            }, 1500);
        });
    }
});
