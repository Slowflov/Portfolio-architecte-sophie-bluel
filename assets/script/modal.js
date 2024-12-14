document.addEventListener('DOMContentLoaded', function() {
    // Simplification de l'accès aux éléments
    const getElem = id => document.getElementById(id);
    const query = selector => document.querySelector(selector);

    // Récupération des différents éléments de la page
    const modifyLink = getElem('modify-link');
    const modal = getElem('myModal');
    const closeModalBtn = modal?.querySelector('.close-x');
    const mediaForm = getElem('mediaForm');
    const galleryView = getElem('gallery-view');
    const addPhotoView = getElem('add-photo-view');
    const openAddPhotoView = getElem('openAddPhotoView');
    const backToGallery = query('.backToGallery');
    const headerMod = query('.header-mod');
    let submitPhotoButton = getElem('submitPhotoButton');
    let image = getElem('image');
    const previewImg = getElem('previewImg');
    const pFile = getElem('pFile');
    const titleInput = getElem('title');
    const categorySelect = getElem('category');

    // Fonction pour obtenir le jeton
    const getToken = () => sessionStorage.getItem('token');

    // Vérification de la présence du jeton et affichage/masquage des éléments
    if (headerMod) {
        headerMod.style.display = getToken() ? 'block' : 'none';
    }

    // Fonction pour ouvrir la fenêtre modale
    const openModal = event => {
        event.preventDefault();
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        fetchWorks(); // Récupération et affichage des travaux
    };

    // Assignation des gestionnaires d'événements pour ouvrir la fenêtre modale
    headerMod?.addEventListener('click', openModal);
    modifyLink?.addEventListener('click', openModal);

    // Gestionnaire de fermeture de la fenêtre modale
    closeModalBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
        resetFormAndRebindHandlers();
    });

    // Fermeture de la fenêtre modale en cliquant à l'extérieur
    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetFormAndRebindHandlers();
        }
    });

    // Gestionnaire pour ouvrir le formulaire d'ajout de photo
    openAddPhotoView?.addEventListener('click', event => {
        event.preventDefault();
        galleryView.style.display = 'none';
        addPhotoView.style.display = 'block';
    });

    // Gestionnaire pour revenir à la galerie
    backToGallery?.addEventListener('click', event => {
        event.preventDefault();
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        resetFormAndRebindHandlers();
    });

    // Gestionnaire de changement d'image
    const handleImageChange = async event => {
        const file = event.target.files[0];
        if (file) {
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            titleInput.value = fileNameWithoutExtension;

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
    };

    // Fonction de réinitialisation du formulaire et réassignation des gestionnaires d'événements
    const resetFormAndRebindHandlers = () => {
        image.value = ""; // Réinitialiser l'image sélectionnée
        previewImg.src = ""; // Cacher l'aperçu de l'image
        previewImg.style.display = "none"; // Cacher l'élément d'aperçu
        submitPhotoButton.style.display = "block"; // Afficher le bouton d'ajout de photo
        pFile.style.display = "block"; // Afficher les informations sur le fichier
        titleInput.value = ""; // Réinitialiser la valeur du titre
        categorySelect.value = ""; // Réinitialiser la valeur de la catégorie

        const mediaInner = query('.media-inner');
        mediaInner.innerHTML = `
            <img class="media_img" src="./images/picture-svgrepo-com 1.png" alt="icon-photoloading" id="previewImg">
            <button type="button" class="media_btn" id="submitPhotoButton">+ Ajouter photo</button>
            <input type="file" id="image" name="image" style="display: none;" accept="image/png, image/jpeg">
            <p class="file-info" id="pFile">jpg, png : 4mo max</p>
        `;

        // Réassigner les gestionnaires d'événements
        submitPhotoButton = getElem('submitPhotoButton');
        image = getElem('image');
        submitPhotoButton.addEventListener('click', event => {
            event.preventDefault();
            image.click();
        });
        
        image.addEventListener('change', handleImageChange);
    };

    // Assignation du gestionnaire pour le bouton d'ajout de photo
    submitPhotoButton?.addEventListener('click', event => {
        event.preventDefault();
        image.click();
    });

    // Assignation du gestionnaire pour le changement d'image
    image.addEventListener('change', handleImageChange);

    // Gestionnaire d'envoi du formulaire
    mediaForm.addEventListener('submit', async e => {
        e.preventDefault(); 

        const imageInput = image;
        const title = titleInput.value.trim();
        const category = categorySelect.value;

        if (!imageInput.files[0] || !title || !category) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const formData = new FormData(mediaForm);
        formData.append("image", imageInput.files[0]);

        const token = getToken();
        if (!token) {
            alert("Non autorisé : aucun jeton trouvé");
            return;
        }

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (response.ok) {
            const responseData = await response.json();
            addWorkToGallery(responseData);

            resetFormAndRebindHandlers();
        } else if (response.status === 401) {
            alert("Non autorisé : jeton invalide");
        } else {
            alert("Une erreur est survenue lors de l'envoi de l'image.");
        }
    });
});


















































