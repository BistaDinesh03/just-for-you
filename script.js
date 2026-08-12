document.addEventListener('DOMContentLoaded', () => {
    const config = window.proposal;
    
    // Populate all text from config
    document.getElementById('entryName').textContent = config.intro.title;
    document.querySelector('#sceneEntry p').textContent = config.intro.subtitle;
    document.getElementById('personalLine1').textContent = config.personalMessage.line1;
    document.getElementById('personalLine2').textContent = config.personalMessage.line2;
    document.getElementById('proposalQuestion').textContent = config.question;
    document.getElementById('yesMessageDisplay').textContent = config.yesMessage;
    document.getElementById('letterContent').textContent = config.letter;
    
    // Playful section text
    const playfulQuestion = document.querySelector('#scenePlayful .serif');
    if (playfulQuestion) playfulQuestion.textContent = config.playful.question;
    
    const playfulSubtitle = document.querySelector('#scenePlayful p:nth-of-type(2)');
    if (playfulSubtitle) playfulSubtitle.textContent = config.playful.subtitle;
    
    document.getElementById('optionFood').textContent = config.playful.option1;
    document.getElementById('optionYou').textContent = config.playful.option2;
    
    // Scene IDs in order
    const scenes = [
        'sceneEntry',
        'scenePersonal', 
        'sceneMemories',
        'scenePhotos',
        'scenePlayful',
        'sceneBuildup',
        'sceneLetter',
        'sceneProposal',
        'sceneCelebration'
    ];
    
    let currentScene = 0;
    
    function showScene(index) {
        if (index < 0 || index >= scenes.length) return;
        
        // Hide all scenes
        scenes.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden-scene');
                el.classList.remove('active-scene');
            }
        });
        
        // Show target scene
        const target = document.getElementById(scenes[index]);
        if (target) {
            target.classList.remove('hidden-scene');
            target.classList.add('active-scene');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            currentScene = index;
            
            // Start celebration if it's the last scene
            if (scenes[index] === 'sceneCelebration') {
                startCelebration();
            }
        }
    }
    
    // ENTER BUTTON - Start the journey
    document.getElementById('enterButton').addEventListener('click', function() {
        this.textContent = '...';
        this.disabled = true;
        
        setTimeout(() => {
            showScene(1); // Show personal message
            setTimeout(() => {
                showScene(2); // Show memories after 3 seconds
            }, 3000);
        }, 600);
    });
    
    // Build memories
    const container = document.getElementById('memoriesContainer');
    if (container && config.memories) {
        config.memories.forEach((memory, i) => {
            const div = document.createElement('div');
            div.className = 'flex flex-col md:flex-row gap-8 items-center opacity-0 translate-y-8 transition-all duration-1000';
            div.style.transitionDelay = `${i * 200}ms`;
            div.innerHTML = `
                <div class="flex-1 space-y-4 order-2 md:order-1">
                    <span class="text-sm uppercase tracking-widest text-gray-500">${memory.date}</span>
                    <h3 class="text-3xl md:text-4xl serif font-light">${memory.title}</h3>
                    <p class="text-gray-300 leading-relaxed">${memory.text}</p>
                </div>
                <div class="flex-1 order-1 md:order-2 overflow-hidden rounded-2xl">
                    <img src="${memory.image}" alt="${memory.title}" 
                         class="w-full h-64 md:h-80 object-cover rounded-2xl hover:scale-105 transition-transform duration-700" 
                         loading="lazy" 
                         onerror="this.src='assets/images/placeholder-1.jpg'">
                </div>
            `;
            container.appendChild(div);
            
            // Reveal on scroll
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-8');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            obs.observe(div);
        });
    }
    
    // Build photo gallery
    const grid = document.getElementById('photoGrid');
    if (grid && config.memories) {
        config.memories.forEach((memory) => {
            const div = document.createElement('div');
            div.className = 'overflow-hidden rounded-2xl cursor-pointer group relative';
            div.innerHTML = `
                <img src="${memory.image}" alt="${memory.title}" 
                     class="w-full h-72 md:h-96 object-cover transition-all duration-700 group-hover:scale-105" 
                     loading="lazy" 
                     onerror="this.src='assets/images/placeholder-1.jpg'">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end p-6">
                    <p class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 serif text-xl">${memory.title}</p>
                </div>
            `;
            div.addEventListener('click', () => {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = document.getElementById('lightboxImg');
                if (lightbox && lightboxImg) {
                    lightboxImg.src = memory.image;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
            grid.appendChild(div);
        });
    }
    
    // Lightbox close
    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
    
    // Playful interaction
    const response = document.getElementById('playfulResponse');
    document.getElementById('optionFood').addEventListener('click', () => {
        response.textContent = config.playful.response1;
        response.classList.remove('opacity-0');
        response.classList.add('opacity-100');
        setTimeout(() => showScene(5), 2000);
    });
    
    document.getElementById('optionYou').addEventListener('click', () => {
        response.textContent = config.playful.response2;
        response.classList.remove('opacity-0');
        response.classList.add('opacity-100');
        setTimeout(() => showScene(5), 2000);
    });
    
    // Auto advance from buildup to letter
    const buildupEl = document.getElementById('sceneBuildup');
    if (buildupEl) {
        const buildupObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => showScene(6), 4000);
                    buildupObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        buildupObs.observe(buildupEl);
    }
    
    // Auto advance from letter to proposal
    const letterEl = document.getElementById('sceneLetter');
    if (letterEl) {
        const letterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => showScene(7), 5000);
                    letterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        letterObs.observe(letterEl);
    }
    
    // Proposal buttons
    const yesBtn = document.getElementById('yesButton');
    const maybeBtn = document.getElementById('maybeButton');
    const maybeMsg = document.getElementById('maybeMessageDisplay');
    
    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            yesBtn.textContent = '...';
            if (maybeBtn) maybeBtn.style.display = 'none';
            setTimeout(() => showScene(8), 800);
        });
    }
    
    if (maybeBtn) {
        maybeBtn.addEventListener('click', () => {
            if (maybeMsg) {
                maybeMsg.textContent = config.maybeMessage;
                maybeMsg.classList.remove('opacity-0');
                maybeMsg.classList.add('opacity-100');
                setTimeout(() => {
                    maybeMsg.classList.remove('opacity-100');
                    maybeMsg.classList.add('opacity-0');
                }, 3000);
            }
        });
    }
    
    // Celebration particles
    function startCelebration() {
        const canvas = document.getElementById('celebrationCanvas');
        if (!canvas) return;
        canvas.innerHTML = '';
        
        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff8fab'];
        
        // Colored particles
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${Math.random() * 8 + 2}px;
                height: ${Math.random() * 8 + 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
                pointer-events: none;
                animation: floatUp ${Math.random() * 3 + 2}s ease-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            canvas.appendChild(p);
        }
        
        // Floating hearts
        for (let i = 0; i < 15; i++) {
            const h = document.createElement('div');
            h.innerHTML = '❤️';
            h.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 12}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
                pointer-events: none;
                animation: heartFloat ${Math.random() * 4 + 3}s ease-out infinite;
                animation-delay: ${Math.random() * 3}s;
            `;
            canvas.appendChild(h);
        }
    }
    
    // Secret easter egg
    const secretHeart = document.getElementById('secretHeart');
    if (secretHeart) {
        secretHeart.addEventListener('click', function() {
            const secret = document.createElement('div');
            secret.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.95);
                backdrop-filter: blur(20px);
                padding: 3rem;
                border-radius: 2rem;
                z-index: 2000;
                text-align: center;
                color: white;
            `;
            secret.innerHTML = `
                <p class="text-2xl serif mb-4">You found the secret. ✨</p>
                <p class="text-xl italic">${config.secretMessage}</p>
                <button class="mt-6 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition" onclick="this.parentElement.remove()">close</button>
            `;
            document.body.appendChild(secret);
            setTimeout(() => {
                if (secret.parentElement) secret.remove();
            }, 5000);
        });
    }
    
    // Music toggle
    const musicToggle = document.getElementById('musicToggle');
    let audio = null;
    if (config.music && config.music.enabled) {
        musicToggle.style.display = 'flex';
        audio = new Audio(config.music.file);
        audio.loop = true;
        audio.volume = 0.3;
        
        musicToggle.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(() => {});
                musicToggle.textContent = '🔊';
            } else {
                audio.pause();
                musicToggle.textContent = '🔇';
            }
        });
    }
    
    // Create background stars
    const particles = document.getElementById('particlesContainer');
    if (particles) {
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${Math.random() * 2 + 1}px;
                height: ${Math.random() * 2 + 1}px;
                animation-delay: ${Math.random() * 6}s;
                animation-duration: ${Math.random() * 4 + 4}s;
            `;
            particles.appendChild(star);
        }
    }
    
    // Start with first scene
    showScene(0);
    
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.star, .memory-card, .photo-cinematic').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
    
    console.log('✅ Just For You - Ready! Click Enter to start.');
});