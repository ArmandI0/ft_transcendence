import { hideSectionPong, showSectionPong } from './showAndHideSections.js';
import { startGame3D } from '../pong3D.js';
import { handleAPI42return } from '../home.js';

export async function loadEventListeners(page)
{
	if (page === 'pong3D')
	{
		document.getElementById('button-start-pong-3D').addEventListener('click', function() 
		{
			hideSectionPong('button-start-pong-3D');
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
	else if (page == 'charts')
	{
	}
}

export async function removeEventListeners(page)
{

}

