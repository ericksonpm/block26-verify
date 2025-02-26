document.getElementById('retirementStatus').addEventListener('change', function() {
    const rankGroup = document.getElementById('retirementRankGroup');
    const payGroup = document.getElementById('retirementPayGroup');
    const showGroups = this.value !== 'none';
    rankGroup.style.display = showGroups ? 'block' : 'none';
    payGroup.style.display = showGroups ? 'block' : 'none';
});

document.getElementById('derivativePreference').addEventListener('change', function() {
    document.getElementById('derivativeDetails').style.display = this.value !== 'none' ? 'block' : 'none';
});

function checkDerivativeEligibility(formValues) {
    const derivativeType = formValues.derivativePreference;
    const servicePeriod = formValues.veteranServicePeriod;
    const dischargeType = formValues.veteranDischargeType;
    
    let isEligible = false;
    const reasons = [];
    const disqualifiers = [];

    if (derivativeType !== 'none') {
        if (dischargeType !== 'honorable') {
            disqualifiers.push("Veteran must have had an honorable discharge");
        }

        switch(derivativeType) {
            case 'widow':
                if (servicePeriod === 'none') {
                    disqualifiers.push("Veteran must have served in a qualifying campaign");
                } else {
                    reasons.push("Unmarried widow/widower of campaign veteran");
                }
                break;
            case 'spouse-disabled':
                reasons.push("Spouse of service-connected disabled veteran unable to work");
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
    const formValues = {
        serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
        campaignService: document.getElementById('campaignService').value,
        dischargeType: document.getElementById('dischargeType').value,
        retirementStatus: document.getElementById('retirementStatus').value,
        retirementRank: document.getElementById('retirementRank').value,
        disabilityRating: parseInt(document.getElementById('disabilityRating').value),
        militaryRetirementPay: document.getElementById('militaryRetirementPay')?.value || 'no',
        derivativePreference: document.getElementById('derivativePreference').value,
        veteranServicePeriod: document.getElementById('veteranServicePeriod').value,
        veteranDischargeType: document.getElementById('veteranDischargeType').value
    };

    let isVeteranEligible = false;
    const veteranReasons = [];
    const veteranDisqualifiers = [];
    const totalMonths = formValues.serviceYears * 12;

    if (formValues.dischargeType === 'honorable') {
        if (formValues.campaignService !== 'none') {
            veteranReasons.push(`Campaign participation: ${formValues.campaignService.replace(/-/g, ' ').toUpperCase()}`);
            isVeteranEligible = true;
        } else if (totalMonths >= 24) {
            veteranReasons.push(`${formValues.serviceYears} years (${totalMonths} months) qualifying service`);
            isVeteranEligible = true;
        }

        if (formValues.retirementStatus === 'medical' && formValues.disabilityRating >= 30) {
            veteranReasons.push("Medical retiree with 30%+ disability rating");
            isVeteranEligible = true;
        }

        if (formValues.retirementRank === 'o4-plus') {
            if (formValues.militaryRetirementPay === 'yes') {
                veteranDisqualifiers.push("O-4+ retirees receiving military pay are ineligible");
                isVeteranEligible = false;
            }
        }
    } else {
        veteranDisqualifiers.push("Non-honorable discharge type");
    }

    const derivativeResult = checkDerivativeEligibility(formValues);
    const finalEligible = isVeteranEligible || derivativeResult.isDerivativeEligible;
    const allReasons = [...veteranReasons, ...derivativeResult.derivativeReasons];
    const allDisqualifiers = [...veteranDisqualifiers, ...derivativeResult.derivativeDisqualifiers];

    // Determine Subgroup
    let subgroup = 'B';
    const subgroupDetails = [];
    
    if (finalEligible) {
        if (formValues.disabilityRating >= 30) {
            subgroup = 'AD';
            subgroupDetails.push("30%+ Service-Connected Disability (5 U.S.C. 2108(3))");
        } else if (derivativeResult.isDerivativeEligible || formValues.campaignService !== 'none' || totalMonths >= 24) {
            subgroup = 'A';
            subgroupDetails.push(derivativeResult.isDerivativeEligible ? 
                "Derivative Preference (OPM RIF Guidance)" : 
                "Campaign Service or Non-Disabled Veteran");
        }
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3 class="${finalEligible ? 'eligible' : 'ineligible'}">
            ${finalEligible ? '✅ Eligible' : '❌ Not Eligible'} - Retention Subgroup ${subgroup}
        </h3>
        <div class="subgroup-explanation subgroup-${subgroup}">
            <strong>Subgroup ${subgroup} Definition:</strong>
            ${subgroup === 'AD' ? 
                'Veterans with 30%+ compensable disability (Highest Retention Priority)' :
            subgroup === 'A' ? 
                'Other preference eligibles (Including campaign veterans and derivative claims)' : 
                'Non-preference eligibles'}
        </div>
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
        ${subgroupDetails.length ? `
        <div class="subgroup-factors">
            <strong>Subgroup Determination Factors:</strong>
            <ul>${subgroupDetails.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>` : ''}
        <div class="legal-refs">
            <h4>Legal References:</h4>
            <ul>
                <li><a href="https://www.law.cornell.edu/uscode/text/5/2108" target="_blank">5 U.S.C. 2108</a></li>
                ${formValues.derivativePreference !== 'none' ? '<li><a href="https://www.opm.gov/policy-data-oversight/workforce-restructuring/reductions-in-force/workforce_reshaping.pdf#page=23" target="_blank">OPM RIF Derivative Preference</a></li>' : ''}
            </ul>
        </div>
    `;
    resultDiv.className = finalEligible ? 'result-eligible' : 'result-ineligible';
    resultDiv.style.display = 'block';
}