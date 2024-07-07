document.addEventListener('DOMContentLoaded', function() {
    const getElem = id => document.getElementById(id);
    const query = selector => document.querySelector(selector);

    const modifyLink = getElem('modify-link');
    const modal = getElem('myModal');
    const closeModalBtn = modal?.querySelector('.close-x');
    const mediaForm = getElem('mediaForm');
    const galleryView = getElem('gallery-view');
    const addPhotoView = getElem('add-photo-view');
    const openAddPhotoView = getElem('openAddPhotoView');
    const backToGallery = query('.backToGallery');
    const submitPhotoButton = getElem('submitPhotoButton');
    const fileInput = getElem('fileInput');
    const validateButton = query('#mediaForm input[type="submit"]');
    const headerMod = query('.header-mod');

    const getToken = () => sessionStorage.getItem('token') || console.error('No token found in localStorage');

    // Проверка токена и отображение элемента headerMod
    if (headerMod) {
        headerMod.style.display = sessionStorage.getItem('token') ? 'block' : 'none';
    }

    // Открытие модального окна
    const openModal = event => {
        event.preventDefault();
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        fetchWorks();
    };

    headerMod?.addEventListener('click', openModal);
    modifyLink?.addEventListener('click', openModal);

    // Закрытие модального окна
    closeModalBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Переключение вида
    openAddPhotoView?.addEventListener('click', event => {
        event.preventDefault();
        galleryView.style.display = 'none';
        addPhotoView.style.display = 'block';
    });

    backToGallery?.addEventListener('click', event => {
        event.preventDefault();
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
    });

    // Обработчик кнопки "Ajouter photo"
    submitPhotoButton?.addEventListener('click', () => {
        fileInput.click();
    });

    // Обработчик изменения файла и предварительного просмотра изображения
    fileInput.addEventListener('change', async event => {
        console.log('File input changed');
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ''); // Удаляем расширение (последние символы после последней точки)

            document.getElementById('title').value = fileNameWithoutExtension;

            const formData = new FormData(mediaForm);
            formData.append('image', file);

            const reader = new FileReader(); // Создаем объект для чтения файлов
            reader.readAsDataURL(file); // Читаем файл как URL

            reader.onload = () => {
                console.log('File loaded');
                // После загрузки файла, устанавливаем его как src для изображения
                const mediaImg = query('.media_img');
                if (mediaImg) {
                    mediaImg.src = reader.result; // Устанавливаем src изображения
                    mediaImg.style.display = 'block'; // Показываем изображение
                }

                // Отображаем предварительный просмотр изображения
                const imgPreviewContainer = document.createElement('div');
                imgPreviewContainer.className = 'img-container';

                const imgPreview = document.createElement('img');
                imgPreview.src = reader.result;
                imgPreview.className = 'img-preview';

                imgPreviewContainer.appendChild(imgPreview);

                const previewContainer = document.querySelector('.media-inner');
                previewContainer.innerHTML = ''; // Clear existing content
                previewContainer.appendChild(imgPreviewContainer);
            };

            await envoiePhoto(formData); // Вызываем функцию отправки фото на сервер
        }
    });

    // Подтверждение и отправка формы медиа
    validateButton?.addEventListener('click', event => {
        event.preventDefault(); // Предотвращаем стандартное поведение формы
        console.log('Form submitted');
        modal.style.display = 'none';
        mediaForm.reset();
    });

    // Функция отправки фотографии на сервер
    async function envoiePhoto(formData) {
        const token = getToken();
        if (!token) return;
        try {
            const newPhotoPosted = await fetch('http://localhost:5678/api/works', {
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData,
                method: 'POST'
            });

            if (newPhotoPosted.status === 401) return console.error('Unauthorized: Invalid token');

            const result = await newPhotoPosted.json();
            if (result) {
                const gallery = getElem('gallery');
                const modalGallery = getElem('modalGallery');
                if (!modalGallery) return console.error('Element with id "modalGallery" not found.');

                const createNewWork = (id, imageUrl, title, categoryId) => {
                    const figure = document.createElement('figure');
                    figure.dataset.id = id;
                    figure.setAttribute('categoryId', categoryId);

                    const img = document.createElement('img');
                    img.src = imageUrl;

                    const caption = document.createElement('figcaption');
                    caption.innerHTML = title;

                    figure.append(img, caption);
                    return figure;
                };

                const newWork = createNewWork(result.id, result.imageUrl, result.title, result.categoryId);
                gallery.appendChild(newWork);

                const newWorkModal = createNewWork(result.id, result.imageUrl, 'editer', result.categoryId);
                const newDustBin = document.createElement('div');
                newDustBin.classList.add('dustbin');
                newDustBin.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
                newWorkModal.appendChild(newDustBin);
                newWorkModal.setAttribute("tabindex", 3);
                modalGallery.appendChild(newWorkModal);

                newDustBin.addEventListener('click', () => deleteWork(result.id, newWork));
            }
        } catch (error) {
            console.error('Error posting new photo:', error);
        }
    }

    // Функция удаления работы
    const deleteWork = async (workId, elementToRemove) => {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (response.ok) elementToRemove.remove();
        else console.error('Error deleting work');
    };

    // Dummy fetchWorks function to prevent errors
    function fetchWorks() {
        console.log('Fetching works...');
    }
});























