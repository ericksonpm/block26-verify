// DOM Elements
const form = {
  retired: document.getElementById('retired'),
  retirementType: document.getElementById('retirementType'),
  rank: document.getElementById('rank'),
  serviceYears: document.getElementById('serviceYears'),
  disability: document.getElementById('disability'),
  result: document.getElementById('result'),
  sections: {
    retirement: document.getElementById('retirementTypeSection'),
    rank: document.getElementById('rankSection'),
    service: document.getElementById('serviceYearsSection')
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('checkBtn').addEventListener('click', checkEligibility);
  document.getElementById('clearBtn').addEventListener('click', clearForm);
  
  // Cascading visibility handlers
  form.retired.addEventListener('change', toggleRetirementDetails);
  form.retirementType.addEventListener('change', toggleServiceRequirements);
});

// Core Logic
function checkEligibility() {
  if (!validateForm()) return;

  const inputs = {
    isRetired: form.retired.value === 'yes',
    rank: form.rank.value,
    serviceYears: parseInt(form.serviceYears.value, 10),
    disability: parseInt(form.disability.value, 10),
    retirementType: form.retirementType.value
  };

  const result = calculateEligibility(inputs);
  displayResult(result.text, result.className);
}

// Helper Functions
function calculateEligibility({isRetired, rank, serviceYears, disability, retirementType}) {
  if (!isRetired) {
    return { text: "Block 26: NO (Non-retired personnel)", className: "alert" };
  }

  if (rank === 'o3') {
    return disability >= 30 
      ? { text: "Block 26: YES (Disabled below O-4)", className: "success" }
      : { text: "Block 26: NO", className: "alert" };
  }

  if (rank === 'o4') {
    if ((retirementType === 'medical' || serviceYears < 20) && disability >= 30) {
      return { text: "Block 26: YES (Qualifying exception)", className: "success" };
    }
    return {
      text: serviceYears >= 20 
        ? "Block 26: NO (20+ year non-medical retirement)" 
        : "Block 26: NO",
      className: "alert"
    };
  }

  return { text: "Error: Invalid input combination", className: "error" };
}

function validateForm() {
  if (form.retired.value === 'yes' && !form.serviceYears.value) {
    displayResult("Please enter service years", "error");
    form.serviceYears.focus();
    return false;
  }
  return true;
}

// UI Functions
function toggleRetirementDetails() {
  const isRetired = this.value === 'yes';
  form.sections.retirement.classList.toggle('visible', isRetired);
  form.sections.rank.classList.toggle('visible', isRetired);
  form.retirementType.disabled = !isRetired;
}

function toggleServiceRequirements() {
  const needsServiceYears = this.value === 'nonMedical';
  form.sections.service.classList.toggle('visible', needsServiceYears);
  form.serviceYears.required = needsServiceYears;
}

function displayResult(text, className = '') {
  form.result.textContent = text;
  form.result.className = className;
}

function clearForm() {
  // Reset values
  form.retired.value = 'no';
  form.retirementType.value = 'nonMedical';
  form.rank.value = 'o3';
  form.serviceYears.value = '';
  form.disability.value = '0';
  
  // Reset UI state
  Object.values(form.sections).forEach(section => section.classList.remove('visible'));
  form.retirementType.disabled = true;
  displayResult('');
}
