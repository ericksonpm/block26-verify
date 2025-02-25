document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners
    const retirementType = document.getElementById('retirementType');
    const calculateButton = document.getElementById('calculateButton');

    retirementType.addEventListener('change', function() {
        const isRetired = this.value !== 'none';
        document.getElementById('rankGroup').style.display = isRetired ? 'block' : 'none';
        document.getElementById('medicalDetails').style.display = 
            this.value === 'medical' ? 'block' : 'none';
    });

    calculateButton.addEventListener('click', calculateRifStatus);
});

function calculateRifStatus(e) {
    e.preventDefault();
    
    const formValues = {
        serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
        retirementType: document.getElementById('retirementType').value,
        retirementRank: document.getElementById('retirementRank').value,
        combatRelated: document.getElementById('combatRelated').value,
        disabilityRating: document.getElementById('disabilityRating').value,
        currentTenure: document.getElementById('currentTenure').value,
        veteranPreference: document.getElementById('veteranPreference').value
    };

    // Initialize results and disqualifiers
    let block23 = '';
    let block26 = 'No';
    let subgroup = 'B';
    const disqualifiers = [];

    // Base eligibility checks
    const isCombatMedical = formValues.retirementType === 'medical' && 
                          formValues.combatRelated === 'yes';
    const hasCompensable = formValues.disabilityRating === '30c';
    const isHighRankRegular = formValues.retirementType === 'regular' && 
                            formValues.retirementRank === 'o4-plus';

    // Block 23 determination
    if(formValues.veteranPreference !== 'none') {
        block23 = {
            'TP': '2',  // 5-point preference
            'XP': '3',  // 10-point non-compensable
            'CP': '4',  // 10-point compensable
            'CPS': '6', // 10-point 30%+ disability
            'SSP': '7'  // Sole survivor
        }[formValues.veteranPreference];
    }

    // Block 26 eligibility rules
    if(isCombatMedical) {
        block26 = 'Yes';
        subgroup = 'AD';
    } else if(hasCompensable) {
        block26 = 'Yes';
        subgroup = formValues.retirementType === 'regular' ? 'A' : 'AD';
    } else if(formValues.veteranPreference !== 'none' && 
             formValues.veteranPreference !== 'SSP') {
        block26 = 'Yes';
        subgroup = 'A';
    }

    // High-rank regular retiree restrictions (5 U.S.C. 2108(2))
    if(isHighRankRegular) {
        if(!hasCompensable) {
            block26 = 'No';
            subgroup = 'B';
            disqualifiers.push("O-4+ regular retirees require 30%+ compensable disability");
        } else if(formValues.disabilityRating === '30c') {
            disqualifiers.push("O-4+ with compensable disability downgraded to Subgroup A");
            subgroup = 'A';
        }
    }

    // 20-year regular retiree exclusion
    if(formValues.retirementType === 'regular' && formValues.serviceYears >= 20) {
        block26 = 'No';
        subgroup = 'B';
        disqualifiers.push("20+ year regular retirees ineligible for veteran preference");
    }

    // Update UI
    const resultDiv = document.getElementById('sf50Results');
    document.getElementById('block23').textContent = block23 || 'N/A';
    document.getElementById('block26').textContent = block26;
    document.getElementById('subgroup').textContent = subgroup;
    
    if(disqualifiers.length > 0) {
        resultDiv.innerHTML += `<div class="disqualifiers">
            <h4>Disqualifying Factors:</h4>
            <ul>${disqualifiers.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>`;
    }

    resultDiv.style.display = 'block';
}
