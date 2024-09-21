async function showSection(sectionId)
{
    let api;

    if (sectionId === 'card-container')
	    api = '/game/game_card';
	else if (sectionId === 'pong-container')
		api = '/game/game_pong'
    else if (sectionId === 'game-container-3d')
        api = '/game/game_3d';
    else if (sectionId === 'login')
        api = '/users/login';
    else if (sectionId === 'register')
        api = '/users/register';
	else if (sectionId === 'home_button')
		api = '';
    else 
	{
        console.error('Invalid section ID:', sectionId);
        return;
    }

    try
	{
        const response = await fetch(api);
        const html = await response.text();
        const container = document.getElementById(sectionId);
        if (container)
		{
			container.innerHTML = html;
			container.style.display = 'flex';
			container.style.margin = '0';
			container.style.padding = '0';
			container.style.height = '100vh';
			container.style.width = '100vw';
			container.style.overflow = 'hidden';
			
			// Charger dynamiquement les scripts nécessaires
			if (sectionId === 'card-container')
			{
				loadScripts([
					staticFiles.cardGame,
					staticFiles.cardMenuInteracts,
					staticFiles.tournamentCardHandle,
				]);
			}
			else if (sectionId === 'pong-container')
			{
				loadScripts([ staticFiles.pong2D,
					staticFiles.ballMouvement,
					staticFiles.menuInteractsPong,
					staticFiles.tournamentHandlePong,
				]);
			}
			document.getElementById('main-page').style.display = 'none';
        } 
		else
		{
            console.error('Element with ID not found:', sectionId);
        }
    } 
	catch (error)
	{
        console.error('Error fetching data:', error);
    }
}

function loadScripts(scripts)
{
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // Pour s'assurer que les scripts sont exécutés dans l'ordre
        document.body.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', function() {
	
	document.getElementById('button_to_pong').addEventListener('click', async function() 
	{
		await showSection('pong-container');
	});

	document.getElementById('button_to_card').addEventListener('click', async function() 
	{
		await showSection('card-container');
	});
	
	document.getElementById('button_to_3d').addEventListener('click', async function() 
	{
		await showSection('game-container-3d');
	});
	document.getElementById('button_to_login').addEventListener('click', async function() 
	{
		await showSection1('/users/login');
	});
	document.getElementById('button_to_register').addEventListener('click', async function() 
	{
		await showSection1('/users/register');
	});
	document.getElementById('home_button').addEventListener('click', async function() 
	{
		await showSection('home_button');
	});	
});

async function showSection1(url)
{
	try {
		history.pushState({}, '', url);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const html = await response.text();
		const container = document.getElementById('main-grid');
		if (container) {
			container.innerHTML = html;
			
			// Après avoir inséré le HTML, attacher l'événement au formulaire
			const registerForm = document.getElementById('registerForm');
			if (registerForm) {
				registerForm.addEventListener('submit', async function(event) {
					event.preventDefault(); // Empêche le rechargement de la page
					await submitRegistrationForm(registerForm); // Soumet le formulaire via AJAX
				});
			}
		} else {
			console.error('Element with ID not found:', 'main-grid');
		}
	} catch (error) {
		console.error('Error fetching the section:', error);
	}
}

// Fonction pour soumettre le formulaire d'inscription via AJAX
async function submitRegistrationForm(form)
{
    const formData = new FormData(form);  // Récupère les données du formulaire

    try
	{
        const response = await fetch(form.action,
		{
            method: 'POST',
            body: formData,
            headers:{'X-Requested-With' : 'XMLHttpRequest'}// Indique qu'il s'agit d'une requête AJAX 
        });

        const data = await response.json();  // Attend la réponse JSON
        if (response.ok)
		{
            console.log('Succès :', data.message);
            document.getElementById('main-grid').innerHTML = `<p>${data.message}</p>`;
        }
		else
		{
            console.error('Erreurs :', data.errors);
            const errorContainer = document.getElementById('responseMessage');
            if (errorContainer)
			{
                errorContainer.innerHTML = `<p>${data.errors}</p>`;
            }
        }
    }
	catch (error)
	{
        console.error('Erreur lors de la soumission du formulaire :', error);
    }
}


