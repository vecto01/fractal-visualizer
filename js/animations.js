// Плавные анимации для изменения параметров
let animationId = null;
const animationDuration = 500; // Время анимации в миллисекундах
const steps = 20; // Количество шагов для плавного перехода

// Функция для плавного изменения параметров
const animateTransition = (targetIterations, targetColorScheme) => {
    const startTime = performance.now();
    let step = 0;
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        step = Math.min(Math.floor(progress * steps), steps - 1);
        
        const currentIterations = Math.floor(startIterations + (targetIterations - startIterations) * progress);
        const currentColorScheme = progress < 1 ? startColorScheme : targetColorScheme;
        
        // Обновляем визуализацию с текущими параметрами
        fractal.draw(currentIterations, currentColorScheme, scale, offsetX, offsetY);
        
        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            // Устанавливаем финальные параметры
            iterationsSlider.value = targetIterations;
            colorSchemeSelect.value = targetColorScheme;
            iterationsValue.textContent = targetIterations;
            colorSchemeValue.textContent = targetColorScheme;
            hideLoading();
        }
    };
    
    // Начинаем анимацию
    startIterations = parseInt(iterationsSlider.value);
    startColorScheme = colorSchemeSelect.value;
    animationId = requestAnimationFrame(animate);
};

// Очистка анимации
const clearAnimation = () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
};

// Применяем анимацию для изменений
iterationsSlider.addEventListener('input', () => {
    clearAnimation();
    animateTransition(parseInt(iterationsSlider.value), colorSchemeSelect.value);
});

colorSchemeSelect.addEventListener('change', () => {
    clearAnimation();
    animateTransition(parseInt(iterationsSlider.value), colorSchemeSelect.value);
});

colorBtn.addEventListener('click', () => {
    clearAnimation();
    const currentScheme = colorSchemeSelect.value;
    const schemes = ['HSV', 'RGB', 'Viridis'];
    const currentIndex = schemes.indexOf(currentScheme);
    const nextIndex = (currentIndex + 1) % schemes.length;
    
    animateTransition(parseInt(iterationsSlider.value), schemes[nextIndex]);
});