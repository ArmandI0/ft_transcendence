
function showSectionCard(sectionId)
{
	document.getElementById(sectionId).style.display = 'flex';
}

function hideSectionCard(sectionId) 
{
    document.getElementById(sectionId).style.display = 'none';
}

document.getElementById('button-1player').addEventListener('click', function() 
{
    hideSectionCard('main-menu-buttons-card');
    showSectionCard('hide-game-container');
    document.getElementById('start').style.display = 'flex';
});

document.getElementById('button-tournament-card').addEventListener('click', function() 
{
    hideSectionCard('main-menu-buttons-card');
    showSectionCard('tournament-container-card');
});

document.getElementById('start').addEventListener('click', function() 
{
    resetCardGame();
    startGame();
    document.getElementById('start').style.display = 'none';
});


document.getElementById('Home').addEventListener('click', function()
{
    resetCardGame();
    hideSectionCard('hide-game-container');
    hideSectionCard('tournament-container-card');
    showSectionCard('main-menu-buttons-card');
});

document.getElementById('back-main').addEventListener('click', function()
{
    resetCardGame();
    hideSectionCard('card-container');
    showSectionCard('main-page');
});

document.getElementById('play-tournament').addEventListener('click', function() 
{
    const inputElements = document.querySelectorAll('.form-control');
    PlayersCard.length = 0;
    for (let i = 0; i < inputElements.length && i < 4; i++)
        PlayersCard.push(inputElements[i].value);

    if (validatePlayers(PlayersCard)) 
    {
        hideSectionCard('tournament-container-card');
        showSectionCard('hide-game-container');
        showSectionCard('tournament-visualizer-card');
        setNames();

        // lancement du tournoi
        tournamentCard = true;
    } 
    else 
    {
        alert('Please enter 4 unique player (3-10 caracters)');
    }
    document.getElementById('start').style.display = 'flex';
});

