// Здесь потом можно добавить интерактив
// Например, загрузку статей с сервера или счётчик просмотров
console.log("Programming Cub — сайт готов к чтению! 🚀");

// Плавная прокрутка для якорей (если добавим)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});