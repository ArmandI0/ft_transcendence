export function loadCss(page)
{
	if (page) 
	{
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = `css/${page}.css`;
		link.dataset.page = page;
		document.head.appendChild(link);
	}	
}

export async function loadHtml(page,div)
{
	const response = await fetch(`pages/${page}.html`);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	const html = await response.text();
	const container = document.getElementById(div);
	
	if (container) {
		container.innerHTML = html;
	} 
	else
		console.error(`Le conteneur ${div} n'existe pas`);
		
}

export async function loadScript(page) 
{
	const scriptId = `script-${page}`;
	let existingScript = document.getElementById(scriptId);

	if (existingScript) {
	existingScript.remove();
	}

	const script = document.createElement('script');
	script.src = `js/${page}.js`;
	script.id = scriptId;
	script.async = true;
	script.type = 'module';

	return new Promise((resolve) => {
		script.onload = () => {
			resolve();
		};
		script.onerror = () => {
			console.warn(`Le script ${page}.js n'a pas pu être chargé. Aucune erreur retournée.`); 
			resolve();
		};
		document.body.appendChild(script);
	});
}