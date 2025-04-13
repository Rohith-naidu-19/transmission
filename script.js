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
    const denom = Math.pow(a, n + 1) - 1;
    memo[n] = denom !== 0
      ? (vo * Math.pow(a, n) * (a - 1)) / denom
      : 0;
  } else if (n === 0) {
    memo[n] = 0;
  } else {
    const prev1 = voltage(n - 1, a, vo, memo);
    const prev2 = voltage(n - 2, a, vo, memo);
    memo[n] = prev1 * (1 + 1 / a) - prev2 / a;
  }

  return memo[n];
}

function calculateVoltages(n, d, D, vo) {
  console.log('Inputs:', { n, d, D, vo });

  if (d === 0 || D === 0 || n <= 0 || isNaN(d) || isNaN(D) || isNaN(n)) {
    console.error("Invalid input values for calculating 'a'.");
    return [];
  }

  const a = Math.pow(D / d, 1 / (n + 1));
  console.log('Calculated a:', a);

  const results = [];
  for (let i = 1; i <= n; i++) {
    const v = voltage(i, a, vo);
    console.log(`Voltage at sheath ${i}:`, v);
    results.push(v);
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

  if (isNaN(n) || isNaN(d) || isNaN(D) || isNaN(vo) ||
      n <= 0 || d <= 0 || D <= 0 || vo <= 0) {
    outputDiv.innerHTML += '<p style="color:red;">⚠️ Please enter valid positive values for all fields.</p>';
    return;
  }

  const results = calculateVoltages(n, d, D, vo);
  if (results.length === 0) {
    outputDiv.innerHTML += '<p style="color:red;">⚠️ Could not calculate voltages. Check your inputs.</p>';
    return;
  }

  results.forEach((v, index) => {
    const p = document.createElement('p');
    p.textContent = `Voltage at Sheath ${index + 1}: ${v.toFixed(2)} V`;
    outputDiv.appendChild(p);
  });
}

// Initialize first step
showStep(0);
