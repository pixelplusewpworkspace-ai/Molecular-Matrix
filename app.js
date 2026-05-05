/**
 * Molecular Matrix Interactive Background System
 * Node Canvas Animation & Scroll Interactions (GSAP)
 */

window.addEventListener('load', () => {

    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Interactive Canvas Matrix (Hero Right Side)
    const canvas = document.getElementById('molecular-canvas');
    const statusText = document.getElementById('synthesis-status');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;
        let time = 0;
        let currentState = 'DATA'; // States: DATA, SYNTHESIS, UI, FADE

        // Target Coordinates forming a Clean UI Layout Box
        let uiAnchors = [
            // Card Outer Frame Nodes
            {x: 0.15, y: 0.15}, {x: 0.85, y: 0.15}, {x: 0.85, y: 0.85}, {x: 0.15, y: 0.85},
            {x: 0.15, y: 0.5}, {x: 0.85, y: 0.5},
            // Sidebar Grid
            {x: 0.3, y: 0.15}, {x: 0.3, y: 0.85},
            // Dashboard Widgets
            {x: 0.4, y: 0.25}, {x: 0.6, y: 0.25}, {x: 0.8, y: 0.25},
            {x: 0.4, y: 0.4}, {x: 0.6, y: 0.4}, {x: 0.8, y: 0.4},
            {x: 0.4, y: 0.6}, {x: 0.8, y: 0.6},
        ];

        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Struct
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.anchorIndex = Math.floor(Math.random() * uiAnchors.length);
            }

            update() {
                if (currentState === 'DATA') {
                    this.vx += Math.sin(this.y * 0.05 + time * 0.1) * 0.05;
                    this.vy += Math.cos(this.x * 0.05 + time * 0.1) * 0.05;
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.95;
                    this.vy *= 0.95;
                    if (this.x < 0) this.x = canvas.width;
                    if (this.x > canvas.width) this.x = 0;
                    if (this.y < 0) this.y = canvas.height;
                    if (this.y > canvas.height) this.y = 0;
                } else if (currentState === 'SYNTHESIS' || currentState === 'UI') {
                    const anchor = uiAnchors[this.anchorIndex % uiAnchors.length];
                    const targetX = canvas.width * anchor.x;
                    const targetY = canvas.height * anchor.y;
                    this.x += (targetX - this.x) * 0.08;
                    this.y += (targetY - this.y) * 0.08;
                } else if (currentState === 'FADE') {
                    this.y += 2;
                    if (this.y > canvas.height) this.reset();
                }
            }

            draw() {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time++;
            const cycle = time % 600;
            if (cycle < 200) {
                currentState = 'DATA';
                if (statusText) statusText.innerText = 'DATA';
            } else if (cycle < 350) {
                currentState = 'SYNTHESIS';
                if (statusText) statusText.innerText = 'SYNTHESIZING';
            } else if (cycle < 550) {
                currentState = 'UI';
                if (statusText) statusText.innerText = 'CLEAN UI';
            } else {
                currentState = 'FADE';
                if (statusText) statusText.innerText = 'RESET';
            }

            if (currentState === 'DATA') {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 10) {
                    const y = canvas.height * 0.5 + Math.sin(x * 0.01 + time * 0.05) * 50 + Math.cos(x * 0.03 + time * 0.08) * 30;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            if (currentState === 'UI') {
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.lineWidth = 0.5;
                const w = canvas.width;
                const h = canvas.height;
                ctx.strokeRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);
                ctx.strokeRect(w * 0.15, h * 0.15, w * 0.15, h * 0.7);
                ctx.strokeRect(w * 0.3, h * 0.15, w * 0.55, h * 0.15);
                ctx.fillStyle = 'rgba(255,255,255,0.04)';
                ctx.fillRect(w * 0.35, h * 0.35, w * 0.2, h * 0.15);
                ctx.fillRect(w * 0.6, h * 0.35, w * 0.2, h * 0.15);
                ctx.fillRect(w * 0.35, h * 0.55, w * 0.45, h * 0.25);
                ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(w * 0.45, h * 0.42, 10, 0, Math.PI * 1.5);
                ctx.stroke();
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const factor = currentState === 'UI' ? 60 : 100;
                    if (dist < factor) {
                        const opacity = 1 - (dist / factor);
                        ctx.strokeStyle = `rgba(255,255,255,${opacity * (currentState === 'UI' ? 0.3 : 0.15)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Count animations wrapper ticker callback trigger metric bars
    function animateCount(elem, target) {
        let current = 0;
        let increment = target / 60; // speed of count
        let interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                if (target === 2.4) elem.innerText = '2.4sec';
                else if (target === 4.2) elem.innerText = '4.2X';
                else elem.innerText = Math.round(target) + '%';
                clearInterval(interval);
            } else {
                if (target === 2.4 || target === 4.2) elem.innerText = current.toFixed(1) + (target === 2.4 ? 'sec' : 'X');
                else elem.innerText = Math.round(current) + '%';
            }
        }, 16);
    }

    // 3. GSAP Scrolling Triggers Reveals
    gsap.registerPlugin(ScrollTrigger);

    // Fade reveal animation presets trigger
    gsap.to('.scale-reveal', {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2
    });

    gsap.to('.fade-reveal', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.3
    });

    // Mobile Menu Toggler setup if needed
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuCloseBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
             mobileMenu.classList.remove('translate-x-full');
        });
    }

    if (menuCloseBtn && mobileMenu) {
        menuCloseBtn.addEventListener('click', () => {
             mobileMenu.classList.add('translate-x-full');
        });
    }

    // Close menu on link click
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
            });
        });
    }

    // Metric triggers on scroll
    ScrollTrigger.create({
        trigger: "#metrics-bar",
        start: "top 80%",
        onEnter: () => {
             document.querySelectorAll('.metric-item').forEach(item => {
                 const target = parseFloat(item.getAttribute('data-target'));
                 animateCount(item, target);
             });
        },
        once: true
    });

    // 4. Interactive Services Auto-cycling Timeline
    const tabs = document.querySelectorAll('.about-tab');
    const slides = document.querySelectorAll('.viz-slide');
    let activeIndex = 0;
    let autoCycleInterval;

    function switchTab(index) {
        tabs.forEach(t => t.classList.remove('active-tab'));
        slides.forEach(s => s.classList.remove('active-slide'));

        tabs[index].classList.add('active-tab');
        slides[index].classList.add('active-slide');

        renderViz(index); // Trigger visual animation
    }

    // Auto Cycle Interval
    function startCycle() {
        autoCycleInterval = setInterval(() => {
            activeIndex = (activeIndex + 1) % tabs.length;
            switchTab(activeIndex);
        }, 3500);
    }
    startCycle();

    // User click trigger
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
             clearInterval(autoCycleInterval);
             activeIndex = index;
             switchTab(index);
             setTimeout(startCycle, 5000); // Resume cycling
        });
    });

    // Custom Advanced Visual Renderers for each Tab
    function renderViz(index) {
        const canvas = document.getElementById(`viz-canvas-${index}`);
        if (!canvas) return;
        const vctx = canvas.getContext('2d');

        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        let frame = 0;
        
        // Setup state variables based on index for node generation
        let nodes = [];
        if (index === 0) {
            // Setup 3D cube vertices
            for (let x = -1; x <= 1; x += 2) {
                for (let y = -1; y <= 1; y += 2) {
                    for (let z = -1; z <= 1; z += 2) {
                        nodes.push({ x, y, z });
                    }
                }
            }
        } else if (index === 1 || index === 4) {
            // Swarm particles
            for (let i = 0; i < 30; i++) {
                nodes.push({
                    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
                    angle: Math.random() * Math.PI * 2, radius: Math.random() * 40 + 20
                });
            }
        }

        function drawFrame() {
            if (!slides[index].classList.contains('active-slide')) return; 
            vctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            if (index === 0) {
                // 1. Premium Web: Rotating 3D Wireframe Cube
                vctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                vctx.lineWidth = 1;

                const angleY = frame * 0.01;
                const angleX = frame * 0.005;
                const scale = 50 + Math.sin(frame * 0.02) * 5; 

                // Project 3D to 2D
                const projected = nodes.map(n => {
                    // Rotate Y
                    let x = n.x * Math.cos(angleY) - n.z * Math.sin(angleY);
                    let z = n.x * Math.sin(angleY) + n.z * Math.cos(angleY);
                    // Rotate X
                    let y = n.y * Math.cos(angleX) - z * Math.sin(angleX);
                    let pz = n.y * Math.sin(angleX) + z * Math.cos(angleX);

                    const d = 3 / (3 + pz); // Perspective division
                    return { x: cx + x * scale * d, y: cy + y * scale * d, pz };
                });

                // Connect Edges
                const edges = [[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]];
                edges.forEach(e => {
                    vctx.beginPath();
                    vctx.moveTo(projected[e[0]].x, projected[e[0]].y);
                    vctx.lineTo(projected[e[1]].x, projected[e[1]].y);
                    vctx.stroke();
                });

                // Draw vertices with depth mapping
                projected.forEach(p => {
                    vctx.fillStyle = p.pz > 0 ? '#FFF' : 'rgba(255,255,255,0.4)';
                    vctx.beginPath(); vctx.arc(p.x, p.y, p.pz > 0 ? 3 : 1.5, 0, Math.PI*2); vctx.fill();
                });

            } else if (index === 1) {
                // 2. High-Risk Payment: Shield Orbital Swarm Matrix
                vctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                vctx.lineWidth = 1;

                // Central Lock core mesh
                const pulse = 30 + Math.sin(frame * 0.05) * 5;
                vctx.strokeStyle = 'rgba(0, 255, 120, 0.4)';
                vctx.strokeRect(cx - 12, cy - 8, 24, 16);
                vctx.strokeRect(cx - 8, cy - 18, 16, 10);

                nodes.forEach(p => {
                    p.angle += 0.02;
                    const x = cx + Math.cos(p.angle) * p.radius;
                    const y = cy + Math.sin(p.angle) * p.radius * 0.5; // Elliptical 3D orbit

                    vctx.fillStyle = 'rgba(255,255,255,0.8)';
                    vctx.beginPath(); vctx.arc(x, y, 1.5, 0, Math.PI * 2); vctx.fill();

                    // Connect connecting laser threads to center
                    if (Math.random() > 0.9) {
                        vctx.strokeStyle = 'rgba(0,255,120,0.15)';
                        vctx.beginPath(); vctx.moveTo(x, y); vctx.lineTo(cx, cy); vctx.stroke();
                    }
                });

            } else if (index === 2) {
                // 3. Algorithmic SEO: Stacking Mountain Layer chart areas
                for (let l = 0; l < 2; l++) {
                    vctx.fillStyle = l === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)';
                    vctx.strokeStyle = l === 0 ? 'rgba(255,255,255,0.1)' : '#FFF';
                    vctx.lineWidth = l === 0 ? 0.5 : 1.5;

                    vctx.beginPath();
                    vctx.moveTo(0, canvas.height);
                    for (let x = 0; x < canvas.width; x += 15) {
                        const freq = l === 0 ? 0.01 : 0.02;
                        const phase = frame * 0.05 + l * 2;
                        const y = cy + Math.sin(x * freq + phase) * 40 - (l * 10) + Math.cos(x * 0.005) * 20;

                        vctx.lineTo(x, y);
                    }
                    vctx.lineTo(canvas.width, canvas.height);
                    vctx.fill();
                    vctx.stroke();
                }

            } else if (index === 3) {
                // 4. Compliance: Self-Assembling Hexagonal Grid Mesh structures
                vctx.strokeStyle = 'rgba(255,255,255,0.2)';
                vctx.lineWidth = 1;
                const size = 20;

                for (let r = -2; r <= 2; r++) {
                    for (let c = -2; c <= 2; c++) {
                        const offsetX = c * size * 1.5;
                        const offsetY = r * size * Math.sqrt(3) + (Math.abs(c) % 2 * size * Math.sqrt(3)/2);
                        
                        const pulseScale = 1 + Math.sin(frame * 0.03 + (r+c)) * 0.08;

                        vctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = i * Math.PI / 3;
                            const x = cx + offsetX + Math.cos(angle) * size * pulseScale;
                            const y = cy + offsetY + Math.sin(angle) * size * pulseScale;
                            if (i === 0) vctx.moveTo(x, y);
                            else vctx.lineTo(x, y);
                        }
                        vctx.closePath();
                        vctx.stroke();

                        if (Math.sin(frame * 0.02 + r) > 0.8) {
                            vctx.fillStyle = 'rgba(255,255,255,0.05)'; vctx.fill();
                        }
                    }
                }

            } else if (index === 4) {
                // 5. Logistics: Matrix Streams connecting nodes loops
                vctx.strokeStyle = 'rgba(255,255,255,0.1)';
                nodes.forEach(p => {
                    p.x += p.vx; p.y += p.vy;

                    // Bounds
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                    vctx.fillStyle = 'rgba(255,255,255,0.6)';
                    vctx.beginPath(); vctx.arc(p.x, p.y, 1, 0, Math.PI*2); vctx.fill();

                    nodes.forEach(p2 => {
                        const dx = p.x - p2.x; const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 40) {
                            vctx.strokeStyle = `rgba(255,255,255,${1 - dist/40})`;
                            vctx.beginPath(); vctx.moveTo(p.x, p.y); vctx.lineTo(p2.x, p2.y); vctx.stroke();
                        }
                    });
                });
            }

            requestAnimationFrame(drawFrame);
        }
        drawFrame();
    }

    // Initial first-render
    setTimeout(() => switchTab(0), 500);

    // GSAP Scroll Animations for Mirror Section (Pain Points)
    gsap.from(".pain-point", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#mirror",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});
