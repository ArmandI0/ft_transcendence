import { hideSectionPong, showSectionPong } from './showAndHideSections.js';
import { startGame3D } from '../pong3D.js';

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
}

export async function removeEventListeners(page)
{

}