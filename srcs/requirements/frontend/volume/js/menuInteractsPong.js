
function showSectionPong(sectionId)
{
	document.getElementById(sectionId).style.display = 'flex';
}

function hideSectionPong(sectionId) 
{
    document.getElementById(sectionId).style.display = 'none';
}

document.getElementById('button-1v1').addEventListener('click', function() 
{
    hideSectionPong('main-menu-buttons-pong');
    showSectionPong('game-container-pong');
    GamePaused = false;
    startPong();
});

document.getElementById('button-tournament-pong').addEventListener('click', function() 
{
    hideSectionPong('main-menu-buttons-pong');
    showSectionPong('tournament-container-pong');
});

document.getElementById('Back').addEventListener('click', function()
{
    hideSectionPong('game-container-pong');
    hideSectionPong('tournament-container-pong');
    hideSectionPong('tournament-visualizer-pong');
    hideSectionPong('button-play-next-tournament');
    showSectionPong('main-menu-buttons-pong');
    GamePaused = true;
    resetGame();
});

document.getElementById('Home-pong').addEventListener('click', function()
{
    // resetCardGame();
    hideSectionPong('pong-container');
    showSectionPong('main-page');
});

document.getElementById('wimbledon').addEventListener('click', function() {
    document.getElementById('game-container-pong').style.backgroundColor = 'green';
    document.getElementById('tournament-winner-pong').style.color = 'purple';
});

document.getElementById('usOpen').addEventListener('click', function() {
    document.getElementById('game-container-pong').style.backgroundColor = 'purple';
    document.getElementById('tournament-winner-pong').style.color = 'yellow';
});

document.getElementById('asOpen').addEventListener('click', function() {
    document.getElementById('game-container-pong').style.backgroundColor = 'blue';
    document.getElementById('tournament-winner-pong').style.color = 'yellow';
});

document.getElementById('Roland').addEventListener('click', function() {
    document.getElementById('game-container-pong').style.backgroundColor = 'rgba(210, 105, 30, 0.8)';
    document.getElementById('tournament-winner-pong').style.color = 'white';
});
