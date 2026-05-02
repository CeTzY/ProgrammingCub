// ========== TELEGRAM WEB APP ==========
let tg = window.Telegram?.WebApp;
let userId = null;
let userName = "";
let selectedLevel = null;

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

// ========== HAPTIC FEEDBACK ==========
function hapticFeedback(style = "light") {
    if (tg?.HapticFeedback) {
        if (style === "success" || style === "error") {
            tg.HapticFeedback.notificationOccurred(style);
        } else {
            tg.HapticFeedback.impactOccurred(style);
        }
    }
}

// ========== НАВИГАЦИЯ ==========
document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        const page = tab.getAttribute("data-page");
        hapticFeedback("light");
        document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(`page-${page}`).classList.add("active");
        if (page === "top") loadTopList();
        if (page === "profile") loadProfile();
        if (page === "lessons") loadLessons();
        if (page === "home") loadCurrentHW();
    });
});

// ========== ЗАГРУЗКА ТЕКУЩЕГО ДЗ (хардкод) ==========
async function loadCurrentHW() {
    const hwContent = document.getElementById("hw-content");
    
    const hwData = {
        id: 2,
        title: "ЗАДАНИЯ НА НЕДЕЛЮ — PYTHON С НУЛЯ",
        easy: "🟢 Сумма чётных чисел — посчитай сумму всех чётных чисел от 1 до N",
        medium: "🟡 Обратный отсчёт — обратный отсчёт от N до 1 и 'ПУСК!'",
        hard: "🔵 Калькулятор с историей — +, -, *, /, history, exit",
        deadline: "Воскресенье, 23:00"
    };
    
    hwContent.innerHTML = `
<span class="prompt">$</span> /hw --current

📚 *Домашнее задание #${hwData.id}*
📌 ${hwData.title}

————————————

🎯 Уровень 1: ${hwData.easy}

⚔️ Уровень 2: ${hwData.medium}

💀 Уровень 3: ${hwData.hard}

————————————

📅 Дедлайн: ${hwData.deadline}
🏆 Награда: +15 / +30 / +60 опыта
    `;
}

// ========== ВЫБОР УРОВНЯ ==========
document.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedLevel = btn.getAttribute("data-level");
        hapticFeedback("medium");
    });
});

// ========== ОТПРАВКА КОДА ==========
document.getElementById("submit-code-btn")?.addEventListener("click", async () => {
    const code = document.getElementById("code-input").value;
    if (!selectedLevel) {
        alert("❌ Выбери уровень сложности!");
        hapticFeedback("error");
        return;
    }
    if (!code.trim()) {
        alert("❌ Введи код решения!");
        hapticFeedback("error");
        return;
    }
    
    const submitBtn = document.getElementById("submit-code-btn");
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "⏳ Отправка...";
    submitBtn.disabled = true;
    
    const levelNames = { 1: "🟢 Уровень 1", 2: "🟡 Уровень 2", 3: "🔴 Уровень 3" };
    
    if (tg) {
        tg.sendData(JSON.stringify({
            action: "submit_hw",
            level: selectedLevel,
            level_name: levelNames[selectedLevel],
            code: code,
            user_id: userId,
            user_name: userName
        }));
        
        alert(`✅ Код отправлен на проверку администратору!\n\nУровень: ${levelNames[selectedLevel]}\nОбычно проверка занимает до 24 часов.`);
        hapticFeedback("success");
        document.getElementById("code-input").value = "";
        selectedLevel = null;
        document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("selected"));
    } else {
        alert(`❌ Отправь этот код боту @ProgClubBot_bot\n\nКоманда: /hw submit ${selectedLevel}`);
        hapticFeedback("light");
    }
    
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
});

// ========== ЗАГРУЗКА ТАБЛИЦЫ ЛИДЕРОВ (ЗАГЛУШКА) ==========
async function loadTopList() {
    const topContainer = document.getElementById("top-list");
    topContainer.innerHTML = `
        <div class="terminal-mini" style="margin-top: 0;">
            <div class="terminal-header">$ cat top.txt</div>
            <div class="terminal-body-mini">
<span class="prompt">$</span> /hw_top --leaderboard

┌─────────────────────────────────────────┐
│           🏆 ТОП УЧАСТНИКОВ             │
├─────────────────────────────────────────┤
│  🥇 CeTzY          — 150 опыта          │
│  🥈 Скоро         — тут будешь ты       │
│  🥉               —                     │
└─────────────────────────────────────────┘

📊 Полный топ в боте: /hw_top
🤖 @ProgClubBot_bot
            </div>
        </div>
    `;
}

// ========== ЗАГРУЗКА ПРОФИЛЯ (ЗАГЛУШКА) ==========
async function loadProfile() {
    if (!userId) {
        document.getElementById("user-points").innerText = "?";
        document.getElementById("user-hw-done").innerText = "?";
        document.getElementById("user-level").innerText = "?";
        document.getElementById("user-rank").innerText = "Авторизуйся в Telegram";
        return;
    }
    
    document.getElementById("user-points").innerText = "0";
    document.getElementById("user-hw-done").innerText = "0";
    document.getElementById("user-level").innerText = "1";
    document.getElementById("user-rank").innerText = "🥚 Новичок";
    document.getElementById("exp-fill").style.width = "0%";
    document.getElementById("exp-text").innerText = "0 / 50 опыта";
}

// ========== ЗАГРУЗКА СПИСКА УРОКОВ ==========
function loadLessons() {
    const lessonsGrid = document.getElementById("lessons-list");
    const lessons = [
        { num: 1, title: "Переменные", desc: "Что это вообще такое и для чего нужны", duration: "15 мин", level: "⭐" },
        { num: 2, title: "Вывод и ввод", desc: "print() и input(). Учимся общаться с программой", duration: "12 мин", level: "⭐" },
        { num: 3, title: "Условия", desc: "if, elif, else. Программа выбирает, что делать", duration: "18 мин", level: "⭐⭐" },
        { num: 4, title: "Арифметика и логика", desc: "Операторы, сравнения, приоритеты", duration: "20 мин", level: "⭐⭐" },
        { num: 5, title: "Циклы", desc: "while и for. Заставляем код повторяться", duration: "25 мин", level: "⭐⭐⭐" }
    ];
    
    lessonsGrid.innerHTML = "";
    lessons.forEach(lesson => {
        const card = document.createElement("div");
        card.className = "lesson-card";
        card.onclick = () => {
            hapticFeedback("medium");
            window.open("https://t.me/CeTzYPythonLessons", "_blank");
        };
        card.innerHTML = `
            <div class="lesson-number">0${lesson.num}</div>
            <div class="lesson-info">
                <h3>${lesson.title}</h3>
                <p>${lesson.desc}</p>
                <div class="lesson-meta">
                    <span>📖 ${lesson.duration}</span>
                    <span>${lesson.level}</span>
                </div>
            </div>
        `;
        lessonsGrid.appendChild(card);
    });
}

// ========== ЗАГРУЗКА ПРИ СТАРТЕ ==========
loadCurrentHW();
loadLessons();

console.log("%c🚀 Programming Cub Mini App v2.0 запущен!", "color: #00ff88; font-size: 16px; font-family: monospace;");