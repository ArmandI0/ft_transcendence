import {loadEventListeners} from './utils/loadEventListeners.js';
import {loadComposant} from './utils/loadComposant.js';
import {loadCss, loadHtml, loadScript} from './utils/loadPage.js';
import * as gameStatus from './utils/gameStatus.js' ;
import { launchFunctions } from './utils/launchFunctions.js';

async function loadPage(page, div) 
{
	const existingStyles = document.querySelectorAll('link[data-page]');
	existingStyles.forEach(link => link.remove());

	if (page) 
		loadCss(page);
	try 
	{
		await loadHtml(page, div);
		await loadComposant(page);
		await loadScript(page);
		await loadEventListeners(page);
		await launchFunctions(page);
	}
	catch (error) 
	{
		console.error('Error fetching the section:', error);
		const container = document.getElementById(div);
		if (container) 
			container.innerHTML = '<div>Error loading page. Please try again.</div>';
	}
}


document.addEventListener('DOMContentLoaded', async () => {
	const app = document.getElementById('app');

	// Chargement initial de la page
	loadPage('home', 'app');

	// SERT aux boutons BACKWARD AND FORWARD
	window.addEventListener('popstate', (event) => {
		const path = window.location.pathname.substring(1) || 'home';
		const divToReplace = event.state || 'app';
		loadPage(path, divToReplace);
	});

	let currentPage = 'home';
	document.body.addEventListener('click', async (event) => {
		if (event.target.matches('a')) {
			event.preventDefault();
			const href = event.target.getAttribute('href');
			console.log(href);
			const div = event.target.getAttribute('div');
			console.log(div);
			//   if (href.substring(1) === currentPage)
			//     return;
			currentPage = href.substring(1); // Met à jour la page actuelle

			window.history.pushState(div, '', href.substring(1));
			gameStatus.setStatus(false);
			await loadPage(href.substring(1), div);
		}
	});
});
