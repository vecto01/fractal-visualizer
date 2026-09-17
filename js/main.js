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

// ===== Управление 3D-рендером =====
const init3DRender = () => {
    // Показать состояние загрузки
    showLoading();
    
    // Инициализация 3D-рендера
    const sceneResult = init3DScene();
    
    // Колбэк завершения рендеринга
    const onRenderComplete = () => {
        hideLoading();
        
        // Показать сообщение об успешной визуализации
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.remove('hidden');
        }
    };
    
    // Установить колбэк завершения анимации
    sceneResult.setOnComplete(onRenderComplete);
    
    // Обработка изменений параметров
    document.getElementById('depth').addEventListener('input', (e) => {
        recursionDepth = parseInt(e.target.value);
        updateFractal();
    });
    
    document.getElementById('point-count').addEventListener('input', (e) => {
        vertexCount = parseInt(e.target.value);
        updateFractal();
    });
    
    document.getElementById('animation-speed').addEventListener('input', (e) => {
        animationSpeed = parseFloat(e.target.value);
    });
    
    document.getElementById('export-btn').addEventListener('click', exportAnimation);
    
    // Кнопка перезапуска
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            init3DRender();
        });
    }
};

// ===== Обновление фрактала =====
const updateFractal = () => {
    console.log('Обновление фрактала:', { vertexCount, recursionDepth });
    // TODO: Реализовать обновление фрактала с новыми параметрами
};

// ===== Экспорт анимации =====
const exportAnimation = () => {
    console.log('Экспорт анимации');
    // TODO: Реализовать экспорт анимации в GIF/MP4
};

// Запуск инициализации 3D-рендера
init3DRender();