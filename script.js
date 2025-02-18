// Derivative Preference Logic
document.getElementById('derivativePreference').addEventListener('change', function() {
    const derivativeDetails = document.getElementById('derivativeDetails');
    derivativeDetails.style.display = this.value !== 'none' ? 'block' : 'none';
});

function checkDerivativeEligibility(formValues) {
    const derivativeType = formValues.derivativePreference;
    const servicePeriod = formValues.veteranServicePeriod;
    const dischargeType = formValues.veteranDischargeType;
    
    let isEligible = false;
    const reasons = [];
    const disqualifiers = [];

    if (derivativeType !== 'none') {
        // Common requirement for all derivative claims
        if (dischargeType !== 'honorable') {
            disqualifiers.push("Veteran must have had an honorable discharge");
        }

        // Type-specific requirements
        switch(derivativeType) {
            case 'widow':
                if (servicePeriod === 'none') {
                    disqualifiers.push("Veteran must have served in a qualifying campaign");
                } else {
                    reasons.push("Unmarried widow/widower of campaign veteran");
                }
                break;
                
            case 'spouse-disabled':
                reasons.push("Spouse of service-connected disabled veteran (veteran unable to work)");
                break;
                
            case 'mother-deceased':
                reasons.push("Mother of veteran who died in war/campaign");
                break;
                
            case 'mother-disabled':
                reasons.push("Mother of permanently disabled veteran");
                break;
        }

        isEligible = disqualifiers.length === 0;
    }

    return { isDerivativeEligible: isEligible, derivativeReasons: reasons, derivativeDisqualifiers: disqualifiers };
}

function checkEligibility() {
    // Capture all form values (existing + new derivative fields)
    const formValues = {
        // Existing veteran fields
        serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
        campaignService: document.getElementById('campaignService').value,
        dischargeType: document.getElementById('dischargeType').value,
        retirementStatus: document.getElementById('retirementStatus').value,
        retirementRank: document.getElementById('retirementRank').value,
        disabilityRating: parseInt(document.getElementById('disabilityRating').value),
        militaryRetirementPay: document.getElementById('militaryRetirementPay')?.value || 'no',
        
        // New derivative fields
        derivativePreference: document.getElementById('derivativePreference').value,
        veteranServicePeriod: document.getElementById('veteranServicePeriod').value,
        veteranDischargeType: document.getElementById('veteranDischargeType').value
    };

    // Existing eligibility checks
    let isVeteranEligible = false;
    const veteranReasons = [];
    const veteranDisqualifiers = [];
    
    // ... maintain existing veteran eligibility logic ...

    // Check derivative eligibility
    const derivativeResult = checkDerivativeEligibility(formValues);
    
    // Combine results
    const finalEligible = isVeteranEligible || derivativeResult.isDerivativeEligible;
    const allReasons = [...veteranReasons, ...derivativeResult.derivativeReasons];
    const allDisqualifiers = [...veteranDisqualifiers, ...derivativeResult.derivativeDisqualifiers];

    // Build result display
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3 class="${finalEligible ? 'eligible' : 'ineligible'}">
            ${finalEligible ? '✅ Eligible' : '❌ Not Eligible'}
        </h3>
        
        ${allReasons.length ? `
        <div class="result-section">
            <h4>Qualifying Factors:</h4>
            <ul>${allReasons.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>` : ''}
        
        ${allDisqualifiers.length ? `
        <div class="result-section">
            <h4>Disqualifying Factors:</h4>
            <ul>${allDisqualifiers.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>` : ''}
        
        <div class="legal-refs">
            <h4>Legal References:</h4>
            <ul>
                <li><a href="https://www.law.cornell.edu/uscode/text/5/2108#a_3" target="_blank">5 U.S.C. 2108(3)</a></li>
                ${formValues.derivativePreference !== 'none' ? 
                '<li><a href="https://www.opm.gov/policy-data-oversight/workforce-restructuring/reductions-in-force/workforce_reshaping.pdf#page=23" target="_blank">OPM Derivative Preference</a></li>' : ''}
            </ul>
        </div>
    `;
    
    resultDiv.className = finalEligible ? 'result-eligible' : 'result-ineligible';
    resultDiv.style.display = 'block';
}
