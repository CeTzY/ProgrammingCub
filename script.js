// Небольшой скрипт для проверки работы кнопки
function sayHello() {
    const name = document.getElementById('name').value;
    if (name) {
        alert('Привет, ' + name + '! Код работает отлично.');
    } else {
        alert('Пожалуйста, введите имя!');
    }
}