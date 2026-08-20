/* ✦ JUST FOR YOU — Main Experience Engine ✦ */
(function() {
    'use strict';

    function init() {
        const s = window.story;
        if (!s) {
            console.error('config.js missing.');
            return;
        }
        console.log('Story loaded for:', s.person?.name);

        const $ = function(id) {
            const el = document.getElementById(id);
            if (!el) console.warn('Missing: #' + id);
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

        setText('howTitle', s.howItStarted?.title);
        setText('howDate', s.howItStarted?.date);
        setText('howLine1', s.howItStarted?.line1);
        setText('howLine2', s.howItStarted?.line2);
        setText('howLine3', s.howItStarted?.line3);

        setText('keptTitle', s.keptTalking?.title);
        setText('keptLine1', s.keptTalking?.line1);
        setText('keptLine2', s.keptTalking?.line2);
        setText('keptLine3', s.keptTalking?.line3);
        setText('keptLine4', s.keptTalking?.line4);

        setText('honestTitle', s.honestPart?.title);
        const honestList = $('honestList');
        if (honestList && s.honestPart?.lines) {
            honestList.innerHTML = '';
            s.honestPart.lines.forEach(function(line, i) {
                const li = document.createElement('li');
                li.textContent = line;
                li.style.animationDelay = (i * 0.4 + 0.2) + 's';
                honestList.appendChild(li);
            });
        }

        setText('confLine1', s.confession?.line1);
        setText('confLine2', s.confession?.line2);
        setText('confLine3', s.confession?.line3);
        setText('confLine4', s.confession?.line4);

        setText('distCountry1', s.distance?.line1);
        setText('distCountry2', s.distance?.line2);
        setText('distLine3', s.distance?.line3);
        setText('distLine4', s.distance?.line4);
        setText('distLine5', s.distance?.line5);

        setText('letterBody', s.letter);
        setText('questionText', s.question);

        setText('yesLine1', s.yes?.line1);
        setText('yesLine2', s.yes?.line2);
        setText('yesLine3', s.yes?.line3);
        setText('yesLine4', s.yes?.line4);
        setText('yesLine5', s.yes?.line5);

        setText('maybeLine1', s.maybe?.line1);
        setText('maybeLine2', s.maybe?.line2);
        setText('maybeLine3', s.maybe?.line3);
        setText('maybeLine4', s.maybe?.line4);

        // ─── NOTIFICATION SYSTEM (SAFE) ─────────────
        function sendNotification(answer) {
            const notif = s.notifications;
            
            // Check if notifications are enabled
            if (!notif || !notif.enabled) {
                console.log('Notifications disabled. No email sent.');
                return;
            }
            
            // Check if email is provided
            if (!notif.email || notif.email.trim() === '' || notif.email === 'YOUR_EMAIL@gmail.com') {
                console.warn('⚠️ Notifications enabled but no valid email configured.');
                console.warn('   Open config.js and set your own email address.');
                console.warn('   No notification was sent.');
                return;
            }
            
            // Send notification
            fetch("https://formsubmit.co/ajax/" + notif.email, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    _subject: "JustForYou — Someone answered!",
                    answer: answer,
                    time: new Date().toLocaleString(),
                    page: window.location.href
                })
            }).then(function(res) {
                console.log('✅ Notification sent to:', notif.email);
            }).catch(function(err) {
                console.warn('⚠️ Could not send notification. User experience not affected.');
            });
        }

        // ─── SCENE ORDER ─────────────────────────────
        const sceneOrder = [
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

        let currentIndex = 0;

        function showSceneByIndex(index) {
            if (index < 0 || index >= sceneOrder.length) return;

            sceneOrder.forEach(function(id) {
                const el = $(id);
                if (el) el.classList.remove('active');
            });

            const sceneId = sceneOrder[index];
            const target = $(sceneId);
            if (!target) return;

            target.offsetHeight;
            target.classList.add('active');
            currentIndex = index;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            updateNavButtons();

            if (sceneId === 'sceneYes') celebrate();

            console.log('Scene ' + (index + 1) + '/' + sceneOrder.length + ': ' + sceneId);
        }

        function goNext() {
            if (currentIndex < sceneOrder.length - 1) {
                showSceneByIndex(currentIndex + 1);
            }
        }

        function goBack() {
            if (currentIndex > 0) {
                showSceneByIndex(currentIndex - 1);
            }
        }

        // ─── NAVIGATION BUTTONS ──────────────────────
        const nextBtn = $('nextBtn');
        const backBtn = $('backBtn');

        function updateNavButtons() {
            if (backBtn) {
                backBtn.style.display = (currentIndex === 0) ? 'none' : 'flex';
            }
            if (nextBtn) {
                var isEndScene = (sceneOrder[currentIndex] === 'sceneYes' || sceneOrder[currentIndex] === 'sceneMaybe');
                nextBtn.style.display = isEndScene ? 'none' : 'flex';
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', goNext);
        }

        if (backBtn) {
            backBtn.addEventListener('click', goBack);
        }

        // ─── ENTRY BUTTON ────────────────────────────
        if (enterBtn) {
            enterBtn.addEventListener('click', function() {
                showSceneByIndex(1);
            });
        }

        // ─── QUESTION BUTTONS ────────────────────────
        const yesBtn = $('yesBtn');
        const maybeBtn = $('maybeBtn');

        if (yesBtn) {
            yesBtn.addEventListener('click', function() {
                console.log('🖱️ YES clicked');
                sendNotification("YES — They said YES!");
                yesBtn.textContent = '...';
                if (maybeBtn) maybeBtn.style.opacity = '0';
                setTimeout(function() { showSceneByIndex(8); }, 600);
            });
        }

        if (maybeBtn) {
            maybeBtn.addEventListener('click', function() {
                console.log('🖱️ MAYBE clicked');
                sendNotification("MAYBE — They want to take it slow");
                showSceneByIndex(9);
            });
        }

        // ─── RETURN FROM MAYBE ───────────────────────
        const returnBtn = $('returnBtn');
        if (returnBtn) {
            returnBtn.addEventListener('click', function() {
                showSceneByIndex(7);
                if (yesBtn) yesBtn.textContent = 'Yes';
                if (maybeBtn) maybeBtn.style.opacity = '1';
            });
        }

        // ─── KEYBOARD NAVIGATION ─────────────────────
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                goNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                goBack();
            }
        });

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
        }

        // ─── SECRET ──────────────────────────────────
        const secretTrigger = $('secretTrigger');
        if (secretTrigger && s.secret) {
            secretTrigger.addEventListener('click', function() {
                const toast = document.createElement('div');
                toast.className = 'secret-toast';
                toast.innerHTML = '<p style="margin-bottom:0.4rem;">You found it.</p><p>' + s.secret + '</p>';
                document.body.appendChild(toast);
                setTimeout(function() { toast.remove(); }, 4000);
            });
        }

        // ─── REDUCED MOTION ──────────────────────────
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }

        // ─── START ───────────────────────────────────
        showSceneByIndex(0);
        console.log('Ready. Notifications: ' + (s.notifications?.enabled ? 'enabled' : 'disabled'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();