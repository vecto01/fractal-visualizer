// Фрактал Джулия
const JuliaFractal = {
  
  // Параметры фрактала
  params: {
    iterations: 100,
    zoom: 1.0,
    xOffset: 0.0,
    yOffset: 0.0,
    c: { real: -0.7, imag: 0.27015 }, // Константа для фрактала Джулия
  },
  
  // Инициализация
  init: function(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.pixels = new Uint8Array(width * height * 4);
    this.render();
  },
  
  // Рендеринг фрактала
  render: function() {
    const { width, height, params } = this;
    const { iterations, zoom, xOffset, yOffset, c } = params;
    const pixelData = this.pixels;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Преобразование координат в комплексную плоскость
        const real = (x / zoom - xOffset) * 4.0 / width;
        const imag = (y / zoom - yOffset) * 4.0 / height;
        
        // Алгоритм фрактала Джулия
        let zReal = real;
        let zImag = imag;
        let zSquaredReal = 0;
        let zSquaredImag = 0;
        let iter = 0;
        
        for (let i = 0; i < iterations; i++) {
          zSquaredReal = zReal * zReal - zImag * zImag;
          zSquaredImag = 2 * zReal * zImag;
          zReal = zSquaredReal + c.real;
          zImag = zSquaredImag + c.imag;
          
          if (zReal * zReal + zImag * zImag > 4) break;
          iter = i;
        }
        
        // Цветовая схема (простая палитра)
        const colorIndex = iter % 256;
        pixelData[(x + y * width) * 4] = colorIndex; // R
        pixelData[(x + y * width) * 4 + 1] = colorIndex; // G
        pixelData[(x + y * width) * 4 + 2] = colorIndex; // B
        pixelData[(x + y * width) * 4 + 3] = 255; // A
      }
    }
    
    this.ctx.putImageData(new ImageData(this.pixels, width, height), 0, 0);
  },
  
  // Обновление параметров
  updateParams: function(newParams) {
    Object.assign(this.params, newParams);
    this.render();
  },
};

// Экспорт для использования в основном файле
module.exports = JuliaFractal;