// ===== УПРАВЛЕНИЕ UI =====

/**
 * Класс для управления UI: темой, состоянием и взаимодействиями.
 */

class UIManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.initTheme();
    this.initEventListeners();
    this.gifExporter = null;
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
    // Переключатель темы
    window.addEventListener('load', () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark && this.theme === 'light') {
        this.toggleTheme();
      }
    });

    // Обработка экспорта в GIF
    const exportButton = document.getElementById('export-btn');
    if (exportButton) {
      exportButton.addEventListener('click', () => this.handleExport());
    }
  }

  /**
   * Обработка экспорта в GIF с анимацией.
   */
  handleExport() {
    // Создаём модальное окно с прогресс-баром
    this.showExportModal();

    // Инициализируем экспортер
    this.gifExporter = new GIF();
    this.gifExporter.on('progress', (progress) => this.updateExportProgress(progress));
    this.gifExporter.on('finished', () => this.hideExportModal());

    // Симуляция рендеринга GIF (в реальности нужно передать фрактал)
    this.gifExporter.render();
  }

  /**
   * Отображение модального окна с прогресс-баром.
   */
  showExportModal() {
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `<div class="modal-content">
      <h3>Экспорт в GIF</h3>
      <div class="progress-container">
        <div class="progress-bar" style="width: 0%;"></div>
      </div>
      <p>Генерация GIF...</p>
    </div>`;

    document.body.appendChild(modal);
    this.modal = modal;
    this.animateExportButton();
  }

  /**
   * Обновление прогресса экспорта.
   */
  updateExportProgress(progress) {
    if (this.modal) {
      const progressBar = this.modal.querySelector('.progress-bar');
      progressBar.style.width = `${progress * 100}%`;
    }
  }

  /**
   * Закрытие модального окна.
   */
  /**
   * Закрытие модального окна и отображение сообщения об успешном экспорте.
   */
  hideExportModal() {
    if (this.modal) {
      const modal = this.modal;
      const exportComplete = document.getElementById('export-complete');
      if (exportComplete) {
        exportComplete.style.opacity = '1';
        exportComplete.style.transform = 'translateY(0)';
      }
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 500); // Задержка для анимации
    }
  }
  }

  /**
   * Анимация кнопки экспорта.
   */
  animateExportButton() {
    const exportButton = document.getElementById('export-btn');
    if (exportButton) {
      exportButton.classList.add('export-button-animating');
      setTimeout(() => {
        exportButton.classList.remove('export-button-animating');
      }, 500);
    }
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