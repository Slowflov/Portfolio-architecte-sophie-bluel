document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.querySelector('.error');
    const logoutButton = document.querySelector('#login-link');
    let token = sessionStorage.getItem('token');

    // Проверка аутентификации и скрытие фильтров для аутентифицированных пользователей
    if (token) {
        hideFilters();
        administrator();
        logoutAdministrator();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = loginForm.elements.email.value;
            const password = loginForm.elements.password.value;

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        errorMessage.textContent = 'Identifiant ou mot de passe incorrect';
                    } else {
                        errorMessage.textContent = 'Erreur de connexion. Veuillez réessayer';
                    }
                    errorMessage.hidden = false;
                    return;
                }

                const data = await response.json();
                token = data.token;
                const role = data.role;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('role', role);
                console.log('Token et rôle sauvegardés', token, role);

                window.location.href = 'index.html';
            } catch (error) {
                console.error('Erreur lors de la connexion', error);
            }
        });
    } else {
        console.error('Formulaire de connexion non trouvé');
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", handleClickLogout);
    }

    function handleClickLogout() {
        if (logoutButton.textContent === "login") {
            window.location.href = "./login.html";
        } else if (logoutButton.textContent === "logout") {
            sessionStorage.removeItem('token');
            logoutButton.removeEventListener("click", handleClickLogout);
            window.location.href = "./index.html";
        }
    }

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

    function hideFilters() {
        const filters = document.querySelector('.filters');
        if (filters) {
            filters.style.display = 'none';
        }
    }
});

























