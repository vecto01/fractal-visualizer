// Настройки для анализатора частот
const analyzerNode = new Tone.Analyser(256, Tone.fftSize(256));
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;

// Инициализация анализатора
function initAudioAnalyzer() {
    analyzerNode.connect(audioContext.destination);
    Tone.start();
    
    // Подключение микрофона или аудиофайла
    audioSource = Tone.getMic();
    audioSource.connect(analyzerNode);
    
    // Обновление параметров фрактала в зависимости от частотного спектра
    Tone.Transport.scheduleRepeat(updateFractalParams, 0.1);
}

// Обновление параметров фрактала
function updateFractalParams() {
    const dataArray = new Uint8Array(analyzerNode.frequencyBinCount);
    analyzerNode.getByteFrequencyData(dataArray);
    
    // Вычисляем среднюю частоту
    const avgFrequency = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    
    // Обновляем параметры фрактала
    const depthInput = document.getElementById('depth');
    const pointCountInput = document.getElementById('point-count');
    
    // Динамическое изменение параметров в зависимости от частоты
    depthInput.value = Math.min(100, Math.max(10, avgFrequency / 2.5));
    pointCountInput.value = Math.min(2000, Math.max(500, avgFrequency * 2));
    
    // Обновляем визуализацию
    if (window.init3DRender && window.init3DRender.updateFractal) {
        window.init3DRender.updateFractal();
    }
}

// Запуск анализатора
initAudioAnalyzer();