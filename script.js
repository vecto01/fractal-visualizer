// Функция для плавного появления фрактала
document.addEventListener('DOMContentLoaded', () => {
    const loadingText = document.querySelector('.loading-text');
    const canvas = document.querySelector('.fractal-canvas');
    const canvasContainer = document.querySelector('.fractal-canvas-container');

    // Анимация загрузки
    setTimeout(() => {
        loadingText.style.opacity = '0';
        canvas.classList.add('show');
        canvasContainer.style.opacity = '1';
    }, 1500);

    // Логика рендеринга фрактала
    const fractal = new FractalCanvas(canvas, {
        width: canvas.width,
        height: canvas.height,
        maxIterations: 50,
        colorScheme: 'red'
    });
    fractal.render();

    // Кнопка сброса вида
    document.getElementById('resetView').addEventListener('click', () => {
        fractal.resetView();
        canvasContainer.style.transform = 'scale(1)';
    });

    // Кнопка смены цветовой схемы
    document.getElementById('changeColors').addEventListener('click', () => {
        fractal.toggleColorScheme();
        canvasContainer.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
        setTimeout(() => {
            canvasContainer.style.boxShadow = 'none';
        }, 500);
    });

    // Слайдер итераций
    document.getElementById('iterations').addEventListener('input', (e) => {
        fractal.maxIterations = parseInt(e.target.value);
        fractal.render();
    });
});