// Кэш для сохранения результатов рендеринга
const cache = {}

// Функция для кэширования результатов рендеринга
function cacheKey(fractalType, palette, iterations, zoom) {
    return `${fractalType}_${palette}_${iterations}_${zoom}`;
}

// Функция для получения кэшированных данных или рендеринга
function getCachedData(fractalType, palette, iterations, zoom) {
    const key = cacheKey(fractalType, palette, iterations, zoom);
    const cachedData = localStorage.getItem(key);
    
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return null;
}

// Функция для сохранения рендеринга в кэш
function saveToCache(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// Основной рендеринг с кэшированием
function renderFractalWithCache(canvas, fractalType, palette, iterations, zoom) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const key = cacheKey(fractalType, palette.join('_'), iterations, zoom);
    
    // Проверяем кэш
    const cachedData = getCachedData(fractalType, palette.join('_'), iterations, zoom);
    
    // Анимация загрузки
    const loadingAnimation = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);
        
        // Добавляем спиннер
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 15, 0, Math.PI * 2);
        ctx.strokeStyle = 'var(--accent-color)';
        ctx.lineWidth = 2;
        ctx.stroke();
    };
    
    // Если данные кэшированы, просто отрисовываем их
    if (cachedData) {
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Восстанавливаем данные из кэша
        for (let i = 0; i < data.length; i += 4) {
            data[i] = cachedData[i];
            data[i + 1] = cachedData[i + 1];
            data[i + 2] = cachedData[i + 2];
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
        return;
    }
    
    // Создаем ImageData для рендеринга
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Основной алгоритм рендеринга
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let real, imag;
            if (fractalType === 'mandelbrot') {
                real = -0.5 + (x / (width - 1)) * zoom;
                imag = 0 + (y / (height - 1)) * zoom;
            } else {
                real = -1.5 + (x / (width - 1)) * 3;
                imag = -1.5 + (y / (height - 1)) * 3;
            }
            
            let zx = 0;
            let zy = 0;
            let xi = real;
            let yi = imag;
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
    
    // Рендерим фрактал с кэшированием
    renderFractalWithCache(canvas, currentFractal, palette, iterations, zoom);
    
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
    pngLink.href = canvas.toDataURL('image/png');
    pngLink.click();
    
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