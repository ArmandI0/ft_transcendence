import { hideSection, showSection } from './showAndHideSections.js';
import { startGame3D } from '../pong3D.js';
import { handleAPI42return } from '../home.js';
import { startPong, startTournament } from "../pong.js";
import * as gameStatus from './gameStatus.js' ;
import { setGameTypeData, setSetSize } from './utils_charts.js';
import { generateCharts } from '../charts.js';

export async function loadEventListeners(page)
{
	if (page === 'pong3D')
	{
		document.getElementById('button-start-pong-3D-2p').addEventListener('click', function() 
		{
			hideSection('button-start-pong-3D-2p');
			hideSection('button-start-pong-3D-1p');
			document.getElementById('grid-3d-render').style.display = 'grid';
			startGame3D();
		});
		document.getElementById('button-start-pong-3D-1p').addEventListener('click', function() 
		{
			hideSection('button-start-pong-3D-2p');
			hideSection('button-start-pong-3D-1p');
			gameStatus.setStatus('ia', true);
			document.getElementById('grid-3d-render').style.display = 'flex';
			hideSection('pong3d-separator');
			hideSection('view-player2');
			startGame3D();
		});		

	}
	else if (page === 'home')
	{
		document.getElementById('button_to_42api').addEventListener('click', async function() 
		{
			window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e7eec0078c1ebf1f2c748a722b939725a58fb11846625ae5893e337c098104f7&redirect_uri=https%3A%2F%2Flocalhost&response_type=code';
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
			document.getElementById('play-pong').style.display = 'flex';
		});

		document.getElementById('button-ia').addEventListener('click', function() 
		{
			gameStatus.setStatus('ia', true);
			hideSection('main-menu-buttons-pong');
			showSection('game-container-pong');

			document.getElementById('play-pong').style.display = 'flex';
		});

		document.getElementById('play-pong').addEventListener('click', function()
		{
			startPong();
			document.getElementById('play-pong').style.display = 'none';
		});

		document.getElementById('Parameters').addEventListener('click', function() {
			const isSectionVisible = gameStatus.getStatus('paramSectionVisible');
		
			if (isSectionVisible)
			{
				hideSection('select-chelem');
			}
			else
			{
				showSection('select-chelem');
			}
		
			gameStatus.setStatus('paramSectionVisible', !isSectionVisible); // Inverser l'état de la section
		});

		document.getElementById('button-tournament-pong').addEventListener('click', function() 
		{
			hideSection('main-menu-buttons-pong');
			showSection('tournament-container-pong');
		});

		document.getElementById('play-tournament-pong').addEventListener('click', function() 
		{
			gameStatus.setStatus('tournamentMod', true);
			startTournament();
		});

		document.getElementById('Home-pong').addEventListener('click', function()
		{
			gameStatus.setStatus('ia', false);
			gameStatus.setStatus('tournamentInProgress', false);
			hideSection('ball');
			showSection('main-menu-buttons-pong');
			hideSection('game-container-pong');
			hideSection('tournament-container-pong');
			hideSection('tournament-visualizer-pong');
		});

		document.getElementById('wimbledon').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
			document.getElementById('tournament-winner-pong').style.color = 'purple';
		});

		document.getElementById('usOpen').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'rgba(128, 0, 128, 0.7)';
			document.getElementById('tournament-winner-pong').style.color = 'yellow';
		});

		document.getElementById('asOpen').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
			document.getElementById('tournament-winner-pong').style.color = 'yellow';
		});

		document.getElementById('Roland').addEventListener('click', function() {
			document.getElementById('game-container-pong').style.backgroundColor = 'rgba(210, 105, 30, 0.8)';
			document.getElementById('tournament-winner-pong').style.color = 'white';
		});
	}
	else if (page == 'charts')
	{
		document.getElementById('button-stats-pong').addEventListener('click', function() {
			setGameTypeData("RollangGapong");
			generateCharts();
		});
		document.getElementById('button-stats-cyberpong').addEventListener('click', function() {
			setGameTypeData("Cyberpong");
			generateCharts();
		});	
		document.getElementById('button-stats-cards').addEventListener('click', function() {
			setGameTypeData("Cards");
			generateCharts();
		});	
		document.getElementById('button-stats-groups').addEventListener('click', function() {
			let nb = parseInt(document.getElementById("sets-size-field").value);
			let groupSize;
		
			if (!isNaN(nb) && nb >= 1 && nb <= 100) {
				groupSize = nb;
			} 
			else {
				groupSize = 5;
			}
		
			setSetSize(groupSize);
			generateCharts();
		});
		// document.getElementById('button-stats-groups').addEventListener('keydown', function(event) {
		// 	if (event.key === 'Enter') {
		// 		event.preventDefault();
		// 	}
		// });	
		// document.getElementById('button-stats-groups').addEventListener('keypress', function(event) {
		// 	if (event.key === 'Enter') {
		// 		event.preventDefault();
		// 	}
		// });		
	}
}

export async function removeEventListeners(page)
{

}

