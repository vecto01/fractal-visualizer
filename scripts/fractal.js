// Fractal Visualizer — рендеринг Мандельброта и Джулии на <canvas>.

const palettes = {
    Plasma: [[255, 0, 0], [255, 127, 0], [255, 255, 0], [0, 255, 0], [0, 0, 255], [75, 0, 130], [143, 0, 255]],
    Night: [[0, 0, 0], [0, 0, 100], [0, 100, 200], [100, 100, 255], [200, 200, 255], [255, 255, 255]],
    Solar: [[255, 0, 0], [255, 165, 0], [255, 255, 0], [127, 255, 0], [0, 255, 0], [0, 0, 255]],
    Ultraviolet: [[147, 112, 219], [100, 149, 237], [135, 206, 235], [173, 216, 230], [230, 230, 250], [255, 255, 255]],
    Monochrome: [[0, 0, 0], [50, 50, 50], [100, 100, 100], [150, 150, 150], [200, 200, 200], [255, 255, 255]],
    RainbowGradient: [[255, 0, 0], [255, 127, 0], [255, 255, 0], [0, 255, 0], [0, 0, 255], [75, 0, 130], [143, 0, 255], [255, 0, 255]],
    EarthTones: [[139, 69, 19], [205, 133, 63], [255, 215, 0], [102, 205, 170], [0, 100, 0], [128, 0, 0]],
};

// Локализация
const translations = {
    ru: {
        loading: 'Загрузка фрактала...',
        palette: 'Палитра',
        iterations: 'Итерации',
        zoom: 'Масштаб',
        fractalType: 'Тип фрактала',
        mandelbrot: 'Мандельброт',
        julia: 'Джулия',
        paintingMode: 'Режим рисования',
        export: 'Экспорт',
        exportComplete: 'Экспорт завершён!',
        themeToggle: 'Тёмная тема',
        successMessage: 'Фрактал успешно визуализирован!',
    },
    en: {
        loading: 'Loading fractal...',
        palette: 'Palette',
        iterations: 'Iterations',
        zoom: 'Zoom',
        fractalType: 'Fractal Type',
        mandelbrot: 'Mandelbrot',
        julia: 'Julia',
        paintingMode: 'Painting Mode',
        export: 'Export',
        exportComplete: 'Export complete!',
        themeToggle: 'Dark Theme',
        successMessage: 'Fractal successfully visualized!',
    }
};

const canvas = document.getElementById('fractal-canvas');
const ctx = canvas.getContext('2d');
const loadingEl = document.getElementById('loading');
const paletteSelector = document.getElementById('paletteSelector');
const iterationsInput = document.getElementById('iterations');
const iterationsValue = document.getElementById('iterationsValue');
const fractalTypeSelector = document.getElementById('fractalType');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');
const startBtn = document.getElementById('start-btn');
const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');

// ---------- Состояние ----------
const state = {
    palette: 'Plasma',
    iterations: 50,
    zoom: 1,
    centerX: -0.5,
    centerY: 0,
    fractalType: 'mandelbrot',
    juliaCX: -0.7,
    juliaCY: 0.27015,
    isLowEndDevice: false,
    language: 'en',
    theme: 'dark',
};

// ---------- Функции для работы с цветами ----------
function colorAt(iter, maxIter, palette) {
    if (iter === maxIter) return [0, 0, 0];
    const ratio = iter / maxIter;
    const idx = Math.floor(ratio * (palette.length - 1));
    const segment = palette[idx];
    const segmentRatio = (ratio * (palette.length - 1) - idx) * (palette.length - 1);
    const nextSegment = palette[idx + 1] || segment;
    return [
        Math.round(segment[0] + segmentRatio * (nextSegment[0] - segment[0])),
        Math.round(segment[1] + segmentRatio * (nextSegment[1] - segment[1])),
        Math.round(segment[2] + segmentRatio * (nextSegment[2] - segment[2])),
    ];
}

// ---------- Рендеринг Мандельброта ----------
function renderMandelbrot(width, height, maxIter, palette) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const scale = 3 / (width * state.zoom);
    for (let py = 0; py < height; py++) {
        const y0 = (py - height / 2) * scale + state.centerY;
        for (let px = 0; px < width; px++) {
            let x = (px - width / 2) * scale + state.centerX;
            let y = y0;
            let iter = 0;
            while (x * x + y * y <= 4 && iter < maxIter) {
                const xt = x * x - y * y + state.juliaCX;
                y = 2 * x * y + state.juliaCY;
                x = xt;
                iter++;
            }
            const [r, g, b] = colorAt(iter, maxIter, palette);
            const i = (py * width + px) * 4;
            data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
        }
    }
    return imageData;
}

// ---------- Рендеринг Джулии ----------
function renderJulia(width, height, maxIter, palette) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const scale = 3 / (width * state.zoom);
    for (let py = 0; py < height; py++) {
        const y0 = (py - height / 2) * scale + state.centerY;
        for (let px = 0; px < width; px++) {
            let x = (px - width / 2) * scale + state.centerX;
            let y = y0;
            let iter = 0;
            while (x * x + y * y <= 4 && iter < maxIter) {
                const xt = x * x - y * y + state.juliaCX;
                y = 2 * x * y + state.juliaCY;
                x = xt;
                iter++;
            }
            const [r, g, b] = colorAt(iter, maxIter, palette);
            const i = (py * width + px) * 4;
            data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
        }
    }
    return imageData;
}

let renderPending = false;
function showLoading() { loadingEl.hidden = false; }
function hideLoading() { loadingEl.hidden = true; }

let debounceTimer = null;
function debounceRender() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, state.isLowEndDevice ? 100 : 0);
}

function render() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
        const width = canvas.width, height = canvas.height;
        const palette = palettes[state.palette];
        const imageData = state.fractalType === 'julia'
            ? renderJulia(width, height, state.iterations, palette)
            : renderMandelbrot(width, height, state.iterations, palette);
        ctx.putImageData(imageData, 0, 0);
        renderPending = false;
    });
}

// ---------- Управление ----------
function resizeCanvas() {
    const size = Math.round(Math.min(canvas.clientWidth || 640, 640));
    if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
    }
}

// ---------- Экспорт ----------
function exportImage(format = 'png') {
    // Определяем имя файла для отображения в модальном окне
    const timestamp = new Date().toISOString().slice(0, 19);
    const filename = format === 'svg'
        ? `fractal-${state.fractalType}-${timestamp}.svg`
        : `fractal-${state.fractalType}-${timestamp}.png`;
    
    if (format === 'svg') {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('xmlns', svgNS);
        svg.setAttribute('width', canvas.width);
        svg.setAttribute('height', canvas.height);
        const img = document.createElementNS(svgNS, 'image');
        img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL('image/png'));
        img.setAttribute('width', canvas.width);
        img.setAttribute('height', canvas.height);
        svg.appendChild(img);
        const svgStr = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgStr], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    } else {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    // Возвращаем имя файла для использования в модальном окне
    return filename;
}

// Воспроизвести звуковой эффект
function playExportSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

// Добавляем обработчик для кнопки экспорта
exportBtn.addEventListener('click', () => {
    const filename = exportImage('png');
    playExportSound();
    
    // Показываем модальное окно с именем файла
    const modal = document.getElementById('export-modal');
    const exportFilenameEl = document.getElementById('export-filename');
    exportFilenameEl.textContent = filename;
    modal.classList.add('show');
    
    // Закрываем модальное окно при клике на кнопку
    const closeModalBtn = document.getElementById('close-modal-btn');
    closeModalBtn.onclick = () => {
        modal.classList.remove('show');
    };
});

window.addEventListener('resize', resizeCanvas);

// ---------- Инициализация ----------
buildPaletteSelector();
initLanguage();
setupDeviceSpecificSettings();
resizeCanvas();
render();
loadingEl.hidden = true;
canvas.hidden = false;
requestAnimationFrame(() => canvas.classList.add('loaded'));