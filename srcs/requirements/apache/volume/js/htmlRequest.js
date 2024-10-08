import {loadEventListeners} from './utils/loadEventListeners.js';
import {loadComposant} from './utils/loadComposant.js';
import {loadCss, loadHtml, loadScript} from './utils/loadPage.js';
import * as gameStatus from './utils/gameStatus.js' ;
import { launchFunctions } from './utils/launchFunctions.js';

export function getCookie(name)
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
		console.log('Success :', data.message);
		return true
	}
	else
	{
		return false;
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
	let historyNav = JSON.parse(localStorage.getItem('historyNav')) || [{ page: 'home', div: 'app' }];
	const actualState = historyNav[historyNav.length];

	const actualPage = actualState.page;
	const actualDiv = actualState.Div;

	loadPage(actualPage, actualDiv);

	window.addEventListener('popstate', (event) => {
		const prevState = historyNav.length > 0 ? historyNav[historyNav.length - 1] : null;
		if (prevState === null)
		{
			const prevPage = prevState.page;
			const prevDiv = prevState.Div;
			loadPage(prevPage, prevDiv);
		}
		else
			loadPage('home', 'div');
	});

	document.body.addEventListener('click', async (event) => {
		if (event.target.matches('a'))
		{
			event.preventDefault();
			const href = event.target.getAttribute('href');
			const div = event.target.getAttribute('div');
			currentPage = href.substring(1);



			let state = await loadPage(href.substring(1), div);
			if(state)
			{
				historyStack.push({ page: href.substring(1), div: div });
				localStorage.setItem('lastPage', href.substring(1));
            	localStorage.setItem('lastDiv', div);
				window.history.pushState({ page: currentPage }, '', href);
			}
			gameStatus.setStatus('game_run', false);
		}
	});
});
