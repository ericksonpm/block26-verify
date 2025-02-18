// Form Visibility Control
document.getElementById('retirementStatus').addEventListener('change', function () {
    const conditionalSection = document.querySelector('.retirement-conditional');
    conditionalSection.style.display = this.value !== 'none' ? 'block' : 'none';
});

// Main Eligibility Check
function checkEligibility() {
    // Capture Input Values
    const formValues = {
        serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
        campaignService: document.getElementById('campaignService').value,
        dischargeType: document.getElementById('dischargeType').value,
        retirementStatus: document.getElementById('retirementStatus').value,
        retirementRank: document.getElementById('retirementRank').value,
        disabilityRating: parseInt(document.getElementById('disabilityRating').value),
        militaryRetirementPay: document.getElementById('militaryRetirementPay')?.value || 'no',
    };

    // Initialize Tracking Variables
    let isEligible = false;
    const reasons = [];
    const disqualifiers = [];
    const totalMonths = formValues.serviceYears * 12;

    // Base Eligibility Checks
    if (formValues.dischargeType !== 'honorable') {
        disqualifiers.push("Non-honorable discharge type");
    } else {

        // Service Duration Requirements
if (formValues.campaignService === 'none') {
    if (totalMonths < 24) { // 24 months = 2 years
        disqualifiers.push("24+ months active duty required (without campaign participation)");
    } else {
        reasons.push(`${formValues.serviceYears} years (${totalMonths} months) qualifying service`);
    }
} else {
    reasons.push(`Campaign participation: ${formValues.campaignService.replace(/-/g, ' ').toUpperCase()}`);
}


        // Retirement Status Analysis
        if (formValues.retirementStatus === 'regular') {
            if (formValues.retirementRank === 'o4-plus') {
                if (formValues.militaryRetirementPay === 'yes') {
                    disqualifiers.push("O-4+ retirees receiving military retirement pay are ineligible");
                } else {
                    disqualifiers.push(
                        "O-4+ retiree requires additional exceptions (e.g., continuous federal employment since 1964)"
                    );
                }
            }
        } else if (formValues.retirementStatus === 'medical' && formValues.disabilityRating >= 30) {
            reasons.push("Medical retiree with 30%+ disability rating");
        }

        // Disability Considerations
        if (formValues.disabilityRating >= 30) {
            reasons.push("30% or higher VA disability rating");
        } else if (formValues.disabilityRating >= 10) {
            reasons.push("10-20% VA disability rating with qualifying service");
        }
    }

    // Check Reservist Eligibility
if (formValues.retirementStatus === 'none' && formValues.campaignService === 'none') {
    disqualifiers.push("Reservists performing weekend drills or annual training are not eligible unless called to active duty under Title 10.");
} else if (formValues.retirementStatus === 'regular' && formValues.retirementRank === 'none') {
    disqualifiers.push("Retired reservists drawing pay at age 60 must meet additional criteria.");
}

    
    // Final Determination
    isEligible = disqualifiers.length === 0 && reasons.length > 0;

    // Build Result Display
    const resultDiv = document.getElementById('result');
    resultDiv.className = isEligible ? 'result-eligible' : 'result-ineligible';
    resultDiv.innerHTML = `
        <h3>${isEligible ? '✅ Eligible for Block 26 Preference' : '❌ Not Eligible for Block 26 Preference'}</h3>
        
        ${reasons.length ? `
        <div class="result-section">
            <h4>Qualifying Factors:</h4>
            <ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>` : ''}
        
        ${disqualifiers.length ? `
        <div class="result-section">
            <h4>Disqualifying Factors:</h4>
            <ul>${disqualifiers.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>` : ''}
        
        <div class="legal-refs">
            <h4>Legal References:</h4>
            <ul>
                <li><a href="https://www.law.cornell.edu/uscode/text/5/2108" target="_blank">5 U.S.C. 2108</a></li>
                ${formValues.retirementRank === 'o4-plus' ? 
                '<li><a href="https://www.law.cornell.edu/uscode/text/5/2108#a_3_D" target="_blank">5 U.S.C. 2108(3)(D)</a></li>' : ''}
                <li><a href="https://www.ecfr.gov/current/title-5/chapter-I/subchapter-B/part-752/subpart-C/section-752.402#p-752.402(c)(3)" target="_blank">5 CFR 752.402(c)(3)</a></li>
            </ul>
        </div>
    `;
    resultDiv.style.display = 'block';
}
