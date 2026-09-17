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

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const loadingEl = document.getElementById('loading');
const paletteSelector = document.getElementById('paletteSelector');
const iterationsInput = document.getElementById('iterations');
const iterationsValue = document.getElementById('iterationsValue');
const zoomInput = document.getElementById('zoom');
const zoomValue = document.getElementById('zoomValue');
const fractalTypeSelect = document.getElementById('fractalType');
const paintingModeBtn = document.getElementById('paintingModeBtn');
const exportBtn = document.getElementById('exportBtn');
const exportFormatSelect = document.getElementById('exportFormat');
const exportCompleteEl = document.getElementById('export-complete');
const themeToggle = document.getElementById('themeToggle');

const state = {
    palette: 'Plasma',
    fractalType: 'mandelbrot',
    iterations: 60,
    zoom: 1,
    centerX: -0.5,
    centerY: 0,
    juliaCX: -0.7,
    juliaCY: 0.27015,
    paintingMode: false,
    isLowEndDevice: false,
};

// Локализация
let currentLanguage = 'ru';
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('fractal-language', lang);
    updateUILanguage();
}

function updateUILanguage() {
    const t = translations[currentLanguage];
    loadingEl.textContent = t.loading;
    paletteSelector.querySelector('h3').textContent = t.palette;
    iterationsInput.previousElementSibling.textContent = t.iterations;
    zoomInput.previousElementSibling.textContent = t.zoom;
    fractalTypeSelect.previousElementSibling.textContent = t.fractalType;
    paintingModeBtn.textContent = t.paintingMode;
    exportBtn.textContent = t.export;
    themeToggle.textContent = t.themeToggle;
    exportCompleteEl.textContent = t.exportComplete;
    
    // Обновляем опции типов фракталов
    fractalTypeSelect.options[0].text = t.mandelbrot;
    fractalTypeSelect.options[1].text = t.julia;
}

// Проверка на слабое устройство
function detectLowEndDevice() {
    if (!navigator.deviceMemory) return false;
    // Меньше 2GB ОЗУ считаем слабым устройством
    return navigator.deviceMemory <= 2;
}

// Настройка параметров для слабых устройств
function setupDeviceSpecificSettings() {
    state.isLowEndDevice = detectLowEndDevice();
    if (state.isLowEndDevice) {
        // Уменьшаем количество итераций для слабых устройств
        iterationsInput.value = 40;
        iterationsInput.max = 60;
        iterationsInput.min = 20;
        iterationsValue.textContent = 40;
        state.iterations = 40;
    }
}

// Инициализация языка
function initLanguage() {
    let savedLang = localStorage.getItem('fractal-language');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else {
        // Проверяем настройки браузера
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) currentLanguage = 'en';
    }
    updateUILanguage();
}

// ---------- Тема ----------
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === 'light' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
    try { localStorage.setItem('fractal-theme', theme); } catch (e) { /* приватный режим */ }
}
(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('fractal-theme'); } catch (e) { /* приватный режим */ }
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved || (prefersLight ? 'light' : 'dark'));
})();
themeToggle.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
});

// ---------- Палитры ----------
function buildPaletteSelector() {
    for (const name of Object.keys(palettes)) {
        const el = document.createElement('div');
        el.className = 'palette-option' + (name === state.palette ? ' active' : '');
        el.dataset.palette = name;
        el.title = name;
        const [r, g, b] = palettes[name][0];
        el.style.background = `linear-gradient(135deg, rgb(${r},${g},${b}), rgb(${palettes[name].at(-1).join(',')}))`;
        el.addEventListener('click', () => {
            state.palette = name;
            paletteSelector.querySelectorAll('.palette-option').forEach(o => o.classList.remove('active'));
            el.classList.add('active');
            render();
        });
        paletteSelector.appendChild(el);
    }
}

// ---------- Рендеринг ----------
function colorAt(iter, maxIter, palette) {
    if (iter === maxIter) return [0, 0, 0];
    const t = iter / maxIter;
    const idx = Math.min(Math.floor(t * palette.length), palette.length - 1);
    return palette[idx];
}

function renderMandelbrot(width, height, maxIter, palette) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const scale = 3 / (width * state.zoom);
    for (let py = 0; py < height; py++) {
        const y0 = (py - height / 2) * scale + state.centerY;
        for (let px = 0; px < width; px++) {
            const x0 = (px - width / 2) * scale + state.centerX;
            let x = 0, y = 0, iter = 0;
            while (x * x + y * y <= 4 && iter < maxIter) {
                const xt = x * x - y * y + x0;
                y = 2 * x * y + y0;
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
        render();
    }
}

iterationsInput.addEventListener('input', () => {
    state.iterations = parseInt(iterationsInput.value, 10);
    iterationsValue.textContent = state.iterations;
    debounceRender();
});

zoomInput.addEventListener('input', () => {
    state.zoom = parseFloat(zoomInput.value);
    zoomValue.textContent = state.zoom.toFixed(1);
    debounceRender();
});

fractalTypeSelect.addEventListener('change', () => {
    state.fractalType = fractalTypeSelect.value;
    state.centerX = 0; state.centerY = 0;
    render();
});

paintingModeBtn.addEventListener('click', () => {
    state.paintingMode = !state.paintingMode;
    paintingModeBtn.classList.toggle('active', state.paintingMode);
    canvas.classList.toggle('painting-mode', state.paintingMode);
});

canvas.addEventListener('click', (e) => {
    if (!state.paintingMode) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width);
    const py = (e.clientY - rect.top) * (canvas.height / rect.height);
    const scale = 3 / (canvas.width * state.zoom);
    const dx = (px - canvas.width / 2) * scale;
    const dy = (py - canvas.height / 2) * scale;
    if (state.fractalType === 'julia') {
        state.juliaCX += dx * 0.15;
        state.juliaCY += dy * 0.15;
    } else {
        state.centerX += dx;
        state.centerY += dy;
        state.zoom = Math.min(state.zoom * 1.4, 200);
        zoomInput.value = Math.min(parseFloat(zoomInput.value) * 1.4, 4);
        zoomValue.textContent = state.zoom.toFixed(1);
    }
    render();
});

// ---------- Экспорт ----------
function exportPNG() {
    const link = document.createElement('a');
    link.download = 'fractal.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function exportSVG() {
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
    link.download = 'fractal.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

exportBtn.addEventListener('click', () => {
    if (exportFormatSelect.value === 'svg') exportSVG(); else exportPNG();
    exportCompleteEl.hidden = false;
    exportCompleteEl.style.animation = 'none';
    // перезапуск CSS-анимации появления
    void exportCompleteEl.offsetWidth;
    exportCompleteEl.style.animation = '';
    setTimeout(() => { exportCompleteEl.hidden = true; }, 2000);
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