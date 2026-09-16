// ===== Параметры фрактала =====
const fractalParams = {
  width: 800,
  height: 600,
  maxIterations: 100,
  zoom: 1,
  xOffset: 0,
  yOffset: 0,
  colorScheme: 'classic',
  isAnimating: false,
  animationFrameId: null,
};

// ===== Элементы DOM =====
const canvas = document.getElementById('fractal-canvas');
const ctx = canvas.getContext('2d');
const loadingElement = document.getElementById('loading');
const fractalContainer = document.getElementById('fractal-container');
const iterationsSlider = document.getElementById('iterations');
const colorSchemeSelect = document.getElementById('color-scheme');
const exportBtn = document.getElementById('export-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// ===== Инициализация канвы =====
function initCanvas() {
  canvas.width = fractalParams.width;
  canvas.height = fractalParams.height;
  drawFractal();
}

// ===== Рендеринг фрактала =====
function drawFractal() {
  const iterations = parseInt(iterationsSlider.value);
  const colorScheme = colorSchemeSelect.value;
  const { width, height } = canvas;

  // Очистка канвы
  ctx.clearRect(0, 0, width, height);

  // Логика рендеринга фрактала Мандельброта
  const centerX = width / 2;
  const centerY = height / 2;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const real = (x - centerX) / fractalParams.zoom + fractalParams.xOffset;
      const imag = (y - centerY) / fractalParams.zoom + fractalParams.yOffset;

      let zReal = 0;
      let zImag = 0;
      let temp;
      let iterationsCount = 0;

      while (zReal * zReal + zImag * zImag < 4 && iterationsCount < iterations) {
        temp = zReal * zImag;
        zReal = zReal * zReal - zImag * zImag + real;
        zImag = 2 * temp + imag;
        iterationsCount++;
      }

      // Определение цвета
      let hue = 0;
      if (iterationsCount === iterations) {
        hue = 0;
      } else {
        hue = (iterationsCount / iterations) * 360;
      }

      let color = '';
      switch (colorScheme) {
        case 'classic':
          color = `hsl(${hue}, 100%, 50%)`;
          break;
        case 'rainbow':
          color = `hsl(${hue}, 100%, 70%)`;
          break;
        case 'monochrome':
          color = `hsl(0, 0%, ${(iterationsCount / iterations) * 100}%)`;
          break;
      }

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// ===== Анимация переходов =====
function animateTransition() {
  if (fractalParams.isAnimating) return;
  fractalParams.isAnimating = true;

  const startTime = performance.now();
  const duration = 500;

  function render(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Очистка канвы с анимацией
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Заполняем канву временным цветом
    ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (progress < 1) {
      fractalParams.animationFrameId = requestAnimationFrame(render);
    } else {
      fractalParams.isAnimating = false;
      cancelAnimationFrame(fractalParams.animationFrameId);
      drawFractal();
    }
  }

  fractalParams.animationFrameId = requestAnimationFrame(render);
}

// ===== Переключение тем =====
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleBtn.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
  animateTransition();
}

// ===== Экспорт как PNG =====
function exportAsPNG() {
  const link = document.createElement('a');
  link.download = 'fractal.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ===== Подписка на события =====
iterationsSlider.addEventListener('input', animateTransition);
colorSchemeSelect.addEventListener('change', animateTransition);
exportBtn.addEventListener('click', exportAsPNG);
themeToggleBtn.addEventListener('click', toggleTheme);

// ===== Резиновое масштабирование =====
window.addEventListener('resize', () => {
  fractalParams.width = window.innerWidth * 0.8;
  fractalParams.height = window.innerHeight * 0.6;
  canvas.width = fractalParams.width;
  canvas.height = fractalParams.height;
  drawFractal();
});

// ===== Инициализация =====
window.addEventListener('load', () => {
  initCanvas();
  loadingElement.style.opacity = '0';
  loadingElement.classList.add('fade-out');
  setTimeout(() => {
    fractalContainer.style.display = 'block';
  }, 500);

  // Проверка сохранённой темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = 'Светлая тема';
  }

  // Поддержка prefers-color-scheme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark && savedTheme !== 'light') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = 'Светлая тема';
  }
});