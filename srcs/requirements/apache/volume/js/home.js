import { getCookie } from "./htmlRequest";

function handleCode(code) 
{
	const url = `/accounts/api42?code=${code}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log('Réponse du backend:', data.login);
		})
		.catch((error) => {
			console.error('Erreur:', error);
		});
}

export function handleAPI42return(url)
{
	if (url.has('code'))
	{
		const code = url.get('code');
		handleCode(code);
		const new_url = window.location.origin + window.location.pathname;
		history.replaceState({page : 'home', div : 'app'}, 'home', window.location.pathname);
	}
}

export async function updateLoginButton()
{
	const button = document.getElementById('button_to_42api');
	let isLogged = await is_auth();
	if (isLogged)
	{
		button.classList.add('logged-in');
		button.textContent = 'Logout';
	}
	else
	{
		button.classList.remove('logged-in');
		button.textContent = 'Login with 42 API';
	}
}

export async function logout()
{
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
		if (response.status === 200)
		{
			console.log('Success :', data.message);
			return true
		}
		else
		{
			return false;
		}
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
        return null;
    }
}
