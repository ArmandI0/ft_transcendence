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
let FirstCall = true;
let id = -1;
let namePlayer2 = "Player2";

let avatar3DPlayer1 = 0;
let avatar3DPlayer2 = 0;

export function resetGlobalsVar()
{
	game_run = false;
	ia = false;
	isPaused = true;
	tournamentMod = false;
	tournamentInProgress = false;
	paramSectionVisible = false;
	tutoSectionVisible = false;
	isPower = false;
	isAnimating = false;
	player1Power = false;
	player2Power = false;
	isCardClickable = true;
	tournamentCard = false;
	isCoop = false;
	FirstCall = true;
	id = -1;
	namePlayer2 = "Player2";
	avatar3DPlayer1 = 0;
	avatar3DPlayer2 = 0;	
}

export function getAvatarType(player)
{
	if (player === 1)
		return avatar3DPlayer1;
	else
		return avatar3DPlayer2;
}

export function setAvatarType(player, type)
{
	if (player === 1)
		avatar3DPlayer1 = type;
	else
		avatar3DPlayer2 = type;
}

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
	if (name_var === 'namePlayer2')
		return namePlayer2;
	if (name_var === 'tournamentCard')
		return tournamentCard;
	if (name_var === 'isCoop')
		return isCoop;
	if (name_var === 'FirstCall')
		return FirstCall;
	if (name_var === id)
		return id;
}

export function setStatus(name_var, status)
{
	if (name_var === 'game_run')
	{
		console.log(`game_run variable : ${status}`);
		game_run = status;
	}
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
	else if (name_var === 'namePlayer2')
		namePlayer2 = status;
	else if (name_var === 'tournamentCard')
		tournamentCard = status;
	else if (name_var === 'isCoop')
		isCoop = status;
	else if (name_var === 'FirstCall')
		FirstCall = status;
	else if (name_var = id)
		id = status;
}

