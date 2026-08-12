// Wait for everything to load
window.addEventListener('DOMContentLoaded', () => {
    
    // Get config safely
    const config = window.proposal;
    
    // Check if config exists
    if (!config) {
        console.error('❌ config.js not loaded! Make sure config.js is in the same folder.');
        return;
    }
    
    console.log('✅ Config loaded:', config.name);
    
    // Safe element getter
    function getEl(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`⚠️ Element #${id} not found`);
        return el;
    }
    
    // Populate text safely
    const entryName = getEl('entryName');
    if (entryName && config.intro) entryName.textContent = config.intro.title;
    
    const entrySubtitle = document.querySelector('#sceneEntry p');
    if (entrySubtitle && config.intro) entrySubtitle.textContent = config.intro.subtitle;
    
    const personal1 = getEl('personalLine1');
    if (personal1 && config.personalMessage) personal1.textContent = config.personalMessage.line1;
    
    const personal2 = getEl('personalLine2');
    if (personal2 && config.personalMessage) personal2.textContent = config.personalMessage.line2;
    
    const proposalQ = getEl('proposalQuestion');
    if (proposalQ && config.question) proposalQ.textContent = config.question;
    
    const yesMsg = getEl('yesMessageDisplay');
    if (yesMsg && config.yesMessage) yesMsg.textContent = config.yesMessage;
    
    const letterContent = getEl('letterContent');
    if (letterContent && config.letter) letterContent.textContent = config.letter;
    
    // Playful section
    if (config.playful) {
        const playfulQ = document.querySelector('#scenePlayful .serif');
        if (playfulQ) playfulQ.textContent = config.playful.question;
        
        const playfulSub = document.querySelector('#scenePlayful p:nth-of-type(2)');
        if (playfulSub) playfulSub.textContent = config.playful.subtitle;
        
        const opt1 = getEl('optionFood');
        if (opt1) opt1.textContent = config.playful.option1;
        
        const opt2 = getEl('optionYou');
        if (opt2) opt2.textContent = config.playful.option2;
    }
    
    // Scene management
    const scenes = [
        'sceneEntry', 'scenePersonal', 'sceneMemories', 'scenePhotos',
        'scenePlayful', 'sceneBuildup', 'sceneLetter', 'sceneProposal', 'sceneCelebration'
    ];
    
    function showScene(index) {
        if (index < 0 || index >= scenes.length) return;
        
        scenes.forEach(id => {
            const el = getEl(id);
            if (el) {
                el.classList.add('hidden-scene');
                el.classList.remove('active-scene');
            }
        });
        
        const target = getEl(scenes[index]);
        if (target) {
            target.classList.remove('hidden-scene');
            target.classList.add('active-scene');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (scenes[index] === 'sceneCelebration') {
                startCelebration();
            }
        }
    }
    
    // ENTER BUTTON
    const enterBtn = getEl('enterButton');
    if (enterBtn) {
        enterBtn.addEventListener('click', function() {
            this.textContent = '...';
            this.disabled = true;
            
            setTimeout(() => {
                showScene(1);
                setTimeout(() => showScene(2), 3000);
            }, 600);
        });
    }
    
    // Build memories
    const memoriesContainer = getEl('memoriesContainer');
    if (memoriesContainer && config.memories) {
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
                         class="w-full h-64 md:h-80 object-cover rounded-2xl" 
                         loading="lazy">
                </div>
            `;
            memoriesContainer.appendChild(div);
            
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
    
    // Build photos
    const photoGrid = getEl('photoGrid');
    if (photoGrid && config.memories) {
        config.memories.forEach((memory) => {
            const div = document.createElement('div');
            div.className = 'overflow-hidden rounded-2xl cursor-pointer group relative';
            div.innerHTML = `
                <img src="${memory.image}" alt="${memory.title}" 
                     class="w-full h-72 md:h-96 object-cover transition-all duration-700 group-hover:scale-105" 
                     loading="lazy">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end p-6">
                    <p class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 serif text-xl">${memory.title}</p>
                </div>
            `;
            div.addEventListener('click', () => {
                const lb = getEl('lightbox');
                const lbImg = getEl('lightboxImg');
                if (lb && lbImg) {
                    lbImg.src = memory.image;
                    lb.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
            photoGrid.appendChild(div);
        });
    }
    
    // Close lightbox
    window.closeLightbox = function() {
        const lb = getEl('lightbox');
        if (lb) {
            lb.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeLightbox();
    });
    
    // Playful buttons
    const playfulResponse = getEl('playfulResponse');
    const foodBtn = getEl('optionFood');
    const youBtn = getEl('optionYou');
    
    if (foodBtn && config.playful) {
        foodBtn.addEventListener('click', () => {
            if (playfulResponse) {
                playfulResponse.textContent = config.playful.response1;
                playfulResponse.classList.remove('opacity-0');
                playfulResponse.classList.add('opacity-100');
            }
            setTimeout(() => showScene(5), 2000);
        });
    }
    
    if (youBtn && config.playful) {
        youBtn.addEventListener('click', () => {
            if (playfulResponse) {
                playfulResponse.textContent = config.playful.response2;
                playfulResponse.classList.remove('opacity-0');
                playfulResponse.classList.add('opacity-100');
            }
            setTimeout(() => showScene(5), 2000);
        });
    }
    
    // Auto advance buildup
    const buildup = getEl('sceneBuildup');
    if (buildup) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => showScene(6), 4000);
                }
            });
        }, { threshold: 0.5 }).observe(buildup);
    }
    
    // Auto advance letter
    const letter = getEl('sceneLetter');
    if (letter) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => showScene(7), 5000);
                }
            });
        }, { threshold: 0.3 }).observe(letter);
    }
    
    // Proposal buttons
    const yesBtn = getEl('yesButton');
    const maybeBtn = getEl('maybeButton');
    const maybeMsg = getEl('maybeMessageDisplay');
    
    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            yesBtn.textContent = '...';
            if (maybeBtn) maybeBtn.style.display = 'none';
            setTimeout(() => showScene(8), 800);
        });
    }
    
    if (maybeBtn) {
        maybeBtn.addEventListener('click', () => {
            if (maybeMsg && config.maybeMessage) {
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
    
    // Celebration
    function startCelebration() {
        const canvas = getEl('celebrationCanvas');
        if (!canvas) return;
        canvas.innerHTML = '';
        
        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff8fab'];
        
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position:absolute;
                width:${Math.random()*8+2}px;
                height:${Math.random()*8+2}px;
                background:${colors[Math.floor(Math.random()*colors.length)]};
                border-radius:50%;
                left:${Math.random()*100}%;
                top:${Math.random()*100}%;
                opacity:0;
                pointer-events:none;
                animation:floatUp ${Math.random()*3+2}s ease-out infinite;
                animation-delay:${Math.random()*2}s;
            `;
            canvas.appendChild(p);
        }
        
        for (let i = 0; i < 15; i++) {
            const h = document.createElement('div');
            h.innerHTML = '❤️';
            h.style.cssText = `
                position:absolute;
                font-size:${Math.random()*20+12}px;
                left:${Math.random()*100}%;
                top:${Math.random()*100}%;
                opacity:0;
                pointer-events:none;
                animation:heartFloat ${Math.random()*4+3}s ease-out infinite;
                animation-delay:${Math.random()*3}s;
            `;
            canvas.appendChild(h);
        }
    }
    
    // Secret
    const secretBtn = getEl('secretHeart');
    if (secretBtn) {
        secretBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);padding:3rem;border-radius:2rem;z-index:2000;text-align:center;color:white;';
            div.innerHTML = `
                <p class="text-2xl serif mb-4">You found the secret. ✨</p>
                <p class="text-xl italic">${config.secretMessage || 'You are amazing.'}</p>
                <button class="mt-6 px-6 py-2 bg-white/10 rounded-full" onclick="this.parentElement.remove()">close</button>
            `;
            document.body.appendChild(div);
            setTimeout(() => { if (div.parentElement) div.remove(); }, 5000);
        });
    }
    
    // Music
    const musicToggle = getEl('musicToggle');
    if (config.music && config.music.enabled && musicToggle) {
        musicToggle.style.display = 'flex';
        const audio = new Audio(config.music.file);
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
    
    // Stars
    const particles = getEl('particlesContainer');
    if (particles) {
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                left:${Math.random()*100}%;
                top:${Math.random()*100}%;
                width:${Math.random()*2+1}px;
                height:${Math.random()*2+1}px;
                animation-delay:${Math.random()*6}s;
                animation-duration:${Math.random()*4+4}s;
            `;
            particles.appendChild(star);
        }
    }
    
    // Start!
    showScene(0);
    console.log('✅ Just For You is ready! Click Enter to start.');
});