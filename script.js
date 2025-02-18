// script.js
function checkEligibility() {
    const serviceBranch = document.getElementById('serviceBranch').value;
    const dischargeType = document.getElementById('dischargeType').value;
    const retirementStatus = document.getElementById('retirementStatus').value;
    const retirementRank = document.getElementById('retirementRank').value;
    const disabilityRating = parseInt(document.getElementById('disabilityRating').value);
    const servicePeriod = document.getElementById('servicePeriod').value;
    
    let isEligible = false;
    let reasons = [];
    let disqualifiers = [];

    // Base eligibility checks
    if (serviceBranch !== 'none' && dischargeType === 'honorable') {
        // Retirement status analysis
        if (retirementStatus !== 'none') {
            if (retirementStatus === 'medical' && disabilityRating >= 30) {
                isEligible = true;
                reasons.push("Medical retiree with 30%+ disability rating");
            } else if (retirementRank === 'o4-plus' && disabilityRating < 30) {
                disqualifiers.push("Retired officer (O-4+) without sufficient disability rating");
            } else if (retirementStatus === 'regular' && disabilityRating >= 30) {
                isEligible = true;
                reasons.push("Regular retiree with 30%+ disability rating");
            }
        } else {
            // Non-retired veteran checks
            if (disabilityRating >= 10) {
                isEligible = true;
                reasons.push(disabilityRating >= 30 ? 
                    "30%+ service-connected disability" : 
                    "10-20% disability with qualifying service");
            }
            
            if (servicePeriod !== 'none') {
                isEligible = true;
                reasons.push("Qualifying service period: " + servicePeriod);
            }
        }
    } else {
        disqualifiers.push("No honorable military service");
    }

    // Final determination
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    if (isEligible && disqualifiers.length === 0) {
        resultDiv.style.backgroundColor = '#d4edda';
        resultDiv.innerHTML = `
            <h3>Eligible for Block 26 Preference ✅</h3>
            <p><strong>Qualifying Factors:</strong></p>
            <ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul>
            <p>Based on 5 U.S.C. 2108 and OPM guidelines [2][4]</p>
        `;
    } else {
        resultDiv.style.backgroundColor = '#f8d7da';
        resultDiv.innerHTML = `
            <h3>Not Eligible for Block 26 Preference ❌</h3>
            <p><strong>Disqualifying Factors:</strong></p>
            <ul>${disqualifiers.map(d => `<li>${d}</li>`).join('')}</ul>
            <p>Reference: OPM RIF guidelines [4][7]</p>
        `;
    }
}
