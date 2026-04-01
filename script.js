/* =============================================
   WEDDING — GSAP + ScrollTrigger Cinematic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    const main = document.getElementById('main');
    const opening = document.getElementById('opening');

    // ─── OPENING ENTRANCE ───
    const oTL = gsap.timeline({ delay: 0.5 });
    oTL.to('#openLineL', { width: 60, duration: 1, ease: 'power3.out' })
       .to('#openLineR', { width: 60, duration: 1, ease: 'power3.out' }, '<')
       .fromTo('#openStar', { scale: 0, opacity: 0, rotation: 180 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.5')
       .fromTo('#openSub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.3')
       .fromTo('#openGroom', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
       .fromTo('#openAmpWrap', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.5')
       .fromTo('#openBride', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
       .fromTo('#openDate', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
       .fromTo('#openBtn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4');

    // ─── OPEN BUTTON ───
    document.getElementById('openBtn').addEventListener('click', () => {
        gsap.to(opening, {
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            duration: 1.2,
            ease: 'power3.inOut',
            onComplete: () => { opening.style.display = 'none'; }
        });
        gsap.to(main, { opacity: 1, duration: 1.2, delay: 0.4, ease: 'power2.out' });
        setTimeout(() => {
            initAnimations();
            startPetals();
            startCelebrations();
        }, 600);
    });

    // ─── COUNTDOWN ───
    const wedding = new Date('2026-05-04T09:30:00+05:30').getTime();
    function tick() {
        const d = wedding - Date.now();
        if (d < 0) return;
        set('days',    Math.floor(d / 86400000));
        set('hours',   Math.floor((d % 86400000) / 3600000));
        set('minutes', Math.floor((d % 3600000) / 60000));
        set('seconds', Math.floor((d % 60000) / 1000));
    }
    function set(id, v) {
        const el = document.getElementById(id);
        const s = String(v).padStart(2, '0');
        if (el.textContent !== s) {
            gsap.to(el, { y: -6, opacity: 0, duration: 0.12, ease: 'power2.in', onComplete() {
                el.textContent = s;
                gsap.fromTo(el, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' });
            }});
        }
    }
    tick();
    setInterval(tick, 1000);

    // ─── SCROLL-TRIGGERED ANIMATIONS ───
    function initAnimations() {

        // Helper: animate elements when they scroll into view
        // Uses gsap.set + ScrollTrigger callback to avoid "stuck invisible" bugs
        function reveal(selector, triggerEl, opts = {}) {
            const els = gsap.utils.toArray(selector);
            if (!els.length) return;

            // Immediately set starting state
            gsap.set(els, {
                y: opts.y || 40,
                x: opts.x || 0,
                opacity: 0,
                scale: opts.scale || 1
            });

            ScrollTrigger.create({
                trigger: triggerEl,
                start: opts.start || 'top 90%',
                once: true,
                onEnter: () => {
                    gsap.to(els, {
                        y: 0,
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        duration: opts.duration || 0.9,
                        stagger: opts.stagger || 0.15,
                        ease: opts.ease || 'power3.out',
                        delay: opts.delay || 0
                    });
                }
            });
        }

        // Hero entrance (plays immediately, no scroll trigger)
        const hTL = gsap.timeline({ delay: 0.2 });
        hTL.from('#heroTag', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
           .from('#heroGroom', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=0.4')
           .from('#hAmp', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.6')
           .to('#hLineL', { width: 60, duration: 0.8, ease: 'power3.out' }, '<')
           .to('#hLineR', { width: 60, duration: 0.8, ease: 'power3.out' }, '<')
           .from('#heroBride', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=0.6')
           .from('#heroDate', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
           .from('#heroVenue', { y: 15, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
           .from('#scrollCue', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.2');

        // Hero parallax
        const heroBg = document.getElementById('heroBgImg');
        if (heroBg && heroBg.style.display !== 'none') {
            gsap.to('#heroBgImg', {
                scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
                y: 120, scale: 1.2, ease: 'none'
            });
        }

        // Gallery
        reveal('.gallery-reveal', '#gallery');
        reveal('.gallery-img', '#gallery', { y: 60, stagger: 0.2, duration: 1 });

        // Gallery swipe dots (mobile)
        const galleryScroll = document.querySelector('.gallery-scroll');
        const galleryDots = document.querySelectorAll('.gallery-dot');
        if (galleryScroll && galleryDots.length) {
            galleryScroll.addEventListener('scroll', () => {
                const scrollLeft = galleryScroll.scrollLeft;
                const cardWidth = galleryScroll.firstElementChild.offsetWidth;
                const gap = 16;
                const idx = Math.round(scrollLeft / (cardWidth + gap));
                galleryDots.forEach((dot, i) => {
                    dot.classList.toggle('bg-gold-500/60', i === idx);
                    dot.classList.toggle('bg-gold-500/20', i !== idx);
                });
            });
        }

        // Countdown
        reveal('.cd-reveal', '#countdown');
        reveal('.cd-box', '#countdown', { y: 50, scale: 0.85, stagger: 0.12, ease: 'back.out(1.2)' });

        // Families
        reveal('.fam-reveal', '#families');
        reveal('.fam-card', '#families', { y: 50, stagger: 0.25, duration: 1 });

        // Events
        reveal('.ev-reveal', '#events');
        reveal('.ev-card', '#events', { x: -50, y: 0, stagger: 0.1, duration: 0.8 });

        // Venue
        reveal('.venue-reveal', '#venue', { y: 50 });

        // Quote
        reveal('.quote-reveal', '.quote-reveal', { y: 30 });

        // Footer
        reveal('footer > div > *', 'footer', { y: 25 });

        // BG image parallax
        document.querySelectorAll('#countdown img, #venue img').forEach(img => {
            if (img.style.display !== 'none') {
                gsap.to(img, {
                    scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 2 },
                    y: 80, ease: 'none'
                });
            }
        });

        // Safety: after 3 seconds, force everything visible in case any trigger didn't fire
        setTimeout(() => {
            document.querySelectorAll('.fam-card, .ev-card, .cd-box, .gallery-img, .gallery-reveal, .fam-reveal, .ev-reveal, .cd-reveal, .venue-reveal, .quote-reveal').forEach(el => {
                if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
                    gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.5 });
                }
            });
        }, 3000);
    }

    // ─── CELEBRATIONS (Confetti + Fireworks) ───
    function startCelebrations() {
        const container = document.getElementById('celebrations');
        if (!container) return;

        const colors = ['#c9a84c', '#e8d48b', '#d4a853', '#f2dc9e', '#b03a55', '#d66580', '#fdf8f0', '#e8c56a'];
        const shapes = ['circle', 'square', 'strip'];

        // Confetti
        function spawnConfetti() {
            const el = document.createElement('div');
            el.className = 'confetti';
            const color = colors[Math.random() * colors.length | 0];
            const shape = shapes[Math.random() * shapes.length | 0];
            const size = Math.random() * 8 + 4;

            el.style.left = Math.random() * 100 + '%';
            el.style.top = Math.random() * 30 + '%';
            el.style.backgroundColor = color;
            el.style.animationDuration = (Math.random() * 4 + 3) + 's';
            el.style.animationDelay = Math.random() * 2 + 's';

            if (shape === 'strip') {
                el.style.width = size * 0.4 + 'px';
                el.style.height = size * 1.5 + 'px';
                el.style.borderRadius = '2px';
            } else if (shape === 'circle') {
                el.style.width = size + 'px';
                el.style.height = size + 'px';
                el.style.borderRadius = '50%';
            } else {
                el.style.width = size + 'px';
                el.style.height = size + 'px';
            }

            container.appendChild(el);
            setTimeout(() => el.remove(), 8000);
        }

        // Firework bursts
        function spawnFirework() {
            const rect = container.getBoundingClientRect();
            const cx = Math.random() * rect.width;
            const cy = Math.random() * rect.height * 0.5;
            const particleCount = Math.random() * 10 + 10 | 0;
            const color = colors[Math.random() * colors.length | 0];

            for (let i = 0; i < particleCount; i++) {
                const p = document.createElement('div');
                p.className = 'firework-particle';
                const size = Math.random() * 4 + 3;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.backgroundColor = color;
                p.style.boxShadow = `0 0 ${size + 4}px ${color}, 0 0 ${size + 8}px ${color}`;
                p.style.left = cx + 'px';
                p.style.top = cy + 'px';
                p.style.opacity = '1';
                const angle = (360 / particleCount) * i;
                const dist = Math.random() * 80 + 40;
                const dx = Math.cos(angle * Math.PI / 180) * dist;
                const dy = Math.sin(angle * Math.PI / 180) * dist;
                const dur = 1200 + Math.random() * 600;
                p.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 }
                ], { duration: dur, easing: 'ease-out', fill: 'forwards' });
                container.appendChild(p);
                setTimeout(() => p.remove(), dur + 100);
            }
        }

        // Ambient sparkles
        function spawnSparkle() {
            const s = document.createElement('div');
            s.className = 'sparkle';
            const size = Math.random() * 5 + 3;
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            s.style.left = Math.random() * 100 + '%';
            s.style.top = Math.random() * 100 + '%';
            const color = colors[Math.random() * colors.length | 0];
            s.style.backgroundColor = color;
            s.style.boxShadow = `0 0 ${size + 2}px ${color}`;
            s.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(s);
            setTimeout(() => s.remove(), 8000);
        }

        // Start with ScrollTrigger
        ScrollTrigger.create({
            trigger: '#events',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                // Initial burst
                for (let i = 0; i < 20; i++) setTimeout(spawnConfetti, i * 100);
                for (let i = 0; i < 15; i++) setTimeout(spawnSparkle, i * 150);
                setTimeout(spawnFirework, 500);
                setTimeout(spawnFirework, 1200);
                setTimeout(spawnFirework, 2000);

                // Continuous ambient
                setInterval(spawnConfetti, 800);
                setInterval(spawnSparkle, 1000);
                setInterval(spawnFirework, 3500);
            }
        });
    }

    // ─── PETALS ───
    function startPetals() {
        const c = document.getElementById('petals');
        const colors = ['#c9a84c','#e8d48b','#d4a853','#a68a3e','#7d6630'];
        function spawn() {
            const p = document.createElement('div');
            p.className = 'petal';
            const col = colors[Math.random() * colors.length | 0];
            const sz = Math.random() * 10 + 5;
            p.innerHTML = `<svg viewBox="0 0 20 20" width="${sz}" height="${sz}"><ellipse cx="10" cy="10" rx="5" ry="9" fill="${col}" opacity="0.4" transform="rotate(${Math.random()*360} 10 10)"/></svg>`;
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 8 + 10) + 's';
            p.style.animationDelay = Math.random() * 3 + 's';
            c.appendChild(p);
            setTimeout(() => p.remove(), 20000);
        }
        for (let i = 0; i < 5; i++) setTimeout(spawn, i * 500);
        setInterval(spawn, 1200);
    }

    // ─── MUSIC TOGGLE ───
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');

    if (musicBtn && bgMusic) {
        let musicPlaying = false;
        bgMusic.volume = 0.5;

        // Auto-play on "Open Invitation" click (user gesture satisfies autoplay policy)
        document.getElementById('openBtn').addEventListener('click', () => {
            setTimeout(() => {
                gsap.to(musicBtn, { opacity: 1, duration: 0.5 });
            }, 2000);

            bgMusic.play().then(() => {
                musicPlaying = true;
                musicBtn.classList.add('bg-gold-500/20', 'border-gold-500/50');
            }).catch(() => {});
        });

        musicBtn.addEventListener('click', () => {
            musicPlaying = !musicPlaying;
            if (musicPlaying) {
                bgMusic.play();
            } else {
                bgMusic.pause();
            }
            musicBtn.classList.toggle('bg-gold-500/20', musicPlaying);
            musicBtn.classList.toggle('border-gold-500/50', musicPlaying);
            gsap.fromTo(musicBtn, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
        });
    }
});
