// Файл для рендеринга фракталов в Web Worker
// Обработка данных из main.js для синхронизации с аудио

let audioData = null;
let params = null;

self.onmessage = function(e) {
    if (e.data.type === 'params') {
        params = e.data.params;
    } else if (e.data.type === 'audioUpdate') {
        // Обновляем параметры фрактала на основе данных аудио
        audioData = e.data.data;
        const updatedParams = {
            ...params,
            maxIterations: Math.floor(audioData.bass * 2 + 50), // Бас влияет на количество итераций
            zoom: 1 + (audioData.mid / 100) // Мид изменяет масштаб
        };
        const fractalData = generateFractal(updatedParams);
        self.postMessage({
            type: 'fractalRenderedWithAudio',
            data: fractalData,
            audioData: audioData
        });
    } else {
        // Обычная генерация фрактала
        const fractalData = generateFractal(params);
        self.postMessage(fractalData);
    }
};

function generateFractal(params) {
    // Логика генерации фрактала (упрощённая версия)
    const { width, height, maxIterations, zoom, offsetX, offsetY } = params;
    const imageData = new Uint8ClampedArray(width * height * 4);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const real = (x - offsetX) / zoom;
            const imag = (y - offsetY) / zoom;
            let iter = 0;
            let zReal = 0;
            let zImag = 0;
            let temp;
            
            while (iter < maxIterations && zReal * zReal + zImag * zImag < 4) {
                temp = zReal * zReal - zImag * zImag + real;
                zImag = 2 * zReal * zImag + imag;
                zReal = temp;
                iter++;
            }
            
            // Цвет в зависимости от количества итераций и данных аудио
            const colourIndex = iter % 256 + Math.floor(audioData?.treble || 0);
            imageData[(y * width + x) * 4 + 0] = colourIndex; // R
            imageData[(y * width + x) * 4 + 1] = colourIndex; // G
            imageData[(y * width + x) * 4 + 2] = colourIndex; // B
            imageData[(y * width + x) * 4 + 3] = 255; // A
        }
    }
    
    return imageData;
}