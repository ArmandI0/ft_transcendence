import { hideSection, showSection } from './showAndHideSections.js';
import { startGame3D } from '../pong3D.js';
import { handleAPI42return } from '../home.js';
import { resetVisualizerTournament, resetPower, startPong, startTournament } from "../pong.js";
import * as gameStatus from './gameStatus.js' ;
import { setGameTypeData, setSetSize } from './utils_charts.js';
import { generateCharts } from '../charts.js';
import { slideInRodgerLogo, slideInRolandLogo } from './pongAnim.js';
import { startGame, validatePlayers, setNames, resetCardGame, checkWin, compareValue, returnFlippedCards} from '../card.js'
import { cardData } from '../card.js';
import { dataPostTournament, setTournament } from "./SendGameData.js";
import { getCurrentFormattedDate } from "./SendDataHandle.js";
import { setBordersAvatar} from './avatars.js';

export async function loadEventListeners(page)
{
	if (page === 'pong3D')
	{
		document.getElementById('button-start-pong-3D').addEventListener('click', function() 
		{
			if (gameStatus.getStatus('ia') ===  true)
				{
					document.getElementById('grid-3d-render').style.display = 'flex';
					hideSection('pong3d-separator');
					hideSection('view-player2');
				}
			else
				document.getElementById('panel-3d-render').style.display = 'flex';
			hideSection('button-start-pong-3D');
			startGame3D();
		});		
	}
	else if (page === 'pong3D_menu')
	{
		document.getElementById('button-start-pong-3D-2p').addEventListener('click', function() 
		{
			gameStatus.setStatus('ia', false);
			showSection('player2-field-name');
			setBordersAvatar(this, 0);
		});
		document.getElementById('button-start-pong-3D-1p').addEventListener('click', function() 
		{
			gameStatus.setStatus('ia', true);
			hideSection('player2-field-name');
			setBordersAvatar(this, 0);
		});
		document.getElementById('customization-pong-1-player-1').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(1, 0);
			setBordersAvatar(this, 1);
		});
		document.getElementById('customization-pong-2-player-1').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(1, 1);
			setBordersAvatar(this, 1);
		});
		document.getElementById('customization-pong-3-player-1').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(1, 2);
			setBordersAvatar(this, 1);
		});
		document.getElementById('customization-pong-4-player-1').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(1, 3);
			setBordersAvatar(this, 1);
		});
		document.getElementById('customization-pong-1-player-2').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(2, 0);
			setBordersAvatar(this, 2);
		});
		document.getElementById('customization-pong-2-player-2').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(2, 1);
			setBordersAvatar(this, 2);
		});
		document.getElementById('customization-pong-3-player-2').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(2, 2);
			setBordersAvatar(this, 2);
		});
		document.getElementById('customization-pong-4-player-2').addEventListener('click', function() 
		{
			gameStatus.setAvatarType(2, 3);
			setBordersAvatar(this, 2);
		});				
		document.getElementById('button-to-game-3d').addEventListener('click', function() {
			let namePlayer2 = document.getElementById("player2-field-name").value;
			gameStatus.setStatus('namePlayer2', namePlayer2);
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

		document.getElementById('button-coop').addEventListener('click', function()
		{
			showSection('Home-pong');
			showSection('player3');
			hideSection('main-menu-buttons-pong');
			showSection('game-container-pong');
			document.getElementById('play-pong').style.display = 'flex';
			gameStatus.setStatus('isCoop', true);
			slideInRodgerLogo();
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
			gameStatus.setStatus('isCoop', false);
			hideSection('player3');
			gameStatus.setStatus('ia', false);
			gameStatus.setStatus('tournamentInProgress', false);
			gameStatus.setStatus('isPaused', true);
			resetPower();
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
		document.getElementById('button-stats-pong').addEventListener('click', function() {
			setGameTypeData("RollandGapong");
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
	
	}
	else if (page === 'card')
	{
		
		['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'].forEach(cardId => {
			const cardElement = document.getElementById(cardId);
			
			if (cardElement) {
				cardElement.addEventListener('click', function() {
					if (cardData.flippedCards.length < 2 && gameStatus.getStatus('isCardClickable')) {
						this.classList.toggle('card-front');
						this.classList.toggle('card-back');
						cardData.flippedCards.push(this);
		
						if (cardData.flippedCards.length === 2) {
							if (compareValue() === 0) {
								setTimeout(returnFlippedCards, 500);
							} else {
								cardData.flippedCards.forEach(card => {
									card.classList.add('hidden');
								});
								checkWin();
								cardData.flippedCards = [];
							}
						}
					}
				});
			}
		});

		document.getElementById('button-1player').addEventListener('click', function() 
		{
			hideSection('main-menu-buttons-card');
			showSection('hide-game-container');
			showSection('Home');
			document.getElementById('start').style.display = 'flex';
		});

		document.getElementById('button-tournament-card').addEventListener('click', function() 
		{
			hideSection('main-menu-buttons-card');
			showSection('tournament-container-card');
			showSection('Home');
		});

		document.getElementById('start').addEventListener('click', function() 
		{
			resetCardGame();
			startGame();
			document.getElementById('start').style.display = 'none';
		});

		document.getElementById('Parameters').addEventListener('click', function() {
			const isSectionVisible = gameStatus.getStatus('paramSectionVisible');
			
			const section = document.getElementById('select-param');

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

		document.querySelectorAll('.btn-custom4-card').forEach(button => {
			button.addEventListener('click', function() {
				document.querySelectorAll('.btn-custom4-card').forEach(btn => {
					btn.classList.remove('selected');
					btn.classList.add('not-selected');
				});
				
				this.classList.add('selected');
				this.classList.remove('not-selected');
			});
		});

		document.querySelectorAll('.btn-custom5-card').forEach(button => {
			button.addEventListener('click', function() {

				if (this.classList.contains('selected')) {
					gameStatus.setStatus('isPower', false);
					this.classList.remove('selected');
					this.classList.add('not-selected');
				} else {
					gameStatus.setStatus('isPower', true);
					document.querySelectorAll('.btn-custom5-card').forEach(btn => {
						btn.classList.remove('selected');
						btn.classList.add('not-selected');
					});

					this.classList.add('selected');
					this.classList.remove('not-selected');
				}
			});
		});

		document.getElementById('white').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');

			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = 'white';
			}
			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = 'white';
			}
		});

		document.getElementById('grey').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');

			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = 'grey';
			}
			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = 'grey';
			}
		});

		document.getElementById('blue').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');

			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = 'lightblue';
			}
			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = 'lightblue';
			}
		});

		document.getElementById('yellow').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');
			
			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = '#FFFFE0';
			}
			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = '#FFFFE0';
			}
		});

		document.getElementById('Home').addEventListener('click', function()
		{
			resetCardGame();
			gameStatus.setStatus('isPower', false);
			hideSection('tournament-visualizer-card-final');
			hideSection('hide-game-container');
			hideSection('tournament-container-card');
			hideSection('tournament-visualizer-card');
			hideSection('Home');
			showSection('main-menu-buttons-card');
		});

		document.getElementById('play-tournament').addEventListener('click', function() 
		{
			const inputElements = document.querySelectorAll('.form-control');
			cardData.PlayersCard.length = 0;
			for (let i = 0; i < inputElements.length && i < 4; i++)
				cardData.PlayersCard.push(inputElements[i].value);

			if (validatePlayers(cardData.PlayersCard)) 
			{
				hideSection('tournament-container-card');
				showSection('hide-game-container');
				showSection('tournament-visualizer-card');
				setNames();

				// lancement du tournoi
				gameStatus.setStatus('tournamentCard', true);        
				dataPostTournament.date = getCurrentFormattedDate();
				dataPostTournament.game_type = 'CardGame';
				gameStatus.setStatus('id', setTournament());
			} 
			else 
			{
				alert('Please enter 4 unique player (3-10 caracters)');
			}
			document.getElementById('start').style.display = 'flex';
		});
	}
	else if (page === 'card')
	{
		
		['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'].forEach(cardId => {
			const cardElement = document.getElementById(cardId);
			
			if (cardElement) {
				cardElement.addEventListener('click', function() {
					if (cardData.flippedCards.length < 2 && gameStatus.getStatus('isCardClickable')) {
						this.classList.toggle('card-front');
						this.classList.toggle('card-back');
						cardData.flippedCards.push(this);
		
						if (cardData.flippedCards.length === 2) {
							if (compareValue() === 0) {
								setTimeout(returnFlippedCards, 500);
							} else {
								cardData.flippedCards.forEach(card => {
									card.classList.add('hidden');
								});
								checkWin();
								cardData.flippedCards = [];
							}
						}
					}
				});
			}
		});

		document.getElementById('button-1player').addEventListener('click', function() 
		{
			hideSection('main-menu-buttons-card');
			showSection('hide-game-container');
			showSection('Home');
			document.getElementById('start').style.display = 'flex';
		});

		document.getElementById('button-tournament-card').addEventListener('click', function() 
		{
			hideSection('main-menu-buttons-card');
			showSection('tournament-container-card');
			showSection('Home');
		});

		document.getElementById('start').addEventListener('click', function() 
		{
			resetCardGame();
			startGame();
			document.getElementById('start').style.display = 'none';
		});

		document.getElementById('Parameters').addEventListener('click', function() {
			const isSectionVisible = gameStatus.getStatus('paramSectionVisible');
			
			const section = document.getElementById('select-param');

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

		document.querySelectorAll('.btn-custom4-card').forEach(button => {
			button.addEventListener('click', function() {
				document.querySelectorAll('.btn-custom4-card').forEach(btn => {
					btn.classList.remove('selected');
					btn.classList.add('not-selected');
				});
				
				this.classList.add('selected');
				this.classList.remove('not-selected');
			});
		});

		document.querySelectorAll('.btn-custom5-card').forEach(button => {
			button.addEventListener('click', function() {

				if (this.classList.contains('selected')) {
					gameStatus.setStatus('isPower', false);
					this.classList.remove('selected');
					this.classList.add('not-selected');
				} else {
					gameStatus.setStatus('isPower', true);
					document.querySelectorAll('.btn-custom5-card').forEach(btn => {
						btn.classList.remove('selected');
						btn.classList.add('not-selected');
					});

					this.classList.add('selected');
					this.classList.remove('not-selected');
				}
			});
		});

		document.getElementById('white').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');

			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = 'white';
			}
			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = 'white';
			}
		});

		document.getElementById('grey').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');

			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = 'grey';
			}
			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = 'grey';
			}
		});

		document.getElementById('blue').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');

			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = 'lightblue';
			}
			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = 'lightblue';
			}
		});

		document.getElementById('yellow').addEventListener('click', function() {
			const cardBacks = document.getElementsByClassName('card-back');
			const cardFronts = document.getElementsByClassName('card-front');
			
			for (let i = 0; i < cardFronts.length; i++) {
				cardFronts[i].style.backgroundColor = '#FFFFE0';
			}
			for (let i = 0; i < cardBacks.length; i++) {
				cardBacks[i].style.backgroundColor = '#FFFFE0';
			}
		});

		document.getElementById('Home').addEventListener('click', function()
		{
			resetCardGame();
			gameStatus.setStatus('isPower', false);
			hideSection('tournament-visualizer-card-final');
			hideSection('hide-game-container');
			hideSection('tournament-container-card');
			hideSection('tournament-visualizer-card');
			hideSection('Home');
			showSection('main-menu-buttons-card');
		});

		document.getElementById('play-tournament').addEventListener('click', function() 
		{
			const inputElements = document.querySelectorAll('.form-control');
			cardData.PlayersCard.length = 0;
			for (let i = 0; i < inputElements.length && i < 4; i++)
				cardData.PlayersCard.push(inputElements[i].value);

			if (validatePlayers(cardData.PlayersCard)) 
			{
				hideSection('tournament-container-card');
				showSection('hide-game-container');
				showSection('tournament-visualizer-card');
				setNames();

				// lancement du tournoi
				gameStatus.setStatus('tournamentCard', true);        
				dataPostTournament.date = getCurrentFormattedDate();
				dataPostTournament.game_type = 'CardGame';
				gameStatus.setStatus('id', setTournament());
			} 
			else 
			{
				alert('Please enter 4 unique player (3-10 caracters)');
			}
			document.getElementById('start').style.display = 'flex';
		});
	}
}

export async function removeEventListeners(page)
{

}

