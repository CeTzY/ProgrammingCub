// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '97px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'var(--bg-dark)';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid var(--border)';
            navLinks.style.zIndex = '100';
        }
    });
}

// Кликабельные quick-карточки с твоими ссылками
const quickCards = document.querySelectorAll('.quick-card');
const urls = {
    'Основной чат клуба': 'https://t.me/programming_club_CeTzY',
    'Python уроки': 'https://t.me/CeTzYPythonLessons',
    'CodeRunner Bot': 'https://t.me/ProgClubBot_bot'
};

quickCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3')?.innerText;
        if (title && urls[title]) {
            window.open(urls[title], '_blank');
        }
    });
});

// Кнопка Join в навигации
const joinBtn = document.getElementById('nav-join');
if (joinBtn) {
    joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://t.me/programming_club_CeTzY', '_blank');
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

document.querySelectorAll('.article-card, .event-card, .stat-card, .quick-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Форма подписки
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = subscribeForm.querySelector('input[type="email"]')?.value;
        if (email) {
            alert(`Спасибо за подписку, ${email}! А пока подписывайся на Telegram-каналы 😊`);
            subscribeForm.reset();
        }
    });
}

// Консольное приветствие с твоими ссылками
console.log('%c🚀 Programming Cub | Код, сообщество, бесконечное развитие', 'color: #00ff88; font-size: 16px; font-family: monospace;');
console.log('%c$ grep -i "links" ./telegram', 'color: #71717a');
console.log('%c> Основной чат: https://t.me/programming_club_CeTzY', 'color: #00ff88');
console.log('%c> Python уроки: https://t.me/CeTzYPythonLessons', 'color: #00b8ff');
console.log('%c> CodeRunner Bot: https://t.me/ProgClubBot_bot', 'color: #ffbb33');
console.log('%c$ echo "Добро пожаловать в клуб!"', 'color: #71717a');

// Добавляем ссылки на все статьи (пока пустышки, можно потом заменить на реальные)
document.querySelectorAll('.article-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        alert('Статья в разработке! А пока загляни в Telegram-канал с Python уроками 😉');
        window.open('https://t.me/CeTzYPythonLessons', '_blank');
    });
});

// События тоже делаем кликабельными
document.querySelectorAll('.event-card').forEach((card) => {
    card.addEventListener('click', () => {
        window.open('https://t.me/programming_club_CeTzY', '_blank');
    });
});