import { hideSection, showSection } from './showAndHideSections.js';
import { startGame3D } from '../pong3D.js';
import { handleAPI42return } from '../home.js';
import { startPong } from "../pong.js";
import { startTournament } from "../pong.js";
import * as gameStatus from './gameStatus.js' ;

export async function loadEventListeners(page)
{
	if (page === 'pong3D')
	{
		document.getElementById('button-start-pong-3D').addEventListener('click', function() 
		{
			hideSection('button-start-pong-3D');
			document.getElementById('grid-3d-render').style.display = 'grid';
			startGame3D();
		});

	}
	else if (page === 'home')
	{
		document.getElementById('button_to_42api').addEventListener('click', async function() 
		{
			window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e7eec0078c1ebf1f2c748a722b939725a58fb11846625ae5893e337c098104f7&redirect_uri=http%3A%2F%2Flocalhost%3A8070&response_type=code';
		});	

		const url_params = new URLSearchParams(window.location.search);
		handleAPI42return(url_params);
	}
	else if (page === 'pong')
	{
		document.getElementById('button-1v1').addEventListener('click', function() 
		{
			hideSection('main-menu-buttons-pong');
			showSection('game-container-pong');
			showSection('select-chelem');
			document.getElementById('play-pong').style.display = 'flex';
		});

		document.getElementById('button-ia').addEventListener('click', function() 
		{
			gameStatus.setStatus('ia', true);
			hideSection('main-menu-buttons-pong');
			showSection('game-container-pong');
			showSection('select-chelem');
			document.getElementById('play-pong').style.display = 'flex';
		});

		document.getElementById('play-pong').addEventListener('click', function()
		{
			startPong();
			document.getElementById('play-pong').style.display = 'none';
		});

		document.getElementById('button-tournament-pong').addEventListener('click', function() 
		{
			hideSection('main-menu-buttons-pong');
			showSection('tournament-container-pong');
			showSection('select-chelem');
		});

		document.getElementById('play-tournament-pong').addEventListener('click', function() 
		{
			gameStatus.setStatus('tournamentMod', true);
			startTournament();
		});

		document.getElementById('Home-pong').addEventListener('click', function()
		{
			gameStatus.setStatus('ia', false);
			hideSection('ball');
			hideSection('select-chelem');
			showSection('main-menu-buttons-pong');
			hideSection('game-container-pong');
			hideSection('tournament-container-pong');
			hideSection('tournament-visualizer-pong');
		});

		document.getElementById('wimbledon').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'green';
			document.getElementById('tournament-winner-pong').style.color = 'purple';
		});

		document.getElementById('usOpen').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'purple';
			document.getElementById('tournament-winner-pong').style.color = 'yellow';
		});

		document.getElementById('asOpen').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'blue';
			document.getElementById('tournament-winner-pong').style.color = 'yellow';
		});

		document.getElementById('Roland').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'rgba(210, 105, 30, 0.8)';
			document.getElementById('tournament-winner-pong').style.color = 'white';
		});
	}
}

export async function removeEventListeners(page)
{

}