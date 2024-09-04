const button_play_tournament = document.getElementById('play-tournament');
const parentContainer = document.getElementById('parent-container');
const tournamentContainer = document.getElementById('tournament-container');
const gameContainer = document.getElementById('game-container');
const tournamentVizualizer = document.getElementById('tournament-visualizer');

const Players = [4];

function validatePlayers(players) 
{
    if (players.length !== 4)
        return false;
    const uniquePlayers = new Set(players);
    if (uniquePlayers.size !== 4)
        return false;
    for (const player of players)
    {
        if (typeof player !== 'string' || player.length < 3 || player.length > 10)
            return false;
    }
    return true;
}

document.getElementById('play-tournament').addEventListener('click', function() 
{
    const inputElements = document.querySelectorAll('.form-control');
    Players.length= 0;
    inputElements.forEach((input) => {
        Players.push(input.value);
    });

    if (validatePlayers(Players)) 
    {
        hideSection('tournament-container');
        showSection('game-container');
        showSection('tournament-visualizer');
        GamePaused = false;
        Tournament = true;
        // lancement du pong
        requestAnimationFrame(updateBallPosition);
    } 
    else 
    {
        alert('Please enter 4 unique player (3-10 caracters)');
    }
});