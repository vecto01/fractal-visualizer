document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const canvas = document.getElementById('fractalCanvas');
  const ctx = canvas.getContext('2d');
  const fractalContainer = document.getElementById('fractalContainer');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const resetViewBtn = document.getElementById('resetView');
  const changeColorsBtn = document.getElementById('changeColors');
  const iterationsSlider = document.getElementById('iterations');
  const zoomSlider = document.getElementById('zoom');
  const themeToggle = document.getElementById('themeToggle');
  const controlsPanel = document.querySelector('.controls-panel');
  const footer = document.querySelector('.footer');

  // Fractal parameters
  let iterations = 50;
  let zoom = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isAnimating = false;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.body.setAttribute('data-theme', currentTheme);

  // Check for saved fractal settings
  const savedIterations = localStorage.getItem('iterations');
  const savedZoom = localStorage.getItem('zoom');
  if (savedIterations) iterations = parseInt(savedIterations);
  if (savedZoom) zoom = parseFloat(savedZoom);

  // Initialize canvas
  function initCanvas() {
    const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
    canvas.width = size;
    canvas.height = size;
    fractalContainer.style.width = `${size}px`;
    fractalContainer.style.height = `${size}px`;
    drawFractal();
  }

  // Draw Mandelbrot fractal
  function drawFractal() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 3.5 / zoom;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const real = scale * (x - centerX) / centerX + offsetX;
        const imag = scale * (y - centerY) / centerY + offsetY;
        const color = mandelbrot(real, imag, iterations);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // Mandelbrot algorithm
  function mandelbrot(real, imag, maxIterations) {
    let x = 0;
    let y = 0;
    let iter = 0;
    while (x * x + y * y < 4 && iter < maxIterations) {
      const xtemp = x * x - y * y + real;
      y = 2 * x * y + imag;
      x = xtemp;
      iter++;
    }
    if (iter === maxIterations) return '#000000';

    const hue = iter / maxIterations * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }

  // Event listeners
  resetViewBtn.addEventListener('click', function() {
    offsetX = 0;
    offsetY = 0;
    zoom = 1;
    iterationsSlider.value = 50;
    zoomSlider.value = 1;
    drawFractal();
    saveSettings();
    animateReset();
  });

  function animateReset() {
    const originalOpacity = 1;
    fractalContainer.style.opacity = '0.5';
    setTimeout(() => {
      drawFractal();
      fractalContainer.style.opacity = originalOpacity;
    }, 300);
  }

  changeColorsBtn.addEventListener('click', function() {
    const colors = ['hsl(120, 100%, 50%)', 'hsl(240, 100%, 50%)', 'hsl(0, 100%, 50%)', 'hsl(300, 100%, 50%)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    alert(`Current color scheme: ${randomColor}`);
    // TODO: Implement actual color scheme change
  });

  iterationsSlider.addEventListener('input', function() {
    iterations = parseInt(this.value);
    drawFractal();
    saveSettings();
  });

  zoomSlider.addEventListener('input', function() {
    zoom = parseFloat(this.value);
    drawFractal();
    saveSettings();
  });

  // Mouse and touch events for zooming
  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('touchstart', startDrag);
  canvas.addEventListener('mousemove', drag);
  canvas.addEventListener('touchmove', drag);
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('touchend', endDrag);

  let isDragging = false;
  let startX, startY;
  let startOffsetX, startOffsetY;

  function startDrag(e) {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;
    startOffsetX = offsetX;
    startOffsetY = offsetY;
    e.preventDefault();
  }

  function drag(e) {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX || e.touches[0].clientX;
    const currentY = e.clientY || e.touches[0].clientY;
    offsetX = startOffsetX + (currentX - startX) / 1000;
    offsetY = startOffsetY + (currentY - startY) / 1000;
    drawFractal();
  }

  function endDrag() {
    isDragging = false;
  }

  // Theme toggle
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Save settings
  function saveSettings() {
    localStorage.setItem('iterations', iterations);
    localStorage.setItem('zoom', zoom);
  }

  // Loading overlay
  function showLoading() {
    loadingOverlay.classList.add('show');
    loadingOverlay.classList.remove('hidden');
    document.body.style.cursor = 'wait';
  }

  function hideLoading() {
    loadingOverlay.classList.remove('show');
    loadingOverlay.classList.add('hidden');
    document.body.style.cursor = '';
  }

  // Initialize with animations
  function initWithAnimations() {
    showLoading();
    setTimeout(() => {
      initCanvas();
      hideLoading();
      controlsPanel.classList.add('fade-in');
      footer.classList.add('fade-in');
      setTimeout(() => {
        document.body.style.overflow = 'auto';
      }, 500);
    }, 1000);
  }

  // Initialize
  initWithAnimations();

  // Resize handler
  window.addEventListener('resize', function() {
    initCanvas();
  });

  // Touch events for mobile
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoom *= delta;
    zoomSlider.value = zoom;
    drawFractal();
    saveSettings();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
      offsetY -= 0.01;
      drawFractal();
    } else if (e.key === 'ArrowDown') {
      offsetY += 0.01;
      drawFractal();
    } else if (e.key === 'ArrowLeft') {
      offsetX -= 0.01;
      drawFractal();
    } else if (e.key === 'ArrowRight') {
      offsetX += 0.01;
      drawFractal();
    }
  });
});