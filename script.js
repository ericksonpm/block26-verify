function checkEligibility() {
    const isRetired = document.getElementById('retired').value === 'yes';
    const rank = document.getElementById('rank').value;
    const serviceYears = parseInt(document.getElementById('serviceYears').value);
    const disability = parseInt(document.getElementById('disability').value);

    let resultText = '';
    let resultClass = '';

    // Core logic from OPM guidelines
    if (!isRetired) {
        resultText = "Block 26: NO (Non-retired personnel)";
        resultClass = "alert";
    } else if (rank === 'o3') {
        resultText = disability >= 30 ? "Block 26: YES (Disabled below O-4)" : "Block 26: NO";
        resultClass = disability >= 30 ? "success" : "alert";
    } else if (rank === 'o4') {
        if (serviceYears < 20 || disability >= 30) {
            resultText = "Block 26: YES (O-4+ with qualifying criteria)";
            resultClass = "success";
        } else {
            resultText = "Block 26: NO (O-4+ without qualifying criteria)";
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

function clearForm() {
    document.getElementById('retired').value = 'no';
    document.getElementById('rank').value = 'o3';
    document.getElementById('serviceYears').value = '';
    document.getElementById('disability').value = '0';
    document.getElementById('result').textContent = '';
}
