import { getCookie } from "./htmlRequest.js";
import { is_auth } from "./htmlRequest.js";
function handleCode(code) 
{
	const url = `/accounts/api42?code=${code}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			updateLoginButton();
		})
		.catch((error) => {
		});
}

export async function handleAPI42return(url)
{
	if (url.has('code'))
	{
		const code = url.get('code');
		let data = handleCode(code);
		history.replaceState({page : 'home', div : 'app'}, 'home', '');
	}
}

export async function updateLoginButton() {
    const button = document.getElementById('button_to_42api');
    if (!button) return;

    let isLogged = await is_auth();
    if (isLogged) {
        button.textContent = 'Logout';
        button.classList.add('logged-in');
        button.removeEventListener('click', redirectTo42API);
        button.addEventListener('click', handleLogout);
    } else {
        button.textContent = 'Login with 42 API';
        button.classList.remove('logged-in');
        button.removeEventListener('click', handleLogout);
        button.addEventListener('click', redirectTo42API);
    }
}

export async function handleLogout() {
    await logout();
    updateLoginButton();
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
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

function redirectTo42API() {
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e7eec0078c1ebf1f2c748a722b939725a58fb11846625ae5893e337c098104f7&redirect_uri=https%3A%2F%2Flocalhost&response_type=code';
}

export async function initHomePage() {
    await updateLoginButton();

    const urlParams = new URLSearchParams(window.location.search);
    await handleAPI42return(urlParams);
}