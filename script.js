// ✦ JUST FOR YOU - Main Script ✦
document.addEventListener('DOMContentLoaded', () => {
    
    const config = window.proposal;
    
    // Populate config
    document.getElementById('entryName').textContent = config.intro.title;
    document.querySelector('#sceneEntry p').textContent = config.intro.subtitle;
    document.getElementById('personalLine1').textContent = config.personalMessage.line1;
    document.getElementById('personalLine2').textContent = config.personalMessage.line2;
    document.getElementById('proposalQuestion').textContent = config.question;
    document.getElementById('yesMessageDisplay').textContent = config.yesMessage;
    document.getElementById('letterContent').textContent = config.letter;
    document.querySelector('#scenePlayful .serif').textContent = config.playful.question;
    document.querySelector('#scenePlayful p:nth-of-type(2)').textContent = config.playful.subtitle;
    document.getElementById('optionFood').textContent = config.playful.option1;
    document.getElementById('optionYou').textContent = config.playful.option2;
    
    // Scene management
    const scenes = ['sceneEntry','scenePersonal','sceneMemories','scenePhotos','scenePlayful','sceneBuildup','sceneLetter','sceneProposal','sceneCelebration'];
    let currentScene = 0;
    
    function showScene(index) {
        if (index < 0 || index >= scenes.length) return;
        scenes.forEach(id => {
            const el = document.getElementById(id);
            el.classList.add('hidden-scene');
            el.classList.remove('active-scene');
        });
        const target = document.getElementById(scenes[index]);
        target.classList.remove('hidden-scene');
        target.classList.add('active-scene');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        currentScene = index;
        if (scenes[index] === 'sceneCelebration') startCelebration();
    }
    
    // Entry button
    document.getElementById('enterButton').addEventListener('click', () => {
        const btn = document.getElementById('enterButton');
        btn.textContent = '...';
        btn.disabled = true;
        setTimeout(() => {
            showScene(1);
            setTimeout(() => showScene(2), 3000);
        }, 600);
    });
    
    // Build memories
    const container = document.getElementById('memoriesContainer');
    config.memories.forEach((memory, i) => {
        const div = document.createElement('div');
        div.className = 'memory-card flex flex-col md:flex-row gap-8 items-center opacity-0 translate-y-8 transition-all duration-1000';
        div.style.transitionDelay = `${i * 200}ms`;
        div.innerHTML = `
            <div class="flex-1 space-y-4 order-2 md:order-1">
                <span class="text-sm uppercase tracking-widest text-gray-500">${memory.date}</span>
                <h3 class="text-3xl md:text-4xl serif font-light">${memory.title}</h3>
                <p class="text-gray-300 leading-relaxed">${memory.text}</p>
            </div>
            <div class="flex-1 order-1 md:order-2 overflow-hidden rounded-2xl">
                <img src="${memory.image}" alt="${memory.title}" class="w-full h-64 md:h-80 object-cover rounded-2xl hover:scale-105 transition-transform duration-700" loading="lazy" onerror="this.src='assets/images/placeholder-1.jpg'">
            </div>
        `;
        container.appendChild(div);
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
    
    // Photo gallery
    const grid = document.getElementById('photoGrid');
    config.memories.forEach((memory) => {
        const div = document.createElement('div');
        div.className = 'photo-cinematic overflow-hidden rounded-2xl cursor-pointer group relative';
        div.innerHTML = `
            <img src="${memory.image}" alt="${memory.title}" class="w-full h-72 md:h-96 object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" onerror="this.src='assets/images/placeholder-1.jpg'">
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end p-6">
                <p class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 serif text-xl">${memory.title}</p>
            </div>
        `;
        div.addEventListener('click', () => {
            document.getElementById('lightboxImg').src = memory.image;
            document.getElementById('lightbox').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        grid.appendChild(div);
    });
    
    // Lightbox close
    window.closeLightbox = function() {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
    
    // Playful
    const response = document.getElementById('playfulResponse');
    document.getElementById('optionFood').addEventListener('click', () => {
        response.textContent = config.playful.response1;
        response.classList.remove('opacity-0'); response.classList.add('opacity-100');
        setTimeout(() => showScene(5), 2000);
    });
    document.getElementById('optionYou').addEventListener('click', () => {
        response.textContent = config.playful.response2;
        response.classList.remove('opacity-0'); response.classList.add('opacity-100');
        setTimeout(() => showScene(5), 2000);
    });
    
    // Buildup to letter
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => showScene(6), 4000);
            }
        });
    }, { threshold: 0.5 }).observe(document.getElementById('sceneBuildup'));
    
    // Letter to proposal
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => showScene(7), 5000);
            }
        });
    }, { threshold: 0.3 }).observe(document.getElementById('sceneLetter'));
    
    // Proposal
    const maybeMsg = document.getElementById('maybeMessageDisplay');
    document.getElementById('yesButton').addEventListener('click', () => {
        document.getElementById('yesButton').textContent = '...';
        document.getElementById('maybeButton').style.display = 'none';
        setTimeout(() => showScene(8), 800);
    });
    document.getElementById('maybeButton').addEventListener('click', () => {
        maybeMsg.textContent = config.maybeMessage;
        maybeMsg.classList.remove('opacity-0'); maybeMsg.classList.add('opacity-100');
        setTimeout(() => { maybeMsg.classList.remove('opacity-100'); maybeMsg.classList.add('opacity-0'); }, 3000);
    });
    
    // Celebration
    function startCelebration() {
        const canvas = document.getElementById('celebrationCanvas');
        canvas.innerHTML = '';
        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff8fab'];
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('div');
            p.style.cssText = `position:absolute;width:${Math.random()*8+2}px;height:${Math.random()*8+2}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:0;pointer-events:none;animation:floatUp ${Math.random()*3+2}s ease-out infinite;animation-delay:${Math.random()*2}s;`;
            canvas.appendChild(p);
        }
        for (let i = 0; i < 15; i++) {
            const h = document.createElement('div');
            h.innerHTML = '❤️';
            h.style.cssText = `position:absolute;font-size:${Math.random()*20+12}px;left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:0;pointer-events:none;animation:heartFloat ${Math.random()*4+3}s ease-out infinite;animation-delay:${Math.random()*3}s;`;
            canvas.appendChild(h);
        }
    }
    
    // Animations
    const style = document.createElement('style');
    style.textContent = `@keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:0.8;}100%{transform:translateY(-100vh) scale(0);opacity:0;}}@keyframes heartFloat{0%{transform:translateY(0) rotate(0deg);opacity:0.7;}100%{transform:translateY(-80vh) rotate(20deg);opacity:0;}}`;
    document.head.appendChild(style);
    
    // Secret
    document.getElementById('secretHeart').addEventListener('click', function() {
        const secret = document.createElement('div');
        secret.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);backdrop-filter:blur(20px);padding:3rem;border-radius:2rem;z-index:2000;text-align:center;';
        secret.innerHTML = `<p class="text-2xl serif mb-4">You found the secret. ✨</p><p class="text-xl italic">${config.secretMessage}</p><button class="mt-6 px-6 py-2 bg-white/10 rounded-full" onclick="this.parentElement.remove()">close</button>`;
        document.body.appendChild(secret);
        setTimeout(() => secret.remove(), 5000);
    });
    
    // Music
    const musicToggle = document.getElementById('musicToggle');
    let audio = null;
    if (config.music.enabled) {
        musicToggle.style.display = 'flex';
        audio = new Audio(config.music.file);
        audio.loop = true;
        audio.volume = 0.3;
        musicToggle.addEventListener('click', () => {
            if (audio.paused) { audio.play().catch(()=>{}); musicToggle.textContent = '🔊'; }
            else { audio.pause(); musicToggle.textContent = '🔇'; }
        });
    }
    
    // Particles
    const particles = document.getElementById('particlesContainer');
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;animation-delay:${Math.random()*6}s;animation-duration:${Math.random()*4+4}s;`;
        particles.appendChild(star);
    }
    
    showScene(0);
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.star,.memory-card,.photo-cinematic').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
});