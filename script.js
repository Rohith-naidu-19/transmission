let step = 0;
const images = [
  'images/a.jpg', 'images/b.jpg', 'images/c.jpg',
  'images/d.jpg', 'images/e.jpg', 'images/done.png'
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

function voltage(n, a,a1, vo, memo = {}) {
  if (n in memo) return memo[n];
  if (n === 1) {
    memo[n] = a1;
  } else if (n === 0) {
    memo[n] = 0;
  } else {
    memo[n] = voltage(n - 1, a,a1, vo, memo) * (1 + 1 / a) - voltage(n - 2, a,a1, vo, memo) / a;
  }
  return memo[n];
}

function calculateVoltages(n, d, D, vo) {
  const a = Math.pow(D / d, 1/(n+1));
  const a1= (vo *Math.pow(a, n)*(a-1)) / (Math.pow(a, n+1)-1);
  const results = [];
  for (let i = 1; i <= n; i++) {
    results.push(voltage(i, a, a1, vo));
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
  const a = Math.pow(D / d, 1 / (n + 1));

  results.forEach((voltage, index) => {
    const rn = (D / 2) /   Math.pow(a, index + 1); // rₙ for current sheath
    const p = document.createElement('p');
    p.textContent = `Sheath ${index + 1}: Voltage = ${voltage.toFixed(2)} KV, at radius= ${rn.toFixed(5)} cm`;
    outputDiv.appendChild(p);
  });

    // --- Add Potential Gradient Summary Section ---
    const lnA = Math.log(a);
    const denom = (d / 2) * lnA;
  
    const gradientWithout = vo / ((n + 1) * denom);
    const gradientWith = (vo * (a - 1)) / ((Math.pow(a, n + 1) - 1) * denom);
  
    const gradientSection = document.createElement('div');
    gradientSection.innerHTML = `
      <h3 style="margin-top: 20px;">Potential Gradient </h3>
      <p>Without Intersheath: ${gradientWithout.toFixed(2)} KV/cm</p>
      <p>With Intersheath   : ${gradientWith.toFixed(2)} KV/cm</p>
    `;
  
    outputDiv.appendChild(gradientSection);
  
}


// Initialize first step
showStep(0);
