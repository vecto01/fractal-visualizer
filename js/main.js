// ===== ГЛАВНЫЙ СКРИПТ ===== 

/**
 * Главный скрипт для интеграции фрактала и UI.
 */

class FractalApp {
  constructor() {
    this.fractal = null;
    this.uiManager = null;
    this.init();
  }

  /**
   * Инициализация приложения.
   */
  init() {
    // Инициализация UI
    this.uiManager = new UIManager();
    
    // Инициализация фрактала
    this.fractal = new FractalVisualizer('fractalCanvas');
    
    // Подключение обработчиков событий
    this.setupEventListeners();
  }

  /**
   * Настройка обработчиков событий.
   */
  setupEventListeners() {
    // Обновление значений слайдеров в реальном времени
    const iterationSlider = document.querySelector('.iteration-slider');
    const zoomSlider = document.querySelector('.zoom-slider');
    
    iterationSlider.addEventListener('input', () => {
      document.getElementById('iteration-value').textContent = iterationSlider.value;
    });
    
    zoomSlider.addEventListener('input', () => {
      document.getElementById('zoom-value').textContent = zoomSlider.value;
    });
  }
}

// Запуск приложения
window.addEventListener('DOMContentLoaded', () => {
  const app = new FractalApp();
});