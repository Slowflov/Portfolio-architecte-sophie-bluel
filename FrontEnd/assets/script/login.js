document.addEventListener('DOMContentLoaded', function() {
    // Recherche du formulaire de connexion par ID
    const loginForm = document.getElementById('loginForm');
    // Recherche de l'élément pour afficher les erreurs
    const errorMessage = document.querySelector('.error');
    // Initialisation de la variable logoutButton
    const logoutButton = document.querySelector('#login-link');
    // Récupération du token depuis sessionStorage
    let token = sessionStorage.getItem('token');

    // Vérification de la présence du formulaire de connexion
    if (loginForm) {
        // Ajout d'un gestionnaire d'événement pour l'envoi du formulaire
        loginForm.addEventListener('submit', async function(event) {
            // Empêcher le comportement par défaut du formulaire
            event.preventDefault();

            // Récupération des valeurs email et password du formulaire
            const email = loginForm.elements.email.value;
            const password = loginForm.elements.password.value;

            try {
                // Envoi de la requête au serveur pour la connexion de l'utilisateur
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                // Affichage du message d'erreur en cas de réponse non réussie
                if (!response.ok) {
                    if (response.status === 401) {
                        errorMessage.textContent = 'Identifiant ou mot de passe incorrect';
                    } else {
                        errorMessage.textContent = 'Erreur de connexion. Veuillez réessayer';
                    }
                    errorMessage.hidden = false;
                    return;
                }

                // Analyse de la réponse au format JSON
                const data = await response.json();
                // Sauvegarde du token dans une variable
                token = data.token;
                const role = data.role;
                // Sauvegarde du token et du rôle dans sessionStorage
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('role', role);
                console.log('Token et rôle sauvegardés', token, role);

                // Redirection de l'utilisateur vers la page d'accueil après une connexion réussie
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Erreur lors de la connexion', error);
            }
        });
    } else {
        console.error('Formulaire de connexion non trouvé');
    }

    // Vérification de la présence du token et exécution des fonctions administrateur
    if (token) {
        administrator();
        logoutAdministrator();
    }

    // Vérification de la présence du bouton logout et ajout d'un gestionnaire d'événement
    if (logoutButton) {
        logoutButton.addEventListener("click", handleClickLogout);
    }

    // Fonction de gestion du clic sur le bouton logout
    function handleClickLogout() {
        if (logoutButton.textContent === "login") {
            window.location.href = "./login.html";
        } else if (logoutButton.textContent === "logout") {
            sessionStorage.removeItem('token');
            logoutButton.removeEventListener("click", handleClickLogout);
            window.location.href = "./index.html";
        }
    }

    // Fonction administrateur
    function administrator() {
        if (token) {
            logoutButton.textContent = "logout";
            const linkModals = document.getElementsByClassName("link__modal");
            document.querySelector("header").style.marginTop = "100px";
            for (let i = 0; i < linkModals.length; i++) {
                linkModals[i].style.visibility = "visible";
            }
        }
    }

    // Fonction de déconnexion administrateur
    function logoutAdministrator() {
        const linkModals = document.getElementsByClassName("link__modal");
        if (logoutButton) {
            logoutButton.addEventListener("click", function() {
                if (token) {
                    sessionStorage.removeItem('token');
                    document.getElementById("modal__header").style.visibility = "hidden";
                    for (let i = 0; i < linkModals.length; i++) {
                        linkModals[i].style.visibility = "hidden";
                    }
                }
            });
        }
    }
});
























