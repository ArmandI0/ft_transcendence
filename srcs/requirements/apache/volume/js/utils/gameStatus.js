let game_run = false;
let ia = false;
let isPaused = false;
let tournamentMod = false;
let tournamentInProgress = false;
let paramSectionVisible = false;
let tutoSectionVisible = false;

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
}
