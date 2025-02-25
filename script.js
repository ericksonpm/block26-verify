document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    document.getElementById('retirementType').addEventListener('change', function() {
        document.getElementById('medicalDetails').style.display = 
            this.value === 'medical' ? 'block' : 'none';
    });

    document.getElementById('calculateButton').addEventListener('click', calculateRifStatus);
});

function calculateRifStatus(e) {
    if(e) e.preventDefault();
    
    const inputs = {
        serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
        retirementType: document.getElementById('retirementType').value,
        combatRelated: document.getElementById('combatRelated').value,
        disabilityRating: document.getElementById('disabilityRating').value,
        currentTenure: document.getElementById('currentTenure').value,
        veteranPreference: document.getElementById('veteranPreference').value
    };

    // Calculate results
    let block23 = '';
    let block26 = 'No';
    let subgroup = 'B';

    if(inputs.veteranPreference !== 'none') {
        block23 = {
            'TP': '2',
            'XP': '3',
            'CP': '4',
            'CPS': '6',
            'SSP': '7'
        }[inputs.veteranPreference];
    }

    const isCombatMedical = inputs.retirementType === 'medical' && 
                          inputs.combatRelated === 'yes';
    const hasCompensable = inputs.disabilityRating === '30c';

    if(isCombatMedical || hasCompensable) {
        block26 = 'Yes';
        subgroup = 'AD';
    } else if(inputs.veteranPreference !== 'none' && inputs.veteranPreference !== 'SSP') {
        block26 = 'Yes';
        subgroup = 'A';
    }

    if(inputs.retirementType === 'regular' && inputs.serviceYears >= 20) {
        block26 = 'No';
        subgroup = 'B';
    }

    // Update display
    document.getElementById('block23').textContent = block23 || 'N/A';
    document.getElementById('block26').textContent = block26;
    document.getElementById('subgroup').textContent = subgroup;
    document.getElementById('sf50Results').style.display = 'block';
}
