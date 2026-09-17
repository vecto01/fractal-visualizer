// ===== Модуль анимаций для режима "Кинетическая живопись" =====

/**
 * Анимация загрузки круга (индикатор прогресса)
 * @param {HTMLElement} element - Круг, который будет анимироваться
 * @param {number} duration - Продолжительность анимации в секундах
 */
function animateLoadingCircle(element, duration = 2) {
  const startTime = Date.now();
  const startRotation = 0;
  
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    
    // Плавное вращение круга по мере загрузки
    const rotation = startRotation + (360 * progress);
    element.style.transform = `rotate(${rotation}deg)`;
    element.style.opacity = progress < 1 ? progress : 1;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Завершение анимации: круг останавливается и становится полностью видимым
      element.style.transform = `rotate(${360}deg)`;
      element.style.transition = 'transform 0.5s ease-out, opacity 0.3s ease-out';
      element.style.opacity = '1';
      // Добавляем эффект пульсации для завершения
      element.style.animation = 'pulse 0.5s ease-out';
    }
  };
  
  requestAnimationFrame(animate);
}

/**
 * Анимация пульсации для завершения
 */
const styles = document.createElement('style');
styles.textContent = 
`
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

document.head.appendChild(styles);

/**
 * Центрирование круга на экране
 * @param {HTMLElement} element - Круг, который нужно центрировать
 */
function centerElement(element) {
  element.style.position = 'absolute';
  element.style.left = '50%;'
  element.style.transform = 'translateX(-50%)';
  element.style.top = 'calc(50% - 25px)'; // 50px - диаметр круга
  element.style.width = '50px';
  element.style.height = '50px';
  element.style.borderRadius = '50%';
  element.style.backgroundColor = '#4dabf7';
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.3s ease-out';
  element.style.zIndex = '1000';
  element.style.boxShadow = '0 0 10px rgba(77, 171, 247, 0.5)';
}

/**
 * Анимация появления текста "Готово!"
 * @param {HTMLElement} element - Текст, который будет анимироваться
 */
function animateText(element) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(10px)';
  element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 10); // Минимальная задержка для запуска анимации
}