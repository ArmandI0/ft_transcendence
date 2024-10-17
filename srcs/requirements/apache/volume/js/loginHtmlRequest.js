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
			
			const registerForm = document.getElementById('registerForm');
			if (registerForm) {
				registerForm.addEventListener('submit', async function(event) {
					event.preventDefault();
					await submitRegistrationForm(registerForm);
				});
			}
		} else {
			console.error('Element with ID not found:', 'game-window');
		}
	} catch (error) {
		console.error('Error fetching the section:', error);
	}
}

async function submitRegistrationForm(form)
{
    const formData = new FormData(form);

    try
	{
        const response = await fetch(form.action,
		{
            method: 'POST',
            body: formData,
            headers:{'X-Requested-With' : 'XMLHttpRequest'}
        });

        const data = await response.json();
        if (response.ok)
		{
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

