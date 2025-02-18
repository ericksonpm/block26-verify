// script.js
function checkBlock26() {
    const veteranStatus = document.getElementById('veteranStatus').value;
    const retiredMilitary = document.getElementById('retiredMilitary').value;
    const resultDiv = document.getElementById('result');
    
    let isValid = false;
    let message = '';

    if (veteranStatus === 'yes') {
        if (retiredMilitary === 'no') {
            isValid = true;
            message = 'Block 26 SHOULD show veteran preference (Valid configuration)';
            resultDiv.style.backgroundColor = '#d4edda';
            resultDiv.style.color = '#155724';
        } else {
            message = 'Block 26 SHOULD NOT show veteran preference (Retired military do not qualify)';
            resultDiv.style.backgroundColor = '#fff3cd';
            resultDiv.style.color = '#856404';
        }
    } else {
        isValid = true;
        message = 'Block 26 SHOULD BE BLANK (No veteran status claimed)';
        resultDiv.style.backgroundColor = '#d4edda';
        resultDiv.style.color = '#155724';
    }

    resultDiv.innerHTML = `
        <h3>Verification Result:</h3>
        <p>${message}</p>
        <p><strong>Logic applied:</strong></p>
        <ul>
            <li>Veteran Status: ${veteranStatus.toUpperCase()}</li>
            <li>Retired Military: ${retiredMilitary.toUpperCase()}</li>
        </ul>
    `;
}
