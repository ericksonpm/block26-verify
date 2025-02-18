function checkEligibility() {
    const isRetired = document.getElementById('retired').value === 'yes';
    const rank = document.getElementById('rank').value;
    const serviceYears = parseInt(document.getElementById('serviceYears').value) || 0; // Handle NaN
    const disability = parseInt(document.getElementById('disability').value);
    const retirementType = document.getElementById('retirementType').value;

    let resultText = '';
    let resultClass = '';

    if (!isRetired) {
        resultText = "Block 26: NO (Non-retired personnel)";
        resultClass = "alert";
    } else if (rank === 'o3') {
        resultText = disability >= 30 ? "Block 26: YES (Disabled below O-4)" : "Block 26: NO";
        resultClass = disability >= 30 ? "success" : "alert";
    } else if (rank === 'o4') {
        // Corrected logic per OPM guidelines
        if ((retirementType === 'medical' || serviceYears < 20) && disability >= 30) {
            resultText = "Block 26: YES (Qualifying exception)";
            resultClass = "success";
        } else {
            resultText = serviceYears >= 20 ? 
                "Block 26: NO (20+ year non-medical retirement)" : 
                "Block 26: NO";
            resultClass = "alert";
        }
    }

    displayResult(resultText, resultClass);
}

function displayResult(text, className) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = text;
    resultDiv.className = className;
}

// ... rest of your functions ...

function clearForm() {
    document.getElementById('retired').value = 'no';
    document.getElementById('rank').value = 'o3';
    document.getElementById('serviceYears').value = '';
    document.getElementById('retirementType').value = 'nonMedical';
    document.getElementById('disability').value = '0';
    document.getElementById('result').textContent = '';
    
    // Reset retirement type UI
    document.getElementById('retirementTypeSection').style.opacity = '0.5';
    document.getElementById('retirementType').disabled = true;
}

// Retirement type visibility handler
document.getElementById('retired').addEventListener('change', function() {
    const retirementSection = document.getElementById('retirementTypeSection');
    const retirementSelect = document.getElementById('retirementType');
    
    if (this.value === 'yes') {
        retirementSection.style.opacity = '1';
        retirementSelect.disabled = false;
    } else {
        retirementSection.style.opacity = '0.5';
        retirementSelect.disabled = true;
    }
});
