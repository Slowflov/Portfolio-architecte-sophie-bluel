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
    const headerMod = query('.header-mod');

    const getToken = () => sessionStorage.getItem('token') || console.error('No token found in sessionStorage');

    if (headerMod) {
        headerMod.style.display = sessionStorage.getItem('token') ? 'block' : 'none';
    }

    const openModal = event => {
        event.preventDefault();
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        fetchWorks();
    };

    headerMod?.addEventListener('click', openModal);
    modifyLink?.addEventListener('click', openModal);

    closeModalBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

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

    submitPhotoButton?.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async event => {
        const file = event.target.files[0];
        if (file) {
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            document.getElementById('title').value = fileNameWithoutExtension;

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                const mediaImg = query('.media_img');
                if (mediaImg) {
                    mediaImg.src = reader.result;
                    mediaImg.style.display = 'block';
                }

                const imgPreviewContainer = document.createElement('div');
                imgPreviewContainer.className = 'img-container';

                const imgPreview = document.createElement('img');
                imgPreview.src = reader.result;
                imgPreview.className = 'img-preview';

                imgPreviewContainer.appendChild(imgPreview);

                const previewContainer = query('.media-inner');
                previewContainer.innerHTML = '';
                previewContainer.appendChild(imgPreviewContainer);
            };
        }
    });

    mediaForm.addEventListener('submit', async event => {
        event.preventDefault();
        const file = fileInput.files[0];
        if (!file) {
            return console.error('No file selected');
        }

        const title = getElem('title').value;
        const category = getElem('category').value;

        if (!title || !category) {
            return console.error('Title and category are required');
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', category);

        const token = getToken();
        if (!token) return;

        try {
            console.log('Submitting form with the following data:');
            formData.forEach((value, key) => {
                console.log(`${key}:`, value);
            });

            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const responseText = await response.text();

            if (!response.ok) {
                console.error(`Error ${response.status}:`, responseText);
                return;
            }

            const result = JSON.parse(responseText);
            console.log('Response from server:', result);

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
    });

    const deleteWork = async (workId, elementToRemove) => {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
        });
        if (response.ok) elementToRemove.remove();
        else console.error('Error deleting work');
    };

    function fetchWorks() {
        console.log('Fetching works...');
    }
});
































