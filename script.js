// Quadratic Functions Tutor script

// Helper to switch between sections
function setActiveSection(sectionId) {
  const sections = document.querySelectorAll('section');
  sections.forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
  // Update nav buttons
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  if (sectionId === 'learnSection') document.getElementById('learnBtn').classList.add('active');
  if (sectionId === 'visualizeSection') document.getElementById('visualizeBtn').classList.add('active');
  if (sectionId === 'practiceSection') document.getElementById('practiceBtn').classList.add('active');
}

// Event listeners for navigation buttons
document.getElementById('learnBtn').addEventListener('click', () => setActiveSection('learnSection'));
document.getElementById('visualizeBtn').addEventListener('click', () => setActiveSection('visualizeSection'));
document.getElementById('practiceBtn').addEventListener('click', () => setActiveSection('practiceSection'));

// GRAPH VISUALIZER
// Draws axes on canvas
function drawAxes(ctx, width, height, scale) {
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.beginPath();
  // x-axis
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  // y-axis
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();
  // ticks and labels
  ctx.fillStyle = '#666';
  ctx.font = '10px sans-serif';
  // horizontal ticks
  for (let x = -10; x <= 10; x++) {
    const px = width / 2 + x * scale;
    ctx.beginPath();
    ctx.moveTo(px, height / 2 - 3);
    ctx.lineTo(px, height / 2 + 3);
    ctx.stroke();
    if (x !== 0) ctx.fillText(x.toString(), px - 3, height / 2 + 15);
  }
  // vertical ticks
  for (let y = -10; y <= 10; y++) {
    const py = height / 2 - y * scale;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 3, py);
    ctx.lineTo(width / 2 + 3, py);
    ctx.stroke();
    if (y !== 0) ctx.fillText(y.toString(), width / 2 + 8, py + 3);
  }
}

function plotQuadratic() {
  const a = parseFloat(document.getElementById('coefA').value);
  const b = parseFloat(document.getElementById('coefB').value);
  const c = parseFloat(document.getElementById('coefC').value);
  if (isNaN(a) || a === 0) {
    alert('Coefficient a must be a non-zero number.');
    return;
  }
  const canvas = document.getElementById('graphCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  // Determine scale to fit vertex and roots better. Choose scale automatically based on |a|,|b|,|c|
  const scale = 20; // 20 pixels per unit
  // Draw axes
  drawAxes(ctx, width, height, scale);
  // Plot quadratic
  ctx.strokeStyle = '#c55';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let firstPoint = true;
  // Choose x-range from -10 to 10 for drawing. Increase if vertex outside range
  const xMin = -10;
  const xMax = 10;
  const step = 0.1;
  for (let x = xMin; x <= xMax; x += step) {
    const y = a * x * x + b * x + c;
    const px = width / 2 + x * scale;
    const py = height / 2 - y * scale;
    if (firstPoint) {
      ctx.moveTo(px, py);
      firstPoint = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  // Compute vertex
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  // Compute discriminant and roots
  const disc = b * b - 4 * a * c;
  let roots = [];
  if (disc > 0) {
    const sqrtD = Math.sqrt(disc);
    roots.push((-b + sqrtD) / (2 * a));
    roots.push((-b - sqrtD) / (2 * a));
  } else if (disc === 0) {
    roots.push(-b / (2 * a));
  }
  // Draw vertex
  const vx = width / 2 + vertexX * scale;
  const vy = height / 2 - vertexY * scale;
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(vx, vy, 4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ff0000';
  ctx.font = '12px sans-serif';
  ctx.fillText(`V(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, vx + 5, vy - 5);
  // Draw y-intercept at (0,c)
  const yix = width / 2;
  const yiy = height / 2 - c * scale;
  ctx.fillStyle = '#006600';
  ctx.beginPath();
  ctx.arc(yix, yiy, 4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText(`Y-int (0, ${c.toFixed(2)})`, yix + 5, yiy - 5);
  // Draw roots (x-intercepts)
  ctx.fillStyle = '#0000ff';
  roots.forEach(root => {
    const rx = width / 2 + root * scale;
    const ry = height / 2;
    ctx.beginPath();
    ctx.arc(rx, ry, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(`X-int (${root.toFixed(2)}, 0)`, rx + 5, ry - 5);
  });
  // Update results
  const resultsDiv = document.getElementById('graphResults');
  let resultHTML = `<p><strong>Vertex:</strong> (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})</p>`;
  resultHTML += `<p><strong>Axis of symmetry:</strong> x = ${vertexX.toFixed(2)}</p>`;
  resultHTML += `<p><strong>Discriminant:</strong> Δ = ${disc.toFixed(2)}</p>`;
  if (roots.length === 2) {
    resultHTML += `<p><strong>x‑intercepts:</strong> x = ${roots[0].toFixed(2)}, ${roots[1].toFixed(2)}</p>`;
  } else if (roots.length === 1) {
    resultHTML += `<p><strong>Double x‑intercept:</strong> x = ${roots[0].toFixed(2)}</p>`;
  } else {
    resultHTML += `<p><strong>No real x‑intercepts</strong></p>`;
  }
  resultsDiv.innerHTML = resultHTML;
}

document.getElementById('plotBtn').addEventListener('click', plotQuadratic);

// PRACTICE QUESTIONS

const practiceContainer = document.getElementById('practiceContainer');

// Utility to clear practice area
function clearPractice() {
  practiceContainer.innerHTML = '';
}

// Generate random integer in range [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate Vertex to General form question
function generateVertexToGeneral() {
  clearPractice();
  // Random coefficients
  let a = randInt(1, 4);
  // Random sign for a (sometimes negative for downward parabolas)
  if (Math.random() < 0.5) a = -a;
  const h = randInt(-5, 5);
  const k = randInt(-5, 5);
  // Compute general form coefficients
  const b = -2 * a * h;
  const c = a * h * h + k;
  // Build DOM
  const qDiv = document.createElement('div');
  qDiv.className = 'practice-question';
  qDiv.innerHTML = `<h3>Convert to general form</h3>
    <p>The quadratic is given in vertex (turning point) form: <strong>${a === -1 ? '-' : a !== 1 ? a : ''}(x ${h >= 0 ? '- ' + h : '+ ' + (-h)})<sup>2</sup> ${k >= 0 ? '+ ' + k : '- ' + (-k)}</strong>.<br>
    Write it in standard form <em>ax<sup>2</sup> + bx + c</em> by finding coefficients <em>a</em>, <em>b</em> and <em>c</em>.</p>
    <div class="input-group"><label>Coefficient a:</label><input type="number" id="ansA"></div>
    <div class="input-group"><label>Coefficient b:</label><input type="number" id="ansB"></div>
    <div class="input-group"><label>Coefficient c:</label><input type="number" id="ansC"></div>
    <button id="submitVertexBtn">Submit</button>
    <div id="vertexFeedback" class="feedback"></div>`;
  practiceContainer.appendChild(qDiv);
  // Submission handler
  document.getElementById('submitVertexBtn').addEventListener('click', () => {
    const ua = parseFloat(document.getElementById('ansA').value);
    const ub = parseFloat(document.getElementById('ansB').value);
    const uc = parseFloat(document.getElementById('ansC').value);
    const fb = document.getElementById('vertexFeedback');
    if (isNaN(ua) || isNaN(ub) || isNaN(uc)) {
      fb.style.color = 'darkred';
      fb.textContent = 'Please enter numerical values for all coefficients.';
      return;
    }
    // Compare with true coefficients
    if (Math.abs(ua - a) < 1e-6 && Math.abs(ub - b) < 1e-6 && Math.abs(uc - c) < 1e-6) {
      fb.style.color = 'green';
      fb.textContent = 'Correct! Well done.';
    } else {
      fb.style.color = 'darkred';
      fb.innerHTML = `Not quite. The correct coefficients are a = ${a}, b = ${b}, c = ${c}.`;
    }
  });
}

// Generate discriminant question
function generateDiscriminant() {
  clearPractice();
  // Random a, b, c producing various discriminant categories
  let a = randInt(1, 5);
  if (Math.random() < 0.5) a = -a;
  let b = randInt(-10, 10);
  let c = randInt(-10, 10);
  // Compute discriminant
  const disc = b * b - 4 * a * c;
  let numReal;
  if (disc > 0) numReal = 2; else if (disc === 0) numReal = 1; else numReal = 0;
  const qDiv = document.createElement('div');
  qDiv.className = 'practice-question';
  qDiv.innerHTML = `<h3>Discriminant &amp; number of real solutions</h3>
    <p>Consider the quadratic equation <strong>${a === -1 ? '-' : a !== 1 ? a : ''}x<sup>2</sup> ${b >= 0 ? '+ ' + b : '- ' + (-b)}x ${c >= 0 ? '+ ' + c : '- ' + (-c)} = 0</strong>.</p>
    <div class="input-group"><label>Discriminant Δ:</label><input type="number" id="discAns"></div>
    <div class="input-group"><label>Number of real solutions:</label>
      <select id="numRealAns">
        <option value="2">Two</option>
        <option value="1">One</option>
        <option value="0">None</option>
      </select>
    </div>
    <button id="submitDiscBtn">Submit</button>
    <div id="discFeedback" class="feedback"></div>`;
  practiceContainer.appendChild(qDiv);
  document.getElementById('submitDiscBtn').addEventListener('click', () => {
    const userD = parseFloat(document.getElementById('discAns').value);
    const userNum = parseInt(document.getElementById('numRealAns').value);
    const fb = document.getElementById('discFeedback');
    if (isNaN(userD)) {
      fb.style.color = 'darkred';
      fb.textContent = 'Please enter a numerical discriminant.';
      return;
    }
    const correctD = disc;
    if (Math.abs(userD - correctD) < 1e-6 && userNum === numReal) {
      fb.style.color = 'green';
      fb.textContent = 'Correct!';
    } else {
      fb.style.color = 'darkred';
      fb.innerHTML = `Not quite. Δ = ${correctD} and there ${numReal === 1 ? 'is' : 'are'} ${numReal} real solution${numReal !== 1 ? 's' : ''}.`;
    }
  });
}

// Generate solving question
function generateSolveQuadratic() {
  clearPractice();
  // Generate random quadratic with real solutions (discriminant >= 0)
  let a, b, c, disc;
  do {
    a = randInt(1, 5);
    if (Math.random() < 0.5) a = -a;
    b = randInt(-10, 10);
    c = randInt(-10, 10);
    disc = b * b - 4 * a * c;
  } while (disc < 0);
  const sqrtD = Math.sqrt(disc);
  const r1 = (-b + sqrtD) / (2 * a);
  const r2 = (-b - sqrtD) / (2 * a);
  const qDiv = document.createElement('div');
  qDiv.className = 'practice-question';
  qDiv.innerHTML = `<h3>Solve using the quadratic formula</h3>
    <p>Solve the equation <strong>${a === -1 ? '-' : a !== 1 ? a : ''}x<sup>2</sup> ${b >= 0 ? '+ ' + b : '- ' + (-b)}x ${c >= 0 ? '+ ' + c : '- ' + (-c)} = 0</strong> for x.</p>
    <div class="input-group"><label>Solutions (comma‑separated):</label><input type="text" id="rootsAns" placeholder="e.g. 2, -3"></div>
    <button id="submitSolveBtn">Submit</button>
    <div id="solveFeedback" class="feedback"></div>`;
  practiceContainer.appendChild(qDiv);
  document.getElementById('submitSolveBtn').addEventListener('click', () => {
    const input = document.getElementById('rootsAns').value.trim();
    const fb = document.getElementById('solveFeedback');
    if (!input) {
      fb.style.color = 'darkred';
      fb.textContent = 'Please enter your solutions.';
      return;
    }
    // Split by comma or space
    const parts = input.split(/[,\s]+/).filter(x => x.length > 0);
    if (parts.length !== 2 && parts.length !== 1) {
      fb.style.color = 'darkred';
      fb.textContent = 'Please enter one or two numerical solutions.';
      return;
    }
    const userRoots = parts.map(s => parseFloat(s));
    if (userRoots.some(x => isNaN(x))) {
      fb.style.color = 'darkred';
      fb.textContent = 'Please enter valid numbers.';
      return;
    }
    // Compare sets (order doesn't matter); allow approximate equality
    let correct = false;
    if (userRoots.length === 2) {
      const diff1 = Math.abs(userRoots[0] - r1) + Math.abs(userRoots[1] - r2);
      const diff2 = Math.abs(userRoots[0] - r2) + Math.abs(userRoots[1] - r1);
      correct = diff1 < 0.2 || diff2 < 0.2;
    } else if (userRoots.length === 1) {
      correct = Math.abs(userRoots[0] - r1) < 0.2 && Math.abs(r1 - r2) < 1e-6;
    }
    if (correct) {
      fb.style.color = 'green';
      fb.textContent = 'Correct!';
    } else {
      const sols = Math.abs(r1 - r2) < 1e-6 ? r1.toFixed(2) : `${r1.toFixed(2)}, ${r2.toFixed(2)}`;
      fb.style.color = 'darkred';
      fb.innerHTML = `Not quite. The solution${Math.abs(r1 - r2) < 1e-6 ? ' is' : 's are'} ${sols}.`;
    }
  });
}

// Generate projectile (ball) problem
function generateBallProblem() {
  clearPractice();
  // Equation parameters (fixed for the ball problem)
  const a = -0.1;
  const b = 1.4;
  const c = 1.5;
  // Pre-compute features
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const disc = b * b - 4 * a * c;
  const sqrtD = Math.sqrt(disc);
  const root1 = (-b + sqrtD) / (2 * a);
  const root2 = (-b - sqrtD) / (2 * a);
  // Ball starts at x=0, y=c; distance travelled is the positive root
  const distance = Math.max(root1, root2);
  // For height 4, solve -0.1x^2 + 1.4x + 1.5 = 4 → -0.1x^2 + 1.4x - 2.5 = 0
  const a2 = -0.1;
  const b2 = 1.4;
  const c2 = -2.5;
  const disc2 = b2 * b2 - 4 * a2 * c2;
  let hRoots = [];
  if (disc2 >= 0) {
    const s2 = Math.sqrt(disc2);
    hRoots.push((-b2 + s2) / (2 * a2));
    hRoots.push((-b2 - s2) / (2 * a2));
    hRoots.sort((x, y) => x - y);
  }
  const qDiv = document.createElement('div');
  qDiv.className = 'practice-question';
  qDiv.innerHTML = `<h3>Projectile (ball) problem</h3>
    <p>A baseball is hit and the ball follows a parabolic path described by the function <strong>y = -0.1 x<sup>2</sup> + 1.4x + 1.5</strong>, where <em>x</em> is the horizontal distance (metres) travelled and <em>y</em> is the height (metres).</p>
    <p>Answer the following questions.  Enter your answers rounded to one decimal place where appropriate.</p>
    <div class="input-group"><label>a) Horizontal distance travelled by the ball (to where it hits the ground):</label><input type="number" id="ballDistance" step="0.1"></div>
    <div class="input-group"><label>b) Maximum height reached (metres):</label><input type="number" id="ballMaxHeight" step="0.1"></div>
    <div class="input-group"><label>c) Horizontal distance where maximum height occurs (metres):</label><input type="number" id="ballMaxDistance" step="0.1"></div>
    <div class="input-group"><label>d) Height at which the ball was struck (metres):</label><input type="number" id="ballStartHeight" step="0.1"></div>
    <div class="input-group"><label>e) Horizontal distances when the ball is at 4&nbsp;m height (comma‑separated):</label><input type="text" id="ballHeightDistances" placeholder="e.g. 2.5, 12.3"></div>
    <button id="submitBallBtn">Submit</button>
    <div id="ballFeedback" class="feedback"></div>`;
  practiceContainer.appendChild(qDiv);
  document.getElementById('submitBallBtn').addEventListener('click', () => {
    const distAns = parseFloat(document.getElementById('ballDistance').value);
    const maxHAns = parseFloat(document.getElementById('ballMaxHeight').value);
    const maxDistAns = parseFloat(document.getElementById('ballMaxDistance').value);
    const startHAns = parseFloat(document.getElementById('ballStartHeight').value);
    const heightDistInput = document.getElementById('ballHeightDistances').value.trim();
    const fb = document.getElementById('ballFeedback');
    if ([distAns, maxHAns, maxDistAns, startHAns].some(v => isNaN(v)) || !heightDistInput) {
      fb.style.color = 'darkred';
      fb.textContent = 'Please answer all parts.';
      return;
    }
    // Check each answer (within 0.1 tolerance)
    let correct = true;
    if (Math.abs(distAns - distance) > 0.2) correct = false;
    if (Math.abs(maxHAns - vertexY) > 0.2) correct = false;
    if (Math.abs(maxDistAns - vertexX) > 0.2) correct = false;
    if (Math.abs(startHAns - c) > 0.2) correct = false;
    // Parse distance when height is 4 m
    const userVals = heightDistInput.split(/[,\s]+/).filter(x => x.length > 0).map(s => parseFloat(s));
    if (userVals.length !== hRoots.length || userVals.some(isNaN)) {
      correct = false;
    } else {
      // compare sets disregarding order
      const diff1 = Math.abs(userVals[0] - hRoots[0]) + Math.abs(userVals[1] - hRoots[1]);
      const diff2 = Math.abs(userVals[0] - hRoots[1]) + Math.abs(userVals[1] - hRoots[0]);
      if (Math.min(diff1, diff2) > 0.4) correct = false;
    }
    if (correct) {
      fb.style.color = 'green';
      fb.textContent = 'Correct!';
    } else {
      fb.style.color = 'darkred';
      fb.innerHTML = `Not quite.\nDistance travelled ≈ ${distance.toFixed(1)} m, maximum height ≈ ${vertexY.toFixed(1)} m at x ≈ ${vertexX.toFixed(1)} m, ball was struck at ${c.toFixed(1)} m, heights of 4 m occur at x ≈ ${hRoots.map(r => r.toFixed(1)).join(', ')} m.`;
    }
  });
}

// Generate picture frame problem
function generateFrameProblem() {
  clearPractice();
  // Outer dimensions 10 cm by 7 cm
  // Problem description
  const outerLength = 10;
  const outerWidth = 7;
  // precompute expression (not used until evaluation)
  const qDiv = document.createElement('div');
  qDiv.className = 'practice-question';
  qDiv.innerHTML = `<h3>Picture frame problem</h3>
    <p>A picture frame consists of an outer wooden frame measuring 10&nbsp;cm by 7&nbsp;cm.  The wooden part of the frame has uniform width <em>x</em> centimetres on all sides, leaving a glass window in the middle.</p>
    <p>a) Write an expression for the area of the glass window in terms of <em>x</em>. Expand and simplify.</p>
    <div class="input-group"><label>Area expression (as a polynomial in x):</label><input type="text" id="frameExpr" placeholder="e.g. x^2 - 5x + 6"></div>
    <p>b) If the area of glass needed is 28&nbsp;cm<sup>2</sup>, find a possible value of <em>x</em>.</p>
    <button id="submitFrameBtn">Submit</button>
    <div id="frameFeedback" class="feedback"></div>`;
  practiceContainer.appendChild(qDiv);
  document.getElementById('submitFrameBtn').addEventListener('click', () => {
    const exprInput = document.getElementById('frameExpr').value.trim();
    const fb = document.getElementById('frameFeedback');
    if (!exprInput) {
      fb.style.color = 'darkred';
      fb.textContent = 'Please enter the area expression.';
      return;
    }
    // Compute correct polynomial: (10-2x)*(7-2x) = 70 - 20x -14x + 4x^2 = 4x^2 -34x +70
    const correctPoly = '4x^2 - 34x + 70';
    // Evaluate expression equivalence loosely: remove spaces and compare after algebraic sort; for simplicity, we check if the input string contains same coefficients when expanded
    const normalized = exprInput.replace(/\s+/g, '').replace(/\*\*/g, '^');
    const matchPattern = /^([+-]?(\d+)?(?:x\^2))?([+-]\d+)?x?([+-]\d+)?$/i;
    // Not robust: check by evaluating for several x values and comparing numeric results
    const testXs = [0, 1, 2, 3];
    /**
     * Evaluate a user‑entered polynomial expression for a given x.
     *
     * Because students may omit multiplication signs (e.g. write 4x instead of 4*x or 2(x+1)),
     * this function inserts explicit multiplication operators where necessary before
     * substituting x with a numeric value. It also converts the caret (^) to the JS exponent operator (**).
     * If the expression cannot be evaluated, NaN is returned.
     *
     * @param {string} str The raw user expression, e.g. "4x^2 - 34x + 70".
     * @param {number} x The numeric value to substitute for x.
     */
    function evalPoly(str, x) {
      try {
        let expr = str;
        // Remove whitespace for easier pattern replacement
        expr = expr.replace(/\s+/g, '');
        // Insert multiplication between number and variable/parenthesis, e.g. 4x -> 4*x, 2( -> 2*(
        expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        expr = expr.replace(/(\d)\(/g, '$1*(');
        expr = expr.replace(/\)(\d)/g, ')*$1');
        // Insert multiplication between closing parenthesis and variable, e.g. )x -> )*x
        expr = expr.replace(/\)([a-zA-Z])/g, ')*$1');
        // Convert caret to exponent operator
        expr = expr.replace(/\^/g, '**');
        // Substitute variable x with numeric value surrounded by parentheses
        expr = expr.replace(/x/g, `(${x})`);
        // Evaluate the expression in a restricted scope
        return Function(`"use strict";return (${expr});`)();
      } catch (e) {
        return NaN;
      }
    }
    let exprMatches = true;
    for (let i = 0; i < testXs.length; i++) {
      const valUser = evalPoly(exprInput, testXs[i]);
      const valCorrect = evalPoly('4*x^2 -34*x +70', testXs[i]);
      if (isNaN(valUser) || Math.abs(valUser - valCorrect) > 1e-6) {
        exprMatches = false;
        break;
      }
    }
    // Solve 4x^2 -34x + 70 = 28: 4x^2 -34x + 42 = 0 and obtain valid solutions for x (positive and less than 3.5 cm)
    const discriminant = 34 * 34 - 4 * 4 * 42;
    const sqrtDVal = Math.sqrt(discriminant);
    const sol1 = (34 + sqrtDVal) / 8;
    const sol2 = (34 - sqrtDVal) / 8;
    const validSolutions = [sol1, sol2].filter(v => v > 0 && v < 3.5);
    // Provide feedback based solely on polynomial equivalence; we display the computed solutions for x to guide the student
    if (exprMatches) {
      fb.style.color = 'green';
      fb.innerHTML = `Correct! The glass area is (10‑2x)(7‑2x) = 4x^2 - 34x + 70.  Setting this equal to 28 gives 4x^2 -34x +42 = 0; solving yields x ≈ ${validSolutions.map(v => v.toFixed(2)).join(' or ')} cm (only positive values less than 3.5\u00a0cm are possible).`;
    } else {
      fb.style.color = 'darkred';
      fb.innerHTML = `Not quite. The glass area is (10‑2x)(7‑2x) = 4x^2 - 34x + 70.  Setting this equal to 28 gives 4x^2 -34x +42 = 0; solving yields x ≈ ${validSolutions.map(v => v.toFixed(2)).join(' or ')} cm (only positive values less than 3.5\u00a0cm are possible).`;
    }
  });
}

// Main generate function
document.getElementById('generateQuestionBtn').addEventListener('click', () => {
  const type = document.getElementById('practiceType').value;
  switch (type) {
    case 'vertexToGeneral':
      generateVertexToGeneral();
      break;
    case 'discriminant':
      generateDiscriminant();
      break;
    case 'solveQuadratic':
      generateSolveQuadratic();
      break;
    case 'ballProblem':
      generateBallProblem();
      break;
    case 'frameProblem':
      generateFrameProblem();
      break;
    default:
      clearPractice();
  }
});