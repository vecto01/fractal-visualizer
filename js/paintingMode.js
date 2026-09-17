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