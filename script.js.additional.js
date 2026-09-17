// Дополнительная логика для Fractal Visualizer

// Показать сообщение об успешной визуализации
function displaySuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(20px) scale(0.9)';
        successMessage.style.pointerEvents = 'none';
        
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0) scale(1)';
            successMessage.style.pointerEvents = 'auto';
        }, 10);
    }
}

// Переопределяем функцию showSuccessMessage для исправления ошибок
window.showSuccessMessage = displaySuccessMessage;