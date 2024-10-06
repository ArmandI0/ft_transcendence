import {loadEventListeners} from './utils/loadEventListeners.js';
import {loadComposant} from './utils/loadComposant.js';
import {loadCss, loadHtml, loadScript} from './utils/loadPage.js';
import * as gameStatus from './utils/gameStatus.js' ;
import { launchFunctions } from './utils/launchFunctions.js';

function getCookie(name)
{
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function is_auth()
{
	const csrfToken = getCookie('csrftoken');
	const response = await fetch('/accounts/is_auth/',
	{
		method: 'GET',
		headers:{
			'X-Requested-With': 'XMLHttpRequest', 
			'X-CSRFToken': csrfToken,
		}
	});
	const data = await response.json();
	if (response.status === 200)
	{
		console.log('Succès :', data.message);
		return true
	}
	else
	{
		return false
	}
}

async function loadPage(page, div) 
{
	let ret = true;

	
	if (page != 'home')
	{
		const isAuthenticated = await is_auth();
		if (!isAuthenticated){
			return;
		}
	}
	const existingStyles = document.querySelectorAll('link[data-page]');
	existingStyles.forEach(link => link.remove());
		
	if (page) 
		loadCss(page);
	try 
	{
		console.log("PAGE = " + page);
		console.log("DIV = " + div);
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
	return ret;
}


document.addEventListener('DOMContentLoaded', async () => {
	const app = document.getElementById('app');

	loadPage('home', 'app');

	// SERT aux boutons BACKWARD AND FORWARD
	window.addEventListener('popstate', (event) => {
		const path = window.location.pathname.substring(1) || 'home';
		const divToReplace = event.state || 'app';
		loadPage(path, divToReplace);
	});

	let currentPage = 'home';
	document.body.addEventListener('click', async (event) => {
		if (event.target.matches('a'))
		{
			event.preventDefault();
			const href = event.target.getAttribute('href');
			const div = event.target.getAttribute('div');
			currentPage = href.substring(1);
			let state = await loadPage(href.substring(1), div);
			if(state)
				window.history.pushState(div, '', href.substring(1));
		}
	});
});
