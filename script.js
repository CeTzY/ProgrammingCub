// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '64px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'var(--bg-dark)';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid var(--border)';
        }
    });
}

// Плавное появление элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.article-card, .event-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Консольное приветствие
console.log('%c🚀 Programming Cub | Код, сообщество, бесконечное развитие', 'color: #00ff88; font-size: 16px; font-family: monospace;');
console.log('%c$ grep -i "welcome" ./club', 'color: #71717a');
console.log('%c> Добро пожаловать в клуб! Присоединяйся к чату в Telegram', 'color: #00ff88');