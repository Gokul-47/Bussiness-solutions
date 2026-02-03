// Respect reduced motion preferences
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Mobile Navigation Toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        const navLinks = document.getElementById('nav-links');
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        });

        // Animation preset definitions (Web Animations API frames + default options)
        const presets = {
            proFadeUp: { frames: [{opacity:0, transform:'translateY(18px) scale(.995)', filter:'blur(2px)'}, {opacity:1, transform:'translateY(0) scale(1)', filter:'blur(0)'}], opts: { duration: 820, easing: 'cubic-bezier(.16,.84,.44,1)', fill: 'forwards' } },
            proZoom: { frames: [{opacity:0, transform:'translateY(8px) scale(.94)'}, {opacity:1, transform:'translateY(0) scale(1)'}], opts: { duration: 520, easing: 'cubic-bezier(.16,.84,.44,1)', fill: 'forwards' } },
            proRotate: { frames: [{opacity:0, transform:'rotate(-8deg) translateY(18px) scale(.98)'}, {opacity:1, transform:'rotate(0) translateY(0) scale(1)'}], opts: { duration: 820, easing: 'cubic-bezier(.16,.84,.44,1)', fill: 'forwards' } },
            proFlip: { frames: [{transform:'perspective(800px) rotateX(90deg) translateY(14px)', opacity:0}, {transform:'perspective(800px) rotateX(-10deg) translateY(6px)', opacity:1}, {transform:'perspective(800px) rotateX(0deg) translateY(0)', opacity:1}], opts: { duration: 880, easing: 'cubic-bezier(.16,.84,.44,1)', fill: 'forwards' } },
            subtlePulse: { frames: [{transform:'scale(1)'},{transform:'scale(1.02)'},{transform:'scale(1)'}], opts: { duration:1600, easing:'ease-in-out', iterations: Infinity } }
        };

        // Play a preset on an element (supports per-element delay & staggering via attributes)
        function playPreset(el, presetName, delay = 0) {
            if (prefersReduced) {
                // If reduced motion is requested, simply reveal without animation
                el.style.opacity = 1; el.style.transform = 'none'; return Promise.resolve();
            }
            const preset = presets[presetName] || presets.proFadeUp;
            const opts = Object.assign({}, preset.opts);
            if (delay) opts.delay = delay;

            // Web Animations API returns an Animation object
            const anim = el.animate(preset.frames, opts);
            return anim.finished || new Promise(resolve => anim.addEventListener('finish', resolve));
        }

        // Observe & animate with stagger support
        const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -80px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const delay = parseFloat(el.getAttribute('data-delay')) || 0;
                const anim = (el.getAttribute('data-anim') || 'proFadeUp');

                // Stagger children if requested via data-stagger attribute (css selector of children or "auto")
                const stagger = el.getAttribute('data-stagger');
                if (stagger) {
                    const children = stagger === 'auto' ? Array.from(el.children) : Array.from(el.querySelectorAll(stagger));
                    children.forEach((child, i) => {
                        playPreset(child, anim, delay + (i * 90));
                    });
                } else {
                    playPreset(el, anim, delay);
                }

                // If it's a stat item, animate counter
                if (el.classList.contains('stat-item')) {
                    const numberElement = el.querySelector('.stat-number');
                    const target = parseInt(numberElement.getAttribute('data-count')) || 0;
                    animateCounter(numberElement, target, 1400);
                }

                observer.unobserve(el);
            });
        }, observerOptions);

        // Attach reveal + observe
        document.querySelectorAll('.service-card, .stat-item, .cta-content, .section-title, .team-card').forEach(el => { el.classList.add('reveal'); observer.observe(el); });

        // Hero entrance timeline on load (logo -> nav -> hero text -> hero visual)
        function heroEntrance() {
            if (prefersReduced) return;
            const timeline = [];
            const logo = document.querySelector('.logo');
            const nav = document.querySelectorAll('.nav-links li');
            const heroText = document.querySelector('.hero-text');
            const heroVisual = document.querySelector('.hero-visual');

            if (logo) timeline.push(playPreset(logo, 'proZoom', 80));
            nav.forEach((li, i) => timeline.push(playPreset(li, 'proFadeUp', 160 + i*50)));
            if (heroText) timeline.push(playPreset(heroText, 'proFadeUp', 360));
            if (heroVisual) timeline.push(playPreset(heroVisual, 'proRotate', 540));

            return Promise.all(timeline);
        }
        document.addEventListener('DOMContentLoaded', heroEntrance);

        // Smooth counter with easing (requestAnimationFrame)
        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
        function animateCounter(el, target, duration = 1400) {
            if (!el) return;
            const start = performance.now();
            const from = 0;
            const to = target;
            function step(ts) {
                const progress = Math.min(1, (ts - start) / duration);
                const eased = easeOutCubic(progress);
                const val = Math.floor(from + (to - from) * eased);
                el.textContent = (to === 98 ? val + '%' : to === 24 ? val + '/7' : val + '+');
                if (progress < 1) requestAnimationFrame(step); else {
                    // final precise format
                    el.textContent = (to === 98 ? to + '%' : to === 24 ? to + '/7' : to + '+');
                }
            }
            requestAnimationFrame(step);
        }

        // Parallax on hero (throttled and small offsets)
        const floating = document.querySelectorAll('.floating-element, .shape');
        function throttle(fn, wait=16){ let last=0; return (...args)=>{ const now=Date.now(); if(now-last>wait){ last=now; fn(...args);} }; }
        const heroEl = document.querySelector('.hero');
        if (heroEl && !prefersReduced) {
            heroEl.addEventListener('mousemove', throttle((e)=>{
                const rect = heroEl.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                floating.forEach((el, i) => {
                    const depth = (i % 4) + 1;
                    el.style.transform = `translate(${x * 10 / depth}px, ${y * 10 / depth}px)`;
                });
            }, 16));
        }

        // Buttons micro interaction: small press animation
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('pointerdown', () => btn.animate([{ transform: 'scale(.98) translateY(2px)'}, { transform: 'scale(1) translateY(0)'}], { duration: 180, easing: 'ease-out' }));
        });

        // Redirect all clicks on links/buttons/forms to 404.html (preserve safe-link)
        function redirectTo404(e) { if (e.currentTarget && e.currentTarget.classList && e.currentTarget.classList.contains('safe-link')) return; e.preventDefault(); window.location.href = '404.html'; }
        if (!window.location.pathname.endsWith('404.html')) {
            document.querySelectorAll('a').forEach(a => a.addEventListener('click', redirectTo404));
            document.querySelectorAll('button, input[type="button"], .btn, [role="button"]').forEach(b => b.addEventListener('click', redirectTo404));
            document.querySelectorAll('form').forEach(f => f.addEventListener('submit', redirectTo404));
        }