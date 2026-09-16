// Кеш для хранения результатов расчётов фракталов
const renderCache = new Map();

// Алгоритм рендеринга фрактала Мандельброта
function renderMandelbrot(ctx, width, height, maxIterations, colorScheme, offsetX = 0, offsetY = 0, zoom = 1) {
    const cacheKey = `${width}x${height}_${maxIterations}_${colorScheme}_${offsetX}_${offsetY}_${zoom}`;
    
    // Проверка кеша
    if (renderCache.has(cacheKey)) {
        const cachedImageData = renderCache.get(cacheKey);
        ctx.putImageData(cachedImageData, 0, 0);
        return;
    }
    
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Преобразование координат Canvas в комплексную плоскость с учётом смещения и масштаба
    const xMin = -2.0 * zoom + offsetX;
    const xMax = 1.0 * zoom + offsetX;
    const yMin = -1.5 * zoom + offsetY;
    const yMax = 1.5 * zoom + offsetY;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const real = xMin + (x / width) * (xMax - xMin);
            const imag = yMax - (y / height) * (yMax - yMin);
            
            let iter = 0;
            let zx = 0;
            let zy = 0;
            let xSquared = 0;
            let ySquared = 0;
            
            while (xSquared + ySquared < 4 && iter < maxIterations) {
                zy = 2 * zx * zy + imag;
                zx = xSquared - ySquared + real;
                xSquared = zx * zx;
                ySquared = zy * zy;
                iter++;
            }
            
            // Определение цвета в зависимости от схемы
            if (iter === maxIterations) {
                data[(y * width + x) * 4] = 0;     // R
                data[(y * width + x) * 4 + 1] = 0; // G
                data[(y * width + x) * 4 + 2] = 0; // B
                data[(y * width + x) * 4 + 3] = 255; // A
            } else {
                // Радужная схема
                if (colorScheme === 'rainbow') {
                    const hue = (iter % 255) / 255;
                    const rgb = hslToRgb(hue, 1, 0.5);
                    data[(y * width + x) * 4] = rgb.r * 255;
                    data[(y * width + x) * 4 + 1] = rgb.g * 255;
                    data[(y * width + x) * 4 + 2] = rgb.b * 255;
                    data[(y * width + x) * 4 + 3] = 255;
                } else if (colorScheme === 'black-white') {
                    const brightness = iter / maxIterations;
                    const gray = Math.floor(brightness * 255);
                    data[(y * width + x) * 4] = gray;
                    data[(y * width + x) * 4 + 1] = gray;
                    data[(y * width + x) * 4 + 2] = gray;
                    data[(y * width + x) * 4 + 3] = 255;
                }
            }
        }
    }
    
    // Сохранение в кеш
    renderCache.set(cacheKey, imageData);
    ctx.putImageData(imageData, 0, 0);
}

// Конвертация HSL в RGB
function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return { r, g, b };
}

// Основная логика

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fractal-canvas');
    const ctx = canvas.getContext('2d');
    const iterationsInput = document.getElementById('iterations');
    const zoomInput = document.getElementById('zoom');
    const colorSchemeSelect = document.getElementById('color-scheme');
    const themeToggle = document.getElementById('theme-toggle');
    const exportBtn = document.getElementById('export-btn');
    
    // Состояние фрактала
    let offsetX = 0;
    let offsetY = 0;
    let zoomLevel = 1;
    let isDragging = false;
    let startX, startY;
    
    // Инициализация Canvas
    function initCanvas() {
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.cursor = 'default';
    }
    
    // Рендеринг фрактала с плавной анимацией
    function renderFractal() {
        const maxIterations = parseInt(iterationsInput.value);
        const colorScheme = colorSchemeSelect.value;
        
        // Сохраняем текущий контекст для плавного перехода
        ctx.save();
        
        // Очистка Canvas
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg').trim();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Рендеринг фрактала
        renderMandelbrot(ctx, canvas.width, canvas.height, maxIterations, colorScheme, offsetX, offsetY, zoomLevel);
        
        ctx.restore();
    }
    
    // Обработчики событий для Drag-and-Zoom
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        canvas.style.cursor = 'grabbing';
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = (e.clientX - startX) / (zoomLevel * 10);
        const deltaY = (e.clientY - startY) / (zoomLevel * 10);
        
        offsetX += deltaX;
        offsetY += deltaY;
        
        startX = e.clientX;
        startY = e.clientY;
        renderFractal();
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = 'default';
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        canvas.style.cursor = 'default';
    });
    
    // Колесо мыши для зумирования
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / canvas.width;
        const mouseY = (e.clientY - rect.top) / canvas.height;
        
        // Центр зумирования
        const centerX = offsetX + mouseX * 3.0 * zoomLevel;
        const centerY = offsetY + mouseY * 1.5 * zoomLevel;
        
        // Изменение уровня зумирования
        const newZoom = zoomLevel * (e.deltaY > 0 ? 0.9 : 1.1);
        
        // Обновление смещения, чтобы центр остался на месте
        offsetX = centerX - mouseX * 3.0 * newZoom;
        offsetY = centerY - mouseY * 1.5 * newZoom;
        zoomLevel = Math.max(0.1, newZoom); // Минимальный уровень зумирования
        
        // Обновление слайдера зумирования
        zoomInput.value = zoomLevel.toFixed(1);
        
        renderFractal();
    });
    
    // Обработчики событий для параметров
    iterationsInput.addEventListener('input', () => {
        // Плавное обновление при изменении итераций
        renderFractal();
    });
    
    zoomInput.addEventListener('input', () => {
        zoomLevel = parseFloat(zoomInput.value);
        renderFractal();
    });
    
    colorSchemeSelect.addEventListener('change', () => {
        renderFractal();
    });
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = 'Тёмная тема';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = 'Светлая тема';
            localStorage.setItem('theme', 'light');
        }
        renderFractal();
    });
    
    exportBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'fractal.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    
    // Инициализация
    initCanvas();
    renderFractal();
    
    // Загрузка сохранённой темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = 'Светлая тема';
    }
});