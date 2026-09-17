// Генератор GIF-фракталов
const GIF = require('gif.js');

// Функция для экспорта анимации в GIF
function exportGIF() {
    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
    });
    
    const frames = [];
    const frameCount = 10; // Количество кадров для экспорта
    const delay = 100; // Задержка между кадрами в миллисекундах
    
    // Захват кадров
    const captureFrames = () => {
        const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        gif.addFrame(frameData.data, { delay: delay });
        frames.push(frameData);
        
        if (frames.length < frameCount) {
            requestAnimationFrame(captureFrames);
        } else {
            gif.on('finished', (blob) => {
                const link = document.createElement('a');
                link.download = 'fractal.gif';
                link.href = URL.createObjectURL(blob);
                link.click();
            });
            gif.render();
        }
    };
    
    captureFrames();
}

// Экспорт функции для использования в main.js
window.exportGIF = exportGIF;