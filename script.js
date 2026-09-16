// ===== Fractal Visualizer =====

// DOM Elements
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('themeToggle');
const iterationsSlider = document.getElementById('iterationsSlider');
const zoomSlider = document.getElementById('zoomSlider');
const resetButton = document.getElementById('resetButton');
const iterationsValue = document.getElementById('iterationsValue');
const zoomValue = document.getElementById('zoomValue');
const loadingScreen = document.getElementById('loadingScreen');
const fractalContainer = document.querySelector('.fractal-container');
const controlsPanel = document.getElementById('controlsPanel');

// Fractal Settings
let iterations = 50;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;

// Cache for fractal rendering
const fractalCache = new Map();

// Vibration function for mobile devices
function vibrate() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // Vibrate for 50 milliseconds
  }
}

// DOM Event Listeners
iterationsSlider.addEventListener('input', () => {
  iterations = parseInt(iterationsSlider.value);
  iterationsValue.textContent = iterations;
  renderFractal();
  vibrate();
});

zoomSlider.addEventListener('input', () => {
  zoom = parseFloat(zoomSlider.value);
  zoomValue.textContent = zoom.toFixed(1);
  renderFractal();
  vibrate();
});

resetButton.addEventListener('click', () => {
  offsetX = 0;
  offsetY = 0;
  renderFractal();
  vibrate();
});

// Mouse and touch events for dragging
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  vibrate();
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = (e.clientX - lastMouseX) * 0.005;
  const dy = (e.clientY - lastMouseY) * 0.005;
  offsetX += dx;
  offsetY += dy;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  renderFractal();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY * 0.001;
  zoom = Math.max(0.1, Math.min(2, zoom - delta));
  zoomSlider.value = zoom;
  zoomValue.textContent = zoom.toFixed(1);
  renderFractal();
  vibrate();
});

// Keyboard navigation
canvas.addEventListener('keydown', (e) => {
  const step = 0.01;

  switch (e.key) {
    case 'ArrowUp':
      offsetY -= step;
      vibrate();
      break;
    case 'ArrowDown':
      offsetY += step;
      vibrate();
      break;
    case 'ArrowLeft':
      offsetX -= step;
      vibrate();
      break;
    case 'ArrowRight':
      offsetX += step;
      vibrate();
      break;
    case '+':
    case '=':
      zoom = Math.min(2, zoom + 0.1);
      vibrate();
      break;
    case '-':
      zoom = Math.max(0.1, zoom - 0.1);
      vibrate();
      break;
    case 'r':
      offsetX = 0;
      offsetY = 0;
      vibrate();
      break;
  }

  // Update sliders
  zoomSlider.value = zoom;
  zoomValue.textContent = zoom.toFixed(1);
  renderFractal();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  vibrate();
});

// Lazy loading with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      renderFractal();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Initialize fractal
function initFractal() {
  const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
  canvas.width = size;
  canvas.height = size;
  observer.observe(canvas); // Observe canvas for lazy loading
  renderFractal();
}

// Render fractal with caching
function renderFractal() {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // Mandelbrot set rendering logic
  const centerX = -0.5;
  const centerY = 0;
  const pixelSize = 3.5 / zoom;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const real = (x - width / 2) * pixelSize + centerX + offsetX;
      const imag = (y - height / 2) * pixelSize + centerY + offsetY;
      const key = `${real},${imag},${iterations}`;
      
      if (fractalCache.has(key)) {
        const color = fractalCache.get(key);
        ctx.fillStyle = `hsl(${color}, 100%, 50%)`;
      } else {
        const color = mandelbrot(real, imag, iterations);
        fractalCache.set(key, color);
        ctx.fillStyle = `hsl(${color}, 100%, 50%)`;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// Mandelbrot set algorithm
function mandelbrot(cx, cy, maxIter) {
  let x = 0;
  let y = 0;
  let iter = 0;

  while (x * x + y * y < 4 && iter < maxIter) {
    const temp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = temp;
    iter++;
  }

  if (iter === maxIter) return 0;
  return iter;
}

// Loading screen
function hideLoadingScreen() {
  loadingScreen.style.display = 'none';
  fractalContainer.style.opacity = 1;
  controlsPanel.style.opacity = 1;
  setTimeout(() => {
    const loadingComplete = document.createElement('div');
    loadingComplete.className = 'loading-complete';
    loadingComplete.textContent = 'Ready!';
    loadingScreen.appendChild(loadingComplete);
  }, 500);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
} else if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
}

// Initialize
window.addEventListener('load', () => {
  initFractal();
  setTimeout(hideLoadingScreen, 1000);
});

// Resize handler
window.addEventListener('resize', () => {
  initFractal();
});