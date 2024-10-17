import { getCookie } from "./htmlRequest.js";
import { is_auth } from "./htmlRequest.js";
function handleCode(code) 
{
	const url = `/accounts/api42?code=${code}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log('Réponse du backend:', data.login);
			updateLoginButton();
		})
		.catch((error) => {
			console.error('Erreur:', error);
		});
}

export async function handleAPI42return(url)
{
	if (url.has('code'))
	{
		const code = url.get('code');
		let data = handleCode(code);
		history.replaceState({page : 'home', div : 'app'}, 'home', window.location.pathname);
	}
}

export async function updateLoginButton() {
    const button = document.getElementById('button_to_42api');
    if (!button) return; // Si le bouton n'existe pas, arrêter ici

    let isLogged = await is_auth();
    if (isLogged) {
        button.textContent = 'Logout';
        button.classList.add('logged-in');
        button.removeEventListener('click', redirectTo42API); // Supprime l'événement de redirection
        button.addEventListener('click', handleLogout);       // Ajoute l'événement de déconnexion
    } else {
        button.textContent = 'Login with 42 API';
        button.classList.remove('logged-in');
        button.removeEventListener('click', handleLogout);    // Supprime l'événement de déconnexion
        button.addEventListener('click', redirectTo42API);    // Ajoute l'événement de redirection vers l'API 42
    }
}

export async function handleLogout() {
    await logout();          // Appelle la fonction de déconnexion
    updateLoginButton();      // Met à jour le bouton après déconnexion
}

export async function logout() {
    try {
        const csrfToken = getCookie('csrftoken');
        const response = await fetch('/accounts/logout/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            },
        });
        const data = await response.json();
        if (response.status === 200) {
            console.log('Success:', data.message);
            return true;
        } else {
            console.error('Failed to logout');
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return false;
    }
}

function redirectTo42API() {
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e7eec0078c1ebf1f2c748a722b939725a58fb11846625ae5893e337c098104f7&redirect_uri=https%3A%2F%2Flocalhost&response_type=code';
}

// Initialisation du comportement du bouton dans la page 'home'
export async function initHomePage() {
    await updateLoginButton(); // Met à jour le bouton à l'arrivée sur la page

    const urlParams = new URLSearchParams(window.location.search); // Gère le retour de l'API avec le code
    await handleAPI42return(urlParams);
}