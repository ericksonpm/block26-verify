document.getElementById('retirementType').addEventListener('change', function() {
    document.getElementById('medicalDetails').style.display = 
        this.value === 'medical' ? 'block' : 'none';
});

function calculateRifStatus() {
    const inputs = {
        serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
        retirementType: document.getElementById('retirementType').value,
        combatRelated: document.getElementById('combatRelated').value,
        disabilityRating: document.getElementById('disabilityRating').value,
        currentTenure: document.getElementById('currentTenure').value,
        veteranPreference: document.getElementById('veteranPreference').value
    };

    // Initialize results
    let block23 = '';
    let block26 = 'No';
    let subgroup = 'B';

    // Calculate Block 23 code
    if(inputs.veteranPreference !== 'none') {
        block23 = {
            'TP': '2',
            'XP': '3',
            'CP': '4',
            'CPS': '6',
            'SSP': '7'
        }[inputs.veteranPreference];
    }

    // Calculate Block 26 eligibility
    if(inputs.retirementType === 'regular' && inputs.serviceYears >= 20) {
        block26 = 'No';
    } else {
        const isCombatMedical = inputs.retirementType === 'medical' && 
                               inputs.combatRelated === 'yes';
        const hasCompensable = inputs.disabilityRating === '30c';
        
        if(isCombatMedical || hasCompensable) {
            block26 = 'Yes';
            subgroup = 'AD';
        } else if(inputs.veteranPreference !== 'none') {
            block26 = 'Yes';
            subgroup = 'A';
        }
    }

    // Special case for Sole Survivor
    if(inputs.veteranPreference === 'SSP') {
        block26 = 'No';
        subgroup = 'B';
    }

    // Update display
    document.getElementById('block23').textContent = block23 || 'Not Applicable';
    document.getElementById('block26').textContent = block26;
    document.getElementById('subgroup').textContent = subgroup;
    document.getElementById('sf50Results').style.display = 'block';
}
