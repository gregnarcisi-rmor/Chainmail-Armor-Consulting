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

    // ── STORM DATA & SLA ESTIMATOR ──
    // ── STORM CAROUSEL ELEMENTS ──
    const carouselTrack = document.querySelector('.storm-carousel-track');
    const slides = document.querySelectorAll('.storm-carousel-slide');
    const prevBtn = document.querySelector('.carousel-arrow-prev');
    const nextBtn = document.querySelector('.carousel-arrow-next');
    const dots = document.querySelectorAll('.carousel-dot');
    const customSimFields = document.getElementById('custom-sim-fields');
    const stateSelect = document.getElementById('state-select');
    const claimDateInput = document.getElementById('claim-date');
    
    const resultsPanelTitle = document.getElementById('results-panel-title');
    const resultsStatusBadge = document.getElementById('results-status-badge');
    const statDamage = document.getElementById('stat-damage');
    const statClaims = document.getElementById('stat-claims');
    const statState = document.getElementById('stat-state');
    const statDriver = document.getElementById('stat-driver');
    const resultsGrid = document.querySelector('.results-grid');

    // Catastrophe database
    const stormDb = {
        ian: {
            name: "Hurricane Ian (2022)",
            damage: "$54 Billion+",
            claims: "~700,000 Claims",
            state: "Florida (SB 2-D / 4-A)",
            driver: "Wind & Storm Surge",
            stress: "Extreme",
            stressColor: "#ef4444",
            defaultDate: "2022-09-28",
            calcState: "FL"
        },
        ida: {
            name: "Hurricane Ida (2021)",
            damage: "$36 Billion+",
            claims: "~480,000 Claims",
            state: "Louisiana / NY / NJ",
            driver: "Wind, Rain & Flood",
            stress: "Critical",
            stressColor: "#f97316",
            defaultDate: "2021-08-29",
            calcState: "NY" // NY Reg 64 was highly tested in Northeast flooding
        },
        harvey: {
            name: "Hurricane Harvey (2017)",
            damage: "$30 Billion+",
            claims: "~765,000 Claims",
            state: "Texas",
            driver: "Inland Torrential Flood",
            stress: "Critical",
            stressColor: "#f97316",
            defaultDate: "2017-08-25",
            calcState: "FL" // Standard calendar day SLAs (using FL SB 2-D proxy for simulation)
        },
        irma: {
            name: "Hurricane Irma (2017)",
            damage: "$30 Billion+",
            claims: "~1.13 Million Claims",
            state: "Florida",
            driver: "Statewide Wind & Surge",
            stress: "Extreme",
            stressColor: "#ef4444",
            defaultDate: "2017-09-10",
            calcState: "FL"
        },
        sandy: {
            name: "Superstorm Sandy (2012)",
            damage: "$30 Billion+",
            claims: "~1.58 Million Claims",
            state: "New York / New Jersey",
            driver: "Storm Surge & Inundation",
            stress: "Extreme",
            stressColor: "#ef4444",
            defaultDate: "2012-10-29",
            calcState: "NY" // Strict NY Regulation 64 compliance applied
        }
    };

    // Set default claim date to today for custom
    if (claimDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        claimDateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    function calculateBusinessDays(startDate, daysToCount) {
        let currentDate = new Date(startDate);
        let countedDays = 0;
        while (countedDays < daysToCount) {
            currentDate.setDate(currentDate.getDate() + 1);
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                countedDays++;
            }
        }
        return currentDate;
    }

    function formatDate(date) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function renderSLA(state, baseDateString) {
        const claimDate = new Date(baseDateString + 'T00:00:00');
        let content = '';

        if (state === 'FL') {
            const ackDate = new Date(claimDate);
            ackDate.setDate(ackDate.getDate() + 7); // Florida SB 2-D 7-day rule

            const invDate = new Date(claimDate);
            invDate.setDate(invDate.getDate() + 7); // 7-day investigation rule

            const inspectDate = new Date(claimDate);
            inspectDate.setDate(inspectDate.getDate() + 30); // 30-day inspection target

            const payDenyDate = new Date(claimDate);
            payDenyDate.setDate(payDenyDate.getDate() + 60); // 60-day final pay/deny

            content = `
                <div class="result-item">
                    <span class="result-label">Acknowledgment & Instructions (7 Days)</span>
                    <span class="result-val highlight-blue">${formatDate(ackDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Commence Physical Investigation (7 Days)</span>
                    <span class="result-val highlight-cyan">${formatDate(invDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Property Field Inspection Target (30 Days)</span>
                    <span class="result-val highlight-gold">${formatDate(inspectDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Florida Statutory Claim Resolution (60 Days)</span>
                    <span class="result-val highlight-gold">${formatDate(payDenyDate)}</span>
                </div>
            `;
        } else if (state === 'NY') {
            const ackDate = calculateBusinessDays(claimDate, 15); // NY 15 working days
            const invDate = calculateBusinessDays(claimDate, 15); // NY 15 working days
            const formsDate = calculateBusinessDays(claimDate, 15); // NY 15 working days
            const decisionDate = calculateBusinessDays(claimDate, 30); // NY 15-day resolution from proof (30-day simulation)

            content = `
                <div class="result-item">
                    <span class="result-label">Claim Acknowledgment (15 Working Days)</span>
                    <span class="result-val highlight-blue">${formatDate(ackDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Initiate Forensic Investigation (15 Working Days)</span>
                    <span class="result-val highlight-cyan">${formatDate(invDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Transmit Claim Forms (15 Working Days)</span>
                    <span class="result-val">${formatDate(formsDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">New York Claims Decision SLA (Working Days)</span>
                    <span class="result-val highlight-gold">${formatDate(decisionDate)}</span>
                </div>
            `;
        }

        resultsGrid.innerHTML = content;
    }

    function selectStorm(stormId) {
        if (stormId === 'custom') {
            // Show custom input forms
            customSimFields.style.display = 'block';
            resultsPanelTitle.textContent = "Custom Simulation Metrics";
            resultsStatusBadge.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span> SLA Stress: Custom Active`;
            statDamage.textContent = "Simulated";
            statClaims.textContent = "Variable";
            statState.textContent = stateSelect.value === 'FL' ? "Florida" : "New York";
            statDriver.textContent = "Operational Simulation";
            
            // Render using custom inputs
            renderSLA(stateSelect.value, claimDateInput.value);
        } else {
            // Hide custom inputs
            customSimFields.style.display = 'none';
            const data = stormDb[stormId];
            if (!data) return;

            resultsPanelTitle.textContent = `${data.name} Metrics`;
            resultsStatusBadge.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${data.stressColor}; display: inline-block;"></span> SLA Stress: ${data.stress}`;
            statDamage.textContent = data.damage;
            statClaims.textContent = data.claims;
            statState.textContent = data.state;
            statDriver.textContent = data.driver;

            // Render SLA dates using storm's landmark date
            renderSLA(data.calcState, data.defaultDate);
        }
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
        
        // Update selection in storm calculator
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

    // Bind custom inputs to recalculate on change
    if (stateSelect) {
        stateSelect.addEventListener('change', () => {
            if (customSimFields.style.display === 'block') {
                statState.textContent = stateSelect.value === 'FL' ? "Florida (SB 2-D)" : "New York (Reg 64)";
                renderSLA(stateSelect.value, claimDateInput.value);
            }
        });
    }

    if (claimDateInput) {
        claimDateInput.addEventListener('change', () => {
            if (customSimFields.style.display === 'block') {
                renderSLA(stateSelect.value, claimDateInput.value);
            }
        });
    }

    // Default load: Hurricane Ian
    selectStorm('ian');

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
