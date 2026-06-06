(function(){
    // Try to play music on page load
    const bgMusic = document.getElementById('bgMusic');
    if(bgMusic) {
        // Attempt autoplay
        bgMusic.play().catch(() => {
            // If autoplay fails, play on first user interaction
            document.body.addEventListener('click', function playOnce() {
                bgMusic.play();
                document.body.removeEventListener('click', playOnce);
            }, { once: true });
        });
    }
    
    // Canvas particles
    const canvas = document.getElementById('introCanvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight;
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function Point(x,y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    
    function Particle() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
    }
    
    Particle.prototype.initialize = function(x,y,dx,dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * 0.96;
        this.acceleration.y = dy * 0.96;
        this.age = 0;
    };
    
    const particles = [];
    const particleCount = 180;
    
    for(let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function resetParticles() {
        for(let p of particles) {
            p.initialize(
                Math.random() * width,
                Math.random() * height,
                (Math.random() - 0.5) * 1.6,
                (Math.random() - 0.5) * 1.6
            );
        }
    }
    
    resetParticles();
    
    const pastelColors = ['#ff1a3a','#cc0020','#ff4466','#8b0000','#ff6680'];
    
    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        
        for(let p of particles) {
            p.velocity.x += p.acceleration.x;
            p.velocity.y += p.acceleration.y;
            p.position.x += p.velocity.x;
            p.position.y += p.velocity.y;
            p.age += 0.015;
            
            if(p.position.x < -50) p.position.x = width + 50;
            if(p.position.x > width + 50) p.position.x = -50;
            if(p.position.y < -50) p.position.y = height + 50;
            if(p.position.y > height + 50) p.position.y = -50;
            
            ctx.font = `${24 + Math.sin(p.age * 3) * 6}px "Segoe UI Emoji", "Apple Color Emoji"`;
            ctx.fillStyle = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            ctx.shadowColor = '#ff99aa';
            ctx.shadowBlur = 15;
            ctx.fillText('💕', p.position.x, p.position.y);
        }
        
        requestAnimationFrame(drawParticles);
    }
    
    drawParticles();
    
    setTimeout(() => {
        canvas.style.opacity = '0';
        setTimeout(() => {
            document.getElementById('appContainer').style.opacity = '1';
            canvas.style.pointerEvents = 'none';
            // Start music on load
            const music = document.getElementById('bgMusic');
            if(music) music.play().catch(() => {});
        }, 2200);
    }, 3000);
    
    // Floating hearts
    function createFloatingHearts() {
        const c = document.getElementById('floatingHearts');
        if(!c) return;
        
        for(let i = 0; i < 72; i++) {
            let h = document.createElement('div');
            h.className = 'heart';
            h.innerHTML = '💕';
            h.style.left = Math.random() * 100 + '%';
            h.style.top = Math.random() * 100 + '%';
            h.style.fontSize = (Math.random() * 24 + 24) + 'px';
            h.style.animationDelay = Math.random() * 18 + 's';
            c.appendChild(h);
        }
    }
    
    createFloatingHearts();
    
    // Firework
    function triggerFirework() {
        const con = document.getElementById('fireworkContainer');
        if(!con) return;
        
        con.innerHTML = '';
        let f = document.createElement('div');
        f.className = 'firework-crackers';
        
        for(let i = 0; i < 70; i++) {
            let p = document.createElement('div');
            p.className = 'cracker-particle';
            p.innerHTML = '💕';
            let a = Math.random() * Math.PI * 2;
            let d = Math.random() * 400 + 180;
            p.style.setProperty('--x', Math.cos(a) * d + 'px');
            p.style.setProperty('--y', Math.sin(a) * d + 'px');
            p.style.left = '50%';
            p.style.top = '50%';
            p.style.animationDelay = Math.random() * 0.2 + 's';
            f.appendChild(p);
        }
        
        con.appendChild(f);
        
        setTimeout(() => {
            con.innerHTML = '';
        }, 3600);
    }
    
    // Pages array
    const pages = [
        'bestfriendPage',
        'giftPage',
        'birthdayPage',
        'journeyPage',
        'firstDatePage',
        'letterPage',
        'friendshipGamePage',
        'polaroidPage',
        'thankyouPage'
    ];
    
    let currentPageIndex = 0;
    
    window.showPage = function(index) {
        if(index < 0 || index >= pages.length) return;
        
        pages.forEach(p => document.getElementById(p)?.classList.remove('active-page'));
        document.getElementById(pages[index])?.classList.add('active-page');
        currentPageIndex = index;
        
        if(pages[index] === 'friendshipGamePage') initFriendshipGame();
        if(pages[index] === 'journeyPage') attachJourneyListeners();
        if(pages[index] === 'firstDatePage') resetFirstDatePage();
        if(pages[index] === 'bestfriendPage') {
            if(typeof initBestfriend === 'function') initBestfriend();
        }
        if(pages[index] === 'polaroidPage') dropPolaroidsIn();
    };
    
    // Gift box click
    document.getElementById('giftBox')?.addEventListener('click', function() {
        document.getElementById('cube3d').style.transform = 'rotateX(15deg) rotateY(200deg) scale(0.9)';
        
        let pop = document.getElementById('teddyGiftPop');
        if(pop) {
            pop.style.display = 'block';
            setTimeout(() => pop.style.display = 'none', 2500);
        }
        
        triggerFirework();
        setTimeout(() => showPage(2), 2000);
    });
    
    // Navigation
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        if(currentPageIndex < pages.length - 1) showPage(currentPageIndex + 1);
    });
    
    document.getElementById('prevBtn')?.addEventListener('click', () => {
        if(currentPageIndex > 0) showPage(currentPageIndex - 1);
    });
    
    // Envelope (poetry page)
    const envelope = document.getElementById('envelopeClick');
    const flap = document.getElementById('envelopeFlap');
    const scrollDiv = document.getElementById('scrollLetter');
    
    if(envelope) {
        envelope.addEventListener('click', function() {
            if(!scrollDiv.classList.contains('visible')) {
                flap.classList.add('open');
                scrollDiv.classList.add('visible');
            } else {
                flap.classList.remove('open');
                scrollDiv.classList.remove('visible');
            }
        });
    }
    
    // ── Friendship Game ──────────────────────────────────
    function initFriendshipGame() {
        const fgQuestions = [
            {
                question: "Who laughs at serious situations and makes everything worse? 😂",
                options: ["You 😭", "You Both 😂"],
                correct: 1,
                answer: "✅ You Both 😂"
            },
            {
                question: '"Na 5 mins la varen da" — Who said this? ⏰',
                options: ["You 😭", "Your Friend 😂"],
                correct: 1,
                answer: "✅ Your Friend 😂"
            },
            {
                question: "Who starts the fight first? 😤",
                options: ["You 😭", "Your Friend 😂"],
                correct: 0,
                answer: "✅ You 😭"
            },
            {
                question: "Who is more dramatic? 🎭",
                options: ["You 🎭", "Your Friend 😂"],
                correct: 0,
                answer: "✅ You 🎭"
            },
            {
                question: "Who spends more money on food? 🍕",
                options: ["You 😂", "Both 🍕😂"],
                correct: 1,
                answer: "✅ Both 🍕😂"
            }
        ];

        let fgCurrent = 0;
        let fgScore   = 0;

        const qEl   = document.getElementById('fg-question');
        const o1    = document.getElementById('fg-opt1');
        const o2    = document.getElementById('fg-opt2');
        const resEl = document.getElementById('fg-result');
        const pgBar = document.getElementById('fg-progress');

        if (!qEl) return;

        // Reset UI
        o1.style.display = 'block';
        o2.style.display = 'block';
        fgCurrent = 0;
        fgScore   = 0;
        resEl.innerHTML  = '';
        pgBar.style.width = '0%';

        function showFinal() {
            qEl.innerHTML  = '🏆 Friendship Level Completed!';
            o1.style.display = 'none';
            o2.style.display = 'none';
            if (fgScore >= 4) {
                resEl.innerHTML = `❤️ CHAOS DUO 😂<br><br>${fgScore}/5 Correct<br><br>100% Loyalty · Infinite Memories ✨`;
            } else {
                resEl.innerHTML = `😂 Best Friends Forever<br><br>${fgScore}/5 Correct<br><br>Drama Level: MAX 🎭`;
            }
        }

        // Rebind buttons (remove old listeners by replacing)
        const newO1 = o1.cloneNode(true);
        const newO2 = o2.cloneNode(true);
        o1.parentNode.replaceChild(newO1, o1);
        o2.parentNode.replaceChild(newO2, o2);
        newO1.style.display = 'block';
        newO2.style.display = 'block';

        newO1.addEventListener('click', () => answer(0));
        newO2.addEventListener('click', () => answer(1));

        // Load first question — use newO1/newO2 since old refs are detached
        function loadQ() {
            const q = fgQuestions[fgCurrent];
            qEl.innerHTML      = q.question;
            newO1.textContent  = q.options[0];
            newO2.textContent  = q.options[1];
        }

        // Override answer to use new refs
        function answer(selected) {
            const q = fgQuestions[fgCurrent];
            newO1.disabled = true;
            newO2.disabled = true;

            if (selected === q.correct) {
                resEl.innerHTML = q.answer + ' 🎉';
                fgScore++;
            } else {
                resEl.innerHTML = '❌ Wrong 😂 — ' + q.answer;
            }

            pgBar.style.width = (((fgCurrent + 1) / fgQuestions.length) * 100) + '%';
            fgCurrent++;

            setTimeout(() => {
                resEl.innerHTML = '';
                newO1.disabled = false;
                newO2.disabled = false;
                if (fgCurrent < fgQuestions.length) {
                    loadQ();
                } else {
                    showFinal();
                }
            }, 2000);
        }

        loadQ();
    }

    // Journey listeners & music control
    const music = document.getElementById('bgMusic');
    
    function attachJourneyListeners() {
        document.querySelectorAll('.memory-frame').forEach(frame => {
            frame.removeEventListener('click', frame.clickHandler);
            
            frame.clickHandler = function() {
                let type = this.dataset.mediaType;
                let src = this.dataset.mediaSrc;
                let caption = this.dataset.caption;
                let container = document.getElementById('expandedMediaContainer');
                
                container.innerHTML = '';
                container.style.pointerEvents = 'auto';
                
                let exp = document.createElement('div');
                exp.className = 'expanded-media-tab';
                
                let mediaHtml = (type === 'image') 
                    ? `<img src="${src}" class="expanded-media">`
                    : `<video src="${src}" class="expanded-media" controls preload="metadata" playsinline webkit-playsinline muted></video>`;
                
                exp.innerHTML = `
                    ${mediaHtml}
                    <div class="expanded-caption">💗 ${caption}</div>
                    <button class="close-expand-btn">close</button>
                `;
                
                container.appendChild(exp);
                
                // Pause music while video plays
                if(type === 'video' && music) music.pause();
                
                // Request fullscreen for video with delay to prevent hanging
                if(type === 'video') {
                    const videoEl = exp.querySelector('video');
                    if(videoEl) {
                        setTimeout(() => {
                            videoEl.play().then(() => {
                                setTimeout(() => {
                                    if (videoEl.requestFullscreen) {
                                        videoEl.requestFullscreen().catch(e => console.log("Fullscreen prevented:", e));
                                    } else if (videoEl.webkitRequestFullscreen) {
                                        videoEl.webkitRequestFullscreen();
                                    } else if (videoEl.webkitEnterFullscreen) {
                                        videoEl.webkitEnterFullscreen();
                                    }
                                }, 500);
                            }).catch(e => console.log("Play prevented:", e));
                        }, 100);
                    }
                }
                
                exp.querySelector('.close-expand-btn').addEventListener('click', () => {
                    container.innerHTML = '';
                    container.style.pointerEvents = 'none';
                    if(music) music.play();
                });
                
                // If image, resume music if paused
                if(type === 'image' && music && music.paused) music.play();
            };
            
            frame.addEventListener('click', frame.clickHandler);
        });
    }
    
    // ── Bestfriend Question Page ───────────────────────
    let bfNoCount = 0;
    let bfInitDone = false;

    function initBestfriend() {
        const yesBtn  = document.getElementById('bfYesBtn');
        const noBtn   = document.getElementById('bfNoBtn');
        const burst   = document.getElementById('bfHeartBurst');
        const yesMsg  = document.getElementById('bfYesMessage');
        const buttons = document.getElementById('bfButtons');
        const page    = document.getElementById('bestfriendPage');

        if(!yesBtn || !noBtn) return;

        // Reset visual state each time page is shown
        bfNoCount = 0;
        noBtn.style.cssText    = '';
        yesBtn.style.fontSize  = '1.2rem';
        burst.innerHTML        = '';
        yesMsg.style.display   = 'none';
        buttons.style.display  = 'flex';

        // Attach listeners only once
        if(bfInitDone) return;
        bfInitDone = true;

        // YES
        yesBtn.addEventListener('click', function(e) {
            burst.innerHTML = '';
            for(let i = 0; i < 50; i++) {
                let h = document.createElement('div');
                h.className = 'burst-heart';
                h.innerHTML = '💕';
                let angle = Math.random() * Math.PI * 2;
                let dist  = Math.random() * 260 + 100;
                h.style.setProperty('--burst-x', Math.cos(angle) * dist + 'px');
                h.style.setProperty('--burst-y', Math.sin(angle) * dist + 'px');
                h.style.left = '50%';
                h.style.top  = '50%';
                h.style.animationDelay = Math.random() * 0.3 + 's';
                burst.appendChild(h);
            }
            setTimeout(() => {
                buttons.style.display = 'none';
                yesMsg.style.display  = 'block';
                setTimeout(() => showPage(1), 1800);
            }, 1200);
        });

        // NO — fly away
        noBtn.addEventListener('click', function(e) {
            e.preventDefault();
            bfNoCount++;

            const pageRect = page.getBoundingClientRect();
            const randX = pageRect.left + 20 + Math.random() * (pageRect.width  - 120);
            const randY = pageRect.top  + 60 + Math.random() * (pageRect.height - 180);

            this.style.position   = 'fixed';
            this.style.left       = randX + 'px';
            this.style.top        = randY + 'px';
            this.style.transition = 'all 0.25s ease';
            this.style.zIndex     = '9999';
            this.style.margin     = '0';

            const cur = parseFloat(yesBtn.style.fontSize) || 1.2;
            yesBtn.style.fontSize  = Math.min(cur + 0.3, 2.8) + 'rem';
            yesBtn.style.transition = 'all 0.25s ease';

            if(bfNoCount >= 5) {
                this.style.opacity       = '0';
                this.style.pointerEvents = 'none';
            }
        });
    }

    // init immediately (page 0 = bestfriendPage)
    initBestfriend();
    showPage(0);

    // ── Polaroid drop-in ─────────────────────────────────
    function dropPolaroidsIn() {
        const items = document.querySelectorAll('#polaroidPage .pol-item');
        // reset all to hidden first (so re-visiting re-animates)
        items.forEach(el => el.classList.remove('pol-visible'));

        items.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('pol-visible');
            }, i * 300); // 300ms gap between each polaroid
        });
    }

})();

    
// First Date Video Functions
window.playFirstDateVideo = function playFirstDateVideo() {
    document.getElementById('videoConfirmDialog').style.display = 'none';
    document.getElementById('firstDateVideoContainer').style.display = 'block';
    document.getElementById('noVideoMessage').style.display = 'none';
    
    // Auto-play the video with delay to prevent hanging
    const video = document.getElementById('firstDateVideo');
    setTimeout(() => {
        video.play().then(() => {
            // Request fullscreen after a short delay
            setTimeout(() => {
                if (video.requestFullscreen) {
                    video.requestFullscreen().catch(e => console.log("Fullscreen prevented:", e));
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.webkitEnterFullscreen) {
                    video.webkitEnterFullscreen();
                }
            }, 500);
        }).catch(e => console.log("Auto-play prevented:", e));
    }, 100);
}

window.hideVideoConfirm = function hideVideoConfirm() {
    document.getElementById('videoConfirmDialog').style.display = 'none';
    document.getElementById('firstDateVideoContainer').style.display = 'none';
    document.getElementById('noVideoMessage').style.display = 'block';
}

// Reset the first date page when navigating to it
window.resetFirstDatePage = function resetFirstDatePage() {
    document.getElementById('videoConfirmDialog').style.display = 'block';
    document.getElementById('firstDateVideoContainer').style.display = 'none';
    document.getElementById('noVideoMessage').style.display = 'none';
    
    // Pause video if it was playing
    const video = document.getElementById('firstDateVideo');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}
