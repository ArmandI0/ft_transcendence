import { getCookie } from "./htmlRequest.js";

function handleCode(code) 
{
	const url = `/accounts/api42?code=${code}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log('Réponse du backend:', data.login);
			sessionStorage.setItem("username", data.login);
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

export async function logout() 
{
    try 
    {
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
    } 
    catch (error) 
    {
        return false;
    }
}