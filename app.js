/* ==========================================================================
   KASOKU RENOVATION - INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. GLOBAL ENVIRONMENT & NAVIGATION
    // ==========================================
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. 8-BIT SAKURA FALLING PETALS ANIMATION
    // ==========================================
    const sakuraCanvas = document.getElementById('sakura-canvas');
    if (sakuraCanvas) {
        const sCtx = sakuraCanvas.getContext('2d');
        let petals = [];
        const maxPetals = 45;
        let mouseX = 0;
        let windFactor = 0;

        // Resize Canvas
        function resizeSakura() {
            sakuraCanvas.width = window.innerWidth;
            sakuraCanvas.height = window.innerHeight;
        }
        resizeSakura();
        window.addEventListener('resize', resizeSakura);

        // Track mouse movement to affect wind
        window.addEventListener('mousemove', (e) => {
            // Speed and direction of mouse determines extra wind
            const diffX = e.clientX - mouseX;
            windFactor = diffX * 0.05;
            mouseX = e.clientX;
        });

        // Color palette for sakura (pastel shades)
        const sakuraColors = [
            'rgba(255, 121, 198, 0.75)', // Deep neon pink
            'rgba(255, 183, 197, 0.75)', // Classic cherry petal
            'rgba(255, 143, 212, 0.65)', // Bright pink
            'rgba(241, 250, 140, 0.55)', // Soft glowing yellow accent
        ];

        // Petal Constructor
        class Petal {
            constructor() {
                this.reset();
                this.y = Math.random() * sakuraCanvas.height; // Spawn at random height initially
            }

            reset() {
                this.x = Math.random() * sakuraCanvas.width;
                this.y = -10;
                this.size = Math.random() * 5 + 4; // Blocky 4px to 9px size
                this.speedY = Math.random() * 1.2 + 0.8;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.angle = Math.random() * Math.PI * 2;
                this.swingSpeed = Math.random() * 0.02 + 0.01;
                this.color = sakuraColors[Math.floor(Math.random() * sakuraColors.length)];
            }

            update() {
                this.y += this.speedY;
                // Swing left/right naturally + follow mouse wind factor
                this.angle += this.swingSpeed;
                this.x += Math.sin(this.angle) * 0.4 + this.speedX + windFactor * 0.15;
                
                // Decay wind factor slowly
                windFactor *= 0.99;

                // Recycle when off-screen
                if (this.y > sakuraCanvas.height || this.x < -10 || this.x > sakuraCanvas.width + 10) {
                    this.reset();
                }
            }

            draw() {
                sCtx.fillStyle = this.color;
                // Render as blocky 8-bit squares for authentic pixel theme
                sCtx.fillRect(Math.floor(this.x), Math.floor(this.y), Math.floor(this.size), Math.floor(this.size));
            }
        }

        // Initialize Petals
        for (let i = 0; i < maxPetals; i++) {
            petals.push(new Petal());
        }

        // Animation Loop
        function animateSakura() {
            sCtx.clearRect(0, 0, sakuraCanvas.width, sakuraCanvas.height);
            for (let i = 0; i < petals.length; i++) {
                petals[i].update();
                petals[i].draw();
            }
            requestAnimationFrame(animateSakura);
        }
        animateSakura();
    }

    // ==========================================
    // 3. INTERACTIVE 8-BIT SANDBLASTING SIMULATOR
    // ==========================================
    const simCanvas = document.getElementById('simulator-canvas');
    if (simCanvas) {
        const ctx = simCanvas.getContext('2d');
        const prompt = document.getElementById('simulator-prompt');
        const rustVal = document.getElementById('rust-percent');
        const psiVal = document.getElementById('psi-value');
        const btnReset = document.getElementById('btn-reset-simulator');
        
        let isBlasting = false;
        let rect = simCanvas.getBoundingClientRect();
        
        // Particle array for blasting sparks
        let particles = [];

        // Offscreen canvas to hold the rust layer
        const rustCanvas = document.createElement('canvas');
        const rCtx = rustCanvas.getContext('2d');
        
        // Setup Canvas Resolution (fixed internal aspect ratio, CSS handles responsiveness)
        const simWidth = 800;
        const simHeight = 450;
        simCanvas.width = simWidth;
        simCanvas.height = simHeight;
        rustCanvas.width = simWidth;
        rustCanvas.height = simHeight;

        // Generate the 8-bit textured Rust layer offscreen
        function initRust() {
            // Base rust color
            rCtx.fillStyle = 'hsl(22, 60%, 30%)';
            rCtx.fillRect(0, 0, simWidth, simHeight);
            
            // Draw lots of 8-bit rusty pixelated patches
            const pixelSize = 8;
            const colors = ['#5a2e10', '#a05a2c', '#4a2306', '#87421f', '#ffb86c'];
            
            for (let x = 0; x < simWidth; x += pixelSize) {
                for (let y = 0; y < simHeight; y += pixelSize) {
                    // Random noise factor
                    const rand = Math.random();
                    if (rand < 0.35) {
                        rCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                        rCtx.fillRect(x, y, pixelSize, pixelSize);
                    }
                }
            }
        }

        // Draw the background "Clean Steel" structure
        function drawCleanMetal() {
            // Dark steel background
            ctx.fillStyle = '#1e2030';
            ctx.fillRect(0, 0, simWidth, simHeight);

            // Draw grid pattern (blueprint/precision style)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            const grid = 24;
            for (let x = 0; x < simWidth; x += grid) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, simHeight);
                ctx.stroke();
            }
            for (let y = 0; y < simHeight; y += grid) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(simWidth, y);
                ctx.stroke();
            }

            // Draw ground/road line
            ctx.fillStyle = '#2e3047';
            ctx.fillRect(80, 318, 640, 8);

            // Draw Car Body - Retro 8-bit sports car chassis (convertible Miata NB look!)
            ctx.fillStyle = '#ff79c6'; // Neon Sakura Pink chassis
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            
            // Draw custom sports car chassis silhouette
            ctx.beginPath();
            ctx.moveTo(160, 305); // Front nose bumper
            ctx.lineTo(170, 275); // Hood line start
            ctx.lineTo(240, 270); // Hood line flat
            ctx.lineTo(330, 260); // Windshield base
            ctx.lineTo(365, 215); // Windshield top
            ctx.lineTo(415, 215); // Windshield frame top
            ctx.lineTo(425, 260); // Rollbar/Cabin rear base
            ctx.lineTo(580, 262); // Trunk lid line
            ctx.lineTo(625, 275); // Rear spoiler/bumper top
            ctx.lineTo(635, 305); // Rear bumper bottom
            ctx.lineTo(595, 305); // Wheel well arch rear right
            ctx.arc(555, 305, 38, 0, Math.PI, true); // Rear wheel arch
            ctx.lineTo(285, 305); // Side skirt bottom middle
            ctx.arc(245, 305, 38, 0, Math.PI, true); // Front wheel arch
            ctx.lineTo(160, 305); // Front splitter bottom
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Draw cockpit detail (convertible interior seat)
            ctx.fillStyle = '#2a2b36';
            ctx.fillRect(435, 235, 25, 25);
            ctx.strokeRect(435, 235, 25, 25);

            // Draw Windshield glass
            ctx.fillStyle = 'rgba(139, 233, 253, 0.4)';
            ctx.beginPath();
            ctx.moveTo(330, 260);
            ctx.lineTo(365, 215);
            ctx.lineTo(410, 215);
            ctx.lineTo(380, 260);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#8be9fd';
            ctx.stroke();

            // Wheels (Alloys & Tires)
            const wheels = [245, 555];
            wheels.forEach(wx => {
                // Outer Tire
                ctx.fillStyle = '#090a0f';
                ctx.beginPath();
                ctx.arc(wx, 305, 32, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#3b4261';
                ctx.lineWidth = 3;
                ctx.stroke();

                // Alloys / Rims
                ctx.fillStyle = '#cbd5e1';
                ctx.beginPath();
                ctx.arc(wx, 305, 18, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#1e2030';
                ctx.beginPath();
                ctx.arc(wx, 305, 12, 0, Math.PI * 2);
                ctx.fill();

                // Axle Center Cap
                ctx.fillStyle = '#cbd5e1';
                ctx.beginPath();
                ctx.arc(wx, 305, 4, 0, Math.PI * 2);
                ctx.fill();

                // Alloy Spokes (8-bit style cross lines)
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(wx - 16, 305);
                ctx.lineTo(wx + 16, 305);
                ctx.moveTo(wx, 305 - 16);
                ctx.lineTo(wx, 305 + 16);
                ctx.stroke();
            });

            // Glowing neon cyan text sign in the background
            ctx.fillStyle = '#8be9fd';
            ctx.font = 'bold 36px "Outfit"';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(139, 233, 253, 0.6)';
            ctx.shadowBlur = 15;
            ctx.fillText('KASOKU SPECIALS', simWidth / 2, 75);
            ctx.shadowBlur = 0; // Reset shadow

            // Project Sub text
            ctx.fillStyle = '#f1fa8c'; // Glowing pastel yellow
            ctx.font = 'bold 17px "VT323"';
            ctx.fillText('PROJECT: MAZDA MX-5 "LILITH" ROADSTER REBUILD', simWidth / 2, 115);
            
            ctx.fillStyle = '#cbd5e1';
            ctx.font = 'bold 15px "VT323"';
            ctx.fillText('STATUS: SHINY JAPANESE STEEL REVEALED // PROTECTION: C5-M', simWidth / 2, 142);
        }

        // Particle Class (for sandblasting sparks & dust)
        class Spark {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 4 + 2; // blocky spark size
                this.speedX = (Math.random() - 0.5) * 8;
                this.speedY = (Math.random() - 0.5) * 8 - Math.random() * 3; // explosion blast upwards
                this.color = ['#ff79c6', '#8be9fd', '#ffb86c', '#f1fa8c', '#ff5555'][Math.floor(Math.random() * 5)];
                this.life = 1.0;
                this.decay = Math.random() * 0.04 + 0.02;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += 0.1; // gravity pull
                this.life -= this.decay;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life;
                ctx.fillRect(Math.floor(this.x), Math.floor(this.y), Math.floor(this.size), Math.floor(this.size));
                ctx.globalAlpha = 1.0;
            }
        }

        // Perform the blasting action at coordinate
        function blast(x, y) {
            const brushRadius = 24;
            
            // Clear circle on the offscreen rust canvas
            rCtx.globalCompositeOperation = 'destination-out';
            rCtx.beginPath();
            rCtx.arc(x, y, brushRadius, 0, Math.PI * 2);
            rCtx.fill();

            // Spawn sparks particles
            const particleCount = 4;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Spark(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10));
            }

            // Trigger random pressure fluctuations on HUD to look realistic
            if (Math.random() < 0.1) {
                const randomPSI = Math.floor(Math.random() * 15) + 115;
                psiVal.textContent = randomPSI + ' PSI';
            }
        }

        // Calculate how much rust remains on a grid layout (very fast)
        function checkRustPercentage() {
            // Sampling grid to keep CPU load minimal
            const sampleStep = 20; // check every 20px
            let totalPoints = 0;
            let rustyPoints = 0;

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 40; // Super low resolution clone
            tempCanvas.height = 22;
            const tCtx = tempCanvas.getContext('2d');
            
            // Render the scaled down rust layer to low-res for instant computation
            tCtx.drawImage(rustCanvas, 0, 0, 40, 22);
            
            const imgData = tCtx.getImageData(0, 0, 40, 22);
            const pixels = imgData.data;

            for (let i = 3; i < pixels.length; i += 4) {
                totalPoints++;
                if (pixels[i] > 10) { // Alpha is opaque, meaning rust is present
                    rustyPoints++;
                }
            }

            const percentage = Math.ceil((rustyPoints / totalPoints) * 100);
            rustVal.textContent = percentage + '%';

            if (percentage <= 2) {
                rustVal.textContent = '0% CLEANED!';
                rustVal.style.color = '#50fa7b';
                rustVal.style.textShadow = '0 0 10px #50fa7b';
            } else {
                rustVal.style.color = 'var(--sakura-pink)';
            }
        }

        // Get Event Coordinates relative to the canvas aspect ratio
        function getCoords(e) {
            rect = simCanvas.getBoundingClientRect();
            let clientX, clientY;
            
            if (e.touches && e.touches[0]) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            // Map standard pixel coords to canvas coordinate matrix
            const x = (clientX - rect.left) * (simWidth / rect.width);
            const y = (clientY - rect.top) * (simHeight / rect.height);
            return { x, y };
        }

        // Input Listeners
        function startBlast(e) {
            isBlasting = true;
            if (prompt) prompt.classList.add('hidden');
            const coords = getCoords(e);
            blast(coords.x, coords.y);
            e.preventDefault();
        }

        function moveBlast(e) {
            if (!isBlasting) return;
            const coords = getCoords(e);
            blast(coords.x, coords.y);
            
            // Throttle checking for speed
            if (Math.random() < 0.15) {
                checkRustPercentage();
            }
            e.preventDefault();
        }

        function endBlast() {
            if (isBlasting) {
                isBlasting = false;
                checkRustPercentage(); // final check on release
            }
        }

        // Desktop Events
        simCanvas.addEventListener('mousedown', startBlast);
        window.addEventListener('mousemove', moveBlast);
        window.addEventListener('mouseup', endBlast);

        // Touch Mobile Events
        simCanvas.addEventListener('touchstart', startBlast, { passive: false });
        window.addEventListener('touchmove', moveBlast, { passive: false });
        window.addEventListener('touchend', endBlast);

        // Reset button logic
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                initRust();
                checkRustPercentage();
                particles = [];
                rustVal.style.color = 'var(--sakura-pink)';
                rustVal.style.textShadow = '0 0 5px var(--sakura-glow)';
                if (prompt) prompt.classList.remove('hidden');
            });
        }

        // Main Rendering Loop
        function renderSimulator() {
            // 1. Draw Clean Base
            drawCleanMetal();
            
            // 2. Draw Rust Layer on Top
            ctx.drawImage(rustCanvas, 0, 0);

            // 3. Render and clean particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                if (p.life <= 0) {
                    particles.splice(i, 1);
                } else {
                    p.draw();
                }
            }

            requestAnimationFrame(renderSimulator);
        }

        // Run Init
        initRust();
        checkRustPercentage();
        renderSimulator();
    }

    // ==========================================
    // 4. BEFORE/AFTER SLIDER LOGIC
    // ==========================================
    const sliderRange = document.getElementById('before-after-range');
    const beforeImage = document.querySelector('.before-image');
    const sliderHandle = document.querySelector('.slider-handle');

    if (sliderRange && beforeImage && sliderHandle) {
        sliderRange.addEventListener('input', (e) => {
            const val = e.target.value;
            // Crop the width of the before image overlay
            beforeImage.style.width = val + '%';
            // Align the handle line
            sliderHandle.style.left = val + '%';
        });
    }

    // ==========================================
    // 5. CONTACT FORM & SIMULATED B2B QUOTE FLOW
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const btnSubmit = document.getElementById('btn-submit-form');
    const btnResetForm = document.getElementById('btn-reset-form');

    if (contactForm && formSuccess && btnSubmit) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform basic micro-validation/loading animation
            btnSubmit.disabled = true;
            const originalText = btnSubmit.textContent;
            
            // Loading Sequence
            let loadingSteps = ['SZACOWANIE METRAŻU...', 'DOBIERANIE ŚCIERNIWA...', 'LICZENIE KOSZTÓW...', 'WYSYŁANIE ZAPYTANIA...'];
            let step = 0;
            
            const interval = setInterval(() => {
                if (step < loadingSteps.length) {
                    btnSubmit.textContent = loadingSteps[step];
                    step++;
                } else {
                    clearInterval(interval);
                    
                    // Reveal Success state
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Reset Button
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = originalText;
                }
            }, 500);
        });

        // Allow sending another inquiry
        if (btnResetForm) {
            btnResetForm.addEventListener('click', () => {
                contactForm.reset();
                formSuccess.style.display = 'none';
                contactForm.style.display = 'block';
            });
        }
    }
});
