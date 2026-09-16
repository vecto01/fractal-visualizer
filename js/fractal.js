// Функция для рендеринга фрактала Мандельброта
function renderMandelbrot(iterations, zoom) {
    const canvas = document.getElementById('fractal-canvas');
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры canvas
    const width = canvas.width = window.innerWidth * 0.8;
    const height = canvas.height = 600;
    
    // Коэффициенты для масштабирования и смещения
    const centerX = -0.5;
    const centerY = 0;
    const scale = 3.5 / zoom;
    
    // Создаём изображение для анимации
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Рендерим фрактал
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Преобразуем координаты в комплексную плоскость
            const real = scale * (x / width - centerX);
            const imag = scale * (y / height - centerY);
            
            // Вычисляем количество итераций для точки (real, imag)
            let zx = 0;
            let zy = 0;
            let xx = real;
            let yy = imag;
            let iter = 0;
            
            while (xx * xx + yy * yy < 4 && iter < iterations) {
                zx = xx * xx - yy * yy + real;
                zy = 2 * xx * yy + imag;
                xx = zx;
                yy = zy;
                iter++;
            }
            
            // Определяем цвет в зависимости от количества итераций
            const index = (y * width + x) * 4;
            if (iter < iterations) {
                // Используем цветовую схему "Классическая" по умолчанию
                const hue = (iter % 256) / iterations * 360;
                data[index] = Math.floor(255 * Math.sin(hue));
                data[index + 1] = Math.floor(255 * Math.sin(hue + 120));
                data[index + 2] = Math.floor(255 * Math.sin(hue + 240));
                data[index + 3] = 255; // Альфа-канал
            } else {
                // Черный цвет для точек, не входящих в множество
                data[index] = 0;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 255;
            }
        }
    }
    
    // Показываем результат
    ctx.putImageData(imageData, 0, 0);
    animateParameterChange(canvas);
}

// Анимация при изменении параметров
function animateParameterChange(canvas) {
    const ctx = canvas.getContext('2d');
    const originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const animate = (timestamp) => {
        const progress = Math.min(timestamp / 300, 1);
        const opacity = progress;
        
        ctx.globalAlpha = opacity;
        ctx.putImageData(originalImage, 0, 0);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            ctx.globalAlpha = 1;
        }
    };
    
    requestAnimationFrame(animate);
}