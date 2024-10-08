import { hideSection, showSection } from './showAndHideSections.js';
import { startGame3D } from '../pong3D.js';
import { handleAPI42return } from '../home.js';
import { resetVisualizerTournament, startPong } from "../pong.js";
import { startTournament } from "../pong.js";
import * as gameStatus from './gameStatus.js' ;

let isAnimating = false;

function slideInRodgerLogo()
{
    const rolandLogo = document.getElementById('rolandLogo');
    const rodgerLogo = document.getElementById('rodgerLogo');

    if (!isAnimating)
	{
        isAnimating = true; // Définir l'état de l'animation

        // Réinitialiser les classes d'animation
        rolandLogo.classList.remove('slide-right-roland');
        rodgerLogo.classList.remove('slide-left');

        // Forcer un reflow pour que les classes soient effectivement retirées
        void rolandLogo.offsetWidth;

        rolandLogo.classList.add('slide-right-roland');

        // Attendre la fin de l'animation pour changer l'overlay
        setTimeout(() => {
            rolandLogo.classList.remove('slide-right-roland');
            rolandLogo.style.display = 'none';
            rodgerLogo.style.display = 'flex';

            setTimeout(() => {
                rodgerLogo.classList.add('slide-left');
                isAnimating = false;
            }, 500);
        }, 500);
    }
}

function slideInRolandLogo()
{
    const rolandLogo = document.getElementById('rolandLogo');
    const rodgerLogo = document.getElementById('rodgerLogo');

    if (!isAnimating)
	{
        isAnimating = true;

        // Réinitialiser les classes d'animation
        rodgerLogo.classList.remove('slide-right');
        rolandLogo.classList.remove('slide-left-roland');

        // Forcer un reflow pour que les classes soient effectivement retirées
        void rodgerLogo.offsetWidth;

		rolandLogo.style.top = '0';
		rolandLogo.style.left = '140%';

        rodgerLogo.classList.add('slide-right');

        // Attendre la fin de l'animation pour changer l'overlay
        setTimeout(() => {
            rodgerLogo.classList.remove('slide-right');
            rodgerLogo.style.display = 'none';
            rolandLogo.style.display = 'flex';

            setTimeout(() => {
                rolandLogo.classList.add('slide-left-roland');
                isAnimating = false;
            }, 500);
        }, 500); 
    }
}

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
			window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e7eec0078c1ebf1f2c748a722b939725a58fb11846625ae5893e337c098104f7&redirect_uri=https%3A%2F%2Flocalhost&response_type=code';
		});	

		const url_params = new URLSearchParams(window.location.search);
		handleAPI42return(url_params);
		
	}
	else if (page === 'pong')
	{
		document.querySelectorAll('.btn-custom4-pong').forEach(button => {
			button.addEventListener('click', function() {
				document.querySelectorAll('.btn-custom4-pong').forEach(btn => {
					btn.classList.remove('selected');
					btn.classList.add('not-selected');
				});
				
				this.classList.add('selected');
				this.classList.remove('not-selected');
			});
		});

		document.querySelectorAll('.btn-custom6-pong').forEach(button => {
			button.addEventListener('click', function() {
				if (gameStatus.getStatus('isPaused'))
				{
					if (this.classList.contains('selected')) {
						gameStatus.setStatus('isPower', false);
						this.classList.remove('selected');
						this.classList.add('not-selected');
					} else {
						gameStatus.setStatus('isPower', true);
						document.querySelectorAll('.btn-custom6-pong').forEach(btn => {
							btn.classList.remove('selected');
							btn.classList.add('not-selected');
						});
			
						this.classList.add('selected');
						this.classList.remove('not-selected');
					}
				}
			});
		});

		document.querySelectorAll('.btn-custom5-pong').forEach(button => {
			button.addEventListener('click', function() {
				if (this.classList.contains('selected')) {
					this.classList.remove('selected');
					this.classList.add('not-selected');
				} else {
					document.querySelectorAll('.btn-custom5-pong').forEach(btn => {
						btn.classList.remove('selected');
						btn.classList.add('not-selected');
					});
		
					this.classList.add('selected');
					this.classList.remove('not-selected');
				}
				const isSectionVisible = gameStatus.getStatus('tutoSectionVisible');
			
				const section = document.getElementById('tuto-container');
			
				if (isSectionVisible) 
				{
					section.classList.remove('show');
					setTimeout(() => {
						section.style.display = 'none';
					}, 500);
				}
				else
				{
					section.style.display = 'flex'; 
					setTimeout(() => {
						section.classList.add('show');
					}, 100);
				}
				gameStatus.setStatus('tutoSectionVisible', !isSectionVisible);
			});
		});

		document.getElementById('button-1v1').addEventListener('click', function()
		{
			showSection('Home-pong');
			hideSection('main-menu-buttons-pong');
			showSection('game-container-pong');
			document.getElementById('play-pong').style.display = 'flex';
			slideInRodgerLogo();
		});
		
		document.getElementById('button-ia').addEventListener('click', function() 
		{
			showSection('Home-pong');
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
			
			const section = document.getElementById('select-chelem');
		
			if (isSectionVisible) 
			{
				section.classList.remove('show');
				setTimeout(() => {
					section.style.display = 'none';
				}, 500);
			}
			else
			{
				section.style.display = 'flex'; 
				setTimeout(() => {
					section.classList.add('show');
				}, 10);
			}
			
			gameStatus.setStatus('paramSectionVisible', !isSectionVisible);
		});
		

		document.getElementById('button-tournament-pong').addEventListener('click', function() 
		{
			showSection('Home-pong');
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
			gameStatus.setStatus('isPaused', true);
			resetVisualizerTournament();
			hideSection('ball');
			showSection('main-menu-buttons-pong');
			hideSection('game-container-pong');
			hideSection('tournament-container-pong');
			hideSection('tournament-visualizer-pong');
			slideInRolandLogo();
			hideSection('Home-pong');
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
		
	}
}

export async function removeEventListeners(page)
{

}

