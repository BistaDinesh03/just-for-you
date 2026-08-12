/* ✦ JUST FOR YOU — Main Experience Engine ✦ */
(function() {
    'use strict';

    function init() {
        const s = window.story;
        if (!s) {
            console.error('❌ config.js missing.');
            return;
        }
        console.log('✅ Story loaded for:', s.person?.name);

        const $ = function(id) {
            const el = document.getElementById(id);
            if (!el) console.warn('⚠️ Missing: #' + id);
            return el;
        };

        const setText = function(id, text) {
            const el = $(id);
            if (el && text !== undefined && text !== null) el.textContent = text;
        };

        // ─── POPULATE TEXT ───────────────────────────
        setText('openingLine1', s.opening?.line1);
        setText('openingLine2', s.opening?.line2);
        setText('openingLine3', s.opening?.line3);
        
        const enterBtn = $('enterBtn');
        if (enterBtn && s.opening?.buttonText) enterBtn.textContent = s.opening.buttonText;

        // How it started
        setText('howTitle', s.howItStarted?.title);
        setText('howDate', s.howItStarted?.date);
        setText('howLine1', s.howItStarted?.line1);
        setText('howLine2', s.howItStarted?.line2);
        setText('howLine3', s.howItStarted?.line3);

        // Kept talking
        setText('keptTitle', s.keptTalking?.title);
        setText('keptLine1', s.keptTalking?.line1);
        setText('keptLine2', s.keptTalking?.line2);
        setText('keptLine3', s.keptTalking?.line3);
        setText('keptLine4', s.keptTalking?.line4);

        // Honest part
        setText('honestTitle', s.honestPart?.title);
        const honestList = $('honestList');
        if (honestList && s.honestPart?.lines) {
            honestList.innerHTML = '';
            s.honestPart.lines.forEach(function(line, i) {
                const li = document.createElement('li');
                li.textContent = line;
                li.style.animationDelay = (i * 0.5 + 0.3) + 's';
                honestList.appendChild(li);
            });
        }

        // Confession
        setText('confLine1', s.confession?.line1);
        setText('confLine2', s.confession?.line2);
        setText('confLine3', s.confession?.line3);
        setText('confLine4', s.confession?.line4);

        // Distance
        setText('distCountry1', s.distance?.line1);
        setText('distCountry2', s.distance?.line2);
        setText('distLine3', s.distance?.line3);
        setText('distLine4', s.distance?.line4);
        setText('distLine5', s.distance?.line5);

        // Letter
        setText('letterBody', s.letter);

        // Question
        setText('questionText', s.question);

        // Yes
        setText('yesLine1', s.yes?.line1);
        setText('yesLine2', s.yes?.line2);
        setText('yesLine3', s.yes?.line3);
        setText('yesLine4', s.yes?.line4);
        setText('yesLine5', s.yes?.line5);

        // Maybe
        setText('maybeLine1', s.maybe?.line1);
        setText('maybeLine2', s.maybe?.line2);
        setText('maybeLine3', s.maybe?.line3);
        setText('maybeLine4', s.maybe?.line4);
        setText('maybeBtnText', s.maybe?.buttonText);

        // ─── SCENE MANAGEMENT ────────────────────────
        const sceneIds = [
            'sceneOpening',
            'sceneHowStarted',
            'sceneKeptTalking',
            'sceneHonest',
            'sceneConfession',
            'sceneDistance',
            'sceneLetter',
            'sceneQuestion',
            'sceneYes',
            'sceneMaybe'
        ];

        function showScene(sceneId) {
            sceneIds.forEach(function(id) {
                const el = $(id);
                if (el) {
                    el.classList.remove('active');
                }
            });

            const target = $(sceneId);
            if (!target) {
                console.error('❌ Scene not found:', sceneId);
                return;
            }

            target.offsetHeight;
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            console.log('📍 Scene:', sceneId);

            if (sceneId === 'sceneYes') celebrate();
        }

        // ─── ENTRY BUTTON ────────────────────────────
        if (enterBtn) {
            enterBtn.addEventListener('click', function() {
                console.log('🖱️ Enter clicked');
                this.textContent = '...';
                this.disabled = true;
                setTimeout(function() { showScene('sceneHowStarted'); }, 400);
                setTimeout(function() { showScene('sceneKeptTalking'); }, 4500);
            });
            console.log('✅ Enter button ready');
        }

        // ─── AUTO-ADVANCE CHAIN ──────────────────────
        function autoAdvance(triggerSceneId, nextSceneId, delay) {
            const triggerEl = $(triggerSceneId);
            if (!triggerEl) return;
            let fired = false;
            const observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting && !fired) {
                    fired = true;
                    setTimeout(function() { showScene(nextSceneId); }, delay);
                    observer.unobserve(triggerEl);
                }
            }, { threshold: 0.5 });
            observer.observe(triggerEl);
        }

        autoAdvance('sceneKeptTalking', 'sceneHonest', 5000);
        autoAdvance('sceneHonest', 'sceneConfession', 8000);
        autoAdvance('sceneConfession', 'sceneDistance', 5000);
        autoAdvance('sceneDistance', 'sceneLetter', 5000);
        autoAdvance('sceneLetter', 'sceneQuestion', 7000);

        // ─── QUESTION BUTTONS ────────────────────────
        const yesBtn = $('yesBtn');
        const maybeBtn = $('maybeBtn');

        if (yesBtn) {
            yesBtn.addEventListener('click', function() {
                console.log('🖱️ Yes clicked');
                yesBtn.textContent = '...';
                if (maybeBtn) maybeBtn.style.opacity = '0';
                setTimeout(function() { showScene('sceneYes'); }, 900);
            });
        }

        if (maybeBtn) {
            maybeBtn.addEventListener('click', function() {
                console.log('🖱️ Maybe clicked');
                showScene('sceneMaybe');
            });
        }

        // ─── RETURN FROM MAYBE ───────────────────────
        const returnBtn = $('returnBtn');
        if (returnBtn) {
            returnBtn.addEventListener('click', function() {
                showScene('sceneQuestion');
                if (yesBtn) yesBtn.textContent = 'Yes ❤️';
                if (maybeBtn) maybeBtn.style.opacity = '1';
            });
        }

        // ─── CELEBRATION ─────────────────────────────
        function celebrate() {
            const canvas = $('celebrationCanvas');
            if (!canvas) return;

            const colors = ['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#f5ebe0', '#d4a574'];
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = 
                    'left:' + (Math.random() * 100) + '%;' +
                    'top:' + (Math.random() * 100) + '%;' +
                    'width:' + (Math.random() * 4 + 2) + 'px;' +
                    'height:' + (Math.random() * 4 + 2) + 'px;' +
                    'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
                    'animation-delay:' + (Math.random() * 2) + 's;' +
                    'animation-duration:' + (Math.random() * 3 + 3) + 's;';
                fragment.appendChild(particle);
            }

            canvas.appendChild(fragment);

            if (s.music?.enabled && s.music?.file) {
                try {
                    const audio = new Audio(s.music.file);
                    audio.volume = s.music.volume || 0.3;
                    audio.play().catch(function() {});
                } catch(e) {}
            }
        }

        // ─── SECRET ──────────────────────────────────
        const secretTrigger = $('secretTrigger');
        if (secretTrigger && s.secret) {
            secretTrigger.addEventListener('click', function() {
                const toast = document.createElement('div');
                toast.className = 'secret-toast';
                toast.innerHTML = '<p style="margin-bottom:0.5rem;">✨ You found the secret.</p><p>' + s.secret + '</p>';
                document.body.appendChild(toast);
                setTimeout(function() { toast.remove(); }, 4500);
            });
        }

        // ─── LIGHTBOX ────────────────────────────────
        window.closeLightbox = function() {
            const lb = $('lightbox');
            if (lb) {
                lb.style.opacity = '0';
                lb.style.pointerEvents = 'none';
            }
        };

        // ─── REDUCED MOTION ──────────────────────────
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }

        // ─── START ───────────────────────────────────
        showScene('sceneOpening');
        console.log('💫 Ready — Bisuta → Duyen');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();