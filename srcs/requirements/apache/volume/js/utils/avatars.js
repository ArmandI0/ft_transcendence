import { getAvatarType, getStatus } from "./gameStatus.js";

export function setBordersAvatar(element, player)
{
	if (player === 0)
	{
		document.getElementById('button-start-pong-3D-1p').style.border = "";       
		document.getElementById('button-start-pong-3D-2p').style.border = "";    
		element.style.border =    "solid 4px rgb(255, 128, 65)";
	}
	else
	{
		for (let i = 1; i <=4; i++)
			{
				let div_id = `customization-pong-${i}-player-${player}`;
				document.getElementById(div_id).style.border = "";
			}
			if (player === 1)
				element.style.border = "solid 4px rgb(255, 0, 0)";
			else
				element.style.border = "solid 4px rgb(50, 50, 255)";
	}
}

export function setBordersAvatarDefault()
{
	if (getStatus('ia'))
		document.getElementById('button-start-pong-3D-1p').style.border = "solid 4px rgb(255, 128, 65)";
	else
		document.getElementById('button-start-pong-3D-2p').style.border = "solid 4px rgb(255, 128, 65)";
	const type1 = 1 + getAvatarType(1);
	const type2 = 1 + getAvatarType(2);
	let div_id_av1 = `customization-pong-${type1}-player-1`;
	let div_id_av2 = `customization-pong-${type2}-player-2`;
	document.getElementById(div_id_av1).style.border = "solid 4px rgb(255, 0, 0)";
	document.getElementById(div_id_av2).style.border = "solid 4px rgb(50, 50, 255)";
}