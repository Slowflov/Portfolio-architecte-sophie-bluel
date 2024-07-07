document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');

    function checkLoginStatus() {
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        if (token) {
            loginLink.textContent = 'logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', function(event) {
                event.preventDefault();
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('role');
                loginLink.textContent = 'login';
                loginLink.href = 'login.html';
                window.location.href = 'login.html';
            });
            // Дополнительный код для администраторов
            if (role === 'admin') {
                // Добавьте элементы интерфейса для администраторов
                const adminPanelLink = document.createElement('a');
                adminPanelLink.href = 'admin_panel.html';
                adminPanelLink.textContent = 'Admin Panel';
                document.querySelector('nav ul').appendChild(adminPanelLink);
            }
        } else {
            loginLink.textContent = 'login';
            loginLink.href = 'login.html';
        }    
    } 

    checkLoginStatus();

    // Проверяем наличие токена в sessionStorage
let token = sessionStorage.getItem('token');
if (token) {
    // Если токен есть, значит пользователь авторизован
    const modifyLink = document.getElementById('modify-link');
    if (modifyLink) {
        modifyLink.style.display = 'inline-block'; // Делаем кнопку видимой
    }
}
});

// Функция для проверки авторизации пользователя
function isUserAuthenticated() {
    // Пример: проверяем наличие токена в localStorage
    return localStorage.getItem('authToken') !== null;
}



