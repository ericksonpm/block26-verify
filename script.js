// script.js
document.getElementById('retirementStatus').addEventListener('change', function() {
    const rankGroup = document.getElementById('retirementRankGroup');
    rankGroup.style.display = this.value !== 'none' ? 'block' : 'none';
});

function checkEligibility() {
    const formValues = {
        serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
        campaignService: document.getElementById('campaignService').value,
        dischargeType: document.getElementById('dischargeType').value,
        retirementStatus: document.getElementById('retirementStatus').value,
        retirementRank: document.getElementById('retirementRank').value,
        disabilityRating: parseInt(document.getElementById('disabilityRating').value)
    };

    const totalMonths = formValues.serviceYears * 12;
    let isEligible = false;
    const reasons = [];
    const disqualifiers = [];

    // Base eligibility check
    if (formValues.dischargeType === 'honorable') {
        // Campaign service exception
        if (formValues.campaignService !== 'none') {
            reasons.push(`Campaign participation: ${formValues.campaignService.replace(/-/g, ' ').toUpperCase()}`);
            isEligible = true;
        }
        // Duration requirement
        else if (totalMonths >= 6) {
            reasons.push(`${formValues.serviceYears} years (${totalMonths} months) of service`);
            isEligible = true;
        }

        // Medical retirement exception
        if (formValues.retirementStatus === 'medical' && formValues.disabilityRating >= 30) {
            reasons.push("Medical retiree with 30%+ disability rating");
            isEligible = true;
        }

        // Officer retirement restriction
        if (formValues.retirementRank === 'o4-plus' && formValues.disabilityRating < 30) {
            disqualifiers.push("O-4+ retired officer without 30% disability");
            isEligible = false;
        }
    } else {
        disqualifiers.push("Non-honorable discharge");
        isEligible = false;
    }

    // Build result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3 class="${isEligible ? 'eligible' : 'ineligible'}">${isEligible ? '✅ Eligible' : '❌ Not Eligible'}</h3>
        ${reasons.length ? `<p><strong>Qualifying Factors:</strong></p><ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
        ${disqualifiers.length ? `<p><strong>Disqualifying Factors:</strong></p><ul>${disqualifiers.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
        <div class="legal-refs">
            <p>Legal References:</p>
            <ul>
                <li><a href="https://www.law.cornell.edu/uscode/text/5/2108" target="_blank">5 U.S.C. 2108</a></li>
                <li><a href="https://www.opm.gov/policy-data-oversight/workforce-restructuring/reductions-in-force/" target="_blank">OPM RIF Guidance</a></li>
            </ul>
        </div>
    `;
    resultDiv.className = isEligible ? 'result-eligible' : 'result-ineligible';
}
