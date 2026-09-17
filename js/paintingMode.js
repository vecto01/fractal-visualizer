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