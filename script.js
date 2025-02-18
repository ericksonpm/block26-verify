// script.js
function checkEligibility() {
    // Existing variables
    const serviceMonths = parseInt(document.getElementById('serviceMonths').value);
    const campaignService = document.getElementById('campaignService').value;
    
    // New eligibility logic
    let serviceRequirementMet = false;
    
    // Check service duration requirements [OPM Guide Ch7]
    if(campaignService !== 'none') {
        serviceRequirementMet = true;
    } else if(serviceMonths >= 6) { // 180 days = 6 months
        serviceRequirementMet = true;
    }

    // Medical retirement exception [5 CFR 752.402(c)(3)]
    if(retirementStatus === 'medical' && disabilityRating >= 30) {
        serviceRequirementMet = true;
    }

    // Officer retirement restriction [5 U.S.C. 2108(3)(D)]
    if(retirementRank === 'o4-plus' && disabilityRating < 30) {
        serviceRequirementMet = false;
    }

    // Build result message with citations
    const buildCitation = (text, url) => 
        `<a href="${url}" target="_blank">${text}</a>`;

    const resultMessages = {
        eligible: `
            <h3>Eligible for Block 26 Preference ✅</h3>
            <p>Based on:</p>
            <ul>
                <li>${buildCitation('5 U.S.C. 2108', 'https://www.law.cornell.edu/uscode/text/5/2108')}</li>
                <li>${buildCitation('OPM RIF Guidance', 'https://www.opm.gov/policy-data-oversight/workforce-restructuring/reductions-in-force/')}</li>
            </ul>
        `,
        ineligible: `
            <h3>Not Eligible ❌</h3>
            <p>Reference:</p>
            <ul>
                <li>${buildCitation('5 CFR 752.402(c)(3)', 'https://www.ecfr.gov/current/title-5/chapter-I/subchapter-B/part-752/subpart-C/section-752.402')}</li>
            </ul>
        `
    };

    // Update result display
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = serviceRequirementMet ? resultMessages.eligible : resultMessages.ineligible;
    resultDiv.className = serviceRequirementMet ? 'eligible' : 'ineligible';
}
