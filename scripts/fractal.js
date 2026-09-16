// Функция для рендеринга фрактала Мандельброта с анимацией
function renderMandelbrotWithAnimation(canvas, palette, iterations, zoom) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = -0.5;
    const centerY = 0;
    const xMin = centerX - zoom;
    const xMax = centerX + zoom;
    const yMin = centerY - zoom;
    const yMax = centerY + zoom;
    
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
            let zx = 0;
            let zy = 0;
            let xi = real;
            let yi = imag;
            let iter = 0;
            
            while (zx * zx + zy * zy < 4 && iter < iterations) {
                zx = zx * zx - zy * zy + xi;
                zy = 2 * zx * zy + yi;
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
    
    // Обновление фрактала
    if (currentFractal === 'mandelbrot') {
        renderMandelbrotWithAnimation(canvas, palette, iterations, zoom);
    } else {
        renderJuliaWithAnimation(canvas, palette, iterations, zoom);
    }
    
    // Микроинтерактивность: пульсация кнопки
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.style.transform = 'scale(1.05)';
    setTimeout(() => {
        updateBtn.style.transform = 'scale(1)';
    }, 200);
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

document.getElementById('fractalType').addEventListener('change', (e) => {
    currentFractal = e.target.value;
    updateFractal();
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