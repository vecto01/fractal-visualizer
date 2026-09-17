// Дебаунс для слайдеров
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// Объект локализации
const translations = {
    en: {
        loadingTitle: "Fractal Visualizer",
        loadingMessage: "Loading fractal...",
        startButton: "Start Visualization",
        successMessage: "Visualization complete!",
        languageButton: "English",
        themeButton: "Dark Mode",
        languageFlag: "🇬🇧"
    },
    ru: {
        loadingTitle: "Визуализатор Фракталов",
        loadingMessage: "Загрузка фрактала...",
        startButton: "Начать Визуализацию",
        successMessage: "Визуализация завершена!",
        languageButton: "Русский",
        themeButton: "Тёмная Тема",
        languageFlag: "🇷🇺"
    }
};

// Текущий язык
// Загружаем сохранённый язык из localStorage или используем значение по умолчанию
let currentLanguage = localStorage.getItem('language') || 'en';

// Функция для обновления текста на странице
function updateText() {
    const t = translations[currentLanguage];
    document.querySelector('#loading h1').textContent = t.loadingTitle;
    document.querySelector('.loading-message').textContent = t.loadingMessage;
    document.querySelector('#start-visualization-btn').textContent = t.startButton;
    document.querySelector('#success-message').textContent = t.successMessage;
    document.querySelector('.language-toggle').setAttribute('aria-label', `Switch to ${t.languageButton}`);
    document.querySelector('.theme-toggle').setAttribute('aria-label', `Toggle ${t.themeButton}`);
    
    // Обновляем текст и флаг кнопки переключения языка
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        const t = translations[currentLanguage];
        const flagSpan = document.createElement('span');

    // Функция для управления анимацией загрузки и появлением элементов
    function setupLoadingAnimation() {
        const loadingSpinner = document.querySelector('.loading-spinner');
        const loadingMessage = document.querySelector('.loading-message');
        const successMessage = document.querySelector('#success-message');
        const buttonsContainer = document.querySelector('.fixed-buttons');
        const slidersContainer = document.querySelector('.sliders-container');
        const fractalCanvas = document.querySelector('#fractal-canvas');

        // Показываем лоудер и сообщение
        loadingSpinner.classList.add('active');
        loadingMessage.classList.add('active');

        // Скрываем кнопку Start и показываем лоудер
        const startButton = document.querySelector('#start-visualization-btn');
        startButton.classList.add('loading');

        // Задержка для симуляции загрузки
        setTimeout(() => {
            // Скрываем лоудер и сообщение
            loadingSpinner.classList.remove('active');
            loadingMessage.classList.remove('active');

            // Показываем элементы плавно
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            successMessage.classList.add('active');

            // Показываем кнопки и слайдеры
            buttonsContainer.style.opacity = '0';
            buttonsContainer.style.transform = 'translateY(20px)';
            buttonsContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
                buttonsContainer.style.opacity = '1';
                buttonsContainer.style.transform = 'translateY(0)';
            }, 10);

            // Показываем слайдеры
            slidersContainer.style.opacity = '0';
            slidersContainer.style.transform = 'translateY(20px)';
            slidersContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
                slidersContainer.style.opacity = '1';
                slidersContainer.style.transform = 'translateY(0)';
            }, 10);

            // Показываем кнопку Start
            startButton.classList.remove('loading');
        }, 2000); // Симуляция загрузки (2 секунды)
    }

    // Инициализация анимации загрузки при загрузке страницы
    window.addEventListener('load', () => {
        setupLoadingAnimation();
    });

    // Фиксация кнопок и слайдеров на мобильных устройствах
    function setupStickyButtons() {
        const buttonsContainer = document.querySelector('.fixed-buttons');
        const slidersContainer = document.querySelector('.sliders-container');
        
        // Фиксируем кнопки на мобильных устройствах
        if (window.innerWidth <= 768) {
            buttonsContainer.style.position = 'fixed';
            buttonsContainer.style.bottom = '20px';
            buttonsContainer.style.left = '0';
            buttonsContainer.style.right = '0';
            buttonsContainer.style.width = '100%';
            buttonsContainer.style.zIndex = '100';
            buttonsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            buttonsContainer.style.padding = '10px';
            buttonsContainer.style.borderRadius = '10px 10px 0 0';
            buttonsContainer.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            buttonsContainer.style.position = 'static';
            buttonsContainer.style.backgroundColor = 'transparent';
            buttonsContainer.style.boxShadow = 'none';
        }
        
        // Фиксируем слайдеры на мобильных устройствах
        if (window.innerWidth <= 768) {
            slidersContainer.style.position = 'fixed';
            slidersContainer.style.bottom = '120px';
            slidersContainer.style.left = '0';
            slidersContainer.style.right = '0';
            slidersContainer.style.width = '100%';
            slidersContainer.style.zIndex = '90';
            slidersContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            slidersContainer.style.padding = '10px';
            slidersContainer.style.borderRadius = '10px';
            slidersContainer.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            slidersContainer.style.position = 'static';
            slidersContainer.style.backgroundColor = 'transparent';
            slidersContainer.style.boxShadow = 'none';
        }
    }

    // Обновляем фиксацию при изменении размера окна
    window.addEventListener('resize', () => {
        setupStickyButtons();
    });
        flagSpan.textContent = t.languageFlag;
        flagSpan.className = 'language-flag';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = currentLanguage === 'en' ? 'EN' : 'РУ';
        textSpan.className = 'language-text';
        
        // Очищаем старый контент
        while (languageToggle.firstChild) {
            languageToggle.removeChild(languageToggle.firstChild);
        }
        
        // Добавляем флаг и текст
        languageToggle.appendChild(flagSpan);
        languageToggle.appendChild(textSpan);
    }
}

// Функция для переключения языка
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    updateText();
    localStorage.setItem('language', currentLanguage);
}

// Создание эффекта ripple при нажатии на кнопку
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = ripple.style.height = '10px';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.pointerEvents = 'none';
    ripple.style.opacity = '0';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.style.transform = 'scale(4)';
        ripple.style.opacity = '0';
        setTimeout(() => {
            ripple.remove();
        }, 300);
    }, 10);
}

// Функция для добавления обработчика ripple ко всем кнопкам
function addRippleEffectToButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', createRipple);
    });
}

// Функция для обновления значений слайдеров
function updateSliderValues() {
    const depthValue = document.getElementById('recursion-depth-value');
    const pointCountValue = document.getElementById('point-count-value');
    
    depthValue.textContent = document.getElementById('recursion-depth').value;
    pointCountValue.textContent = document.getElementById('point-count').value;
}

// Функция для обновления значений слайдеров
function updateSliderValues() {
    const depthValue = document.getElementById('recursion-depth-value');
    const pointCountValue = document.getElementById('point-count-value');
    
    depthValue.textContent = document.getElementById('recursion-depth').value;
    pointCountValue.textContent = document.getElementById('point-count').value;
}

// Функция для управления слайдерами с клавиатуры
function setupKeyboardControls(slider, min, max, step = 1) {
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            e.preventDefault();
            const currentValue = parseInt(slider.value);
            const newValue = Math.min(currentValue + step, max);
            slider.value = newValue;
            updateSliderValues();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const currentValue = parseInt(slider.value);
            const newValue = Math.max(currentValue - step, min);
            slider.value = newValue;
            updateSliderValues();
        }
    };
    
    slider.addEventListener('keydown', handleKeyDown);
}

// Обновление значений при изменении слайдеров
const recursionDepthSlider = document.getElementById('recursion-depth');
const pointCountSlider = document.getElementById('point-count');

// Используем дебаунс для слайдеров
const debouncedUpdateSliderValues = debounce(updateSliderValues, 100);

recursionDepthSlider.addEventListener('input', debouncedUpdateSliderValues);
pointCountSlider.addEventListener('input', debouncedUpdateSliderValues);

// Настройка управления клавиатурой
setupKeyboardControls(recursionDepthSlider, 1, 10);
setupKeyboardControls(pointCountSlider, 100, 10000, 100);

// Инициализация значений слайдеров
updateSliderValues();

// Обработчик завершения визуализации фрактала
const canvas = document.getElementById('fractal-canvas');
const loadingScreen = document.getElementById('loading');
const fractalContainer = document.getElementById('fractal-container');

// Показать сообщение об успешной визуализации
function showSuccessMessage() {
    // Скрываем экран загрузки с анимацией
    loadingScreen.style.opacity = '0';
    loadingScreen.style.pointerEvents = 'none';
    loadingScreen.style.transform = 'translateY(-20px)';
    loadingScreen.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Создаем сообщение об успешной визуализации
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Visualization complete!';
    document.getElementById('container').appendChild(successMessage);
    
    // Анимация появления сообщения
    setTimeout(() => {
        successMessage.classList.add('active');
    }, 100);
    
    // Показываем основные элементы с анимацией
    fractalContainer.style.opacity = '0';
    fractalContainer.style.transform = 'translateY(20px)';
    fractalContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        fractalContainer.style.opacity = '1';
        fractalContainer.style.transform = 'translateY(0)';
    }, 200);
    
    // Анимация появления кнопок
    const buttons = document.querySelectorAll('.fade-in');
    buttons.forEach((button, index) => {
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
            button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 300 + index * 100);
    });
}

// ===== Основная логика приложения =====

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
    // Обновляем значения на слайдерах
    document.getElementById('point-count-value').textContent = vertexCount;
    document.getElementById('animation-speed-value').textContent = animationSpeed;
    // TODO: Реализовать обновление фрактала с новыми параметрами
};

// Обновление значений слайдеров в реальном времени
// TODO: Реализовать обновление значений слайдеров

// Инициализация обработчиков событий для слайдеров
const initSliderHandlers = () => {
    const pointCountSlider = document.getElementById('point-count');
    const animationSpeedSlider = document.getElementById('animation-speed');
    
    if (pointCountSlider) {
        pointCountSlider.addEventListener('input', updateSliderValues);
    }
    
    if (animationSpeedSlider) {
        animationSpeedSlider.addEventListener('input', updateSliderValues);
    }
};

// Запуск инициализации обработчиков
initSliderHandlers();

// ===== Экспорт анимации =====
const exportAnimation = () => {
    console.log('Экспорт анимации');
    
    // Открытие модального окна
    const modal = document.getElementById('export-modal');
    const closeBtn = document.querySelector('.modal-close');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const body = document.body;
    
    // Добавляем класс для блокировки скролла
    body.classList.add('no-scroll');
    
    // Показываем модальное окно с анимацией
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(20px)';
    modal.style.pointerEvents = 'none';
    modal.style.zIndex = '1000';
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
        modal.style.pointerEvents = 'auto';
        modal.setAttribute('aria-hidden', 'false');
    }, 10);
    
    // Закрытие модального окна по кнопке "Close" или крестику
    const closeModal = () => {
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
        modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.transform = 'translateY(20px)';
            modal.style.pointerEvents = 'none';
            modal.setAttribute('aria-hidden', 'true');
            
            setTimeout(() => {
                // Убираем класс для разблокировки скролла
                body.classList.remove('no-scroll');
                
                // Звуковой эффект закрытия (если поддерживается)
                if (typeof Audio !== 'undefined') {
                    const closeSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-casino-chip-drop-216.mp3');
                    closeSound.volume = 0.2;
                    closeSound.play().catch(e => console.log('Звук не воспроизведён:', e));
                }
            }, 300);
        }, 10);
    };
    
    // Привязываем обработчики закрытия
    closeBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Добавляем имя файла (например, случайное или фиксированное)
    const filename = `fractal_${Date.now()}.png`;
    document.getElementById('export-filename').textContent = `File: ${filename}`;
};

// Запуск инициализации 3D-рендера
init3DRender();

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
        // Добавляем состояние загрузки
        startBtn.classList.add('loading');
        const span = document.createElement('span');
        span.textContent = translations[currentLanguage].loadingMessage;
        startBtn.innerHTML = '';
        startBtn.appendChild(span);
        
        // Логика визуализации (заменяем на реальную или имитацию)
        setTimeout(() => {
            // Убираем состояние загрузки
            startBtn.classList.remove('loading');
            startBtn.textContent = translations[currentLanguage].startButton;
            
            // Показываем сообщение об успешной визуализации и запускаем анимацию фрактала
            const fractalContainer = document.getElementById('fractal-container');
            fractalContainer.style.animation = 'fadeIn 1.5s ease-out forwards';
            fractalContainer.style.animationPlayState = 'running';
            
            displaySuccessMessage();
        }, 2000); // Имитация процесса
    });
}

// Показать сообщение об успешной визуализации
// Функция для отображения сообщения об успешной визуализации
const displaySuccessMessage = () => {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.animation = 'slideUp 0.5s ease-out forwards';
        successMessage.style.animationPlayState = 'running';
    }
};

// Обработчик для скрытия сообщения об успешной визуализации

if (successMessage) {
    successMessage.addEventListener('click', () => {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(20px) scale(0.95)';
        successMessage.style.pointerEvents = 'none';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 300);
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
        const loadingScreen = document.getElementById('loading');
        const fractalContainer = document.getElementById('fractal-container');
        const successMessage = document.getElementById('success-message');
        
        // Скрываем экран загрузки
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'translateY(20px)';
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.width = '100%';
        loadingScreen.style.top = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        
        // Показываем контейнер с фракталом
        setTimeout(() => {
            fractalContainer.style.animation = 'fadeIn 1.5s ease-out forwards';
            fractalContainer.style.animationPlayState = 'running';
        }, 500);
        
        // Показываем сообщение об успешной визуализации
        setTimeout(() => {
            successMessage.style.animation = 'slideUp 0.5s ease-out forwards';
            successMessage.style.animationPlayState = 'running';
        }, 1000);
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
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                loadingSpinner.style.display = 'none';
                
                // Показать основные кнопки с анимацией
                const buttons = document.querySelectorAll('.fixed-buttons button');
                buttons.forEach((button, index) => {
                    button.classList.add('fade-in');
                    button.style.animationDelay = `${index * 0.2}s`;
                });
                
                showSuccessMessage();
            }, 500);
        }, 2000); // Задержка для имитации процесса
    });
    
    // Добавляем эффект ripple ко всем кнопкам
    addRippleEffectToButtons();

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

    // Инициализация переключателя тем
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Обновление иконки в зависимости от темы
        const moonIcon = themeToggle.querySelector('.moon-icon');
        if (moonIcon) {
            moonIcon.setAttribute('data-theme', currentTheme);
        }
        
        themeToggle.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Обновление иконки
            if (moonIcon) {
                moonIcon.setAttribute('data-theme', newTheme);
            }
        });
    }

    // Инициализация переключателя языка
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    // Обновление текста при загрузке страницы
    updateText();