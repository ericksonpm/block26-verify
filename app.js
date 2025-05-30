// SF-50 RIF Analysis Tool JavaScript

// Data from the application_data_json
const SF50_CODES = {
  "block23": {
    "1": {"name": "None - No Veterans Preference", "subgroup": "B"},
    "2": {"name": "5-point preference (TP)", "subgroup": "A"},
    "3": {"name": "10-point/disability (XP)", "subgroup": "A"},
    "4": {"name": "10-point/compensable (CP)", "subgroup": "A"},
    "5": {"name": "10-point/other (XP)", "subgroup": "A"},
    "6": {"name": "10-point compensable/30%+ (CPS)", "subgroup": "AD"},
    "7": {"name": "No points/Sole Survivorship Preference (SSP)", "subgroup": "A"}
  },
  "block24": {
    "1": {"name": "Career employee (3+ years service)", "group": "I", "protection": "Highest"},
    "2": {"name": "Career-conditional (less than 3 years)", "group": "II", "protection": "Moderate"},
    "3": {"name": "Temporary/term/time-limited", "group": "III", "protection": "Lowest"}
  }
};

const RIF_HIERARCHY = [
  "Group I-AD (Career + 30%+ disabled veteran)",
  "Group I-A (Career + other veterans preference)",
  "Group I-B (Career + no veterans preference)",
  "Group II-AD (Conditional + 30%+ disabled veteran)",
  "Group II-A (Conditional + other veterans preference)",
  "Group II-B (Conditional + no veterans preference)",
  "Group III-AD (Temporary + 30%+ disabled veteran)",
  "Group III-A (Temporary + other veterans preference)",
  "Group III-B (Temporary + no veterans preference)"
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Add event listeners
  document.getElementById('rifAnalysisForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('militaryRetiree').addEventListener('change', toggleMilitaryDetails);
  document.getElementById('vaDisability').addEventListener('change', toggleVADetails);
  
  // Initialize form state
  toggleMilitaryDetails();
  toggleVADetails();
}

function handleFormSubmit(event) {
  event.preventDefault();
  
  // Collect form data
  const formData = {
    block23: document.getElementById('block23').value,
    block24: document.getElementById('block24').value,
    block26: document.getElementById('block26').value,
    militaryRetiree: document.getElementById('militaryRetiree').value,
    militaryYears: document.getElementById('militaryYears').value,
    retirementType: document.getElementById('retirementType').value,
    vaDisability: document.getElementById('vaDisability').value,
    vaRating: document.getElementById('vaRating').value
  };
  
  // Validate required fields
  if (!formData.block23 || !formData.block24 || !formData.block26) {
    alert('Please fill in all required SF-50 information.');
    return;
  }
  
  // Analyze the data
  const analysis = analyzeRIFStanding(formData);
  
  // Display results
  displayResults(analysis);
  
  // Show results section
  document.getElementById('analysisResults').classList.remove('hidden');
  document.getElementById('analysisResults').scrollIntoView({ behavior: 'smooth' });
}

function analyzeRIFStanding(data) {
  let analysis = {
    tenureGroup: null,
    subgroup: null,
    rifPosition: null,
    protectionLevel: null,
    warnings: [],
    recommendations: [],
    explanation: ""
  };
  
  // Handle unknown values
  if (data.block23 === 'unknown' || data.block24 === 'unknown' || data.block26 === 'unknown') {
    analysis.warnings.push("Some SF-50 information is missing. Results may be incomplete.");
  }
  
  // Determine tenure group from Block 24
  if (data.block24 && data.block24 !== 'unknown') {
    analysis.tenureGroup = SF50_CODES.block24[data.block24].group;
    analysis.tenureInfo = SF50_CODES.block24[data.block24];
  }
  
  // Determine subgroup - this is where military retiree rules apply
  analysis.subgroup = determineSubgroup(data);
  
  // Check for military retiree issues
  const militaryIssues = checkMilitaryRetireeIssues(data);
  analysis.warnings = analysis.warnings.concat(militaryIssues.warnings);
  analysis.recommendations = analysis.recommendations.concat(militaryIssues.recommendations);
  
  // Determine RIF position and protection level
  if (analysis.tenureGroup && analysis.subgroup) {
    analysis.rifPosition = `Group ${analysis.tenureGroup}-${analysis.subgroup}`;
    analysis.protectionLevel = calculateProtectionLevel(analysis.rifPosition);
    analysis.hierarchyRank = RIF_HIERARCHY.indexOf(analysis.rifPosition.replace(/Group /, "")) + 1;
  }
  
  // Generate explanation
  analysis.explanation = generateExplanation(analysis, data);
  
  // Add general recommendations
  analysis.recommendations = analysis.recommendations.concat(getGeneralRecommendations(analysis, data));
  
  return analysis;
}

function determineSubgroup(data) {
  // Check if person is a 20+ year military retiree (dual compensation act applies)
  const is20YearRetiree = data.militaryRetiree === 'yes' && data.militaryYears === 'yes';
  const isCombatRetirement = data.retirementType === 'combat';
  const isMedicalRetirement = data.retirementType === 'medical';
  
  // For 20+ year military retirees, special rules apply
  if (is20YearRetiree && !isCombatRetirement) {
    // Most 20+ year retirees don't get veterans preference in RIF
    return 'B'; // No veterans preference
  }
  
  // For combat retirees or medical retirees, they may keep veterans preference
  if (isCombatRetirement || (isMedicalRetirement && data.militaryYears === 'no')) {
    // Use their block 23 code normally
    if (data.block23 && data.block23 !== 'unknown') {
      // Special case for 30%+ disability rating
      if (data.vaDisability === 'yes') {
        const rating = parseInt(data.vaRating);
        if (rating >= 30 || data.vaRating === '30' || data.vaRating === '40' || 
            data.vaRating === '50' || data.vaRating === '60' || data.vaRating === '70' || 
            data.vaRating === '80' || data.vaRating === '90' || data.vaRating === '100') {
          return 'AD'; // 30%+ disabled veteran
        }
      }
      return SF50_CODES.block23[data.block23].subgroup;
    }
  }
  
  // For non-military retirees or those with less than 20 years
  if (data.militaryRetiree === 'no' || data.militaryYears === 'no') {
    if (data.block23 && data.block23 !== 'unknown') {
      // Check for 30%+ disability
      if (data.vaDisability === 'yes') {
        const rating = data.vaRating;
        if (rating === '30' || rating === '40' || rating === '50' || rating === '60' || 
            rating === '70' || rating === '80' || rating === '90' || rating === '100') {
          return 'AD'; // 30%+ disabled veteran
        }
      }
      return SF50_CODES.block23[data.block23].subgroup;
    }
  }
  
  return 'B'; // Default to no veterans preference
}

function checkMilitaryRetireeIssues(data) {
  const warnings = [];
  const recommendations = [];
  
  if (data.militaryRetiree === 'yes') {
    if (data.militaryYears === 'yes' && data.retirementType !== 'combat') {
      // 20+ year retiree who is not combat retired
      warnings.push("As a 20+ year military retiree, you typically do NOT qualify for veterans preference in RIF under the Dual Compensation Act of 1964.");
      
      if (data.block26 === 'yes') {
        warnings.push("Your SF-50 shows veterans preference for RIF (Block 26 checked), but this may be incorrect for 20+ year retirees.");
        recommendations.push("Verify with HR that your SF-50 correctly reflects your RIF veterans preference eligibility.");
      }
      
      if (data.block23 !== '1') {
        warnings.push("Your SF-50 shows veterans preference codes, but these may not apply to RIF procedures for 20+ year retirees.");
      }
    }
    
    if (data.retirementType === 'combat') {
      recommendations.push("As a combat retiree, you should retain veterans preference in RIF. Ensure your SF-50 reflects this correctly.");
    }
    
    if (data.retirementType === 'medical' && data.militaryYears === 'no') {
      recommendations.push("As a medical retiree with less than 20 years, you should retain veterans preference in RIF.");
    }
  }
  
  return { warnings, recommendations };
}

function calculateProtectionLevel(rifPosition) {
  const rank = RIF_HIERARCHY.indexOf(rifPosition.replace(/Group /, ""));
  
  if (rank >= 0 && rank <= 2) {
    return 'high';
  } else if (rank >= 3 && rank <= 5) {
    return 'moderate';
  } else {
    return 'low';
  }
}

function generateExplanation(analysis, data) {
  let explanation = "";
  
  if (analysis.tenureGroup && analysis.subgroup) {
    explanation += `Based on your SF-50 information, you are classified as <strong>Group ${analysis.tenureGroup}-${analysis.subgroup}</strong> for RIF purposes. `;
    
    const rank = analysis.hierarchyRank;
    if (rank) {
      explanation += `This puts you at position <strong>#${rank}</strong> out of 9 possible RIF categories. `;
    }
    
    switch (analysis.protectionLevel) {
      case 'high':
        explanation += "This provides <strong>high protection</strong> against RIF actions.";
        break;
      case 'moderate':
        explanation += "This provides <strong>moderate protection</strong> against RIF actions.";
        break;
      case 'low':
        explanation += "This provides <strong>limited protection</strong> against RIF actions.";
        break;
    }
  }
  
  return explanation;
}

function getGeneralRecommendations(analysis, data) {
  const recommendations = [];
  
  if (analysis.protectionLevel === 'low') {
    recommendations.push("Consider exploring other career options or seeking positions in different agencies.");
    recommendations.push("Document your performance ratings and length of service for RIF calculations.");
  }
  
  if (data.vaDisability === 'yes' && data.vaRating && ['30', '40', '50', '60', '70', '80', '90', '100'].includes(data.vaRating)) {
    recommendations.push("Ensure your VA disability rating is properly reflected in your personnel records.");
  }
  
  recommendations.push("Keep copies of all SF-50s and personnel documents.");
  recommendations.push("Stay informed about your agency's RIF procedures and timeline.");
  
  return recommendations;
}

function displayResults(analysis) {
  const resultsContainer = document.getElementById('resultsContent');
  
  let html = '';
  
  // Protection Level Display
  if (analysis.protectionLevel) {
    const protectionClass = `protection-${analysis.protectionLevel}`;
    const protectionText = analysis.protectionLevel.charAt(0).toUpperCase() + analysis.protectionLevel.slice(1);
    
    html += `
      <div class="protection-level ${protectionClass}">
        <div class="icon icon-${analysis.protectionLevel === 'high' ? 'success' : analysis.protectionLevel === 'moderate' ? 'warning' : 'error'}">!</div>
        RIF Protection Level: ${protectionText}
      </div>
    `;
  }
  
  // Tenure and Position Information
  if (analysis.tenureInfo) {
    html += `
      <div class="tenure-info">
        <h3>Your Employment Classification</h3>
        <p><strong>Tenure:</strong> ${analysis.tenureInfo.name}</p>
        <p><strong>RIF Group:</strong> Group ${analysis.tenureGroup}</p>
        <p><strong>RIF Subgroup:</strong> ${analysis.subgroup}</p>
        ${analysis.hierarchyRank ? `<p><strong>RIF Ranking:</strong> Position ${analysis.hierarchyRank} of 9</p>` : ''}
      </div>
    `;
  }
  
  // Explanation
  if (analysis.explanation) {
    html += `
      <div class="result-card">
        <h3><span class="icon icon-info">i</span>What This Means</h3>
        <p>${analysis.explanation}</p>
      </div>
    `;
  }
  
  // Warnings
  if (analysis.warnings.length > 0) {
    html += `
      <div class="warning-box">
        <h4>⚠️ Important Warnings</h4>
        <ul>
          ${analysis.warnings.map(warning => `<li>${warning}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // RIF Hierarchy
  html += generateHierarchyDisplay(analysis.rifPosition);
  
  // Recommendations
  if (analysis.recommendations.length > 0) {
    html += `
      <div class="recommendations">
        <h4>Recommended Actions</h4>
        <ul>
          ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  resultsContainer.innerHTML = html;
}

function generateHierarchyDisplay(userPosition) {
  let html = `
    <div class="rif-hierarchy">
      <h4>RIF Order (Highest to Lowest Protection)</h4>
      <ol class="hierarchy-list">
  `;
  
  RIF_HIERARCHY.forEach((position, index) => {
    const isUserPosition = userPosition && position.includes(userPosition.replace('Group ', ''));
    const className = isUserPosition ? 'user-position' : '';
    
    html += `
      <li class="${className}">
        <span class="rank-number">${index + 1}.</span>
        ${position}
        ${isUserPosition ? ' <strong>(Your Position)</strong>' : ''}
      </li>
    `;
  });
  
  html += `
      </ol>
      <p><em>Employees are separated starting from the bottom of this list.</em></p>
    </div>
  `;
  
  return html;
}

function toggleMilitaryDetails() {
  const militaryRetiree = document.getElementById('militaryRetiree').value;
  const militaryDetails = document.getElementById('militaryDetails');
  
  if (militaryRetiree === 'yes') {
    militaryDetails.classList.remove('hidden');
  } else {
    militaryDetails.classList.add('hidden');
  }
}

function toggleVADetails() {
  const vaDisability = document.getElementById('vaDisability').value;
  const vaDetails = document.getElementById('vaRatingDetails');
  
  if (vaDisability === 'yes') {
    vaDetails.classList.remove('hidden');
  } else {
    vaDetails.classList.add('hidden');
  }
}

function runWhatIfScenario(scenarioType) {
  const resultsContainer = document.getElementById('whatIfResults');
  let html = '';
  
  // Get current form data
  const currentData = {
    block23: document.getElementById('block23').value,
    block24: document.getElementById('block24').value,
    block26: document.getElementById('block26').value,
    militaryRetiree: document.getElementById('militaryRetiree').value,
    militaryYears: document.getElementById('militaryYears').value,
    retirementType: document.getElementById('retirementType').value,
    vaDisability: document.getElementById('vaDisability').value,
    vaRating: document.getElementById('vaRating').value
  };
  
  switch (scenarioType) {
    case 'tenure-change':
      html = generateTenureScenarios(currentData);
      break;
    case 'veterans-pref':
      html = generateVeteransScenarios(currentData);
      break;
    case 'disability-rating':
      html = generateDisabilityScenarios(currentData);
      break;
  }
  
  resultsContainer.innerHTML = html;
  resultsContainer.classList.remove('hidden');
}

function generateTenureScenarios(baseData) {
  let html = '<h3>What if you had different tenure?</h3>';
  
  ['1', '2', '3'].forEach(tenure => {
    if (tenure !== baseData.block24) {
      const scenarioData = { ...baseData, block24: tenure };
      const analysis = analyzeRIFStanding(scenarioData);
      const tenureInfo = SF50_CODES.block24[tenure];
      
      html += `
        <div class="result-card">
          <h4>${tenureInfo.name}</h4>
          <p>RIF Position: Group ${analysis.tenureGroup}-${analysis.subgroup}</p>
          <p>Protection Level: <span class="text-${analysis.protectionLevel === 'high' ? 'success' : analysis.protectionLevel === 'moderate' ? 'warning' : 'error'}">${analysis.protectionLevel}</span></p>
        </div>
      `;
    }
  });
  
  return html;
}

function generateVeteransScenarios(baseData) {
  let html = '<h3>What if you had veterans preference?</h3>';
  
  if (baseData.militaryRetiree === 'yes' && baseData.militaryYears === 'yes') {
    html += `
      <div class="info-box">
        <p>As a 20+ year military retiree, veterans preference scenarios depend on your retirement type:</p>
      </div>
    `;
    
    // Combat retirement scenario
    const combatData = { ...baseData, retirementType: 'combat', block23: '3', block26: 'yes' };
    const combatAnalysis = analyzeRIFStanding(combatData);
    
    html += `
      <div class="result-card">
        <h4>If you were a combat retiree</h4>
        <p>RIF Position: Group ${combatAnalysis.tenureGroup}-${combatAnalysis.subgroup}</p>
        <p>Protection Level: <span class="text-${combatAnalysis.protectionLevel === 'high' ? 'success' : combatAnalysis.protectionLevel === 'moderate' ? 'warning' : 'error'}">${combatAnalysis.protectionLevel}</span></p>
      </div>
    `;
  } else {
    // Non-military or less than 20 years scenarios
    const prefData = { ...baseData, block23: '3', block26: 'yes' };
    const prefAnalysis = analyzeRIFStanding(prefData);
    
    html += `
      <div class="result-card">
        <h4>If you had 10-point veterans preference</h4>
        <p>RIF Position: Group ${prefAnalysis.tenureGroup}-${prefAnalysis.subgroup}</p>
        <p>Protection Level: <span class="text-${prefAnalysis.protectionLevel === 'high' ? 'success' : prefAnalysis.protectionLevel === 'moderate' ? 'warning' : 'error'}">${prefAnalysis.protectionLevel}</span></p>
      </div>
    `;
  }
  
  return html;
}

function generateDisabilityScenarios(baseData) {
  let html = '<h3>What if you had 30%+ VA disability rating?</h3>';
  
  const disabilityData = { ...baseData, vaDisability: 'yes', vaRating: '30' };
  const disabilityAnalysis = analyzeRIFStanding(disabilityData);
  
  html += `
    <div class="result-card">
      <h4>With 30%+ VA disability rating</h4>
      <p>RIF Position: Group ${disabilityAnalysis.tenureGroup}-${disabilityAnalysis.subgroup}</p>
      <p>Protection Level: <span class="text-${disabilityAnalysis.protectionLevel === 'high' ? 'success' : disabilityAnalysis.protectionLevel === 'moderate' ? 'warning' : 'error'}">${disabilityAnalysis.protectionLevel}</span></p>
      <p><em>30%+ disabled veterans get the highest subgroup (AD) within their tenure group.</em></p>
    </div>
  `;
  
  if (baseData.militaryRetiree === 'yes' && baseData.militaryYears === 'yes' && baseData.retirementType !== 'combat') {
    html += `
      <div class="warning-box">
        <p><strong>Note:</strong> Even with 30%+ disability, 20+ year non-combat retirees may still be restricted by the Dual Compensation Act. Verify with HR.</p>
      </div>
    `;
  }
  
  return html;
}

function toggleAccordion(id) {
  const content = document.getElementById(id);
  const header = content.previousElementSibling;
  const icon = header.querySelector('.accordion-icon');
  
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.textContent = '−';
    icon.style.transform = 'rotate(0deg)';
  } else {
    content.classList.add('hidden');
    icon.textContent = '+';
    icon.style.transform = 'rotate(0deg)';
  }
}