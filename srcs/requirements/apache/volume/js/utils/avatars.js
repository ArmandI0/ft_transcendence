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
