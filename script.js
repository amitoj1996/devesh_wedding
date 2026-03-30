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

        // Wishes
        reveal('.wish-reveal', '#wishes', { y: 40 });

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
            document.querySelectorAll('.fam-card, .ev-card, .cd-box, .gallery-img, .gallery-reveal, .fam-reveal, .ev-reveal, .cd-reveal, .venue-reveal, .quote-reveal, .wish-reveal').forEach(el => {
                if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
                    gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.5 });
                }
            });
        }, 3000);
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

    // ─── WISHES (stored in localStorage) ───
    const wishBtn = document.getElementById('wishBtn');
    const wishesList = document.getElementById('wishesList');

    function loadWishes() {
        const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        if (!wishesList) return;
        wishesList.innerHTML = '';
        wishes.slice(-10).reverse().forEach(w => {
            const div = document.createElement('div');
            div.className = 'border border-gold-500/10 rounded-xl p-5 text-left bg-white/[0.02] transition-all duration-300';
            div.innerHTML = `<p class="font-sans text-gold-500/60 text-xs tracking-wider mb-2 font-medium">${escapeHtml(w.name)}</p><p class="font-serif text-cream-200/60 text-base italic leading-relaxed">"${escapeHtml(w.msg)}"</p>`;
            wishesList.appendChild(div);
        });
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    if (wishBtn) {
        wishBtn.addEventListener('click', () => {
            const name = document.getElementById('wishName').value.trim();
            const msg = document.getElementById('wishMsg').value.trim();
            if (!name || !msg) return;

            const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
            wishes.push({ name, msg, date: new Date().toISOString() });
            localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

            document.getElementById('wishName').value = '';
            document.getElementById('wishMsg').value = '';

            // Animate button
            wishBtn.textContent = 'Blessings Sent! ✦';
            setTimeout(() => { wishBtn.innerHTML = '<span class="relative z-10">Send Blessings ✦</span>'; }, 2000);

            loadWishes();
        });
        loadWishes();
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
