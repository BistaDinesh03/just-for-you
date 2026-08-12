/* ✦ JUST FOR YOU — Main Experience Engine ✦ */
(function() {
    'use strict';

    // ─── Wait for everything to load ───────────────────
    window.addEventListener('DOMContentLoaded', () => {
        
        const s = window.story;
        if (!s) {
            console.error('❌ config.js missing. Make sure config.js loads before script.js');
            return;
        }

        // ─── Cache DOM elements ─────────────────────────
        const $ = (id) => document.getElementById(id);
        const qs = (sel) => document.querySelector(sel);
        
        // ─── Populate text from config ──────────────────
        const setText = (id, text) => { const el = $(id); if (el && text) el.textContent = text; };
        
        setText('openingLine1', s.opening?.line1);
        setText('openingLine2', s.opening?.line2);
        const enterBtn = $('enterBtn');
        if (enterBtn && s.opening?.buttonText) enterBtn.textContent = s.opening.buttonText;
        
        setText('questionText', s.question);
        setText('yesLine2', s.yes?.line2);
        setText('letterBody', s.letter);
        
        if (s.playful?.enabled) {
            setText('playfulQuestion', s.playful.question);
            setText('optA', s.playful.optionA);
            setText('optB', s.playful.optionB);
        } else {
            const playfulScene = $('scenePlayful');
            if (playfulScene) playfulScene.style.display = 'none';
        }
        
        // ─── Scene Management ───────────────────────────
        const scenes = [
            'sceneOpening', 'scenePersonal', 'sceneMemories',
            'scenePlayful', 'sceneBuildup', 'sceneLetter',
            'sceneQuestion', 'sceneYes', 'sceneMaybe'
        ];
        
        let currentScene = -1;
        
        function goTo(index) {
            if (index < 0 || index >= scenes.length) return;
            if (index === currentScene) return;
            
            // Hide current
            if (currentScene >= 0) {
                const prev = $(scenes[currentScene]);
                if (prev) {
                    prev.style.opacity = '0';
                    prev.style.pointerEvents = 'none';
                    setTimeout(() => { prev.classList.add('hidden'); }, 600);
                }
            }
            
            // Show next
            const next = $(scenes[index]);
            if (next) {
                next.classList.remove('hidden');
                // Force reflow for transition
                next.offsetHeight;
                next.style.opacity = '1';
                next.style.pointerEvents = 'auto';
            }
            
            currentScene = index;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Trigger celebration if yes scene
            if (scenes[index] === 'sceneYes') celebrate();
        }
        
        // ─── Opening Button ─────────────────────────────
        if (enterBtn) {
            enterBtn.addEventListener('click', function() {
                this.textContent = '...';
                this.disabled = true;
                setTimeout(() => goTo(1), 500);
                // Auto advance through personal message
                setTimeout(() => goTo(2), 3500);
            });
        }
        
        // ─── Build Memory Timeline ──────────────────────
        const memoriesContainer = $('memoriesContainer');
        if (memoriesContainer && s.memories) {
            s.memories.forEach((memory, i) => {
                const card = document.createElement('article');
                card.className = 'memory-card';
                card.style.setProperty('--delay', `${i * 0.15}s`);
                card.innerHTML = `
                    <div class="memory-date">${memory.date}</div>
                    <h3 class="memory-title">${memory.title}</h3>
                    <p class="memory-text">${memory.description}</p>
                    <div class="memory-image-wrap">
                        <img src="${memory.image}" alt="${memory.title}" loading="lazy" class="memory-image">
                    </div>
                `;
                
                // Click to open lightbox
                card.querySelector('.memory-image').addEventListener('click', () => {
                    openLightbox(memory.image, memory.title);
                });
                
                memoriesContainer.appendChild(card);
                
                // Reveal on scroll
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
                observer.observe(card);
            });
        }
        
        // ─── Lightbox ────────────────────────────────────
        const lightbox = $('lightbox');
        const lightboxImg = $('lightboxImg');
        const lightboxCaption = $('lightboxCaption');
        
        window.openLightbox = function(src, caption) {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = src;
            if (lightboxCaption) lightboxCaption.textContent = caption || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        window.closeLightbox = function() {
            if (!lightbox) return;
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    closeLightbox();
                }
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
        
        // ─── Playful Interaction ─────────────────────────
        const optA = $('optA');
        const optB = $('optB');
        const playfulResponse = $('playfulResponse');
        
        if (optA && s.playful?.enabled) {
            optA.addEventListener('click', () => {
                if (playfulResponse) {
                    playfulResponse.textContent = s.playful.responseA;
                    playfulResponse.classList.add('visible');
                }
                optA.disabled = true;
                optB.disabled = true;
                setTimeout(() => goTo(4), 2200);
            });
        }
        
        if (optB && s.playful?.enabled) {
            optB.addEventListener('click', () => {
                if (playfulResponse) {
                    playfulResponse.textContent = s.playful.responseB;
                    playfulResponse.classList.add('visible');
                }
                optA.disabled = true;
                optB.disabled = true;
                setTimeout(() => goTo(4), 2200);
            });
        }
        
        // ─── Auto-advance Buildup → Letter ──────────────
        const buildupScene = $('sceneBuildup');
        if (buildupScene) {
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(() => goTo(5), 5000);
                }
            }, { threshold: 0.6 }).observe(buildupScene);
        }
        
        // ─── Auto-advance Letter → Question ─────────────
        const letterScene = $('sceneLetter');
        if (letterScene) {
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(() => goTo(6), 6000);
                }
            }, { threshold: 0.4 }).observe(letterScene);
        }
        
        // ─── Question Buttons ────────────────────────────
        const yesBtn = $('yesBtn');
        const maybeBtn = $('maybeBtn');
        const maybeMsg = $('maybeMessage');
        
        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                yesBtn.textContent = '...';
                if (maybeBtn) maybeBtn.style.opacity = '0';
                setTimeout(() => goTo(7), 900);
            });
        }
        
        if (maybeBtn) {
            maybeBtn.addEventListener('click', () => {
                goTo(8);
                if (maybeMsg && s.maybe?.message) {
                    maybeMsg.textContent = s.maybe.message;
                }
            });
        }
        
        // ─── Maybe → Return option ──────────────────────
        const returnBtn = $('returnBtn');
        if (returnBtn) {
            returnBtn.addEventListener('click', () => goTo(6));
        }
        
        // ─── Celebration ─────────────────────────────────
        function celebrate() {
            const canvas = $('celebrationCanvas');
            if (!canvas) return;
            
            const colors = ['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#f5ebe0'];
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    animation-delay: ${Math.random() * 2}s;
                    animation-duration: ${Math.random() * 3 + 3}s;
                `;
                fragment.appendChild(particle);
            }
            
            canvas.appendChild(fragment);
            
            // Optional music
            if (s.music?.enabled && s.music?.file) {
                const audio = new Audio(s.music.file);
                audio.volume = s.music.volume || 0.3;
                audio.play().catch(() => {});
            }
        }
        
        // ─── Secret Easter Egg ───────────────────────────
        const secretTrigger = $('secretTrigger');
        if (secretTrigger && s.secret) {
            secretTrigger.addEventListener('click', () => {
                const toast = document.createElement('div');
                toast.className = 'secret-toast';
                toast.innerHTML = `
                    <p>✨ You found it.</p>
                    <p>${s.secret}</p>
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 4000);
            });
        }
        
        // ─── Respect Reduced Motion ──────────────────────
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }
        
        // ─── Start ───────────────────────────────────────
        goTo(0);
        console.log('💫 Just For You — Ready');
    });
})();