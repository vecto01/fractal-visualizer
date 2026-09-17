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

// Флаг активного режима
let is3DMode = false;

// ===== ОБРАБОТКА ОШИБОК ====
const handleError = (error) => {
    console.error("Ошибка в приложении:", error);
    alert("Произошла ошибка. Проверьте совместимость браузера или обновите страницу.");
};

// ===== ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ ====
const toggle3DMode = () => {
    try {
        if (is3DMode) {
            // Возврат в 2D режим
            const canvas = document.getElementById('fractalCanvas');
            canvas.style.display = 'block';
            document.getElementById('app').innerHTML = '';
            const mountPoint = document.getElementById('app');
            mountPoint.appendChild(canvas);
            
            // Перезапуск 2D фрактала
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

// ===== ИНИЦИАЛИЗАЦИЯ ФРАКТАЛА ====
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
    
    // Инициализация обработки аудио
    fractalWorker.postMessage({
        type: 'initAudioWorker',
        audioData: {
            bass: 0,
            mid: 0,
            treble: 0
        },
        params
    });
    
    // Функция для инициализации режима "Кинетическая живопись"
    const initPaintingMode = ({ canvas }) => {
        const fractal = new Fractal(canvas);
        const paintingMode = new PaintingModeSync(fractal);
        return paintingMode;
    };
    
    // Инициализация режима "Кинетическая живопись"
    const paintingModeInstance = initPaintingMode({ canvas });
    
    // Скрыть состояние загрузки
    hideLoading();
    
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

// Проверка на отключение анимаций
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    console.log('Анимации отключены для пользователя');
    document.body.classList.add('no-animations');
}

// Отладочная функция для проверки состояния загрузки
const debugLoadingState = () => {
    const loadingElement = document.getElementById('loading');
    console.log('Loading state:', loadingElement.classList.contains('hidden') ? 'hidden' : 'visible');
    console.log('Loading opacity:', window.getComputedStyle(loadingElement).opacity);
};

// Показать состояние загрузки
const showLoading = () => {
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.remove('hidden');
    console.log('Loading shown');
    debugLoadingState();
};

// Скрыть состояние загрузки
const hideLoading = () => {
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.add('hidden');
    console.log('Loading hidden');
    debugLoadingState();
};

// Запуск инициализации
initFractal();