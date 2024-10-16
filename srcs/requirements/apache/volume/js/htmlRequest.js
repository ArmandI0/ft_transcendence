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

export async function is_auth()
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
	if (data.logged === true)
	{
		return true
	}
	else
	{
		return false;
	}
}

export async function loadPage(page, div) 
{
	let ret = true;

	if (page != 'home')
	{
		const isAuthenticated = await is_auth();
		if (!isAuthenticated){
			alert("Please log in with the 42 api connector");
			page = 'home';
			div = 'app';
			ret = false
		}
	}
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
		const container = document.getElementById(div);
		if (container) 
			container.innerHTML = '<div>Error loading page. Please try again.</div>';
	}
	return ret;
}

document.addEventListener('DOMContentLoaded', async () => {
	const app = document.getElementById('app');
	const state = history.state;
	if (state)
	{
		await loadPage(state.page, state.div)
	}
	else
	{
		await loadPage('home', 'app');
		window.history.pushState({page : 'home', div : 'app'}, 'home', '');
	}
    window.addEventListener('popstate', async (event) => {
        const state = event.state;

        if (state) {
            const page = state.page; 
            const div = state.div;
            await loadPage(page, div);
        } else {
            await loadPage('home', 'app');
        }
    });
	document.body.addEventListener('click', async (event) => {
		if (event.target.matches('a'))
		{
			event.preventDefault();
			event.stopPropagation()
			const href = event.target.getAttribute('href');
			const div = event.target.getAttribute('div');
			let state = await loadPage(href.substring(1), div);

			if(state)
				window.history.pushState({page : href.substring(1), div : div}, href.substring(1), '');
			else
				window.history.pushState({page : 'home', div : 'app'}, 'home', '');
			gameStatus.setStatus('game_run', false);
		}
	});
});
