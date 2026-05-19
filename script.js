/* ── CURSOR (desktop only) ── */
(function () {
    // Only init cursor on non-touch devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const ring = document.getElementById("cursor-ring");
    const dot = document.getElementById("cursor-dot");
    if (!ring || !dot) return;

    let cx = 0, cy = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
        cx = e.clientX;
        cy = e.clientY;
    });

    (function animCursor() {
        rx += (cx - rx) * 0.12;
        ry += (cy - ry) * 0.12;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        dot.style.left = cx + "px";
        dot.style.top = cy + "px";
        requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll("a, button, .card").forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
    });
})();

/* ── CARD SPOTLIGHT ── */
(function () {
    // Only on hover-capable devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const mx = (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%";
            const my = (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%";
            card.style.setProperty("--mx", mx);
            card.style.setProperty("--my", my);
        });
    });
})();

/* ── PARTICLES ── */
(function () {
    const c = document.getElementById("particles");
    if (!c) return;

    // Fewer particles on mobile for performance
    const count = window.innerWidth < 768 ? 10 : 20;

    for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "dot";
        const size = Math.random() * 2.2 + 0.5;
        const bright = Math.random() > 0.45;
        el.style.cssText =
            `width:${size}px;height:${size}px;` +
            `left:${Math.random() * 100}%;` +
            `bottom:${Math.random() * -15}%;` +
            `background:${bright ? "rgba(0,160,255,0.5)" : "rgba(180,220,255,0.08)"};` +
            `box-shadow:${bright ? "0 0 10px rgba(0,160,255,0.4)" : "none"};` +
            `animation-duration:${Math.random() * 22 + 14}s;` +
            `animation-delay:${Math.random() * 22}s;`;
        c.appendChild(el);
    }
})();

/* ── TYPEWRITER ── */
(function () {
    const el = document.getElementById("typewriter");
    if (!el) return;

    const text =
        "Every fathom takes you further from the light. Every current carries a whisper. Every silence hides a presence. You are not alone down here \u2014 you were never alone.";
    let i = 0;

    function tick() {
        if (i < text.length) {
            el.innerHTML = text.substring(0, i + 1) + '<span class="caret" aria-hidden="true"></span>';
            i++;
            const ch = text[i - 1];
            const wait =
                ch === "." ? 420 :
                ch === "\u2014" ? 260 :
                ch === "," ? 180 :
                24 + Math.random() * 22;
            setTimeout(tick, wait);
        } else {
            // Remove caret after done, keep text clean for screen readers
            el.innerHTML = text;
        }
    }

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = text;
    } else {
        setTimeout(tick, 1400);
    }
})();

/* ── FLICKER ── */
(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = document.getElementById("flickerOverlay");
    if (!el) return;

    function trigger() {
        el.style.opacity = "0.04";
        setTimeout(() => (el.style.opacity = "0"), 60);
        setTimeout(() => (el.style.opacity = "0.06"), 100);
        setTimeout(() => (el.style.opacity = "0"), 160);
        setTimeout(trigger, 7000 + Math.random() * 12000);
    }
    setTimeout(trigger, 6000);
})();

/* ── NAV SCROLL STATE ── */
const nav = document.getElementById("nav");
if (nav) {
    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
}

/* ── MOBILE NAV (drawer) ── */
(function () {
    const ham = document.getElementById("hamburger");
    const mob = document.getElementById("mobileNav");
    const closeBtn = document.getElementById("mobileNavClose");
    const backdrop = document.getElementById("mobileNavBackdrop");

    if (!ham || !mob) return;

    let isOpen = false;

    function openNav() {
        isOpen = true;
        mob.removeAttribute("hidden");
        // rAF so 'hidden' removal registers before class add (CSS transition)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mob.classList.add("open");
                backdrop.classList.add("visible");
                backdrop.style.display = "block";
            });
        });
        ham.setAttribute("aria-expanded", "true");
        ham.setAttribute("aria-label", "Close navigation menu");
        ham.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        document.body.style.overflow = "hidden"; // prevent background scroll
        // Focus first link
        const firstLink = mob.querySelector("a, button");
        if (firstLink) setTimeout(() => firstLink.focus(), 100);
    }

    function closeNav() {
        isOpen = false;
        mob.classList.remove("open");
        backdrop.classList.remove("visible");
        ham.setAttribute("aria-expanded", "false");
        ham.setAttribute("aria-label", "Open navigation menu");
        ham.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        document.body.style.overflow = "";
        // Hide after transition
        setTimeout(() => {
            mob.setAttribute("hidden", "");
            backdrop.style.display = "";
        }, 400);
    }

    ham.addEventListener("click", () => isOpen ? closeNav() : openNav());
    if (closeBtn) closeBtn.addEventListener("click", closeNav);

    // Backdrop click
    if (backdrop) backdrop.addEventListener("click", closeNav);

    // Links close nav
    mob.querySelectorAll("a").forEach((l) => l.addEventListener("click", closeNav));

    // Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) closeNav();
    });
})();

/* ── ACTIVE NAV HIGHLIGHT ── */
(function () {
    const secs = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-menu a, .mobile-nav nav a");

    if (!secs.length || !links.length) return;

    let ticking = false;

    function updateActive() {
        let cur = "";
        secs.forEach((s) => {
            if (window.scrollY >= s.offsetTop - 140) cur = s.id;
        });
        links.forEach((l) => {
            l.classList.remove("active");
            if (l.getAttribute("href") === "#" + cur) l.classList.add("active");
        });
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateActive);
            ticking = true;
        }
    }, { passive: true });
})();

/* ── REVEAL ON SCROLL ── */
(function () {
    const revs = document.querySelectorAll(".reveal");
    const bars = document.querySelectorAll(".depth-bar-fill");

    if (!revs.length && !bars.length) return;

    const threshold = 0.12;

    // Use IntersectionObserver for performance
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold }
    );

    const barObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    barObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    revs.forEach((el) => revealObserver.observe(el));
    bars.forEach((el) => barObserver.observe(el));

    // Fallback: check immediately for elements already in view
    revs.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * (1 - threshold)) {
            el.classList.add("show");
        }
    });

    bars.forEach((bar) => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            bar.classList.add("animated");
        }
    });
})();