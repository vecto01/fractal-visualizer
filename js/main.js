// ===== Основная логика приложения ====

// Показать состояние загрузки
const showLoading = () => {
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.remove('hidden');
};

// Скрыть состояние загрузки
const hideLoading = () => {
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.add('hidden');
};

// Инициализация фрактала
const initFractal = () => {
    showLoading(); // Показать состояние загрузки
    
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    
    // Запуск анимации волны при клике на канвас
    canvas.addEventListener('click', (e) => {
        if (e.target === canvas) {
            console.log('Клик на канвас! Анимация волны запущена.');
            canvas.classList.add('wave-animation', 'click-feedback');
            setTimeout(() => {
                console.log('Анимация волны завершена.');
                canvas.classList.remove('wave-animation', 'click-feedback');
            }, 800);
        }
    });
    // Передача обработчика кликов в paintingMode.js
    const paintingModeInstance = initPaintingMode({ canvas });
    canvas.addEventListener('click', paintingModeInstance.handleCanvasClick);
    
    // Скрыть состояние загрузки
    hideLoading();
    
    // Инициализация режима "Кинетическая живопись"
    const paintingModeBtn = document.getElementById('paintingModeBtn');
    const paintingMode = initPaintingMode({ canvas });
    
    paintingModeBtn.addEventListener('click', () => {
        if (paintingModeBtn.classList.contains('active')) {
            paintingMode.deactivate();
            paintingModeBtn.classList.remove('active');
        } else {
            paintingMode.activate();
            paintingModeBtn.classList.add('active');
        }
    });
};

// Запуск инициализации
initFractal();