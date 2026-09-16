// ===== УПРАВЛЕНИЕ UI ===== 

/**
 * Класс для управления UI: темой, состоянием и взаимодействиями.
 */

class UIManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.initTheme();
    this.initEventListeners();
  }

  /**
   * Инициализация темы (светлая/тёмная).
   */
  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    
    // Сохраняем выбор в localStorage
    localStorage.setItem('theme', this.theme);
  }

  /**
   * Переключение темы.
   */
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.initTheme();
  }

  /**
   * Инициализация обработчиков событий для UI.
   */
  initEventListeners() {
    // Переключатель темы (можно добавить кнопку в будущем)
    window.addEventListener('load', () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark && this.theme === 'light') {
        this.toggleTheme();
      }
    });
  }

  /**
   * Обновление значений слайдеров в UI.
   */
  updateSliderValues() {
    const iterationSlider = document.querySelector('.iteration-slider');
    const zoomSlider = document.querySelector('.zoom-slider');
    
    if (iterationSlider) {
      iterationSlider.value = 100;
      document.getElementById('iteration-value').textContent = iterationSlider.value;
    }
    
    if (zoomSlider) {
      zoomSlider.value = 1;
      document.getElementById('zoom-value').textContent = zoomSlider.value;
    }
  }

  /**
   * Активизация/деактивация панели управления.
   */
  setControlsDisabled(state) {
    const controls = document.getElementById('controls');
    if (state) {
      controls.classList.add('controls-disabled');
    } else {
      controls.classList.remove('controls-disabled');
    }
  }
}

// Инициализация UI при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  const uiManager = new UIManager();
  uiManager.updateSliderValues();
});