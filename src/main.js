// Основной модуль для визуализации фракталов
import MandelbrotFractal from './fractal-mandelbrot.js';
import JuliaFractal from './fractal-julia.js';

// Параметры фракталов
const fractalParams = {
  mandelbrot: {
    iterations: 100,
    zoom: 1.0,
    xOffset: -0.5,
    yOffset: 0.0,
  },
  julia: {
    iterations: 100,
    zoom: 1.0,
    xOffset: 0.0,
    yOffset: 0.0,
    c: { real: -0.7, imag: 0.27015 },
  },
};

// Текущий выбранный фрактал
let currentFractal = 'mandelbrot';
let currentFractalInstance = null;

// Элементы DOM
const canvas = document.getElementById('fractalCanvas');
const container = document.querySelector('.fractal-container');
const loadingSpinner = document.getElementById('loadingSpinner');
const toastElement = document.createElement('div');

// Инициализация тоста
function initToast() {
  toastElement.className = 'toast';
  document.body.appendChild(toastElement);
}

// Показать тост
function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add('show');
  
  setTimeout(() => {
    toastElement.classList.remove('show');
  }, 3000);
}

// Показать спиннер загрузки
function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
}

// Скрыть спиннер загрузки
function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none';
}

// Инициализация фрактала
function initFractal() {
  const width = canvas.width;
  const height = canvas.height;
  
  // Показать спиннер загрузки
  showLoadingSpinner();
  
  // Загрузка сохранённых параметров
  const savedParams = localStorage.getItem('fractalParams');
  if (savedParams) {
    Object.assign(fractalParams[currentFractal], JSON.parse(savedParams));
  }
  
  // Создание экземпляра фрактала
  if (currentFractal === 'mandelbrot') {
    currentFractalInstance = MandelbrotFractal;
  } else {
    currentFractalInstance = JuliaFractal;
  }
  
  currentFractalInstance.init(canvas, width, height);
  
  // Скрыть спиннер после рендеринга
  setTimeout(hideLoadingSpinner, 500);
  
  // Анимация появления фрактала
  setTimeout(() => {
    container.classList.add('active-canvas');
  }, 100);
  
  // Обновление UI
  updateUI();
}

// Обновление UI
function updateUI() {
  const fractalType = document.getElementById('fractalType');
  const iterationsInput = document.getElementById('iterations');
  const zoomInput = document.getElementById('zoom');
  
  // Переключатель фракталов
  fractalType.value = currentFractal;
  
  // Настройки фрактала
  iterationsInput.value = fractalParams[currentFractal].iterations;
  zoomInput.value = fractalParams[currentFractal].zoom;
  
  // Сохранение текущих параметров
  localStorage.setItem('fractalParams', JSON.stringify(fractalParams[currentFractal]));
}

// Переключение фракталов
function switchFractal() {
  const newFractalType = document.getElementById('fractalType').value;
  if (newFractalType !== currentFractal) {
    currentFractal = newFractalType;
    initFractal();
  }
}

// Обновление параметров фрактала
function updateFractalParams() {
  const iterationsInput = document.getElementById('iterations');
  const zoomInput = document.getElementById('zoom');
  
  fractalParams[currentFractal].iterations = parseInt(iterationsInput.value);
  fractalParams[currentFractal].zoom = parseFloat(zoomInput.value);
  
  // Обновление фрактала
  currentFractalInstance.updateParams(fractalParams[currentFractal]);
}

// Экспорт фрактала в PNG
function exportToPNG() {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fractal_${currentFractal}_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.png`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Fractal exported as PNG!');
  }, 'image/png', 1.0);
}

// Экспорт фрактала в SVG
function exportToSVG() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", canvas.width);
  svg.setAttribute("height", canvas.height);
  
  const xform = document.createElementNS(svgNS, "g");
  svg.appendChild(xform);
  
  const dataURL = canvas.toDataURL("image/png");
  const img = document.createElementNS(svgNS, "image");
  img.setAttribute("href", dataURL);
  img.setAttribute("width", canvas.width);
  img.setAttribute("height", canvas.height);
  xform.appendChild(img);
  
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fractal_${currentFractal}_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.svg`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Fractal exported as SVG!');
}

// Отображение модального окна экспорта
function showExportModal() {
  const modal = document.getElementById('exportModal');
  modal.classList.add('active');
}

// Закрытие модального окна
function closeExportModal() {
  const modal = document.getElementById('exportModal');
  modal.classList.remove('active');
}

// Инициализация событиями
document.addEventListener('DOMContentLoaded', () => {
  initToast();
  initFractal();
  
  // Переключение фракталов
  document.getElementById('fractalType').addEventListener('change', switchFractal);
  
  // Обновление параметров
  document.getElementById('updateBtn').addEventListener('click', updateFractalParams);
  
  // Экспорт фрактала
  document.getElementById('exportBtn').addEventListener('click', showExportModal);
  
  // Экспорт в PNG
  document.getElementById('exportPngBtn').addEventListener('click', () => {
    exportToPNG();
    closeExportModal();
  });
  
  // Экспорт в SVG
  document.getElementById('exportSvgBtn').addEventListener('click', () => {
    exportToSVG();
    closeExportModal();
  });
  
  // Закрытие модального окна
  document.getElementById('closeModal').addEventListener('click', closeExportModal);
  
  // Закрытие модального окна при клике вне его
  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('exportModal')) {
      closeExportModal();
    }
  });
  
  // Клавиатурная навигация
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') fractalParams[currentFractal].yOffset -= 0.1;
    if (e.key === 'ArrowDown') fractalParams[currentFractal].yOffset += 0.1;
    if (e.key === 'ArrowLeft') fractalParams[currentFractal].xOffset -= 0.1;
    if (e.key === 'ArrowRight') fractalParams[currentFractal].xOffset += 0.1;
    
    currentFractalInstance.updateParams(fractalParams[currentFractal]);
  });
});