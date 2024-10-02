let game_run = false;
let ia = false;
let GamePaused = false;
let tournamentMod = false;

export function getStatus(name_var)
{
	if (name_var === 'game_run')
		return game_run;
	if (name_var === 'ia')
		return ia;
	if (name_var === 'GamePaused')
		return GamePaused;
	if (name_var === 'tournamentMod')
		return tournamentMod;
}

export function setStatus(name_var, status)
{
	if (name_var === 'game_run')
		game_run = status;
	if (name_var === 'ia')
		ia = status;
	if (name_var === 'GamePaused')
		GamePaused = status;
	if (name_var === 'tournamentMod')
		tournamentMod = status;
}
