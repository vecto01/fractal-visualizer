// audioWorker.js
// Обработка аудиопотока и анализа частотного спектра

// Канал связи с main.js
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser;
let dataArray;

self.onmessage = function(e) {
    if (e.data.type === 'initAudioContext') {
        // Инициализация AnalyserNode
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        // Отправляем подтверждение инициализации
        self.postMessage({
            type: 'audioContextReady'
        });
    } else if (e.data.type === 'analyzeAudio') {
        // Анализ частотного спектра
        analyser.getByteFrequencyData(dataArray);
        
        // Преобразуем данные в формат для передачи
        const frequencies = {
            bass: getBassLevel(dataArray),
            mid: getMidLevel(dataArray),
            treble: getTrebleLevel(dataArray)
        };
        
        // Отправляем результат в main.js
        self.postMessage({
            type: 'audioAnalysisResult',
            data: frequencies
        });
    }
};

// Определение уровней частот
function getBassLevel(data) {
    const bassBins = 20; // Нижние 20 бинов
    let sum = 0;
    for (let i = 0; i < bassBins; i++) {
        sum += data[i];
    }
    return sum / bassBins;
}

function getMidLevel(data) {
    const midBins = 60; // Средние 60 бинов (примерно 200–1000 Гц)
    let sum = 0;
    for (let i = bassBins; i < bassBins + midBins; i++) {
        sum += data[i];
    }
    return sum / midBins;
}

function getTrebleLevel(data) {
    const trebleBins = 176; // Верхние 176 бинов (примерно 1000 Гц и выше)
    let sum = 0;
    for (let i = bassBins + midBins; i < data.length; i++) {
        sum += data[i];
    }
    return sum / trebleBins;
}