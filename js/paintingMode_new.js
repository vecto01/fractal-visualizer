// ===== Режим "Кинетическая живопись" ====

class PaintingModeSync {
    constructor(fractal) {
        this.fractal = fractal;
        this.isActive = false;
        this.audioData = { bass: 0, mid: 0, treble: 0 };
        this.audioWorker = null;
        this.canvas = fractal.canvas;
        this.ctx = fractal.ctx;
    }

    activate() {
        this.isActive = true;
        this.initAudioWorker();
        this.setupEventListeners();
    }

    deactivate() {
        this.isActive = false;
        this.cleanupAudioWorker();
        this.cleanupEventListeners();
    }

    initAudioWorker() {
        this.audioWorker = new Worker('js/audioWorker.js');
        this.audioWorker.onmessage = (e) => {
            this.audioData = e.data;
            this.updateFractalParameters();
        };
    }

    cleanupAudioWorker() {
        if (this.audioWorker) {
            this.audioWorker.terminate();
            this.audioWorker = null;
        }
    }

    setupEventListeners() {
        const canvas = this.canvas;
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.handleCanvasClick(x, y);
        });
    }

    cleanupEventListeners() {
        const canvas = this.canvas;
        canvas.removeEventListener('click', this.handleCanvasClick);
    }

    handleCanvasClick(x, y) {
        // Преобразуем координаты в параметры фрактала
        const normalizedX = (x / this.canvas.width) * 2 - 1;
        const normalizedY = (y / this.canvas.height) * 2 - 1;
        
        // Обновляем параметры фрактала
        this.fractal.setZoom(1.05);
        this.fractal.setOffset(normalizedX, normalizedY);
        
        // Анимация волны
        this.canvas.classList.add('wave-animation');
        
        // Удаляем анимацию через requestAnimationFrame
        let animationEnded = false;
        const removeAnimation = () => {
            if (!animationEnded) {
                const style = window.getComputedStyle(this.canvas);
                if (style.animationName === 'none') {
                    animationEnded = true;
                    this.canvas.classList.remove('wave-animation');
                } else {
                    requestAnimationFrame(removeAnimation);
                }
            }
        };
        requestAnimationFrame(removeAnimation);
    }

    updateFractalParameters() {
        // Дебаунс для ограничения частоты обновлений
        if (this.lastUpdateTime && Date.now() - this.lastUpdateTime < 16) {
            return; // Ограничиваем частоту обновлений до ~60fps
        }
        this.lastUpdateTime = Date.now();
        
        // Обновляем параметры фрактала на основе аудио
        const { bass, mid, treble } = this.audioData;
        
        // Применяем изменения к фракталу
        this.fractal.setMaxIterations(50 + Math.min(bass / 2, 100)); // Ограничиваем максимальные значения
        this.fractal.setColorPalette(Math.max(0, Math.min(mid / 100, 1)));
    }

    // Методы для работы с фракталом
    setZoom(zoom) {
        this.fractal.setZoom(zoom);
    }

    setOffset(x, y) {
        this.fractal.setOffset(x, y);
    }

    setMaxIterations(iterations) {
        this.fractal.setMaxIterations(iterations);
    }

    setColorPalette(paletteIndex) {
        this.fractal.setColorPalette(paletteIndex);
    }
}