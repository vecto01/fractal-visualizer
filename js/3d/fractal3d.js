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
    const colors = [];

    // Генерация вершин и цветов (заглушка)
    for (let i = 0; i < 1000; i++) {
        vertices.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        colors.push(Math.random(), Math.random(), Math.random());
    }

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
        alert("Не удалось инициализировать 3D-рендер. Возможно, ваш браузер не поддерживает WebGL. Переключаемся на 2D-режим.");
    };

    scene.onWarning = function(warning) {
        console.warn("Three.js Warning:", warning);
    };

    // Глобальная переменная для передачи данных аудио
    let audioEffectValue = 0.0;
    
    // Обновление значений аудио
    const updateAudioEffect = (value) => {
        audioEffectValue = value;
        customMaterial.uniforms.uAudioEffect.value = value;
    };
    
    // Анимация с обновлением времени и аудио
    const animate = () => {
        requestAnimationFrame(animate);
        fractal.rotation.x += 0.005;
        fractal.rotation.y += 0.005;
        customMaterial.uniforms.uTime.value += 0.016;
        renderer.render(scene, camera);
    };
    
    // Экспортируем функцию для обновления аудио
    window.update3DAudioEffect = updateAudioEffect;
    
    animate();

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Экспорт функции инициализации
export { init3DScene };