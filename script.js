// Дебаунс для слайдеров
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Функция для обновления значений слайдеров
function updateSliderValues() {
    const depthValue = document.getElementById('recursion-depth-value');
    const pointCountValue = document.getElementById('point-count-value');
    
    depthValue.textContent = document.getElementById('recursion-depth').value;
    pointCountValue.textContent = document.getElementById('point-count').value;
}

// Обновление значений при изменении слайдеров
const recursionDepthSlider = document.getElementById('recursion-depth');
const pointCountSlider = document.getElementById('point-count');

// Используем дебаунс для слайдеров
const debouncedUpdateSliderValues = debounce(updateSliderValues, 100);

recursionDepthSlider.addEventListener('input', debouncedUpdateSliderValues);
pointCountSlider.addEventListener('input', debouncedUpdateSliderValues);

// Инициализация значений слайдеров
updateSliderValues();

// Обработчик завершения визуализации фрактала
const canvas = document.getElementById('fractal-canvas');
const successMessage = document.getElementById('success-message');
const loadingScreen = document.getElementById('loading');
const fractalContainer = document.getElementById('fractal-container');

// Показать сообщение об успешной визуализации
function showSuccessMessage() {
    // Используем requestAnimationFrame для плавной анимации
    function animate() {
        if (successMessage.style.opacity !== '1') {
            successMessage.style.opacity = '1';
        }
        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';
        fractalContainer.style.opacity = '1';
    }
    requestAnimationFrame(animate);
}

}

// Имитация завершения визуализации
if (canvas) {
    // Задержка для имитации процесса визуализации
    setTimeout(() => {
        showSuccessMessage();
    }, 2000); // Задержка 2 секунды
} else {
    console.error('Canvas not found. Check the DOM structure.');
}

// Обработчик кнопки "Start"
const startBtn = document.getElementById('start-btn');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        console.log('Visualization started with:', {
            depth: document.getElementById('recursion-depth').value,
            points: document.getElementById('point-count').value
        });
    });
}

// Обработчик кнопки "Export"
const exportBtn = document.getElementById('export-btn');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        console.log('Exporting fractal...');
    });
}

// Обработчик кнопки "Clear"
const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        console.log('Clearing fractal...');
    });
}

// Обработчик кнопки "Start Visualization" на экране загрузки
const startVisualizationBtn = document.getElementById('start-visualization-btn');
if (startVisualizationBtn) {
    startVisualizationBtn.addEventListener('click', () => {
        console.log('Starting visualization...');
        loadingScreen.style.opacity = '0';
        fractalContainer.style.opacity = '1';
    });
}

    // Добавление элементов для анимации загрузки
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.id = 'loading-overlay';
    
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.id = 'loading-spinner';
    
    const loadingText = document.createElement('h2');
    loadingText.textContent = 'Loading fractal...';
    
    loadingOverlay.appendChild(loadingText);
    loadingOverlay.appendChild(loadingSpinner);
    document.body.appendChild(loadingOverlay);

    // Логика загрузки при нажатии на кнопку
    startVisualizationBtn.addEventListener('click', () => {
        console.log('Starting visualization...');
        startVisualizationBtn.classList.add('loading');
        loadingOverlay.classList.add('active');
        loadingOverlay.style.display = 'flex';
        loadingSpinner.style.display = 'block';
        
        // Имитация процесса визуализации (заменить на реальный рендеринг)
        setTimeout(() => {
            startVisualizationBtn.classList.remove('loading');
            loadingOverlay.classList.remove('active');
            loadingOverlay.style.display = 'none';
            loadingSpinner.style.display = 'none';
            
            // Показать основные кнопки с анимацией
            const buttons = document.querySelectorAll('.fixed-buttons button');
            buttons.forEach((button, index) => {
                button.classList.add('fade-in');
                button.style.animationDelay = `${index * 0.2}s`;
            });
            
            showSuccessMessage();
        }, 2000); // Задержка для имитации процесса
    });

    // Показать сообщение об успешной визуализации (обновленная версия)
    function showSuccessMessage() {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(20px)';
        successMessage.style.animation = 'none';
        
        // Анимация появления уведомления
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
            successMessage.style.animation = 'fadeIn 0.5s ease-out forwards';
        }, 100);
        
        // Показать основные элементы
        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';
        fractalContainer.style.opacity = '1';
    }