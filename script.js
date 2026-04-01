// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);

// Preloader Logic
window.addEventListener('load', () => {
    let counterObj = { value: 0 };
    const counterEl = document.querySelector('.preloader-counter');
    
    const tl = gsap.timeline();
    
    tl.to(counterObj, {
        value: 100,
        duration: 2,
        ease: "power3.inOut",
        onUpdate: () => {
            counterEl.textContent = Math.round(counterObj.value) + "%";
        }
    })
    .to('.preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
    }, "+=0.2")
    .fromTo('.hero-huge-text .reveal-text', 
        { y: "110%" },
        { y: "0%", duration: 1.2, stagger: 0.1, ease: "power4.out" },
        "-=0.6"
    )
    .fromTo('.fade-up-delay',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
        "-=0.8"
    )
    .fromTo('.hero-cinematic',
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.5, ease: "power4.inOut" },
        "-=1.2"
    );
});

// Custom Cursor Logic
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
const hoverTargets = document.querySelectorAll('.magnetic-text, .btn-magnetic, .hover-expand, .hover-reveal-trigger, a');

document.addEventListener('mousemove', (e) => {
    gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        gsap.to(target, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }); // Reset magnetic
        const btnText = target.querySelector('.btn-text');
        if(btnText) gsap.to(btnText, { x: 0, y: 0, duration: 0.5 });
    });
});

// Magnetic Buttons Logic
const magnets = document.querySelectorAll('.btn-magnetic, .magnetic-text');
magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
        const btnText = magnet.querySelector('.btn-text');
        if(btnText) gsap.to(btnText, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: "power2.out" });
    });
});

// Services Hover Reveal Logic
const serviceRows = document.querySelectorAll('.hover-reveal-trigger');
serviceRows.forEach(row => {
    const img = row.querySelector('.hover-reveal-img');
    if(!img) return;
    
    row.addEventListener('mousemove', (e) => {
        const rect = row.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(img, {
            x: x, y: y,
            opacity: 1, scale: 1,
            duration: 0.4, ease: "power3.out"
        });
    });
    
    row.addEventListener('mouseleave', () => {
        gsap.to(img, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power3.out" });
    });
});

// Parallax Images
const parallaxFast = document.querySelectorAll('.parallax-img-fast');
parallaxFast.forEach(img => {
    gsap.to(img, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
});

const parallaxMed = document.querySelectorAll('.parallax-img');
parallaxMed.forEach(img => {
    gsap.to(img, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// Scroll Animations
const fadeUps = document.querySelectorAll('.fade-up');
fadeUps.forEach(el => {
    gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 85%" }
        }
    );
});

// Navbar Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if(menuOpen) {
        mobileMenu.classList.add('active');
        menuBtn.textContent = 'Close';
        lenis.stop();
    } else {
        mobileMenu.classList.remove('active');
        menuBtn.textContent = 'Menu';
        lenis.start();
    }
});
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('active');
        menuBtn.textContent = 'Menu';
        lenis.start();
    });
});
