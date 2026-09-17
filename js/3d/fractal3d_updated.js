// ===== ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ ФРАКТАЛА (МНОЖЕСТВО МАНДЕЛЬБРОТА) =====
const generateMandelbrotFractal = (count, depth) => {
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < count; i++) {
        // Генерация координат в плоскости комплексных чисел
        const x = Math.random() * 3.5 - 2.5; // Ось Re
        const y = Math.random() * 2 - 1;    // Ось Im
        
        // Рекурсивное вычисление фрактала
        let zx = 0, zy = 0;
        let iter = 0;
        let escaped = false;
        
        for (let iter = 0; iter < depth; iter++) {
            const xx = zx * zx - zy * zy + x;
            const yy = 2 * zx * zy + y;
            zx = xx;
            zy = yy;
            
            if (zx * zx + zy * zy > 4) {
                escaped = true;
                break;
            }
        }
        
        // Если точка принадлежит множеству Мандельброта, сохраняем её
        if (!escaped) {
            // Преобразование в 3D-пространство
            const z = iter / depth * 2 - 1; // Глубина по оси Z
            vertices.push(x, y, z);
            
            // Цвет зависит от глубины рекурсии
            const hue = (iter / depth) * 360;
            colors.push(hueToRgb(hue), hueToRgb(hue + 120), hueToRgb(hue + 240));
        }
    }
    
    return { vertices, colors };
};

// ===== ПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПРЕОБРАЗОВАНИЯ HUE В RGB =====
const hueToRgb = (h) => {
    h = h % 360;
    if (h < 120) return h / 120;
    if (h < 240) return (240 - h) / 120;
    return (h - 240) / 120;
};

// ===== ДОПОЛНИТЕЛЬНЫЙ ШЕЙДЕР ДЛЯ УЛУЧШЕННОЙ 3D-ВИЗУАЛИЗАЦИИ ====
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';

// Адаптивный вершинный шейдер для эффекта "парения" и динамической глубины
const vertexShaderSource = `
    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vDepth;
    varying float vAudioIntensity;
    
    uniform float uTime;
    uniform float uAudioEffect;
    
    void main() {
        vColor = color;
        vDepth = position.z;
        vAudioIntensity = uAudioEffect;
        
        // Динамическое смещение с учетом аудио
        float offset = sin(uTime * 0.5 + position.x) * 0.005 * (1.0 + vAudioIntensity * 0.5);
        vec3 newPosition = position + vec3(0.0, offset, 0.0);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;

// Фрагментный шейдер для усиления текстуры, глубины и реакции на аудио
const fragmentShaderSource = `
    varying vec3 vColor;
    varying float vDepth;
    varying float vAudioIntensity;
    
    uniform float uTime;
    
    void main() {
        // Усиление глубины и текстуры с учетом аудио
        float depthEffect = smoothstep(0.0, 0.5, vDepth);
        float timeEffect = sin(uTime * 2.0) * 0.1 * (1.0 + vAudioIntensity * 0.3);
        
        // Реакция на аудио: изменение цвета и яркости
        vec3 audioColorEffect = vec3(timeEffect, timeEffect * 0.7, timeEffect * 0.3) * vAudioIntensity;
        
        gl_FragColor = vec4(vColor + audioColorEffect, depthEffect);
    }
`;

// ===== ИНИЦИАЛИЗАЦИЯ СЦЕНЫ ====

// Переменные для адаптивной детализации
let targetFps = 30;
let currentFps = 60;
let vertexCount = 1000;
const minVertexCount = 500;
const maxVertexCount = 2000;
const fpsThreshold = 25;

// Переменные для мониторинга FPS
let lastFrameTime = performance.now();
let frameCount = 0;
let fpsInterval = 1000; // 1 секунда
let scene, camera, renderer, fractalGeometry;

const init3DScene = () => {
    // Создание сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Камера
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Добавление рендерера на страницу
    const mountPoint = document.getElementById('app');
    mountPoint.appendChild(renderer.domElement);

    // Создание геометрии фрактала
    fractalGeometry = new THREE.BufferGeometry();
    const vertices = [];
    // Генерация фрактальных вершин и цветов
    const fractalData = generateMandelbrotFractal(vertexCount, 50);
    vertices = fractalData.vertices;
    colors = fractalData.colors;

    fractalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    fractalGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // ===== АДАПТИВНЫЙ МАТЕРИАЛ ====
    const customMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uAudioEffect: { value: 0.0 }
        },
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        transparent: true,
    });

    // Меш для фрактала
    const fractal = new THREE.Points(fractalGeometry, customMaterial);
    scene.add(fractal);

    // ===== ОБРАБОТКА ОШИБОК ====
    scene.onError = function(error) {
        console.error("Three.js Error:", error);
        alert("Не удалось инициализировать 3D-рендер. Возможно, ваш браузер не поддерживает WebGL. Переключитесь на 2D-режим.");
    };

    scene.onWarning = function(warning) {
        console.warn("Three.js Warning:", warning);
    };

    // Колбэк завершения анимации
    let onRenderCompleteCallback = null;
    
    // Анимация с обновлением времени
    const animate = () => {
        const now = performance.now();
        frameCount++;
        
        // Мониторинг FPS
        if (now - lastFrameTime >= fpsInterval) {
            currentFps = Math.round((frameCount * 1000) / (now - lastFrameTime));
            frameCount = 0;
            lastFrameTime = now;
            
            // Адаптивная детализация
            if (currentFps < fpsThreshold && vertexCount > minVertexCount) {
                vertexCount = Math.max(minVertexCount, Math.floor(vertexCount * 0.9));
                updateVertexCount(vertexCount);
            }
        }
        
        requestAnimationFrame(animate);
        fractal.rotation.x += 0.005;
        fractal.rotation.y += 0.005;
        customMaterial.uniforms.uTime.value += 0.016;
        renderer.render(scene, camera);
    };
    
    // Запуск анимации
    animate();
    
    // Возвращаем объект с колбэком завершения
    return {
        animate,
        setOnComplete: (callback) => {
            onRenderCompleteCallback = callback;
        }
    };
    const updateVertexCount = (count) => {
        const vertices = [];
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            vertices.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            colors.push(Math.random(), Math.random(), Math.random());
        }
        
        fractalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        fractalGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    };




    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Экспорт функции инициализации
export { init3DScene };