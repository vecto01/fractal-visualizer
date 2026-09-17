// ===== Основная логика приложения ====
import { Fractal } from './fractal.js';
import PaintingModeSync from './paintingMode_new.js';

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
window.updateFractal = (params) => {
    const fractalWorker = new Worker('js/fractalWorker.js');
    fractalWorker.postMessage({ params });
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

// Инициализация фрактала
const initFractal = () => {
    console.log('Initializing fractal...');
    showLoading();

    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    
    // Создаём Worker для рендеринга фрактала
    const fractalWorker = new Worker('js/fractalWorker.js');
    
    // Обработчик сообщений от Worker
    fractalWorker.onmessage = function(e) {
        if (e.data.type === 'fractalRenderedWithAudio') {
            ctx.putImageData(e.data.data, 0, 0);
            updateAudioVisualFeedback(e.data.audioData);
        } else {
            ctx.putImageData(e.data, 0, 0);
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
    
    // Функция для инициализации режима "Кинетическая живопись"
    const initPaintingMode = ({ canvas }) => {
        const fractal = new Fractal(canvas);
        const paintingMode = new PaintingModeSync(fractal);
        return paintingMode;
    };

    // Инициализация режима "Кинетическая живопись"
    const paintingModeInstance = initPaintingMode({ canvas });
    
    // Скрыть состояние загрузки после инициализации

    // Обработчик для кнопки "Кинетическая живопись"
    paintingModeBtn.addEventListener('click', () => {
        if (paintingModeBtn.classList.contains('active')) {
            paintingModeInstance.deactivate();
            paintingModeBtn.classList.remove('active');
        } else {
            paintingModeInstance.activate();
            paintingModeBtn.classList.add('active');
        }
    });
    setTimeout(() => {
        hideLoading();
    }, 1500);
    
    // Обработчик для кнопки "Кинетическая живопись"
    paintingModeBtn.addEventListener('click', () => {
        if (paintingModeBtn.classList.contains('active')) {
            paintingModeInstance.deactivate();
            paintingModeBtn.classList.remove('active');
        } else {
            paintingModeInstance.activate();
            paintingModeBtn.classList.add('active');
        }
    });
};

// Экспорт фрактала как GIF
const exportAsGif = () => {
    const canvas = document.getElementById('fractalCanvas');
    const gifProgressBar = document.getElementById('gifProgressBar');
    const gifProgress = document.getElementById('gifProgress');
    const gifProgressText = document.getElementById('gifProgressText');
    
    gifProgressBar.style.display = 'block';
    gifProgressText.style.display = 'none';
    gifProgress.style.width = '0%';
    
    // Создаём экземпляр GIF
    const gif = new GIF({
        width: canvas.width,
        height: canvas.height,
        workers: 2,
        quality: 10,
        repeat: 0,
        frameDelay: 100,
        render: function(currentFrameTime) {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0);
            gif.addFrame(ctx);
        }
    });
    
    // Отслеживаем прогресс
    gif.on('frame', (frame) => {
        const progress = (frame.frame / gif.frames) * 100;
        gifProgress.style.width = `${progress}%`;
        gifProgressText.textContent = `Загрузка: ${Math.round(progress)}%`;
        gifProgressText.style.display = 'block';
        gifProgressBar.style.display = 'block';
    });
    
    gif.on('finished', (blob) => {
        gifProgressBar.style.display = 'none';
        gifProgressText.style.display = 'block';
        gifProgress.style.width = '100%';
        
        // Сохраняем GIF
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fractal.gif';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    gif.on('error', (error) => {
        gifProgressBar.style.display = 'none';
        gifProgressText.style.display = 'none';
        gifProgress.style.width = '0%';
        console.error('Ошибка экспорта:', error);
    });
    
    // Запускаем экспорт
    gif.render();
};

// Запуск инициализации
initFractal();

// Экспорт экземпляра paintingModeInstance в глобальную область видимости
window.paintingModeInstance = paintingModeInstance;