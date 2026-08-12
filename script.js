/* ✦ JUST FOR YOU — Main Experience Engine ✦ */
(function() {
    'use strict';

    // Wait for DOM and config to be ready
    function init() {
        // ─── Get config ──────────────────────────────
        const s = window.story;
        if (!s) {
            console.error('❌ config.js missing. Make sure config.js loads before script.js');
            return;
        }
        console.log('✅ Story config loaded for:', s.person?.name);

        // ─── Helper: get element by ID ───────────────
        const $ = function(id) {
            const el = document.getElementById(id);
            if (!el) console.warn('⚠️ Element not found: #' + id);
            return el;
        };

        // ─── Helper: set text content ────────────────
        const setText = function(id, text) {
            const el = $(id);
            if (el && text !== undefined && text !== null) {
                el.textContent = text;
            }
        };

        // ─── Populate ALL text from config ───────────
        setText('openingLine1', s.opening?.line1);
        setText('openingLine2', s.opening?.line2);
        
        const enterBtn = $('enterBtn');
        if (enterBtn && s.opening?.buttonText) {
            enterBtn.textContent = s.opening.buttonText;
        }

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

        // ─── Scene Management ────────────────────────
        const sceneIds = [
            'sceneOpening',
            'scenePersonal',
            'sceneMemories',
            'scenePlayful',
            'sceneBuildup',
            'sceneLetter',
            'sceneQuestion',
            'sceneYes',
            'sceneMaybe'
        ];

        let currentSceneId = null;

        function showScene(sceneId) {
            // Hide all scenes first
            sceneIds.forEach(function(id) {
                const el = $(id);
                if (el) {
                    el.classList.remove('active');
                    el.classList.add('hidden');
                }
            });

            // Show the target scene
            const target = $(sceneId);
            if (!target) {
                console.error('❌ Scene not found:', sceneId);
                return;
            }

            target.classList.remove('hidden');
            // Force browser reflow for transition to work
            target.offsetHeight;
            target.classList.add('active');

            currentSceneId = sceneId;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            console.log('📍 Showing scene:', sceneId);

            // Trigger celebration if yes scene
            if (sceneId === 'sceneYes') {
                celebrate();
            }
        }

        // ─── Entry Button ────────────────────────────
        if (enterBtn) {
            enterBtn.addEventListener('click', function() {
                console.log('🖱️ Enter button clicked');
                this.textContent = '...';
                this.disabled = true;

                // Go to personal message
                setTimeout(function() {
                    showScene('scenePersonal');
                }, 400);

                // Auto-advance to memories after pause
                setTimeout(function() {
                    showScene('sceneMemories');
                }, 3500);
            });
            console.log('✅ Enter button listener attached');
        } else {
            console.error('❌ Enter button not found!');
        }

        // ─── Build Memory Cards ──────────────────────
        const memoriesContainer = $('memoriesContainer');
        if (memoriesContainer && s.memories && s.memories.length > 0) {
            s.memories.forEach(function(memory, i) {
                const card = document.createElement('article');
                card.className = 'memory-card';
                card.style.setProperty('--delay', (i * 0.15) + 's');

                card.innerHTML = 
                    '<div class="memory-content">' +
                        '<div class="memory-date">' + memory.date + '</div>' +
                        '<h3 class="memory-title">' + memory.title + '</h3>' +
                        '<p class="memory-text">' + memory.description + '</p>' +
                    '</div>' +
                    '<div class="memory-image-wrap">' +
                        '<img src="' + memory.image + '" alt="' + memory.title + '" loading="lazy" class="memory-image">' +
                    '</div>';

                // Click image to open lightbox
                const img = card.querySelector('.memory-image');
                if (img) {
                    img.addEventListener('click', function() {
                        openLightbox(memory.image, memory.title);
                    });
                }

                memoriesContainer.appendChild(card);

                // Reveal on scroll
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
                observer.observe(card);
            });
            console.log('✅ Built ' + s.memories.length + ' memory cards');
        }

        // ─── Lightbox ────────────────────────────────
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

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeLightbox();
        });

        // ─── Playful Interaction ─────────────────────
        const optA = $('optA');
        const optB = $('optB');
        const playfulResponse = $('playfulResponse');

        if (optA && s.playful?.enabled) {
            optA.addEventListener('click', function() {
                if (playfulResponse) {
                    playfulResponse.textContent = s.playful.responseA;
                    playfulResponse.style.opacity = '1';
                }
                optA.disabled = true;
                if (optB) optB.disabled = true;
                setTimeout(function() { showScene('sceneBuildup'); }, 2200);
            });
        }

        if (optB && s.playful?.enabled) {
            optB.addEventListener('click', function() {
                if (playfulResponse) {
                    playfulResponse.textContent = s.playful.responseB;
                    playfulResponse.style.opacity = '1';
                }
                optA.disabled = true;
                if (optB) optB.disabled = true;
                setTimeout(function() { showScene('sceneBuildup'); }, 2200);
            });
        }

        // ─── Auto-advance: Buildup → Letter ──────────
        const buildupScene = $('sceneBuildup');
        if (buildupScene) {
            const buildupObserver = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    setTimeout(function() { showScene('sceneLetter'); }, 5000);
                    buildupObserver.unobserve(buildupScene);
                }
            }, { threshold: 0.6 });
            buildupObserver.observe(buildupScene);
        }

        // ─── Auto-advance: Letter → Question ─────────
        const letterScene = $('sceneLetter');
        if (letterScene) {
            const letterObserver = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    setTimeout(function() { showScene('sceneQuestion'); }, 6000);
                    letterObserver.unobserve(letterScene);
                }
            }, { threshold: 0.4 });
            letterObserver.observe(letterScene);
        }

        // ─── Question Buttons ────────────────────────
        const yesBtn = $('yesBtn');
        const maybeBtn = $('maybeBtn');
        const maybeMsg = $('maybeMessage');

        if (yesBtn) {
            yesBtn.addEventListener('click', function() {
                console.log('🖱️ Yes button clicked');
                yesBtn.textContent = '...';
                if (maybeBtn) maybeBtn.style.opacity = '0';
                setTimeout(function() { showScene('sceneYes'); }, 900);
            });
        }

        if (maybeBtn) {
            maybeBtn.addEventListener('click', function() {
                console.log('🖱️ Maybe button clicked');
                showScene('sceneMaybe');
                if (maybeMsg && s.maybe?.message) {
                    maybeMsg.textContent = s.maybe.message;
                }
            });
        }

        // ─── Return from Maybe ───────────────────────
        const returnBtn = $('returnBtn');
        if (returnBtn) {
            returnBtn.addEventListener('click', function() {
                showScene('sceneQuestion');
            });
        }

        // ─── Celebration ─────────────────────────────
        function celebrate() {
            const canvas = $('celebrationCanvas');
            if (!canvas) return;

            const colors = ['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#f5ebe0'];
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = 
                    'left: ' + (Math.random() * 100) + '%;' +
                    'top: ' + (Math.random() * 100) + '%;' +
                    'width: ' + (Math.random() * 4 + 2) + 'px;' +
                    'height: ' + (Math.random() * 4 + 2) + 'px;' +
                    'background: ' + colors[Math.floor(Math.random() * colors.length)] + ';' +
                    'animation-delay: ' + (Math.random() * 2) + 's;' +
                    'animation-duration: ' + (Math.random() * 3 + 3) + 's;';
                fragment.appendChild(particle);
            }

            canvas.appendChild(fragment);

            // Optional music
            if (s.music?.enabled && s.music?.file) {
                try {
                    const audio = new Audio(s.music.file);
                    audio.volume = s.music.volume || 0.3;
                    audio.play().catch(function() {});
                } catch(e) {
                    console.warn('Could not play music:', e);
                }
            }
        }

        // ─── Secret Easter Egg ───────────────────────
        const secretTrigger = $('secretTrigger');
        if (secretTrigger && s.secret) {
            secretTrigger.addEventListener('click', function() {
                const toast = document.createElement('div');
                toast.className = 'secret-toast';
                toast.innerHTML = '<p>✨ You found it.</p><p>' + s.secret + '</p>';
                document.body.appendChild(toast);
                setTimeout(function() { toast.remove(); }, 4000);
            });
        }

        // ─── Reduced Motion ──────────────────────────
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }

        // ─── START! ──────────────────────────────────
        showScene('sceneOpening');
        console.log('💫 Just For You — Ready! Click "See what\'s inside" to begin.');
    }

    // ─── Run when DOM is ready ──────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();