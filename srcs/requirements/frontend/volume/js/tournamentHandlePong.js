const button_play_tournament = document.getElementById('play-tournament-pong');
const parentContainer = document.getElementById('parent-container');
const tournamentContainer = document.getElementById('tournament-container-pong');
const gameContainer = document.getElementById('game-container-pong');
const tournamentVizualizer = document.getElementById('tournament-visualizer-pong');

const player1_visualizer = document.getElementById('player1_tv-pong');
const player2_visualizer = document.getElementById('player2_tv-pong');
const vs_visualizer = document.getElementById('vs_tv-pong');

let firstMatch = true;
let secondMatch = false;
let finalMatch = false;

const Players = [4];
const PlayersScore = [4];

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
function displayMatch(player1, player2)
{
    player1_visualizer.textContent = player1;
    player2_visualizer.textContent = player2;
}

function displayWinner(winner)
{
    player1_visualizer.style.display = 'none';
    player2_visualizer.style.display = 'none';
    vs_visualizer.style.display = 'none';
    document.getElementById('tournament-winner-pong').style.display = 'block';
    document.getElementById('tournament-winner-pong').textContent = winner + ' wins the tournament!';
}

function resetTournament()
{
    player1_visualizer.style.display = 'block';
    player2_visualizer.style.display = 'block';
    vs_visualizer.style.display = 'block';
    document.getElementById('tournament-winner-pong').style.display = 'none';
    tournamentVizualizer.style.display = 'none';
    PlayersScore.fill(0);
    firstMatch = true;
    GamePaused = true;
    Tournament = false;
    Players.fill('');
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForButtonClick(buttonId) {
    return new Promise(resolve => {
        const button = document.getElementById(buttonId);
        button.style.display = 'block'; // Affiche le bouton
        button.addEventListener('click', function onClick() {
            button.style.display = 'none'; // Cache le bouton après le clic
            button.removeEventListener('click', onClick); // Supprime l'écouteur d'événement
            resolve();
        });
    });
}

function waitForButtonClickBack(buttonId) {
    return new Promise(resolve => {
        const button = document.getElementById(buttonId);
        button.addEventListener('click', function onClick() {
            button.removeEventListener('click', onClick); // Supprime l'écouteur d'événement
            hideSectionPong('tournament-vizualizer-pong');
            resolve();
        });
    });
}

async function tournamentFct(winner)
{
    if (firstMatch)
    {
        displayMatch(Players[0], Players[3]);   
        if (winner === 1 || winner === 2)
        {
            if (winner === 1)
                PlayersScore[0]++;
            else
                PlayersScore[3]++;
            GamePaused = true;
            displayMatch(Players[1], Players[2]);
            await waitForButtonClick('button-play-next-tournament');
            player1_score.textContent = 0;
            player2_score.textContent = 0;
            firstMatch = false;
            secondMatch = true;
            GamePaused = false;
            requestAnimationFrame(updateBallPosition);
        }
    }
    else if (secondMatch)
    {
        if (winner === 1 || winner === 2)
        {
            if (winner === 1)
                PlayersScore[1]++;
            else
                PlayersScore[2]++;
            GamePaused = true;
            let firstFinalist = PlayersScore[0] > PlayersScore[3] ? Players[0] : Players[3];
            let secondFinalist = PlayersScore[1] > PlayersScore[2] ? Players[1] : Players[2];
    
            displayMatch(firstFinalist, secondFinalist);
            await waitForButtonClick('button-play-next-tournament');
            player1_score.textContent = 0;
            player2_score.textContent = 0;
            secondMatch = false;
            finalMatch = true;
            GamePaused = false;
            requestAnimationFrame(updateBallPosition);
        }    
    }
    else if (finalMatch)
    {
        let firstFinalist = PlayersScore[0] > PlayersScore[3] ? Players[0] : Players[3];
        let secondFinalist = PlayersScore[1] > PlayersScore[2] ? Players[1] : Players[2];

        if (winner === 1 || winner === 2)
        {
            finalMatch = false;
            Tournament = false;
            GamePaused = true;
            if (winner === 1)
                displayWinner(firstFinalist);
            else
                displayWinner(secondFinalist);
            await waitForButtonClickBack('Back')
            resetTournament();
        }
    }
}   

document.getElementById('play-tournament-pong').addEventListener('click', function() 
{
    const inputElements = document.querySelectorAll('.form-control');
    Players.length = 0;
    for (let i = 0; i < inputElements.length && i < 4; i++) {
        Players.push(inputElements[i].value);
    }

    console.log(Players);
    if (validatePlayers(Players)) 
    {
        hideSectionPong('tournament-container-pong');
        showSectionPong('game-container-pong');
        showSectionPong('tournament-visualizer-pong');
        GamePaused = false;
        Tournament = true;
        
        // lancement du tournoi
        startPong();
    } 
    else 
    {
        alert('Please enter 4 unique player (3-10 caracters)');
    }
});