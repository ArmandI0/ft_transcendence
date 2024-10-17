
function setLoggedInState(isLoggedIn)
{
    const button = document.getElementById('button_to_42api');
    if (isLoggedIn)
	{
        button.classList.add('logged-in');
        button.textContent = 'Logged In';
    }
	else
	{
        button.classList.remove('logged-in');
        button.textContent = 'Login with 42 API';
    }
}

function handleCode(code) 
{
	const url = `/accounts/api42?code=${code}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log('Réponse du backend:', data.login);
			sessionStorage.setItem("username", data.login);
			setLoggedInState(true);
		})
		.catch((error) => {
			console.error('Erreur:', error);
			setLoggedInState(false);
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
	else
        setLoggedInState(false);
}