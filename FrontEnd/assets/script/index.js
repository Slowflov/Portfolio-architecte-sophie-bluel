async function fetchWorks(categoryId = null) {
    try {
        // Запрос к API для получения списка проектов
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();

        // Находим основную галерею на странице
        const gallery = document.querySelector('.gallery');
        // Очищаем основную галерею перед добавлением новых проектов
        gallery.innerHTML = '';

        // Находим модальную галерею на странице
        const galleryModal = document.querySelector('.gallery-modal');
        // Очищаем модальную галерею перед добавлением новых проектов
        galleryModal.innerHTML = '';

        // Если передан идентификатор категории, фильтруем проекты по этой категории, иначе берем все проекты
        const filteredData = categoryId ? data.filter(item => item.categoryId === categoryId) : data;

        filteredData.forEach(item => {
            let figure = document.createElement('figure');
            figure.classList.add('photo-container');

            let img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.title;

            let figcaption = document.createElement('figcaption');
            figcaption.textContent = item.title;

            // Добавляем изображение и подпись в figure
            figure.appendChild(img);
            figure.appendChild(figcaption);

            // Добавляем figure в основную галерею
            gallery.appendChild(figure);

            // Клонируем figure и добавляем его в модальную галерею
            let figureModal = figure.cloneNode(true);

            // Создаем контейнер для иконки удаления
            let iconContainer = document.createElement('div');
            iconContainer.classList.add('icon-container');

            // Создаем иконку удаления
            let deleteIcon = document.createElement('span');
            deleteIcon.classList.add('material-icons-outlined', 'delete-icon');
            deleteIcon.textContent = 'delete';

            // Добавляем обработчик события для удаления изображения в модальной галерее
            deleteIcon.addEventListener('click', function() {
                figureModal.remove(); // Удаляем figureModal при клике на иконку удаления
            });

            // Добавляем иконку в контейнер и контейнер в figureModal
            iconContainer.appendChild(deleteIcon);
            figureModal.appendChild(iconContainer);

            // Добавляем клонированный figure в модальную галерею
            galleryModal.appendChild(figureModal);
        });

    } catch (error) {
        // Выводим сообщение об ошибке в консоль, если запрос не удался
        console.error('Ошибка:', error);
    }
}

// Функция для загрузки и отображения категорий
async function fetchCategories() {
    try {
        // Запрос к API для получения списка категорий
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        // Находим элемент для фильтров на странице
        const filters = document.querySelector('.filters');
        // Очищаем фильтры перед добавлением новых категорий
        filters.innerHTML = '';

        // Создаем кнопку "Tous" для отображения всех проектов
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';  // Задаем текст кнопки
        allButton.classList.add('filter_btn', 'filter_btn_one'); // Добавляем классы
        allButton.addEventListener('click', () => fetchWorks());  // Добавляем обработчик события для отображения всех проектов
        filters.appendChild(allButton);  // Добавляем кнопку к элементу фильтров

        // Для каждой категории создаем кнопку и добавляем её к элементу фильтров
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;  // Задаем текст кнопки
            button.classList.add('filter_btn'); // Добавляем основной класс для стиля
            // Добавляем обработчик события для отображения проектов соответствующей категории
            button.addEventListener('click', () => fetchWorks(category.id));
            filters.appendChild(button);  // Добавляем кнопку к элементу фильтров
        });
    } catch (error) {
        // Выводим сообщение об ошибке в консоль, если запрос не удался
        console.error('Ошибка при получении категорий:', error);
    }
}

// Функция для проверки наличия токена
const verifyTokenIsPresent = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const loginButton = document.getElementById("login-link"); // Изменили на id элемента, который у вас на странице
        const token = sessionStorage.getItem("token");

        if (token) {
            // Если токен есть, меняем текст ссылки на "logout"
            loginButton.textContent = "logout";

            // Добавляем обработчик события для кнопки logout
            loginButton.addEventListener("click", () => {
                // Удаляем токен из sessionStorage
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("role"); // Добавляем удаление роли, если она сохраняется

                // Изменяем текст ссылки обратно на "login"
                loginButton.textContent = "login";
                loginButton.href = 'login.html'; // Устанавливаем ссылку на страницу login.html
            });
        } else {
            // Если токен отсутствует, оставляем текст ссылки как "login"
            loginButton.textContent = "login";
            loginButton.href = 'login.html'; // Устанавливаем ссылку на страницу login.html
        }
    });
}

// Вызываем функции при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    verifyTokenIsPresent();
    await fetchWorks(); // Загружаем все проекты при загрузке страницы
    fetchCategories();
});

// Вызываем функцию проверки наличия токена при загрузке страницы
verifyTokenIsPresent();







