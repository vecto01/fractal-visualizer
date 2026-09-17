import '@testing-library/jest-dom/extend-expect';

// Настройка окружения jsdom
window = {};
window.matchMedia = jest.fn().mockImplementation((query) => ({ 
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Подключение Web Audio API для тестирования синхронизации звука
class AudioContext {}
window.AudioContext = AudioContext;

// Подключение ResizeObserver для тестирования адаптивности
class ResizeObserver {}
ResizeObserver = jest.fn(() => ({ observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() }));