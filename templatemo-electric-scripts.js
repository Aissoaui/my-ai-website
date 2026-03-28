// Swayedkh - 3D Neon Glassmorphism Animations

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Three.js Scene
let scene, camera, renderer, particles, shapes = [];
let mouseX = 0, mouseY = 0;

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    createGlassPanels();
    createParticles();
    createWireframeShapes();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const orangeLight = new THREE.PointLight(0xFF5E00, 2, 100);
    orangeLight.position.set(20, 20, 20);
    scene.add(orangeLight);

    const blueLight = new THREE.PointLight(0x00B2FF, 2, 100);
    blueLight.position.set(-20, -20, 20);
    scene.add(blueLight);

    animate();

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
}

function createGlassPanels() {
    const geometry = new THREE.PlaneGeometry(15, 20);
    
    for (let i = 0; i < 15; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xFF5E00 : 0x00B2FF,
            transparent: true,
            opacity: 0.03,
            side: THREE.DoubleSide
        });
        
        const panel = new THREE.Mesh(geometry, material);
        
        panel.position.x = (Math.random() - 0.5) * 100;
        panel.position.y = (Math.random() - 0.5) * 100;
        panel.position.z = (Math.random() - 0.5) * 50 - 20;
        
        panel.rotation.x = Math.random() * Math.PI;
        panel.rotation.y = Math.random() * Math.PI;
        
        panel.userData = {
            rotationSpeedX: (Math.random() - 0.5) * 0.01,
            rotationSpeedY: (Math.random() - 0.5) * 0.01,
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        shapes.push(panel);
        scene.add(panel);
    }
}

function createParticles() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        if (Math.random() > 0.5) {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.37;
            colors[i * 3 + 2] = 0;
        } else {
            colors[i * 3] = 0;
            colors[i * 3 + 1] = 0.7;
            colors[i * 3 + 2] = 1;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createWireframeShapes() {
    const hexShape = new THREE.Shape();
    const size = 5;
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (i === 0) hexShape.moveTo(x, y);
        else hexShape.lineTo(x, y);
    }
    hexShape.closePath();

    const hexGeometry = new THREE.ShapeGeometry(hexShape);
    const hexMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF5E00,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    for (let i = 0; i < 5; i++) {
        const hex = new THREE.Mesh(hexGeometry, hexMaterial.clone());
        hex.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 40 - 10
        );
        hex.userData = {
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            floatSpeed: Math.random() * 0.3 + 0.2,
            floatOffset: Math.random() * Math.PI * 2,
            scale: Math.random() * 2 + 1
        };
        hex.scale.set(hex.userData.scale, hex.userData.scale, hex.userData.scale);
        shapes.push(hex);
        scene.add(hex);
    }

    const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00B2FF,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    for (let i = 0; i < 3; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
        cube.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50 - 15
        );
        cube.userData = {
            rotationSpeedX: (Math.random() - 0.5) * 0.01,
            rotationSpeedY: (Math.random() - 0.5) * 0.01,
            floatSpeed: Math.random() * 0.4 + 0.3,
            floatOffset: Math.random() * Math.PI * 2
        };
        shapes.push(cube);
        scene.add(cube);
    }
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
        particles.position.x += (mouseX * 5 - particles.position.x) * 0.02;
        particles.position.y += (mouseY * 5 - particles.position.y) * 0.02;
    }

    shapes.forEach(shape => {
        if (shape.userData.rotationSpeedX) {
            shape.rotation.x += shape.userData.rotationSpeedX;
            shape.rotation.y += shape.userData.rotationSpeedY || 0.01;
        }
        if (shape.userData.rotationSpeed) {
            shape.rotation.z += shape.userData.rotationSpeed;
        }
        if (shape.userData.floatSpeed) {
            shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.05;
        }
    });

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuToggle) menuToggle.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => item.classList.remove('active'));
            const currentNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (currentNav) currentNav.classList.add('active');
        }
    });
}

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNav();
});

updateActiveNav();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Feature tabs functionality
const tabs = document.querySelectorAll('.tab-item');
const panels = document.querySelectorAll('.content-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const panel = document.getElementById(tabId);
        if (panel) panel.classList.add('active');
    });
});

// Form submission
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('.submit-btn');
    const originalText = btn.textContent;
    
    btn.textContent = 'SENDING...';
    btn.style.pointerEvents = 'none';
    
    setTimeout(() => {
        btn.textContent = 'MESSAGE SENT!';
        btn.style.background = 'linear-gradient(135deg, #00B2FF, #00D4FF)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.pointerEvents = '';
            this.reset();
        }, 2000);
    }, 1500);
});

// CTA Button ripple effect
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'cta-ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Text rotation with character animation (ORIGINAL VERSION)
const textSets = document.querySelectorAll('.text-set');
let currentIndex = 0;
let isAnimating = false;

function wrapTextInSpans(element) {
    const text = element.textContent;
    element.innerHTML = text.split('').map((char, i) => 
        `<span class="char" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
}

function animateTextIn(textSet) {
    const glitchText = textSet.querySelector('.glitch-text');
    const subtitle = textSet.querySelector('.subtitle');
    
    wrapTextInSpans(glitchText);
    glitchText.setAttribute('data-text', glitchText.textContent);
    
    setTimeout(() => {
        subtitle.classList.add('visible');
    }, 800);
}

function animateTextOut(textSet) {
    const chars = textSet.querySelectorAll('.char');
    const subtitle = textSet.querySelector('.subtitle');
    
    chars.forEach((char, i) => {
        char.style.animationDelay = `${i * 0.02}s`;
        char.classList.add('out');
    });
    
    subtitle.classList.remove('visible');
}

function rotateText() {
    if (isAnimating) return;
    isAnimating = true;

    const currentSet = textSets[currentIndex];
    const nextIndex = (currentIndex + 1) % textSets.length;
    const nextSet = textSets[nextIndex];

    animateTextOut(currentSet);

    setTimeout(() => {
        currentSet.classList.remove('active');
        nextSet.classList.add('active');
        animateTextIn(nextSet);
        
        currentIndex = nextIndex;
        isAnimating = false;
    }, 600);
}

if (textSets.length > 0) {
    textSets[0].classList.add('active');
    animateTextIn(textSets[0]);

    setTimeout(() => {
        setInterval(rotateText, 5000);
    }, 4000);
}

setInterval(() => {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        if (Math.random() > 0.95) {
            text.style.animation = 'none';
            setTimeout(() => {
                text.style.animation = '';
            }, 200);
        }
    });
}, 3000);

// Magnetic effect for buttons
document.querySelectorAll('.cta-button, .submit-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Tilt effect for cards
document.querySelectorAll('.glass-card, .tab-item, .info-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Loading animation
function initLoader() {
    const loader = document.querySelector('.loading-overlay');
    if (!loader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initLoader();
    initScrollAnimations();
    document.body.classList.add('loaded');
});

// GSAP Scroll Animations - Works both directions (up & down)
function initScrollAnimations() {
    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'top 20%',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
            },
            y: 60,
            opacity: 0,
            ease: 'power2.out'
        });
    });

    // Feature tabs
    gsap.utils.toArray('.tab-item').forEach((tab, i) => {
        gsap.from(tab, {
            scrollTrigger: {
                trigger: tab,
                start: 'top 90%',
                end: 'top 40%',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
            },
            x: -60,
            opacity: 0,
            ease: 'power2.out'
        });
    });

    // Feature content panel
    gsap.from('.feature-content', {
        scrollTrigger: {
            trigger: '.feature-content',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
            toggleActions: 'play reverse play reverse'
        },
        y: 80,
        opacity: 0,
        ease: 'power2.out'
    });

    // About content rows
    gsap.utils.toArray('.about-content').forEach((content, i) => {
        gsap.from(content, {
            scrollTrigger: {
                trigger: content,
                start: 'top 85%',
                end: 'top 30%',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
            },
            y: 100,
            opacity: 0,
            ease: 'power2.out'
        });
    });

    // About visuals
    gsap.utils.toArray('.about-visual').forEach((visual, i) => {
        gsap.from(visual, {
            scrollTrigger: {
                trigger: visual,
                start: 'top 85%',
                end: 'top 30%',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
            },
            scale: 0.7,
            opacity: 0,
            ease: 'power2.out'
        });
    });

    // Contact form
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
            toggleActions: 'play reverse play reverse'
        },
        x: -100,
        opacity: 0,
        ease: 'power2.out'
    });

    // Contact info
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
            toggleActions: 'play reverse play reverse'
        },
        x: 100,
        opacity: 0,
        ease: 'power2.out'
    });

    // Info items
    gsap.utils.toArray('.info-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                end: 'top 40%',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
            },
            x: 60,
            opacity: 0,
            ease: 'power2.out'
        });
    });

    // Feature list items
    gsap.utils.toArray('.feature-list li').forEach((li, i) => {
        gsap.from(li, {
            scrollTrigger: {
                trigger: li,
                start: 'top 95%',
                end: 'top 50%',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
            },
            x: 40,
            opacity: 0,
            ease: 'power2.out'
        });
    });
}

window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
});
