const PaintingModeSync = require('../js/paintingMode.js').default;

const { JSDOM } = require('jsdom');

describe('Синхронизация звука и анимаций', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      runScripts: 'dangerously',
      resources: 'usable'
    });
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    global.cancelAnimationFrame = (id) => clearTimeout(id);
  });

  it('should initialize Web Audio API correctly', async () => {
    const mockFractal = {
      updateParams: jest.fn(),
    };

    const sync = new PaintingModeSync(mockFractal);
    const result = await sync.initAudio();
    expect(result).toBe(true);
  });

  it('should update fractal parameters on audio input', () => {
    const mockFractal = {
      updateParams: jest.fn(),
    };

    const mockAudioContext = {
      state: 'running',
      createGain: jest.fn().mockReturnValue({ connect: jest.fn() }),
      createAnalyser: jest.fn().mockReturnValue({
        getByteFrequencyData: jest.fn(),
      }),
    };

    global.AudioContext = jest.fn(() => mockAudioContext);

    const sync = new PaintingModeSync(mockFractal);
    sync.audioContext = mockAudioContext;
    sync.analyser = mockAudioContext.createAnalyser();
    sync.dataArray = new Uint8Array(256);

    const mockTimestamp = 1000;
    sync.lastTime = 0;
    sync.isActive = true;
    sync.updateFractal(mockTimestamp);

    expect(mockFractal.updateParams).toHaveBeenCalled();
  });

  it('should toggle painting mode correctly', () => {
    const mockFractal = {
      updateParams: jest.fn(),
    };

    const sync = new PaintingModeSync(mockFractal);
    sync.toggleMode();
    expect(sync.isActive).toBe(true);

    sync.toggleMode();
    expect(sync.isActive).toBe(false);
  });
});