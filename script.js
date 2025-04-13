let step = 0;
const images = [
  'images/a.png', 'images/b.png', 'images/c.png',
  'images/d.png', 'images/e.png', 'images/done.png'
];

function showStep(stepIndex) {
  const steps = document.querySelectorAll('.step');
  steps.forEach((el, i) => el.classList.toggle('active', i === stepIndex));
  document.getElementById('stepImg').src = images[stepIndex];
  
  const nextBtn = document.getElementById('nextBtn');
  if (stepIndex === steps.length - 1) {
    nextBtn.textContent = 'Restart';
  } else if (stepIndex === steps.length - 2) {
    nextBtn.textContent = 'Finish';
  } else {
    nextBtn.textContent = 'Next';
  }
}

function nextStep() {
  const steps = document.querySelectorAll('.step');
  const maxStep = steps.length - 1;

  if (step === maxStep) {
    step = 0;
    showStep(step);
    return;
  }

  if (step === maxStep - 1) {
    calculateAndDisplayVoltages();
  }

  step++;
  showStep(step);
}

function prevStep() {
  if (step > 0) step--;
  showStep(step);
}

function voltage(n, a, vo, memo = {}) {
  if (n in memo) return memo[n];
  if (n === 1) {
    memo[n] = (vo * a * a) / (1 + a + a * a);
  } else if (n === 0) {
    memo[n] = 0;
  } else {
    memo[n] = voltage(n - 1, a, vo, memo) * (1 + 1 / a) - voltage(n - 2, a, vo, memo) / a;
  }
  return memo[n];
}

function calculateVoltages(n, d, D, vo) {
  const a = Math.pow(D / d, 1/n);
  const results = [];
  for (let i = 1; i <= n; i++) {
    results.push(voltage(i, a, vo));
  }
  return results;
}

function calculateAndDisplayVoltages() {
  const n = parseInt(document.getElementById('n').value);
  const d = parseFloat(document.getElementById('d').value);
  const D = parseFloat(document.getElementById('D').value);
  const vo = parseFloat(document.getElementById('vo').value);

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '<h3>Voltage Results</h3>';

  if (isNaN(n) || isNaN(d) || isNaN(D) || isNaN(vo) || n <= 0 || d <= 0 || D <= 0 || vo <= 0) {
    outputDiv.innerHTML += '<p style="color:red;">⚠️ Please enter valid positive values for all fields.</p>';
    return;
  }

  const results = calculateVoltages(n, d, D, vo);
  results.forEach((voltage, index) => {
    const p = document.createElement('p');
    p.textContent = `Voltage at Sheath ${index + 1}: ${voltage.toFixed(2)} V`;
    outputDiv.appendChild(p);
  });
}

// Initialize first step
showStep(0);
