async function fetchWorks(categoryId = null) {
    try {
        // Envoyer une requête au serveur pour obtenir la liste des travaux
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();

        // Trouver les galeries pour afficher les travaux
        const gallery = document.querySelector('.gallery');
        const galleryModal = document.querySelector('.gallery-modal');
        // Vider les galeries
        gallery.innerHTML = '';
        galleryModal.innerHTML = '';

        // Filtrer les données par catégorie, si une catégorie est spécifiée
        const filteredData = categoryId ? data.filter(item => item.categoryId === categoryId) : data;

        // Ajouter les travaux à la galerie
        filteredData.forEach(item => addWorkToGallery(item));

    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
    }
}

const deleteWork = async (workId, elementToRemove) => {
    // Obtenir le jeton de sessionStorage
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Jeton non trouvé');
        return;
    }

    try {
        // Envoyer une requête au serveur pour supprimer le travail
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            // Supprimer l'élément du travail du DOM
            elementToRemove.remove();
            // Supprimer également le travail de la galerie principale
            const mainGalleryElement = document.querySelector(`.gallery [data-work-id="${workId}"]`);
            mainGalleryElement?.remove();
            console.log(`Travail avec ID ${workId} supprimé avec succès`);
        } else {
            console.error('Erreur lors de la suppression du travail:', response.statusText);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
};

async function fetchCategories() {
    try {
        // Envoyer une requête au serveur pour obtenir la liste des catégories
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        // Trouver le conteneur pour les filtres
        const filters = document.querySelector('.filters');
        // Vider le conteneur pour les filtres
        filters.innerHTML = '';

        // Créer un bouton "Tous" pour afficher tous les travaux
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.classList.add('filter_btn', 'filter_btn_one');
        allButton.addEventListener('click', (event) => {
            event.preventDefault();
            fetchWorks();
        });
        filters.appendChild(allButton);

        // Créer des boutons pour chaque catégorie
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.classList.add('filter_btn');
            button.addEventListener('click', (event) => {
                event.preventDefault();
                fetchWorks(category.id);
            });
            filters.appendChild(button);
        });

        // Mettre à jour la liste des catégories dans l'élément select
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '';
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Sélectionnez une catégorie';
        categorySelect.appendChild(emptyOption);
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
    }
}

const verifyTokenIsPresent = () => {
    // Trouver le bouton de connexion par ID
    const loginButton = document.getElementById("login-link");
    // Obtenir le jeton de sessionStorage
    const token = sessionStorage.getItem("token");

    // Vérifier si le jeton existe
    if (token) {
        // Changer le texte du bouton en 'logout' et ajouter un gestionnaire d'événement
        loginButton.textContent = "logout";
        loginButton.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            loginButton.textContent = "login";
            loginButton.href = 'login.html';
        });
    } else {
        // Si le jeton n'existe pas, définir le texte du bouton sur 'login' et le lien vers la page de connexion
        loginButton.textContent = "login";
        loginButton.href = 'login.html';
    }
}

const addWorkToGallery = (item) => {
    // Créer un élément figure pour le travail
    let figure = document.createElement('figure');
    figure.classList.add('photo-container');
    figure.setAttribute('data-work-id', item.id);

    // Créer et ajouter un élément img pour l'image du travail
    let img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;

    // Créer et ajouter un élément figcaption pour le titre du travail
    let figcaption = document.createElement('figcaption');
    figcaption.textContent = item.title;

    // Ajouter l'image et le titre à l'élément figure
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Ajouter le travail à la galerie principale
    const gallery = document.querySelector('.gallery');
    gallery.appendChild(figure);

    // Cloner l'élément figure pour la galerie modale
    let figureModal = figure.cloneNode(true);
    // Créer un conteneur pour les icônes dans la galerie modale
    let iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');

    // Créer et ajouter une icône de suppression du travail
    let deleteIcon = document.createElement('span');
    deleteIcon.classList.add('material-icons-outlined', 'delete-icon');
    deleteIcon.textContent = 'delete';

    // Ajouter un gestionnaire d'événement pour supprimer le travail
    deleteIcon.addEventListener('click', (event) => {
        event.preventDefault();
        deleteWork(item.id, figureModal);
    });

    // Ajouter l'icône de suppression au conteneur et le conteneur à l'élément figure
    iconContainer.appendChild(deleteIcon);
    figureModal.appendChild(iconContainer);

    // Ajouter le travail à la galerie modale
    const galleryModal = document.querySelector('.gallery-modal');
    galleryModal.appendChild(figureModal);
};

// Vérifier la présence du jeton lors du chargement de la page
verifyTokenIsPresent();
// Obtenir et afficher les travaux
fetchWorks();
// Obtenir et afficher les catégories
fetchCategories();
















