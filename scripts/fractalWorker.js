// Функция для рендеринга фрактала в Web Worker
self.onmessage = function(e) {
    const { fractalType, palette, iterations, zoom, width, height } = e.data;
    const imageData = self.createImageData(width, height);
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

    // Отправляем результат обратно в основной поток
    self.postMessage(imageData);
};