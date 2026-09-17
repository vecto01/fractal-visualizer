<<<<<<< HEAD
import { Fractal } from './fractal.js';

class PaintingModeSync {
    constructor(fractal) {
        this.fractal = fractal;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationFrameId = null;
        this.isActive = false;
        this.lastTime = 0;
        this.lastClick = { x: 0, y: 0 };
        this.targetZoom = 1;
        this.targetRotation = 0;
        this.smoothFactor = 0.1;
        this.audioIndicatorElement = document.getElementById('audioIndicator');
        this.errorState = false;
    }

    // Инициализация Web Audio API
    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const microphone = this.audioContext.createMediaStreamSource(stream);
            microphone.connect(this.analyser);
            this.setAudioIndicator('AUDIO: Активен');
            return true;
        } catch (error) {
            console.error("Ошибка инициализации аудио:", error);
            this.setAudioIndicator('Ошибка: Микрофон недоступен');
            this.errorState = true;
            return false;
        }
    }

    // Установка текста для индикатора аудио
    setAudioIndicator(text) {
        if (this.audioIndicatorElement) {
            this.audioIndicatorElement.textContent = text;
        }
    }

    // Плавное обновление параметров фрактала
    updateFractal = (timestamp) => {
        if (!this.isActive || this.errorState) return;

        this.analyser.getByteFrequencyData(this.dataArray);
        const avg = this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
        const isMobile = window.innerWidth < 768;
        const speedFactor = isMobile ? 0.7 : 1.0;

        // Плавные переходы для параметров
        this.targetZoom = 1 + (avg / 255) * 0.3 * speedFactor;
        this.targetRotation = Math.sin(timestamp / 1500 * speedFactor) * 0.05;

        // Обновление аудиоэффектов для 3D-рендера
        if (window.update3DAudioEffect) {
            const audioIntensity = avg / 255;
            window.update3DAudioEffect(audioIntensity);
        }

        // Сглаживание параметров
        this.fractal.updateParams({
            zoom: this.fractal.params.zoom + (this.targetZoom - this.fractal.params.zoom) * this.smoothFactor,
            rotation: this.fractal.params.rotation + (this.targetRotation - this.fractal.params.rotation) * this.smoothFactor,
            xOffset: this.lastClick.x / window.innerWidth * 0.1,
            yOffset: this.lastClick.y / window.innerHeight * 0.1
        });

        this.animationFrameId = requestAnimationFrame(this.updateFractal);
    };

    // Запуск режима
    async activate() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        if (await this.initAudio()) {
            this.isActive = true;
            this.animationFrameId = requestAnimationFrame(this.updateFractal);
        } else {
            this.setAudioIndicator('Ошибка: Микрофон недоступен');
        }
    }

    // Остановка режима
    deactivate() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.isActive = false;
        this.setAudioIndicator('AUDIO: Неактивен');
    }

    // Обработчик кликов на канвас
    handleCanvasClick = (e) => {
        if (e.target === e.currentTarget) {
            this.lastClick = {
                x: e.clientX,
                y: e.clientY
            };
            // Добавляем эффект волны для визуальной обратной связи
            e.target.classList.add('wave-animation');
            setTimeout(() => {
                e.target.classList.remove('wave-animation');
            }, 800);
        }
    };

    // Тогглирование режима
    toggleMode() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate().catch(console.error);
        }
    }
}

export default PaintingModeSync;
=======
// ===== Режим "Кинетическая живопись" ====
// Обработка звука и синхронизация с фракталом

/**
 * Инициализация режима "Кинетическая живопись"
 * @param {Object} options - Параметры режима
 * @param {HTMLCanvasElement} canvas - Канвас для рендеринга
 */
const initPaintingMode = async (options) => {
    const { canvas } = options;
    let audioContext;
    let analyser;
    let dataArray;
    let animationFrameId;
    let isActive = false;
    let lastTime = 0;
    let lastClick = { x: 0, y: 0 }; // Добавлена переменная для хранения последнего клика
    
    // Инициализация Web Audio API
    const initAudio = async () => {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            // Подключение микрофона
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            
            return true;
        } catch (error) {
            console.error("Ошибка инициализации аудио:", error);
            return false;
        }
    };
    
    // Анализ аудиопотока и изменение параметров фрактала
    const updateFractal = (timestamp) => {
        if (!isActive) return;
        
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const timeDiff = timestamp - lastTime;
        lastTime = timestamp;
        
        // Кэширование значений для оптимизации
        const cachedAvg = avg;
        const cachedTimeDiff = timeDiff;
        
        // Определение скорости анимации в зависимости от устройства
        const isMobile = window.innerWidth < 768;
        const speedFactor = isMobile ? 0.7 : 1.0;
        
        // Изменение параметров фрактала на основе аудио с учетом адаптивности
        const fractalParams = {
            zoom: 1 + (cachedAvg / 255) * 0.3 * speedFactor,
            rotation: Math.sin(timestamp / 1500 * speedFactor) * 0.05,
            xOffset: 0,
            yOffset: 0,
            timeFactor: cachedTimeDiff / 1000 * speedFactor
        };
        
        // Обновление фрактала с минимальной задержкой
        if (typeof window.updateFractal === 'function') {
            window.updateFractal({
                ...fractalParams,
                xOffset: lastClick.x / canvas.width * 0.1,
                yOffset: lastClick.y / canvas.height * 0.1
            });
        }
        
        // Запланируем следующий кадр с использованием requestAnimationFrame
        animationFrameId = requestAnimationFrame(updateFractal);
    };
    
    // Запуск режима
    const activate = async () => {
        if (await initAudio()) {
            isActive = true;
            animationFrameId = requestAnimationFrame(updateFractal);
            console.log("Режим 'Кинетическая живопись' активирован");
        }
    }
    
    // Остановка режима
    const deactivate = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        isActive = false;
        console.log("Режим 'Кинетическая живопись' остановлен");
    }

    // Обработчик кликов на канвас
    const handleCanvasClick = (e) => {
        if (e.target === canvas) {
            lastClick = {
                x: e.clientX,
                y: e.clientY
            };
            console.log('Клик на канвас:', lastClick);
        }
    };

    // Экспорт функций
    return {
        handleCanvasClick,
    };

};

// ===== Экспорт ====
window.initPaintingMode = initPaintingMode;
>>>>>>> 0f94417c702024c8c962dd6f9ac41c1a75e899ef
