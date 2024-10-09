
function handleCode(code) 
{
	const url = `/accounts/api42?code=${code}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log('Data from 42 received');
		})
		.catch((error) => {
			console.error('Erreur:', error);
		});
}

function updateUrlWindow(newUrl) 
{
	window.history.pushState({page : 'home', div : 'app'}, 'home', '');
}

export function handleAPI42return(url)
{
	if (url.has('code'))
	{
		const code = url.get('code');
		handleCode(code);
		const new_url = window.location.origin + window.location.pathname;
		// updateUrlWindow(new_url);
		history.replaceState({page : 'home', div : 'app'}, 'home', window.location.pathname);
	}
}

