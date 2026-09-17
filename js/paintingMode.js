// ===== Кинетическая живопись =====
// Режим, в котором фрактал изменяется под воздействием звука или клавиатуры.

/**
 * Инициализация режима "Кинетическая живопись"
 * @param {Object} canvas - Элемент canvas для рендеринга фрактала
 * @param {Object} fractalParams - Параметры фрактала для изменения
 */
const initPaintingMode = (canvas, fractalParams) => {
    const ctx = canvas.getContext('2d');
    let audioContext;
    let analyser;
    let audioSource;
    let dataArray;
    let animationId;
    let isActive = false;
    
    // Инициализация Web Audio API
    const initAudio = () => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        // Настройка обработки аудиопотока
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
    };
    
    // Обработка аудиоданных для изменения параметров фрактала
    const updateFractalFromAudio = () => {
        if (!isActive) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Пример: изменение параметров фрактала в зависимости от частоты
        const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        
        // Изменение zoom
        const zoomFactor = 1 + (avgFrequency / 255) * 0.5;
        fractalParams.zoom = Math.max(0.1, Math.min(5, fractalParams.zoom * zoomFactor));
        
        // Изменение смещения центра фрактала
        const centerOffsetX = (Math.random() - 0.5) * 0.005 * avgFrequency;
        const centerOffsetY = (Math.random() - 0.5) * 0.005 * avgFrequency;
        
        fractalParams.centerX += centerOffsetX;
        fractalParams.centerY += centerOffsetY;
    };
    
    // Обработка клавиатуры для ручного изменения параметров
    const handleKeyboardInput = (event) => {
        switch (event.key) {
            case 'ArrowUp':
                fractalParams.zoom *= 0.9;
                break;
            case 'ArrowDown':
                fractalParams.zoom *= 1.1;
                break;
            case 'ArrowLeft':
                fractalParams.xOffset -= 0.01;
                break;
            case 'ArrowRight':
                fractalParams.xOffset += 0.01;
                break;
            default:
                break;
        }
    };
    
    // Активация режима
    const activate = () => {
        if (isActive) return;
        isActive = true;
        initAudio();
        document.addEventListener('keydown', handleKeyboardInput);
        animationId = requestAnimationFrame(updateFractalFromAudio);
    };
    
    // Деактивация режима
    const deactivate = () => {
        if (!isActive) return;
        isActive = false;
        document.removeEventListener('keydown', handleKeyboardInput);
        cancelAnimationFrame(animationId);
    };
    
    return {
        activate,
        deactivate,
    };
};

// Глобальная регистрация функции
window.initPaintingMode = initPaintingMode;