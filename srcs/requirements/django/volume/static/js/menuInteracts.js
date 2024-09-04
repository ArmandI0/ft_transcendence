
function showSection(sectionId)
{
	document.getElementById(sectionId).style.display = 'block';
}

function hideSection(sectionId) 
{
    document.getElementById(sectionId).style.display = 'none';
}

document.getElementById('button-1v1').addEventListener('click', function() 
{
    hideSection('main-menu-buttons');
    showSection('game-container');
    GamePaused = false;
    requestAnimationFrame(updateBallPosition);
});

document.getElementById('button-tournament').addEventListener('click', function() 
{
    hideSection('main-menu-buttons');
    showSection('tournament-container');
});

document.getElementById('Back').addEventListener('click', function()
{
    hideSection('game-container');
    hideSection('tournament-container');
    showSection('main-menu-buttons');
    GamePaused = true;
    resetGame();
});

