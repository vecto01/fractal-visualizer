// ===== Основная логика приложения =====

// Импорт модулей
import { Fractal } from './fractal.js';
import PaintingModeSync from './paintingMode_new.js';
import { init3DScene } from './3d/fractal3d.js';
import { centerElement, animateLoadingCircle, animateText } from './animations.js';

// Инициализация элементов
const loadingCircle = document.getElementById('loading-circle');
const textReady = document.getElementById('ready-text');

// Центрируем круг при загрузке
if (loadingCircle) {
  centerElement(loadingCircle);
  animateLoadingCircle(loadingCircle);
}

// Объекты для хранения сцен
let currentScene = null;
let currentRenderer = null;
let fractalWorker = null;

// Канал связи с audioWorker
let audioWorker = null;
let audioContext = null;
let analyser = null;
let audioSource = null;
let audioDataBuffer = null;

// Флаг активного режима
let is3DMode = false;

// ===== ОБРАБОТКА ОШИБОК =====
const handleError = (error) => {
    console.error("Ошибка в приложении:", error);
    alert("Произошла ошибка. Проверьте совместимость браузера или обновите страницу.");
};

// ===== ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ =====
const toggle3DMode = () => {
    try {
        if (is3DMode) {
            // Возврат в 2D режим
            const canvas = document.getElementById('fractalCanvas');
            canvas.style.display = 'block';
            document.getElementById('app').innerHTML = '';
            const mountPoint = document.getElementById('app');
            mountPoint.appendChild(canvas);
            initFractal();
        } else {
            // Переход в 3D режим
            const canvas = document.getElementById('fractalCanvas');
            canvas.style.display = 'none';
            
            // Проверка поддержки WebGL
            const canvas3D = document.createElement('canvas');
            const gl = canvas3D.getContext('webgl');
            if (!gl) {
                alert("Ваш браузер не поддерживает WebGL. Переключаемся на 2D-режим.");
                initFractal();
                return;
            }
            
            init3DScene();
            
            // Если активен режим "Кинетическая живопись", синхронизируем аудиоэффекты
            if (paintingModeInstance && paintingModeInstance.isActive) {
                paintingModeInstance.updateFractal(performance.now());
            }
        }
        is3DMode = !is3DMode;
    } catch (error) {
        handleError(error);
        // Возврат в 2D режим при ошибке
        const canvas = document.getElementById('fractalCanvas');
        canvas.style.display = 'block';
        document.getElementById('app').innerHTML = '';
        const mountPoint = document.getElementById('app');
        mountPoint.appendChild(canvas);
        initFractal();
    }
};

// ===== ИНИЦИАЛИЗАЦИЯ ФРАКТАЛА =====
const initFractal = () => {
    showLoading();
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    
    // Создаём Worker для рендеринга фрактала
    fractalWorker = new Worker('js/fractalWorker.js');
    
    // Обработчик сообщений от Worker
    fractalWorker.onmessage = function(e) {
        try {
            if (e.data.type === 'fractalRenderedWithAudio') {
                ctx.putImageData(e.data.data, 0, 0);
                updateAudioVisualFeedback(e.data.audioData);
            } else {
                ctx.putImageData(e.data, 0, 0);
            }
        } catch (error) {
            handleError(error);
        }
    };
    
    // Параметры для Worker
    const params = {
        width: canvas.width,
        height: canvas.height,
        maxIterations: 100,
        zoom: 1.0,
        offsetX: canvas.width / 2,
        offsetY: canvas.height / 2
    };
    
    // Отправляем параметры в Worker
    fractalWorker.postMessage({ params });
    
    // Инициализация режима "Кинетическая живопись"
    const paintingModeInstance = initPaintingMode({ canvas });
    
    // Скрыть состояние загрузки
    hideLoading();

    // Отправляем событие о завершении загрузки
    window.dispatchEvent(new CustomEvent('fractalLoaded', { detail: { success: true } }));

    // Анимация появления canvas с задержкой
    const fractalCanvas = document.getElementById('fractalCanvas');
    fractalCanvas.classList.add('loaded');
    setTimeout(() => {
        fractalCanvas.style.opacity = '1';
        fractalCanvas.style.transform = 'scale(1)';
        fractalCanvas.style.filter = 'blur(0)';
    }, 200);

    // Показываем сообщение об успешной загрузке
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Готово! Начните рисовать фракталы!';
    successMessage.id = 'successMessage';
    document.body.appendChild(successMessage);
    setTimeout(() => {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }, 800);

    // Обработчик скролла для анимации при достижении низа страницы
    const scrollTrigger = document.getElementById('scroll-trigger');
    const scrollEffect = document.createElement('div');
    scrollEffect.className = 'scroll-effect';
    document.body.appendChild(scrollEffect);
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        const viewportHeight = window.innerHeight;
        const scrollTriggerPosition = scrollTrigger.getBoundingClientRect().top + scrollPosition;
        
        if (scrollTriggerPosition <= scrollPosition + viewportHeight / 2) {
            scrollEffect.classList.add('active');
        } else {
            scrollEffect.classList.remove('active');
        }
    });
    
    // Обработчик для кнопки "Кинетическая живопись"
    const paintingModeBtn = document.getElementById('paintingModeBtn');
    paintingModeBtn.addEventListener('click', () => {
        if (paintingModeBtn.classList.contains('active')) {
            paintingModeInstance.deactivate();
            paintingModeBtn.classList.remove('active');
        } else {
            paintingModeInstance.activate();
            paintingModeBtn.classList.add('active');
        }
    });
    
    // Обработчик для кнопки переключения режима
    document.getElementById('toggle3DModeBtn').addEventListener('click', toggle3DMode);
    
    // Запуск анимации волны при клике на канвас
    canvas.addEventListener('click', (e) => {
        if (e.target === canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Передаём координаты клика в режим "Кинетическая живопись"
            paintingModeInstance.handleCanvasClick(x, y);
            console.log('Клик на канвас! Координаты:', x, y);
            
            // Анимация волны
            canvas.classList.add('wave-animation');
            setTimeout(() => {
                canvas.classList.remove('wave-animation');
            }, 800);
        }
    });
};

// Функция для отображения визуального индикатора активности
const updateAudioVisualFeedback = (audioData) => {
    const audioIndicator = document.getElementById('audioIndicator');
    if (!audioIndicator) return;
    
    // Обновляем индикатор активности на основе данных аудио
    const bassLevel = audioData.bass;
    const midLevel = audioData.mid;
    const trebleLevel = audioData.treble;
    
    // Обновляем стили индикатора
    audioIndicator.style.opacity = Math.min(bassLevel / 100, 1);
    audioIndicator.textContent = `AUDIO: ${Math.round(bassLevel)}`;
    
    // Анимация для визуализации активности
    document.body.classList.add('audio-active');
    setTimeout(() => {
        document.body.classList.remove('audio-active');
    }, 500);
};

// Инициализация режима "Кинетическая живопись"
const initPaintingMode = ({ canvas }) => {
    const fractal = new Fractal(canvas);
    return new PaintingModeSync(fractal);
};

// Инициализация audioWorker
function initAudioWorker() {
    audioWorker = new Worker('./js/audioWorker.js');
    audioWorker.onmessage = function(e) {
        if (e.data.type === 'audioAnalysisResult') {
            // Передаём данные анализа в fractalWorker
            if (fractalWorker) {
                fractalWorker.postMessage({
                    type: 'audioUpdate',
                    data: e.data.data
                });
            }
        }
    };
    audioWorker.postMessage({ type: 'initAudioContext' });
}

// Показать состояние загрузки
const showLoading = () => {
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.remove('hidden');
    console.log('Loading shown');
};

// Скрыть состояние загрузки
const hideLoading = () => {
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.add('hidden');
    console.log('Loading hidden');
};

// Проверка на отключение анимаций
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    console.log('Анимации отключены для пользователя');
    document.body.classList.add('no-animations');
}

window.onload = function() {
    initFractal();
    initAudioWorker();
}