// Тестовый сценарий для проверки синхронизации звука и анимаций
// Ожидаем, что звук будет влиять на параметры анимации фрактала

const assert = require('assert');
const { PaintingModeSync } = require('../js/paintingMode.js');

describe('Синхронизация звука и анимаций', () => {
    it('должна корректно обрабатывать аудиопоток', () => {
        const sync = new PaintingModeSync();
        // Проверка, что аудиопоток корректно инициализирован
        assert.ok(sync.audioContext, 'Аудиоконтекст должен быть инициализирован');
        assert.ok(sync.analyser, 'Анализатор должен быть инициализирован');
    });

    it('должна изменять параметры анимации при изменении аудиосигнала', () => {
        const sync = new PaintingModeSync();
        // Мокируем изменение аудиосигнала
        const mockData = new Uint8Array(128).fill(100); // Сигнал средней интенсивности
        sync.handleAudioData(mockData);
        // Проверяем, что параметры анимации изменились
        assert.ok(sync.lastAnimationParams !== undefined, 'Параметры анимации должны быть обновлены');
    });
});