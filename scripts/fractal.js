// Кэш в памяти для быстрого доступа
const memoryCache = new Map();

// Функция для кэширования результатов рендеринга в памяти
function cacheKey(fractalType, palette, iterations, zoom) {
    return `${fractalType}_${palette.join('_')}_${iterations}_${zoom}`;
}

// Функция для получения кэшированных данных из памяти
function getCachedData(fractalType, palette, iterations, zoom) {
    const key = cacheKey(fractalType, palette, iterations, zoom);
    return memoryCache.get(key);
}

// Функция для сохранения рендеринга в кэш памяти
function saveToMemoryCache(key, data) {
    memoryCache.set(key, data);
}

// Функция для рендеринга фрактала с использованием Web Worker
function renderFractalWithWebWorker(canvas, fractalType, palette, iterations, zoom) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const key = cacheKey(fractalType, palette, iterations, zoom);
    
    // Проверяем кэш памяти
    const cachedData = getCachedData(fractalType, palette, iterations, zoom);
    if (cachedData) {
        ctx.putImageData(cachedData, 0, 0);
        return;
    }
    
    // Создаем Web Worker для рендеринга
    const worker = new Worker('scripts/fractalWorker.js');
    
    // Отправляем данные в Worker
    worker.postMessage({
        fractalType,
        palette,
        iterations,
        zoom,
        width,
        height
    });
    
    // Обработчик сообщения от Worker
    worker.onmessage = function(e) {
        const result = e.data;
        ctx.putImageData(result, 0, 0);
        saveToMemoryCache(key, result); // Сохраняем в кэш
    };
    
    // Обработчик ошибок
    worker.onerror = function(error) {
        console.error('Ошибка в Worker:', error);
        // Падабэк: рендерим на основном потоке (без Web Worker)
        const fallbackCtx = canvas.getContext('2d');
        const fallbackImageData = fallbackCtx.createImageData(canvas.width, canvas.height);
        const fallbackData = fallbackImageData.data;
        for (let i = 0; i < fallbackData.length; i += 4) {
            fallbackData[i] = 255;
            fallbackData[i + 1] = 255;
            fallbackData[i + 2] = 255;
            fallbackData[i + 3] = 255;
        }
        fallbackCtx.putImageData(fallbackImageData, 0, 0);
    };
    };
}
// Удаляем старую функцию рендеринга с кэшированием в localStorage
// Функция для рендеринга фрактала с использованием Web Worker
function updateFractal() {
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    const palette = palettes[currentPalette];

    // Анимация обновления
    const updateAnimation = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Анимация прогресса
        const progressImageData = ctx.createImageData(canvas.width, canvas.height);
        const progressData = progressImageData.data;
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const progress = (y * canvas.width + x) / (canvas.width * canvas.height);
    // Анимация появления канваса
    const canvas = document.getElementById('fractalCanvas');
    canvas.style.opacity = '0';
    setTimeout(() => {
        canvas.style.opacity = '1';
    }, 100);
        }
        ctx.putImageData(progressImageData, 0, 0);
    };
    
    // Вызываем анимацию обновления
    updateAnimation();
    
    // Рендерим фрактал с использованием Web Worker
    renderFractalWithWebWorker(canvas, currentFractal, palette, iterations, zoom);
    
    // Микроинтерактивность: пульсация кнопки
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.style.transform = 'scale(1.05)';
    setTimeout(() => {
        updateBtn.style.transform = 'scale(1)';
    }, 200);
}
            let iter = 0;
            
            while (zx * zx + zy * zy < 4 && iter < iterations) {
                const zxTemp = zx * zx - zy * zy + xi;
                zy = 2 * zx * zy + yi;
                zx = zxTemp;
                iter++;
            }
            
            const index = (y * width + x) * 4;
            if (iter === iterations) {
                data[index] = 0;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 255;
            } else {
                const colorIndex = Math.min(iter, palette.length - 1);
                const [r, g, b] = palette[colorIndex];
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = 255;
            }
        }
    }
    
    // Сохраняем данные в кэш
    saveToCache(key, data);
    ctx.putImageData(imageData, 0, 0);
}
// Функция для рендеринга фрактала Джулия с анимацией
function renderJuliaWithAnimation(canvas, palette, iterations, zoom) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = -0.7;
    const centerY = 0.27015;
    const xMin = -1.5;
    const xMax = 1.5;
    const yMin = -1.5;
    const yMax = 1.5;
    
    // Анимация загрузки
    const loadingAnimation = () => {
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const progress = (y * width + x) / (width * height);
                const colorIndex = Math.floor(progress * palette.length);
                const [r, g, b] = palette[colorIndex];
                const index = (y * width + x) * 4;
                data[index] = r * progress;
                data[index + 1] = g * progress;
                data[index + 2] = b * progress;
                data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };
    
    // Основной рендеринг
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Основной алгоритм рендеринга
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const real = xMin + (x / (width - 1)) * (xMax - xMin);
            const imag = yMin + (y / (height - 1)) * (yMax - yMin);
            let zx = real;
            let zy = imag;
            let cx = centerX;
            let cy = centerY;
            let iter = 0;
            
            while (zx * zx + zy * zy < 4 && iter < iterations) {
                const zxTemp = zx * zx - zy * zy + cx;
                zy = 2 * zx * zy + cy;
                zx = zxTemp;
                iter++;
            }
            
            const index = (y * width + x) * 4;
            if (iter === iterations) {
                data[index] = 0;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 255;
            } else {
                const colorIndex = Math.min(iter, palette.length - 1);
                const [r, g, b] = palette[colorIndex];
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = 255;
            }
        }
    }
    
    // Анимация завершения
    const animateFinish = () => {
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        const finalPalette = palettes[currentPalette];
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const progress = (y * width + x) / (width * height);
                const colorIndex = Math.floor(progress * finalPalette.length);
                const [r, g, b] = finalPalette[colorIndex];
                const index = (y * width + x) * 4;
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };
    
    // Анимация загрузки
    loadingAnimation();
    ctx.putImageData(imageData, 0, 0);
    animateFinish();
}

// Палитры
const palettes = {
    Plasma: [
        [255, 0, 0], [255, 127, 0], [255, 255, 0], [0, 255, 0], [0, 0, 255], [75, 0, 130], [143, 0, 255]
    ],
    Night: [
        [0, 0, 0], [0, 0, 100], [0, 100, 200], [100, 100, 255], [200, 200, 255], [255, 255, 255]
    ],
    Solar: [
        [255, 0, 0], [255, 165, 0], [255, 255, 0], [127, 255, 0], [0, 255, 0], [0, 0, 255]
    ],
    Ultraviolet: [
        [147, 112, 219], [100, 149, 237], [135, 206, 235], [173, 216, 230], [230, 230, 250], [255, 255, 255]
    ],
    Monochrome: [
        [0, 0, 0], [50, 50, 50], [100, 100, 100], [150, 150, 150], [200, 200, 200], [255, 255, 255]
    ],
    RainbowGradient: [
        [255, 0, 0], [255, 127, 0], [255, 255, 0], [0, 255, 0], [0, 0, 255], [75, 0, 130], [143, 0, 255], [255, 0, 255]
    ],
    EarthTones: [
        [139, 69, 19], [205, 133, 63], [255, 215, 0], [102, 205, 170], [0, 100, 0], [128, 0, 0]
    ]
};

// Инициализация
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

// Палитры для выбора
const paletteSelector = document.getElementById('paletteSelector');
for (const [name, colors] of Object.entries(palettes)) {
    const option = document.createElement('div');
    option.className = 'palette-option';
    option.textContent = name;
    option.dataset.palette = name;
    option.addEventListener('click', () => selectPalette(name));
    paletteSelector.appendChild(option);
}

// Выбранная палитра по умолчанию
let currentPalette = 'Plasma';
let currentFractal = 'mandelbrot';
let iterations = 50;
let zoom = 1;

// Обновление фрактала с анимацией
function updateFractal() {
    const palette = palettes[currentPalette];
    
    // Анимация обновления
    const loadingAnimation = () => {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Анимация загрузки
        const progressImageData = ctx.createImageData(canvas.width, canvas.height);
        const progressData = progressImageData.data;
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                progressData[index] = 255 * 0.5;
                progressData[index + 1] = 255 * 0.5;
                progressData[index + 2] = 255 * 0.5;
                progressData[index + 3] = 255;
            }
        }
        ctx.putImageData(progressImageData, 0, 0);
    };
    
// Обновление фрактала с кэшированием и анимацией
function updateFractal() {
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    const palette = palettes[currentPalette];
    
    // Анимация обновления
    const updateAnimation = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Добавляем анимацию обновления
        const progressImageData = ctx.createImageData(canvas.width, canvas.height);
        const progressData = progressImageData.data;
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const progress = (y * canvas.width + x) / (canvas.width * canvas.height);
                const index = (y * canvas.width + x) * 4;
                progressData[index] = 255 * progress;
                progressData[index + 1] = 255 * progress;
                progressData[index + 2] = 255 * progress;
                progressData[index + 3] = 255;
            }
        }
        ctx.putImageData(progressImageData, 0, 0);
    };
    
    // Вызываем анимацию обновления
    updateAnimation();
    
// Функция для экспорта в SVG
function exportToSVG() {
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Создаем SVG элемент
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Создаем группу для фрактала
    const group = document.createElementNS(svgNS, 'g');
    
    // Создаем изображение из canvas
    const img = document.createElementNS(svgNS, 'image');
    img.setAttribute('x', '0');
    img.setAttribute('y', '0');
    img.setAttribute('width', width);
    img.setAttribute('height', height);
    img.setAttribute('href', canvas.toDataURL('image/png'));
    
    group.appendChild(img);
    svg.appendChild(group);
    
    // Преобразуем SVG в строку
    const serializer = new XMLSerializer();
    let svgStr = serializer.serializeToString(svg);
    
    // Добавляем метаданные
    svgStr = `<?xml version="1.0" standalone="no"?>
<svg xmlns="${svgNS}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${svgStr}
</svg>`;
    
    // Создаем ссылку для скачивания
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const svgLink = document.createElement('a');
    svgLink.href = svgUrl;
    svgLink.download = 'fractal.svg';
    svgLink.click();
    
    // Удаляем временный URL
    URL.revokeObjectURL(svgUrl);
}
    
    // Микроинтерактивность: пульсация кнопки
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.style.transform = 'scale(1.05)';
    setTimeout(() => {
        updateBtn.style.transform = 'scale(1)';
    }, 200);
}
}

// Выбор палитры
function selectPalette(name) {
    currentPalette = name;
    const options = document.querySelectorAll('.palette-option');
    options.forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`.palette-option[data-palette="${name}"]`).classList.add('active');
    updateFractal();
}

// Обновление значений
document.getElementById('iterations').addEventListener('input', (e) => {
    iterations = parseInt(e.target.value);
    document.getElementById('iterationsValue').textContent = iterations;
    updateFractal();
});

// Экспорт фрактала в PNG и GIF
document.getElementById('exportBtn').addEventListener('click', () => {
    const canvas = document.getElementById('fractalCanvas');
    const exportFormatSpan = document.getElementById('exportFormat');
    
    // Анимация экспорта
    const exportAnimation = () => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                data[index] = 255;
                data[index + 1] = 255;
                data[index + 2] = 255;
                data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        setTimeout(() => {
            updateFractal();
        }, 500);
    };
    
    // Экспорт в PNG
    const pngLink = document.createElement('a');
    pngLink.download = 'fractal.png';
    pngLink.href = canvas.toDataURL('image/png');
    pngLink.click();
    exportFormatSpan.textContent = 'PNG';
    
    // Экспорт в GIF
    const gifExport = () => {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height,
            repeat: 0,
            transparent: 'rgba(0, 0, 0, 0)'
        });
        
        // Добавляем 3 кадра для анимации
        for (let i = 0; i < 3; i++) {
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = canvas.width;
            frameCanvas.height = canvas.height;
            const frameCtx = frameCanvas.getContext('2d');
            
            // Копируем данные с основного canvas
            frameCtx.drawImage(canvas, 0, 0);
            
            // Добавляем эффект сдвига для анимации
            if (i > 0) {
                frameCtx.translate(i, i);
                frameCtx.drawImage(canvas, -i, -i);
            }
            
            gif.addFrame(frameCanvas, {
                delay: 100,
                copy: true
            });
        }
        
        // Обработчик завершения экспорта
        gif.on('finished', function(blob) {
            const gifLink = document.createElement('a');
            gifLink.download = 'fractal.gif';
            gifLink.href = URL.createObjectURL(blob);
            gifLink.click();
            exportFormatSpan.textContent = 'GIF';
        });
        
        gif.render();
    };
    
    exportAnimation();
    gifExport();
};
    const exportFormatSpan = document.getElementById('exportFormat');
    let exportFormat = 'png';
    
    // Анимация экспорта
    const exportAnimation = () => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                data[index] = 255;
                data[index + 1] = 255;
                data[index + 2] = 255;
                data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        setTimeout(() => {
            updateFractal();
        }, 500);
    };
    
    // Экспорт в PNG
    const pngLink = document.createElement('a');
    pngLink.download = 'fractal.png';
    pngLink.href = canvas.toDataURL('image/png');
    pngLink.click();
    exportFormatSpan.textContent = 'PNG';
    
    // Экспорт в GIF
// Экспорт в GIF
const gifExport = () => {
    const canvas = document.getElementById('fractalCanvas');
    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        repeat: 0,
        transparent: 'rgba(0, 0, 0, 0)'
    });
    
    // Добавляем 3 кадра для анимации
    for (let i = 0; i < 3; i++) {
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = canvas.width;
        frameCanvas.height = canvas.height;
        const frameCtx = frameCanvas.getContext('2d');
        
        // Копируем данные с основного canvas
        frameCtx.drawImage(canvas, 0, 0);
        
        // Добавляем эффект сдвига для анимации
        if (i > 0) {
            frameCtx.translate(i, i);
            frameCtx.drawImage(canvas, -i, -i);
        }
        
        gif.addFrame(frameCanvas, {
            delay: 100,
            copy: true
        });
    }
    
    // Обработчик завершения экспорта
    gif.on('finished', function(blob) {
        const gifLink = document.createElement('a');
        gifLink.download = 'fractal.gif';
        gifLink.href = URL.createObjectURL(blob);
        gifLink.click();
        exportFormatSpan.textContent = 'GIF';
    });
    
    gif.render();
};
    };
    
    exportAnimation();
    gifExport();
};
    
    // Экспорт в PNG
    const pngLink = document.createElement('a');
    pngLink.download = 'fractal.png';
    // Экспорт фрактала
    document.getElementById('exportBtn').addEventListener('click', () => {
        const canvas = document.getElementById('fractalCanvas');
        const exportFormat = document.getElementById('exportFormat').value;
        
        // Анимация экспорта
        const exportAnimation = () => {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;
                    data[index] = 255;
                    data[index + 1] = 255;
                    data[index + 2] = 255;
                    data[index + 3] = 255;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            setTimeout(() => {
                updateFractal();
            }, 500);
        };
        exportAnimation();
        // Вибрация на мобильных устройствах
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
        if (exportFormat === 'png') {
            const pngLink = document.createElement('a');
            pngLink.download = 'fractal.png';
            pngLink.href = canvas.toDataURL('image/png');
            pngLink.click();
        } else if (exportFormat === 'svg') {
            exportToSVG();
        }
    });

    
    // Экспорт в GIF
    const gifExport = () => {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height,
            repeat: 0,
            transparent: 'rgba(0, 0, 0, 0)'
        });
        
        // Добавляем 3 кадра для анимации
        for (let i = 0; i < 3; i++) {
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = canvas.width;
            frameCanvas.height = canvas.height;
            const frameCtx = frameCanvas.getContext('2d');
            
            // Копируем данные с основного canvas
            frameCtx.drawImage(canvas, 0, 0);
            
            // Добавляем эффект сдвига для анимации
            if (i > 0) {
                frameCtx.translate(i * 2, i * 2);
                frameCtx.drawImage(canvas, -i * 2, -i * 2);
            }
            
            gif.addFrame(frameCanvas, {
                delay: 100,
                copy: true
            });
        }
        
        // Обработчик завершения экспорта
        gif.on('finished', function(blob) {
            const gifLink = document.createElement('a');
            gifLink.download = 'fractal.gif';
            gifLink.href = URL.createObjectURL(blob);
            gifLink.click();
        });
        
        gif.render();
    };
    gifExport();
};
});

document.getElementById('updateBtn').addEventListener('click', () => {
    updateFractal();
});

// Экспорт фрактала
document.getElementById('exportBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'fractal.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    // Анимация экспорта
    const exportAnimation = () => {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                data[index] = 255;
                data[index + 1] = 255;
                data[index + 2] = 255;
                data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        setTimeout(() => {
            updateFractal();
        }, 500);
    };
    exportAnimation();
});

// Адаптивность
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
    updateFractal();
});

// Начальное рендеринг
updateFractal();