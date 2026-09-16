// ===== Режим "Кинетическая живопись" ====
// Обработка звука и динамическое изменение фрактала

const PaintingMode = (() => {
    // Параметры для обработки звука
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyser;
    let microphoneStream;
    let dataArray;
    let animationFrameId;
    let isActive = false;
    
    // Настройки для фрактала (будут изменяться под звук)
    const fractalSettings = {
        colorPalette: 'Plasma',
        frequencyResponse: 0.5,
        amplitudeResponse: 0.3,
        baseColor: '#ff00ff',
        animationSpeed: 0.05,
    };
    
    // Инициализация анализатора звука
    function initAudio() {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    
    // Захват звука с микрофона
    async function startMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            microphoneStream = audioContext.createMediaStreamSource(stream);
            microphoneStream.connect(analyser);
            isActive = true;
        } catch (err) {
            console.error("Ошибка доступа к микрофону:", err);
            alert("Разрешите доступ к микрофону для режима "Кинетическая живопись"");
        }
    }
    
    // Остановка захвата звука
    function stopMicrophone() {
        if (microphoneStream) {
            microphoneStream.disconnect();
            microphoneStream.getTracks().forEach(track => track.stop());
            microphoneStream = null;
            isActive = false;
        }
    }
    
    // Обновление параметров фрактала на основе звука
    function updateFractalFromAudio() {
        if (!isActive) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Изменение параметров фрактала на основе частотного спектра
        const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        const avgAmplitude = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        
        // Динамическое изменение цвета и формы фрактала
        fractalSettings.baseColor = `hsl(${avgFrequency * 2}, 100%, 50%)`;
        fractalSettings.animationSpeed = 0.01 + (avgAmplitude / 255) * 0.04;
        
        // Обновление фрактала
        updateFractalVisualization();
    }
    
    // Обновление визуализации фрактала
    function updateFractalVisualization() {
        // Передача новых настроек в модуль фрактала
        if (typeof fractalUpdateCallback === 'function') {
            fractalUpdateCallback(fractalSettings);
        }
    }
    
    // Начало анимации
    function startAnimation() {
        if (!isActive) return;
        
        animationFrameId = requestAnimationFrame(updateFractalFromAudio);
    }
    
    // Остановка анимации
    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
    
    // Экспортируемые методы
    return {
// Обратная связь с модулем фрактала
let fractalUpdateCallback = null;
            initAudio();
            initAudio();
            return {
                start: startMicrophone,
                stop: stopMicrophone,
                startAnimation: startAnimation,
                stopAnimation: stopAnimation,
                setFractalCallback: (callback) => {
                    fractalUpdateCallback = callback;
                },
                updateFractalSettings: (settings) => {
                    if (fractalUpdateCallback) {
                        fractalUpdateCallback(settings);
                    }
                },
            };
                startAnimation: startAnimation,
                stopAnimation: stopAnimation,
                setFractalCallback: (callback) => {
                    fractalUpdateCallback = callback;
                },
            };
        },
    };
})();

// Глобальная переменная для обратной связи с модулем фрактала
let fractalUpdateCallback = null;