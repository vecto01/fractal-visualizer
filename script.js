document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvas = document.getElementById('fractalCanvas');
  const loadingScreen = document.getElementById('loadingScreen');
  const progressBar = document.getElementById('progressBar');
  const loadingText = document.querySelector('.loading-text');
  const fractalContainer = document.querySelector('.fractal-container');
  const loadingComplete = document.createElement('div');
  loadingComplete.className = 'loading-complete';
  loadingComplete.textContent = 'Fractal loaded!';
  loadingScreen.appendChild(loadingComplete);

  const iterationsSlider = document.getElementById('iterationsSlider');
  const iterationsValue = document.getElementById('iterationsValue');
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomValue = document.getElementById('zoomValue');
  const resetButton = document.getElementById('resetButton');
  const themeToggle = document.getElementById('themeToggle');

  // Context and settings
  const ctx = canvas.getContext('2d');
  let zoomLevel = 1;
  let iterations = 50;
  let isLoading = true;

  // Simulate loading progress with timeout
  function simulateLoadingWithTimeout() {
    isLoading = true;
    loadingScreen.style.display = 'flex';
    progressBar.style.width = '0%';
    loadingText.textContent = 'Loading fractal...'
    loadingComplete.style.display = 'none';

    // Simulate loading steps
    const steps = 5;
    const interval = setInterval(() => {
      const progress = Math.min(100, progressBar.style.width.replace('%', '') + (100 / steps));
      progressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          isLoading = false;
          loadingScreen.style.display = 'none';
          loadingComplete.style.display = 'block';
          fractalContainer.style.opacity = '1';
          setTimeout(() => {
            loadingComplete.style.opacity = '0';
            setTimeout(() => {
              loadingComplete.style.display = 'none';
            }, 500);
          }, 1000);
        }, 500);
      }
    }, 500);
  }

  // Draw fractal (simplified for demo)
  function drawFractal() {
    if (isLoading) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simulate fractal rendering
    for (let i = 0; i < canvas.width; i += 2) {
      for (let j = 0; j < canvas.height; j += 2) {
        const x = (i - canvas.width / 2) / (zoomLevel * 100);
        const y = (j - canvas.height / 2) / (zoomLevel * 100);
        const zx = x;
        const zy = y;
        let xx = 0;
        let yy = 0;
        let iter = 0;

        while (xx * xx + yy * yy < 4 && iter < iterations) {
          const tmp = xx * xx - yy * yy + x;
          yy = 2 * xx * yy + y;
          xx = tmp;
          iter++;
        }

        ctx.fillStyle = iter === iterations ? '#1e1e1e' : `hsl(${iter * 2}, 100%, 50%)`;
        ctx.fillRect(i, j, 2, 2);
      }
    }
  }

  // Initialize canvas
  function initCanvas() {
    const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7);
    canvas.width = size;
    canvas.height = size;
    fractalContainer.style.maxWidth = `${size}px`;
    fractalContainer.style.height = `${size}px`;
    drawFractal();
  }

  // Event listeners
  iterationsSlider.addEventListener('input', () => {
    iterations = parseInt(iterationsSlider.value);
    iterationsValue.textContent = iterations;
    drawFractal();
  });

  zoomSlider.addEventListener('input', () => {
    zoomLevel = parseFloat(zoomSlider.value);
    zoomValue.textContent = zoomLevel.toFixed(1);
    drawFractal();
  });

  resetButton.addEventListener('click', () => {
    zoomLevel = 1;
    zoomSlider.value = 1;
    zoomValue.textContent = '1.0';
    drawFractal();
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? 'Dark Mode' : 'Light Mode';
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (!isLoading) {
      initCanvas();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const step = 0.1 * zoomLevel;
      if (e.key === 'ArrowUp') canvas.style.transform = `translateY(${canvas.style.transform === 'translateY(-100px)' ? '0' : '-100px'})`;
      if (e.key === 'ArrowDown') canvas.style.transform = `translateY(${canvas.style.transform === 'translateY(0)' ? '100px' : '0'})`;
      if (e.key === 'ArrowLeft') canvas.style.transform = `translateX(${canvas.style.transform === 'translateX(0)' ? '-100px' : '0'})`;
      if (e.key === 'ArrowRight') canvas.style.transform = `translateX(${canvas.style.transform === 'translateX(0)' ? '100px' : '0'})`;
    }
  });

  // Start loading simulation
  simulateLoadingWithTimeout();
  initCanvas();

  // Debug logs
  console.log('Fractal visualizer initialized. Loading simulation started.');
});