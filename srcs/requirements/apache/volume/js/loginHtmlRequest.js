document.addEventListener('DOMContentLoaded', function()
{
	document.getElementById('login_button').addEventListener('click', async function() 
	{   
		await showSection('/users/login');
	});
	document.getElementById('register_button').addEventListener('click', async function() 
	{   
		await showSection('/users/register');
	});
	document.getElementById('disconnect_button').addEventListener('click', async function() 
	{   
		await showSection('/users/disconnect');
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
		const container = document.getElementById('game-window');
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
			console.error('Element with ID not found:', 'game-window');
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
            document.getElementById('game-window').innerHTML = `<p>${data.message}</p>`;
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

