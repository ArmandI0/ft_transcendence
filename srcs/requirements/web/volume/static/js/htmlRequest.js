async function showSection(sectionId)
{
	let api ;

	if (sectionId === 'game-container-2d')
		api = '/game/game_2d';
	else if (sectionId === 'game-container-3d')
		api = '/game/game_3d';
	else 
	{
        console.error('Invalid section ID:', sectionId);
        return;
    }

    try 
	{
        const response = await fetch(api);
        const html = await response.text();
        const container = document.getElementById('game-window');
        if (container) {
            container.innerHTML = html;
        } else {
            console.error('Element with ID not found:', sectionId);
        }
    } 
	catch (error) 
	{
        console.error('Error fetching data:', error);
    }

}

document.addEventListener('DOMContentLoaded', function() {
		document.getElementById('button_to_2d').addEventListener('click', async function() 
		{
			await showSection('game-container-2d');
			pongStart();
		});
		
		document.getElementById('button_to_3d').addEventListener('click', async function() 
		{
			await showSection('game-container-3d');
			prepareScene();
		});
		// showSection('game-container-2d');
});



