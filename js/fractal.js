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
  const controlsPanel = document.getElementById('controlsPanel');
  const footer = document.querySelector('.footer');
  const loadingComplete = document.getElementById('loadingComplete');
  const iterationsValue = document.getElementById('iterations-value');
  const zoomValue = document.getElementById('zoom-value');
  const loadingProgressBar = document.createElement('div');
  loadingProgressBar.className = 'loading-progress-bar';

  // Добавляем прогресс-бар
  const loadingProgress = document.createElement('div');
  loadingProgress.className = 'loading-progress';
  loadingProgress.appendChild(loadingProgressBar);
  loadingOverlay.appendChild(loadingProgress);

  // Кликабельная зона
  const clickArea = document.createElement('div');
  clickArea.className = 'click-area';
  document.body.appendChild(clickArea);

// Fractal parameters
let iterations = 50;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;

// Настройки для режима "Кинетическая живопись"
let paintingModeSettings = {
    colorPalette: 'Plasma',
    frequencyResponse: 0.5,
    amplitudeResponse: 0.3,
    baseColor: '#ff00ff',
    animationSpeed: 0.05,
};
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
// Mandelbrot algorithm
function mandelbrot(real, imag, maxIterations) {
    let x = 0;
    let y = 0;
    let iter = 0;
    
    // Динамическое изменение параметров под звук
    const hue = iter / maxIterations * 360;
    
    while (x * x + y * y < 4 && iter < maxIterations) {
        const xtemp = x * x - y * y + real;
        y = 2 * x * y + imag;
        x = xtemp;
        iter++;
    }
    
    if (iter === maxIterations) return '#000000';
    
    // Используем настройки из режима живописи
    const paletteHue = hue * paintingModeSettings.frequencyResponse;
    const paletteSaturation = 100;
    const paletteLightness = 50 + (iter / maxIterations) * 20;
    
    // Динамический цвет на основе звука
    const dynamicHue = (paletteHue + iter * paintingModeSettings.animationSpeed) % 360;
    return `hsl(${dynamicHue}, ${paletteSaturation}%, ${paletteLightness}%)`;
}
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
    fractalContainer.classList.remove('zoom-low', 'zoom-high');
    drawFractal();
    saveSettings();
    animateReset();
  });

  function animateReset() {
    fractalContainer.style.opacity = '0.5';
    setTimeout(() => {
      drawFractal();
      fractalContainer.style.opacity = '1';
    }, 300);
  }

  changeColorsBtn.addEventListener('click', function() {
    const colors = ['hsl(120, 100%, 50%)', 'hsl(240, 100%, 50%)', 'hsl(0, 100%, 50%)', 'hsl(300, 100%, 50%)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    alert(`Current color scheme: ${randomColor}`);
  });

  iterationsSlider.addEventListener('input', function() {
    iterations = parseInt(this.value);
    iterationsValue.textContent = iterations;
    drawFractal();
    saveSettings();
  });

  zoomSlider.addEventListener('input', function() {
    zoom = parseFloat(this.value);
    zoomValue.textContent = zoom.toFixed(1);
    drawFractal();
    saveSettings();
    updateFractalBackground();
  });

  function updateFractalBackground() {
    fractalContainer.classList.remove('zoom-low', 'zoom-high');
    if (zoom < 0.5) {
      fractalContainer.classList.add('zoom-low');
    } else {
      fractalContainer.classList.add('zoom-high');
    }
  }

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
    loadingOverlay.classList.remove('hidden');
    document.body.style.cursor = 'wait';
    loadingProgressBar.style.animation = 'progress 2s linear forwards';
    clickArea.classList.remove('active');
    document.body.style.overflow = 'hidden';
  }

  function hideLoading() {
    loadingOverlay.classList.add('hidden');
// Обновление настроек фрактала из режима живописи
function updateFractalFromPaintingMode(settings) {
    paintingModeSettings = settings;
    drawFractal();
}

// Инициализация режима живописи
const paintingMode = PaintingMode.init();
paintingMode.setFractalCallback(updateFractalFromPaintingMode);
    document.body.style.overflow = 'auto';
  }

  // Show loading complete message
  function showLoadingComplete() {
    loadingComplete.style.display = 'block';
    setTimeout(() => {
      loadingComplete.style.animation = 'fadeOut 1s ease-out forwards';
      setTimeout(() => {
        loadingComplete.style.display = 'none';
        clickArea.classList.add('active');
      }, 1000);
    }, 1500);
  }

  // Initialize with animations
  function initWithAnimations() {
    showLoading();
    setTimeout(() => {
      initCanvas();
      hideLoading();
      controlsPanel.classList.add('fade-in');
      footer.classList.add('fade-in');
      updateFractalBackground();
      showLoadingComplete();
    }, 1000);
  }

  // Initialize
  initWithAnimations();

  // Resize handler
  window.addEventListener('resize', function() {
    initCanvas();
    updateFractalBackground();
  });
// Инициализация кнопки режима живописи
const paintingModeBtn = document.getElementById('paintingModeBtn');
paintingModeBtn.textContent = 'Кинетическая живопись (Вкл)';
paintingModeBtn.addEventListener('click', function() {
    if (paintingModeBtn.textContent.includes('Вкл')) {
        paintingModeBtn.textContent = 'Кинетическая живопись (Выкл)';
        paintingMode.start();
        paintingMode.startAnimation();
    } else {
        paintingModeBtn.textContent = 'Кинетическая живопись (Вкл)';
        paintingMode.stop();
        paintingMode.stopAnimation();
    }
});
  // Touch events for mobile
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoom *= delta;
    zoomSlider.value = zoom;
    drawFractal();
    saveSettings();
    updateFractalBackground();
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

  // Mobile menu toggle
  document.getElementById('menuToggle').addEventListener('click', function() {
    controlsPanel.classList.toggle('active');
  });

  // Кликабельная зона для взаимодействия
  clickArea.addEventListener('click', function() {
    alert('Tap to explore the fractal!');
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Прокрутка вниз
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > 100) {
      clickArea.classList.remove('active');
    }
  });
});