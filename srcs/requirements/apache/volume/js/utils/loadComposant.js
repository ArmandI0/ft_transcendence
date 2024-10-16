export async function loadComposant(page)
{
	if (page === 'home' || page === 'charts' || page === 'history')
	{
		const response = await fetch(`pages/navbar.html`);
		if (!response.ok) 
			throw new Error('Network response was not ok');
		const html = await response.text();
		const container = document.getElementById('navbar');
		
		if (container)
			container.innerHTML = html;	
	}
}