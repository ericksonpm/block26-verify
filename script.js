document.addEventListener('DOMContentLoaded', () => {
    const retirementType = document.getElementById('retirementType');
    const calculateBtn = document.getElementById('calculateBtn');

    // Show/hide relevant fields
    retirementType.addEventListener('change', () => {
        const isRetired = retirementType.value !== 'none';
        document.getElementById('rankGroup').style.display = isRetired ? 'block' : 'none';
        document.getElementById('medicalGroup').style.display = 
            retirementType.value === 'medical' ? 'block' : 'none';
    });

    // Main calculation function
    calculateBtn.addEventListener('click', () => {
        const inputs = {
            serviceYears: parseFloat(document.getElementById('serviceYears').value) || 0,
            retirementType: retirementType.value,
            retirementRank: document.getElementById('retirementRank').value,
            combatRelated: document.getElementById('combatRelated').value,
            disabilityRating: document.getElementById('disabilityRating').value
        };

        let block23 = '';
        let block26 = 'No';
        let subgroup = 'B';
        const messages = [];

        // Calculate Block 23
        if(inputs.retirementType === 'medical' && inputs.combatRelated === 'yes') {
            block23 = '6';
        }

        // Calculate Block 26
        if(inputs.retirementType === 'medical') {
            if(inputs.disabilityRating === '30c') {
                block26 = 'Yes';
                subgroup = 'AD';
            }
        } else if(inputs.retirementType === 'regular') {
            if(inputs.retirementRank === 'o4-plus' && inputs.disabilityRating === '30c') {
                block26 = 'Yes';
                subgroup = 'A';
            } else if(inputs.serviceYears >= 20) {
                messages.push('20+ year regular retirees not eligible');
            }
        }

        // Update UI
        document.getElementById('block23Result').textContent = block23 || 'N/A';
        document.getElementById('block26Result').textContent = block26;
        document.getElementById('subgroupResult').textContent = subgroup;
        document.getElementById('results').classList.remove('hidden');
    });
});
