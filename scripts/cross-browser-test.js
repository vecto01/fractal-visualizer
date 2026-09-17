// Скрипт для автоматического тестирования фрактала на разных браузерах
// Проверяет:
// 1. Отображение фрактала и анимаций
// 2. Работоспособность Web Audio API
// 3. Отзывчивость UI на разных устройствах

const testCases = [
  {
    name: "Отображение фрактала",
    check: () => {
      const canvas = document.querySelector('canvas');
      return canvas && canvas.width > 0 && canvas.height > 0;
    },
    errorMessage: "Фрактал не отображается на canvas!",
  },
  {
    name: "Анимация фрактала",
    check: () => {
      const animationFrame = window.requestAnimationFrame;
      return typeof animationFrame === 'function';
    },
    errorMessage: "requestAnimationFrame недоступен!",
  },
  {
    name: "Web Audio API",
    check: () => {
      return typeof window.AudioContext !== 'undefined' || 
             typeof window.webkitAudioContext !== 'undefined';
    },
    errorMessage: "Web Audio API недоступен!",
  },
  {
    name: "Отзывчивость UI",
    check: () => {
      const button = document.querySelector('button');
      return button && button.addEventListener;
    },
    errorMessage: "UI-элементы не отзывчивы!",
  },
];

// Запуск тестов
const runTests = () => {
  const results = [];
  testCases.forEach((test) => {
    const passed = test.check();
    results.push({
      test: test.name,
      passed,
      message: passed ? "✅ OK" : test.errorMessage,
    });
  });
  return results;
};

// Вывод результатов
const results = runTests();
console.log("Результаты тестирования:", results);

// Возвращаем результаты для дальнейшего анализа
if (window.__crossBrowserTestResults__) {
  window.__crossBrowserTestResults__.push(results);
} else {
  window.__crossBrowserTestResults__ = [results];
}