// Палитры для фракталов
const palettes = {
  plasma: [
    '#FF00FF', '#FF0088', '#FF0055', '#FF0022',
    '#FF2200', '#FF4400', '#FF6600', '#FF8800',
    '#FFBB00', '#FFFF00', '#CCFF00', '#88FF00'
  ],
  night: [
    '#000033', '#000055', '#000077', '#000099',
    '#003300', '#005500', '#007700', '#009900',
    '#333300', '#555500', '#777700', '#999900'
  ],
  solar: [
    '#FFCC00', '#FF9900', '#FF6600', '#FF3300',
    '#FF0000', '#CC0000', '#990000', '#660000',
    '#330000', '#000000', '#003300', '#006600'
  ],
  ultraviolet: [
    '#6600FF', '#9900FF', '#CC00FF', '#FF00FF',
    '#FF00CC', '#FF0099', '#FF0066', '#FF0033',
    '#FF3300', '#FF6600', '#FF9900', '#FFFF00'
  ],
  monochrome: [
    '#000000', '#111111', '#222222', '#333333',
    '#444444', '#555555', '#666666', '#777777',
    '#888888', '#999999', '#AAAAAA', '#FFFFFF'
  ]
};

// Текущая палитра по умолчанию
let currentPalette = 'plasma';

// Функция для применения палитры
function applyPalette(paletteName) {
  currentPalette = paletteName;
  const palette = palettes[paletteName];
  const canvas = document.getElementById('fractalCanvas');
  const ctx = canvas.getContext('webgl');
  
  // Применяем палитру к шейдеру (если используется WebGL)
  if (ctx) {
    // Логика для WebGL (если реализована)
    console.log(`Применена палитра: ${paletteName}`);
  } else {
    // Логика для Canvas 2D (если используется)
    console.log(`Применена палитра: ${paletteName}`);
  }
  
  // Сохраняем выбор в localStorage
  localStorage.setItem('fractalPalette', paletteName);
}

// Загружаем сохранённую палитру при запуске
const savedPalette = localStorage.getItem('fractalPalette');
if (savedPalette) {
  applyPalette(savedPalette);
} else {
  applyPalette(currentPalette);
}

// Экспорт палитры для использования в других файлах
export { palettes, applyPalette, currentPalette };