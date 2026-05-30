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

    // ── SLA TIMELINE CALCULATOR ──
    const stateSelect = document.getElementById('state-select');
    const claimDateInput = document.getElementById('claim-date');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Set default date to today
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
            // 0 = Sunday, 6 = Saturday
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                countedDays++;
            }
        }
        return currentDate;
    }

    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function updateSLA() {
        if (!claimDateInput || !claimDateInput.value) return;
        
        const selectedState = stateSelect.value;
        const claimDate = new Date(claimDateInput.value + 'T00:00:00'); // local time boundary
        
        const resultsGrid = document.querySelector('.results-grid');
        if (!resultsGrid) return;

        let content = '';

        if (selectedState === 'FL') {
            // Florida SB 2-D / SB 4-A rules (Current statutory SLA)
            const ackDate = new Date(claimDate);
            ackDate.setDate(ackDate.getDate() + 7); // 7 calendar days

            const invDate = new Date(claimDate);
            invDate.setDate(invDate.getDate() + 7); // 7 calendar days

            const inspectDate = new Date(claimDate);
            inspectDate.setDate(inspectDate.getDate() + 30); // 30 calendar days for inspection

            const reportShareDate = new Date(claimDate);
            reportShareDate.setDate(reportShareDate.getDate() + 37); // Estimate completed/shared 7 days after inspect

            const payDenyDate = new Date(claimDate);
            payDenyDate.setDate(payDenyDate.getDate() + 60); // 60 calendar days

            content = `
                <div class="result-item">
                    <span class="result-label">Claim Acknowledgment (7 Days)</span>
                    <span class="result-val highlight-blue">${formatDate(ackDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Investigation Commencement (7 Days)</span>
                    <span class="result-val highlight-cyan">${formatDate(invDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Physical Inspection Target (30 Days)</span>
                    <span class="result-val highlight-gold">${formatDate(inspectDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Provide Copy of Adjuster's Estimate</span>
                    <span class="result-val">${formatDate(reportShareDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Final Payment or Denial (60 Days)</span>
                    <span class="result-val highlight-gold">${formatDate(payDenyDate)}</span>
                </div>
            `;
        } else if (selectedState === 'NY') {
            // New York Regulation 64 / Part 216 rules (Working days)
            const ackDate = calculateBusinessDays(claimDate, 15); // 15 working days
            const invDate = calculateBusinessDays(claimDate, 15); // 15 working days
            const formsDate = calculateBusinessDays(claimDate, 15); // 15 working days
            const decisionDate = calculateBusinessDays(claimDate, 30); // Decision within 15 working days of proof of loss (assuming proof submitted by 15th day)

            content = `
                <div class="result-item">
                    <span class="result-label">Claim Acknowledgment (15 Working Days)</span>
                    <span class="result-val highlight-blue">${formatDate(ackDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Begin Investigation (15 Working Days)</span>
                    <span class="result-val highlight-cyan">${formatDate(invDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Provide Claim Forms/Instructions</span>
                    <span class="result-val">${formatDate(formsDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Final Decision Deadline (Approx.)</span>
                    <span class="result-val highlight-gold">${formatDate(decisionDate)}</span>
                </div>
            `;
        }

        resultsGrid.innerHTML = content;
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateSLA();
        });
    }

    // Initial calculation on load
    updateSLA();

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
            
            // Collect form details
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Log securely or mock transmit
            console.log('Secure transmission initiated:', { name, email, message });

            // Simulate server network latency (1.5 seconds)
            setTimeout(() => {
                // Reset loading state
                if (spinner && btnText) {
                    spinner.style.display = 'none';
                    btnText.textContent = 'Submit Request';
                }
                submitBtn.disabled = false;
                
                // Show success screen
                contactForm.reset();
                if (successMsg) {
                    successMsg.style.display = 'block';
                    successMsg.textContent = `Thank you, ${name}. Your consultation request has been securely queued. A Catastrophe Operations Manager will contact you shortly.`;
                    
                    // Auto-hide success message after 8 seconds
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 8000);
                }
            }, 1500);
        });
    }
});
