// ========== TELEGRAM WEB APP ==========
let tg = window.Telegram?.WebApp;
let userId = null;
let userName = null;

if (tg) {
    tg.ready();
    tg.expand();
    const user = tg.initDataUnsafe?.user;
    if (user) {
        userId = user.id;
        userName = user.first_name || "Участник";
        document.getElementById("user-name").innerText = userName;
    }
}

// ========== АНИМАЦИЯ ЗАГРУЗКИ ==========
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading-spinner">⏳ Загрузка...</div>';
    }
}

function hideLoading(containerId, content) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = content;
    }
}

// ========== НАВИГАЦИЯ ==========
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const page = btn.dataset.page;
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(`page-${page}`).classList.add("active");
        
        if (page === "top") renderTop();
        if (page === "profile") renderProfile();
        if (page === "homework") renderHomework();
        if (page === "news") renderNews();
    });
});

// ========== НОВОСТИ ==========
function renderNews() {
    const container = document.getElementById("news-list");
    if (!container) return;
    
    const NEWS = [
        {
            date: "2026-05-03",
            title: "🔥 ДЗ #1 уже в боте!",
            text: "Сумма чётных чисел, обратный отсчёт, калькулятор с историей. Сдавай и получай опыт!"
        },
        {
            date: "2026-05-02",
            title: "📱 Mini App обновился",
            text: "Теперь профиль показывает реальный опыт и очки из бота. Топ синхронизируется автоматически."
        },
        {
            date: "2026-04-28",
            title: "🏆 Появилась система уровней",
            text: "За каждое ДЗ начисляется опыт. Чем больше опыт — тем выше ранг!"
        }
    ];
    
    let html = "";
    for (let n of NEWS) {
        html += `
            <div class="news-item">
                <div class="news-date">📅 ${n.date}</div>
                <div class="news-title">${n.title}</div>
                <div class="news-text">${n.text}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ========== ДОМАШНЕЕ ЗАДАНИЕ (только чтение) ==========
function renderHomework() {
    const container = document.getElementById("homework-content");
    if (!container) return;
    
    const HOMEWORK = {
        id: 1,
        title: "ЗАДАНИЯ НА НЕДЕЛЮ — PYTHON С НУЛЯ",
        deadline: "Воскресенье, 23:00",
        levels: [
            { level: 1, name: "🟢 Уровень 1 — новичок", title: "Сумма чётных чисел", description: "Напиши программу, которая считает сумму всех чётных чисел от 1 до N.", example: "Ввод: 10\nВывод: 30" },
            { level: 2, name: "🟡 Уровень 2 — средний", title: "Обратный отсчёт", description: "Программа выводит обратный отсчёт от N до 1, в конце 'ПУСК!'.", example: "Ввод: 5\n5 4 3 2 1 ПУСК!" },
            { level: 3, name: "🔴 Уровень 3 — профи", title: "Калькулятор с историей", description: "Программа поддерживает +, -, *, /, history, exit.", example: "> +\n10\n5\nРезультат: 15" }
        ]
    };
    
    let html = `<div class="hw-header"><h2>📚 Домашнее задание #${HOMEWORK.id}</h2><div class="hw-deadline">📅 Дедлайн: ${HOMEWORK.deadline}</div></div>`;
    for (let lvl of HOMEWORK.levels) {
        const levelClass = lvl.level === 1 ? "easy" : lvl.level === 2 ? "medium" : "hard";
        html += `
            <div class="hw-card">
                <div class="hw-level ${levelClass}">${lvl.name}</div>
                <div class="hw-title">${lvl.title}</div>
                <div class="hw-description">${lvl.description}</div>
                <div class="hw-section"><div class="hw-section-title">📌 Пример</div><div class="hw-example">${lvl.example}</div></div>
            </div>
        `;
    }
    html += `<div class="info-box">⚡ Сдать задание можно в боте: @ProgClubBot_bot</div>`;
    container.innerHTML = html;
}

// ========== ТАБЛИЦА ЛИДЕРОВ ==========
async function renderTop() {
    showLoading("top-list");
    
    try {
        const response = await fetch("https://cetzy.github.io/ProgrammingCub/api/top.json");
        const topData = await response.json();
        
        if (!topData || topData.length === 0) {
            hideLoading("top-list", '<div class="loading">📭 Пока никого нет. Стань первым!</div>');
            return;
        }
        
        let html = "";
        for (let i = 0; i < topData.length; i++) {
            const u = topData[i];
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`;
            html += `
                <div class="top-item">
                    <div class="top-medal">${medal}</div>
                    <div class="top-name">${u.name}</div>
                    <div class="top-exp">${u.exp} опыта</div>
                    <div class="top-rank">${u.rank}</div>
                </div>
            `;
        }
        hideLoading("top-list", html);
    } catch(e) {
        console.error("Ошибка загрузки топа:", e);
        hideLoading("top-list", '<div class="loading">❌ Ошибка загрузки. Напиши /hw top в боте</div>');
    }
}

// ========== ПРОФИЛЬ (реальные данные с GitHub) ==========
async function renderProfile() {
    const container = document.getElementById("profile-content");
    if (!container) return;
    
    // Если нет ID из Telegram
    if (!userId) {
        document.getElementById("user-name").innerText = userName || "Гость";
        document.getElementById("exp-fill").style.width = "0%";
        document.getElementById("exp-text").innerText = "0 / 50 опыта";
        document.getElementById("user-points").innerText = "0";
        document.getElementById("user-hw-done").innerText = "0";
        document.getElementById("user-level").innerText = "1";
        document.getElementById("user-rank").innerText = "🥚 Новичок";
        return;
    }
    
    // Загружаем профиль с GitHub
    try {
        const response = await fetch(`https://cetzy.github.io/ProgrammingCub/api/users/${userId}.json`);
        
        if (!response.ok) {
            throw new Error("Профиль не найден");
        }
        
        const profile = await response.json();
        
        document.getElementById("user-name").innerText = profile.name || userName;
        document.getElementById("user-points").innerText = profile.points || 0;
        document.getElementById("user-hw-done").innerText = profile.hw_done || 0;
        document.getElementById("user-level").innerText = profile.level || 1;
        document.getElementById("user-rank").innerText = profile.rank || "🥚 Новичок";
        
        const exp = profile.exp || 0;
        const nextExp = profile.next_exp || 50;
        const percent = (exp / nextExp) * 100;
        document.getElementById("exp-fill").style.width = percent + "%";
        document.getElementById("exp-text").innerText = `${exp} / ${nextExp} опыта`;
        
    } catch(e) {
        console.log("Профиль не найден, заглушка");
        document.getElementById("user-name").innerText = userName || "Участник";
        document.getElementById("exp-fill").style.width = "0%";
        document.getElementById("exp-text").innerText = "0 / 50 опыта";
        document.getElementById("user-points").innerText = "0";
        document.getElementById("user-hw-done").innerText = "0";
        document.getElementById("user-level").innerText = "1";
        document.getElementById("user-rank").innerText = "🥚 Новичок";
    }
}

// ========== ЗАПУСК ==========
renderNews();
renderProfile();