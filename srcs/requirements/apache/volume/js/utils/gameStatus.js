let game_run = false;
let ia = false;

export function getStatus(name_var)
{
	if (name_var === 'game_run')
		return game_run;
	if (name_var === 'ia')
		return ia;
}

export function setStatus(name_var, status)
{
	if (name_var === 'game_run')
		game_run = status;
	if (name_var === 'ia')
		ia = status;
}
