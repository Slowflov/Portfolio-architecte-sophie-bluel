document.addEventListener('DOMContentLoaded', function() {
    // Recherche de l'élément du lien de connexion par ID
    const loginLink = document.getElementById('login-link');

    // Fonction de vérification du statut de connexion
    function checkLoginStatus() {
        // Récupération du token et du rôle depuis sessionStorage
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');

        // Vérification de l'existence du token
        if (token) {
            // Modification du texte du lien en 'logout' et ajout d'un gestionnaire d'événement
            loginLink.textContent = 'logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', function(event) {
                // Empêcher le comportement par défaut du lien
                event.preventDefault();
                // Suppression du token et du rôle de sessionStorage
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('role');
                // Modification du texte du lien en 'login' et redirection vers la page de connexion
                loginLink.textContent = 'login';
                loginLink.href = 'login.html';
                window.location.href = 'login.html';
            });

            // Code supplémentaire pour les administrateurs
            if (role === 'admin') {
                // Création et ajout du lien vers le panneau d'administration
                const adminPanelLink = document.createElement('a');
                adminPanelLink.href = 'admin_panel.html';
                adminPanelLink.textContent = 'Admin Panel';
                document.querySelector('nav ul').appendChild(adminPanelLink);
            }
        } else {
            // Si le token n'existe pas, définition du texte du lien en 'login' et lien vers la page de connexion
            loginLink.textContent = 'login';
            loginLink.href = 'login.html';
        }    
    }

    // Appel de la fonction de vérification du statut de connexion
    checkLoginStatus();

    // Vérification de la présence du token dans sessionStorage
    let token = sessionStorage.getItem('token');
    if (token) {
        // Si le token existe, l'utilisateur est connecté
        const modifyLink = document.getElementById('modify-link');
        if (modifyLink) {
            // Rendre le bouton visible
            modifyLink.style.display = 'inline-block';
        }
    }
});






