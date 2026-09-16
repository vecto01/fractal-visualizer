// ========== Основные переменные и инициализация ==========
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const iterationsSlider = document.getElementById('iterationsSlider');
const iterationsValue = document.getElementById('iterationsValue');
const colorSchemeSelect = document.getElementById('colorSchemeSelect');
const resetBtn = document.getElementById('resetBtn');
const colorBtn = document.getElementById('colorBtn');
const themeToggle = document.getElementById('themeToggle');
const loadingIndicator = document.getElementById('loadingIndicator');
const fractalContainer = document.querySelector('.fractal-container');

let fractal;
let scale = 1;
let offsetX = 0;
let offsetY = 0;

// ========== Анимация появления фрактала ==========
const fadeInFractal = () => {
  fractalContainer.style.opacity = '0';
  setTimeout(() => {
    fractalContainer.style.transition = 'opacity 0.5s ease-in-out';
    fractalContainer.style.opacity = '1';
  }, 100);
};

// ========== Инициализация ==========
const init = () => {
  fractal = new Fractal(ctx);
  initCanvas();
  setupEventListeners();
  loadState();
};

// ========== Инициализация canvas ==========
const initCanvas = () => {
  canvas.width = Math.floor(window.innerWidth * 0.8 * window.devicePixelRatio);
  canvas.height = Math.floor(window.innerHeight * 0.6 * window.devicePixelRatio);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  showLoading();
  simulateLoadingWithAnimation();
  setTimeout(() => {
    drawFractal();
    fadeInFractal();
  }, 1500); // Задержка для анимации загрузки
};

// ========== Показать/скрыть загрузку ==========
const showLoading = () => {
  loadingIndicator.style.opacity = '1';
  fractalContainer.style.opacity = '0';
};

const hideLoading = () => {
  loadingIndicator.style.opacity = '0';
};

// ========== Анимация загрузки ==========
const simulateLoadingWithAnimation = () => {
  const spinner = document.querySelector('.loader');
  spinner.style.animation = 'spin 1.5s linear infinite';
};

// ========== Рендеринг фрактала ==========
const drawFractal = () => {
  fractal.draw(
    parseInt(iterationsSlider.value),
    colorSchemeSelect.value,
    scale,
    offsetX,
    offsetY
  );
};

// ========== Обработчики событий ==========
const setupEventListeners = () => {
  // Переключение тем
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    saveState();
  });

  // Сброс вида
  resetBtn.addEventListener('click', () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    drawFractal();
    saveState();
  });

  // Изменение итераций
  iterationsSlider.addEventListener('input', () => {
    iterationsValue.textContent = iterationsSlider.value;
    drawFractal();
    saveState();
  });

  // Изменение цветовой схемы
  colorSchemeSelect.addEventListener('change', () => {
    drawFractal();
    saveState();
  });

  // Кнопка смены цветовой схемы
  colorBtn.addEventListener('click', () => {
    const currentScheme = colorSchemeSelect.value;
    const schemes = ['HSV', 'RGB', 'Viridis'];
    const currentIndex = schemes.indexOf(currentScheme);
    const nextIndex = (currentIndex + 1) % schemes.length;
    colorSchemeSelect.value = schemes[nextIndex];
    drawFractal();
    saveState();
  });

  // Зум и панорама
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    offsetX += (mouseX / scale - canvas.width / 2 / scale) * (scale - delta * scale);
    offsetY += (mouseY / scale - canvas.height / 2 / scale) * (scale - delta * scale);
    scale *= delta;
    drawFractal();
    saveState();
  });

  // Панорама мышью
  let isDragging = false;
  let startX, startY;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    e.preventDefault();
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const dx = (e.clientX - rect.left - startX) / scale;
    const dy = (e.clientY - rect.top - startY) / scale;

    offsetX += dx;
    offsetY += dy;
    drawFractal();
    saveState();
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Адаптивность
  window.addEventListener('resize', () => {
    canvas.width = Math.floor(window.innerWidth * 0.8 * window.devicePixelRatio);
    canvas.height = Math.floor(window.innerHeight * 0.6 * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawFractal();
  });
};

// ========== Сохранение/загрузка состояния ==========
const saveState = () => {
  const state = {
    theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    iterations: iterationsSlider.value,
    colorScheme: colorSchemeSelect.value,
    scale: scale,
    offsetX: offsetX,
    offsetY: offsetY
  };
  localStorage.setItem('fractalState', JSON.stringify(state));
};

const loadState = () => {
  const savedState = localStorage.getItem('fractalState');
  if (savedState) {
    const state = JSON.parse(savedState);
    document.body.classList.toggle('dark-theme', state.theme === 'dark');
    iterationsSlider.value = state.iterations;
    iterationsValue.textContent = state.iterations;
    colorSchemeSelect.value = state.colorScheme;
    scale = state.scale;
    offsetX = state.offsetX;
    offsetY = state.offsetY;
    drawFractal();
  }
};

// ========== Класс для рендеринга фрактала ==========
class Fractal {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(iterations, colorScheme, scale, offsetX, offsetY) {
    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;
    const centerX = -offsetX / scale;
    const centerY = -offsetY / scale;

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const real = (x - width / 2) / scale + centerX;
        const imag = (y - height / 2) / scale + centerY;
        const color = this.mandelbrot(real, imag, iterations, colorScheme);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  mandelbrot(real, imag, iterations, colorScheme) {
    let x = 0;
    let y = 0;
    let iter = 0;

    while (x * x + y * y < 4 && iter < iterations) {
      const xtemp = x * x - y * y + real;
      y = 2 * x * y + imag;
      x = xtemp;
      iter++;
    }

    if (iter === iterations) return '#000000'; // Черный для бесконечных итераций

    // Цветовая схема
    switch (colorScheme) {
      case 'HSV':
        const hue = (iter / iterations) * 360;
        return `hsl(${hue}, 100%, 50%)`;
      case 'RGB':
        const r = Math.floor((iter / iterations) * 255);
        return `rgb(${r}, ${255 - r}, 0)`;
      case 'Viridis':
        const t = iter / iterations;
        const v1 = 255 * (1 - t);
        const v2 = 255 * (1 - Math.abs(2 * t - 1));
        return `rgb(${v1}, ${v2}, 0)`;
      default:
        return '#000000';
    }
  }
}

// ========== Запуск ==========
init();