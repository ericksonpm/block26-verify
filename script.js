document.getElementById('retirementStatus').addEventListener('change', function() {
    const rankGroup = document.getElementById('retirementRankGroup');
    const payGroup = document.getElementById('retirementPayGroup');
    const medicalGroup = document.getElementById('medicalRetirementGroup');
    const isRetired = this.value !== 'none';
    
    rankGroup.style.display = isRetired ? 'block' : 'none';
    payGroup.style.display = isRetired ? 'block' : 'none';
    medicalGroup.style.display = this.value === 'medical' ? 'block' : 'none';
});

document.getElementById('derivativePreference').addEventListener('change', function() {
    document.getElementById('derivativeDetails').style.display = this.value !== 'none' ? 'block' : 'none';
});

function checkDerivativeEligibility(formValues) {
    // ... keep previous derivative eligibility logic unchanged ...
}

function checkEligibility() {
    const formValues = {
        // ... keep previous form value collection ...
    };

    let isVeteranEligible = false;
    const veteranReasons = [];
    const veteranDisqualifiers = [];
    const totalMonths = formValues.serviceYears * 12;

    // New RIF veteran eligibility check for retirees
    let isRifVeteran = true;
    if(formValues.retirementStatus === 'regular') {
        isRifVeteran = formValues.serviceYears < 20 || 
                      formValues.medicalRetirementType === 'combat'; // Combat exception
    }

    if (formValues.dischargeType === 'honorable' && isRifVeteran) {
        // ... keep existing eligibility checks ...

        // Updated medical retirement validation
        if (formValues.retirementStatus === 'medical' && formValues.disabilityRating >= 30) {
            if (formValues.medicalRetirementType === 'combat') {
                veteranReasons.push("Combat-related medical retiree with 30%+ disability");
                isVeteranEligible = true;
            } else {
                veteranDisqualifiers.push("Non-combat medical retirees ineligible for Subgroup AD");
                isVeteranEligible = false;
            }
        }

        // Updated regular retirement handling
        if (formValues.retirementStatus === 'regular') {
            if(formValues.serviceYears >= 20) {
                veteranDisqualifiers.push("20+ year regular retirees ineligible for veteran preference");
                isVeteranEligible = false;
            }
            // ... keep existing O-4+ check ...
        }
    }

    // Updated subgroup determination
    let subgroup = 'B';
    const subgroupDetails = [];
    
    if (finalEligible) {
        if (formValues.disabilityRating >= 30) {
            const isCombatMedical = formValues.retirementStatus === 'medical' && 
                                  formValues.medicalRetirementType === 'combat';
            const isQualifiedRegular = formValues.retirementStatus === 'regular' && 
                                     formValues.serviceYears < 20;

            if(isCombatMedical || isQualifiedRegular || formValues.retirementStatus === 'none') {
                subgroup = 'AD';
                subgroupDetails.push(
                    isCombatMedical ? "Combat-Related Medical Retiree (30%+ Disability)" :
                    isQualifiedRegular ? "Regular Retiree <20 Years Service (30%+ Disability)" :
                    "30%+ Service-Connected Disability"
                );
            }
        }
        else if (derivativeResult.isDerivativeEligible || formValues.campaignService !== 'none' || totalMonths >= 24) {
            subgroup = 'A';
            // ... keep existing A subgroup logic ...
        }
    }

    // ... keep rest of result display logic ...
}
