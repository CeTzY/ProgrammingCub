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

// ========== ДОМАШНЕЕ ЗАДАНИЕ ==========
function renderHomework() {
    const container = document.getElementById("homework-content");
    if (!container) return;
    
    let html = `
        <div class="hw-header">
            <h2>📚 Домашнее задание #${HOMEWORK.id}</h2>
            <div class="hw-deadline">📅 Дедлайн: ${HOMEWORK.deadline}</div>
        </div>
    `;
    
    for (let lvl of HOMEWORK.levels) {
        const levelClass = lvl.level === 1 ? "easy" : lvl.level === 2 ? "medium" : "hard";
        html += `
            <div class="hw-card">
                <div class="hw-level ${levelClass}">${lvl.name}</div>
                <div class="hw-title">${lvl.title}</div>
                <div class="hw-description">${lvl.description}</div>
                <div class="hw-section">
                    <div class="hw-section-title">📌 Пример</div>
                    <div class="hw-example">${lvl.example}</div>
                </div>
            </div>
        `;
    }
    
    html += `<div class="info-box">⚡ Сдать задание можно в боте: @ProgClubBot_bot</div>`;
    container.innerHTML = html;
}

// ========== ТАБЛИЦА ЛИДЕРОВ ==========
async function renderTop() {
    const container = document.getElementById("top-list");
    if (!container) return;
    
    container.innerHTML = '<div class="loading">🏆 Загрузка таблицы лидеров...</div>';
    
    try {
        const response = await fetch("https://cetzy.github.io/ProgrammingCub/api/top.json");
        const topData = await response.json();
        
        if (!topData || topData.length === 0) {
            container.innerHTML = '<div class="loading">📭 Пока никого нет. Стань первым!</div>';
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
        container.innerHTML = html;
    } catch(e) {
        console.error("Ошибка загрузки топа:", e);
        container.innerHTML = '<div class="loading">❌ Ошибка загрузки. Напиши /hw top в боте</div>';
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