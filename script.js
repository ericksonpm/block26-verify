// script.js
function checkEligibility() {
    // Capture all form values
    const serviceYears = parseFloat(document.getElementById('serviceYears').value) || 0;
    const campaignService = document.getElementById('campaignService').value;
    const dischargeType = document.getElementById('dischargeType').value;
    const retirementStatus = document.getElementById('retirementStatus').value;
    const retirementRank = document.getElementById('retirementRank').value;
    const disabilityRating = parseInt(document.getElementById('disabilityRating').value);
    
    // Convert years to months for calculations
    const totalMonths = serviceYears * 12;
    
    let serviceRequirementMet = false;
    let isEligible = false;
    const reasons = [];
    const disqualifiers = [];

    // Base eligibility check
    if (dischargeType === 'honorable') {
        // Campaign service exception
        if (campaignService !== 'none') {
            serviceRequirementMet = true;
            reasons.push(`Campaign participation: ${campaignService.replace('-', ' ').toUpperCase()}`);
        }
        // Duration requirement
        else if (totalMonths >= 6) { // 0.5 years = 6 months
            serviceRequirementMet = true;
            reasons.push(`${serviceYears} years (${totalMonths} months) of service`);
        }

        // Medical retirement exception
        if (retirementStatus === 'medical' && disabilityRating >= 30) {
            serviceRequirementMet = true;
            reasons.push("Medical retiree with 30%+ disability rating");
        }

        // Officer retirement restriction
        if (retirementRank === 'o4-plus' && disabilityRating < 30) {
            serviceRequirementMet = false;
            disqualifiers.push("O-4+ retired officer without 30% disability");
        }
    } else {
        disqualifiers.push("Non-honorable discharge");
    }

    // Final eligibility determination
    isEligible = serviceRequirementMet && disqualifiers.length === 0;

    // Build citations
    const buildCitation = (text, url) => 
        `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;

    // Result templates
    const resultContent = {
        header: isEligible ? 
            `<h3>Eligible for Block 26 Preference ✅</h3>` : 
            `<h3>Not Eligible ❌</h3>`,
        
        reasons: reasons.length > 0 ? `
            <p><strong>Qualifying Factors:</strong></p>
            <ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul>
        ` : '',
        
        disqualifiers: disqualifiers.length > 0 ? `
            <p><strong>Disqualifying Factors:</strong></p>
            <ul>${disqualifiers.map(d => `<li>${d}</li>`).join('')}</ul>
        ` : '',
        
        references: `
            <p><strong>Legal References:</strong></p>
            <ul>
                <li>${buildCitation('5 U.S.C. 2108', 'https://www.law.cornell.edu/uscode/text/5/2108')}</li>
                <li>${buildCitation('OPM Vet Guide', 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide/')}</li>
                ${disabilityRating >= 30 ? `<li>${buildCitation('38 U.S.C. 5303A', 'https://www.law.cornell.edu/uscode/text/38/5303A')}</li>` : ''}
            </ul>
        `
    };

    // Build final output
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        ${resultContent.header}
        ${resultContent.reasons}
        ${resultContent.disqualifiers}
        ${resultContent.references}
    `;
    
    // Visual feedback
    resultDiv.className = isEligible ? 'eligible' : 'ineligible';
    resultDiv.style.display = 'block';
}
