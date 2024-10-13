let game_run = false;
let ia = false;
let isPaused = true;
let tournamentMod = false;
let tournamentInProgress = false;
let paramSectionVisible = false;
let tutoSectionVisible = false;
let isPower = false;
let isAnimating = false;
let player1Power = false;
let player2Power = false;
let isCardClickable = true;
let tournamentCard = false;
let isCoop = false;

// utiliser fonction match

export function getStatus(name_var)
{
	if (name_var === 'game_run')
		return game_run;
	if (name_var === 'ia')
		return ia;
	if (name_var === 'isPaused')
		return isPaused;
	if (name_var === 'tournamentMod')
		return tournamentMod;
	if(name_var === 'tournamentInProgress')
		return tournamentInProgress;
	if (name_var === 'paramSectionVisible')
		return paramSectionVisible;
	if (name_var === 'tutoSectionVisible')
		return tutoSectionVisible;
	if (name_var === 'isPower')
		return isPower;
	if (name_var === 'isAnimating')
		return isAnimating;
	if (name_var === 'player1Power')
		return player1Power;
	if (name_var === 'player2Power')
		return player2Power;
	if (name_var === 'isCardClickable')
		return isCardClickable;
	if (name_var === 'tournamentCard')
		return tournamentCard;
	if (name_var === 'isCoop')
		return isCoop;
}

export function setStatus(name_var, status)
{
	if (name_var === 'game_run')
		game_run = status;
	else if (name_var === 'ia')
		ia = status;
	else if (name_var === 'isPaused')
		isPaused = status;
	else if (name_var === 'tournamentMod')
		tournamentMod = status;
	else if (name_var === 'tournamentInProgress')
		tournamentInProgress = status;
	else if (name_var === 'paramSectionVisible')
		paramSectionVisible = status;
	else if (name_var === 'tutoSectionVisible')
		tutoSectionVisible = status;
	else if (name_var === 'isPower')
		isPower = status;
	else if (name_var === 'isAnimating')
		isAnimating = status;
	else if (name_var === 'player1Power')
		player1Power = status;
	else if (name_var === 'player2Power')
		player2Power = status;
	else if (name_var === 'isCardClickable')
		isCardClickable = status;
	else if (name_var === 'tournamentCard')
		tournamentCard = status;
	else if (name_var === 'isCoop')
		isCoop = status;
}
