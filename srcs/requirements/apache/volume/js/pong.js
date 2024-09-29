
// Variables globales
let player1, player2, ball, player1_score, player2_score;
let container, containerHeight, containerWidth;
let player1Y, player2Y, ballX, ballY, ballSpeedX, ballSpeedY;
let GamePaused = true;
let Tournament = false;
let animationFrameId;

const keysPressed = {};
const step = 8;

// Constantes pour les dimensions et les collisions
const playerCollisionOffset1 = 50;
const playerCollisionOffset2 = 310;
const ballDiam = 20;
const ballRad = ballDiam / 2;

// Initialisation du conteneur de jeu et des dimensions
container = document.getElementById('game-container-pong');
containerHeight = parseFloat(window.getComputedStyle(container).height);
containerWidth = parseFloat(window.getComputedStyle(container).width);

// Ajustement de la hauteur du conteneur pour les collisions avec la balle
const containerHeight_variation = containerHeight - 40;
const ballDiameter1 = containerHeight - (containerHeight - (ballDiam / 2));
const ballDiameter2 = containerHeight - (ballDiam / 2);

// Initialisation des joueurs
player1 = document.getElementById('player1');
const player1_height = parseFloat(window.getComputedStyle(player1).height);
const player1_height2 = player1_height / 2;
const player1_width = parseFloat(window.getComputedStyle(player1).width);

player2 = document.getElementById('player2');
const player2_height = parseFloat(window.getComputedStyle(player2).height);
const player2_height2 = player2_height / 2;
const player2_width = parseFloat(window.getComputedStyle(player2).width);

// Fonction pour initialiser les éléments du jeu
function initializeGameElements()
{
    ball = document.getElementById('ball');
    player1_score = document.getElementById('player1-score');
    player2_score = document.getElementById('player2-score');

    // Position initiale des joueurs et de la balle
    player1Y = containerHeight / 2 - player1_height2;
    player2Y = containerHeight / 2 - player2_height2;
    ballX = containerWidth / 2;
    ballY = containerHeight / 2;
    ballSpeedX = 3;
    ballSpeedY = 3;

    // Appliquer les positions initiales
    player1.style.top = `${player1Y}px`;
    player2.style.top = `${player2Y}px`;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

// Fonction pour gérer les événements de clavier
function setupKeyboardEvents()
{
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });
}

// Fonction pour mettre à jour la position des joueurs
function updatePlayersPosition()
{
    if (keysPressed['w'])
        player1Y = Math.max(playerCollisionOffset1, player1Y - step);
    if (keysPressed['s'])
        player1Y = Math.min(playerCollisionOffset2, player1Y + step);
    if (keysPressed['ArrowUp'])
        player2Y = Math.max(playerCollisionOffset1, player2Y - step);
    if (keysPressed['ArrowDown'])
        player2Y = Math.min(playerCollisionOffset2, player2Y + step);
    
    // Appliquer les positions mises à jour
    player1.style.top = `${player1Y}px`;
    player2.style.top = `${player2Y}px`;

    // Appeler la fonction à nouveau pour une animation continue
    requestAnimationFrame(updatePlayersPosition);
}

/////////// IA /////////////////

let ia = false;

function iaPlayer(ballY, ballX, player2Y)
{
    let keyPress = null;
    let delay;

    //follow ball
    if (ballX > 500 && direction === 'right')
    {
        if (ballY < player2Y && ballX > 500)
            keyPress = 'ArrowUp';
        else if (ballY > player2Y && ballX > 500)
            keyPress = 'ArrowDown';
        delay = 400;
    }
    else  // go middle
    {
        const centerY = 180;
        if (player2Y < centerY - 10)
            keyPress = 'ArrowDown';
        else if (player2Y > centerY + 10) 
            keyPress = 'ArrowUp';
        else
            keyPress = null; // already middle
        delay = 300;
    }

    if (keyPress)
    {
        const keyCode = keyPress === 'ArrowUp' ? 38 : 40;
        
        const keydownEvent = new KeyboardEvent('keydown', {
            key: keyPress,
            code: keyPress,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
        });

        const keyupEvent = new KeyboardEvent('keyup', {
            key: keyPress,
            code: keyPress,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
        });

        document.dispatchEvent(keydownEvent);
        console.log('keydown', keydownEvent);

        setTimeout(() => {
            document.dispatchEvent(keyupEvent);
            console.log('keyup', keyupEvent);
        }, delay);
    }
}

// Fonction pour réinitialiser le jeu
function resetGame()
{
    initializeGameElements();
    GamePaused = true;
    hideSectionPong('ball');

    player1_score.textContent = 0;
    player2_score.textContent = 0;
    
    ballX = containerWidth / 2;
    ballY = containerHeight / 2;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Réinitialiser la vitesse de la balle avec une direction aléatoire
    ballSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

}

// Fonction pour vérifier le score des joueurs et arrêter le jeu si nécessaire
function checkPlayerScore()
{
    const player1Score = parseInt(player1_score.textContent, 10);
    const player2Score = parseInt(player2_score.textContent, 10);

    if (Tournament)
    {
        tournamentFct(0);
    }
    if (player1Score >= 1 || player2Score >= 1) 
    {
        if (player1Score >= 1)
        {
            player1_score.textContent = 'W';
            player2_score.textContent = 'L';
            if (Tournament)
                tournamentFct(1);
            else
                document.getElementById('play-pong').style.display = 'block';
        } 
        else
        {
            player2_score.textContent = 'W';
            player1_score.textContent = 'L';
            if (Tournament)
                tournamentFct(2);
            else
                document.getElementById('play-pong').style.display = 'block';
        }

        // Arrêter le jeu
        ballSpeedX = 0;
        ballSpeedY = 0;
        if (!Tournament)
        {
            GamePaused = true;
            hideSectionPong('ball');
            cancelAnimationFrame(animationFrameId);
        }
    }
}

// Initialisation du jeu après le chargement du DOM
function startPong()
{
    resetGame();
    setupKeyboardEvents();
    GamePaused = false;
    showSectionPong('ball');
    requestAnimationFrame(updatePlayersPosition);
    requestAnimationFrame(updateBallPosition);
}

///////////// MENU INTERACTIONS //////////////////

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
    showSectionPong('select-chelem');
    document.getElementById('play-pong').style.display = 'flex';
});

document.getElementById('button-ia').addEventListener('click', function() 
{
    ia = true;
    hideSectionPong('main-menu-buttons-pong');
    showSectionPong('game-container-pong');
    showSectionPong('select-chelem');
    document.getElementById('play-pong').style.display = 'flex';
});

document.getElementById('play-pong').addEventListener('click', function()
{
    startPong();
    document.getElementById('play-pong').style.display = 'none';
});

document.getElementById('button-tournament-pong').addEventListener('click', function() 
{
    hideSectionPong('main-menu-buttons-pong');
    showSectionPong('tournament-container-pong');
    showSectionPong('select-chelem');
});

document.getElementById('Home-pong').addEventListener('click', function()
{
    ia = false;
    resetGame();
    hideSectionPong('ball');
    hideSectionPong('select-chelem');
    showSectionPong('main-menu-buttons-pong');
    hideSectionPong('game-container-pong');
    hideSectionPong('tournament-container-pong');
    hideSectionPong('tournament-visualizer-pong');
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

///////// BALL MOVMENT ///////////

let direction = 'right';


function updateBallPosition()
{
    if (!GamePaused)
    {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballSpeedX > 0)
            direction = 'right';
        else if (ballSpeedX < 0)
            direction = 'left';
        
        checkPlayerScore();

        const maxAngle = 70 * (Math.PI / 180);
        const maxSpeedY = Math.tan(maxAngle) * Math.abs(ballSpeedX);

        // Collision avec les murs haut et bas
        if (ballY - ballRad <= 0 || ballY + ballRad >= containerHeight_variation) // a regler 
            ballSpeedY = -ballSpeedY;

        // Collision avec joueur 1
        if (ballX - ballRad <= ballRad && ballX - ballRad >= 0 && ballY >= player1Y - player1_height2 && ballY <= player1Y + player1_height2)
        { 
            const hitPosition = ballY - player1Y;

            ballSpeedX = -ballSpeedX;

            ballSpeedY = hitPosition * 0.3;

            if (Math.abs(ballSpeedY) > maxSpeedY)
                ballSpeedY = Math.sign(ballSpeedY) * maxSpeedY;
        }
        // Collision avec joueur 2
        else if (ballX + ballRad >= 765 && ballX + ballRad <= 780 && ballY >= player2Y - player2_height2 && ballY <= player2Y + player2_height2)
        { 
            const hitPosition = ballY - player2Y; // Calcul par rapport au centre de la raquette

            ballSpeedX = -ballSpeedX;

            ballSpeedY = hitPosition * 0.3;

            if (Math.abs(ballSpeedY) > maxSpeedY)
                ballSpeedY = Math.sign(ballSpeedY) * maxSpeedY;
        }

        // Collision avec les bords gauche et droit du conteneur (score)
        if (ballX <= -10 || ballX >= containerWidth - 20)
        {
            if (ballX <= -10)
                player2_score.textContent++;
            if (ballX >= containerWidth - 20)
                player1_score.textContent++;

            // Reset la balle au centre
            ballX = containerWidth / 2 - ballRad;
            ballY = containerHeight / 2 - ballRad;
            ball.style.left = `${ballX}px`;
            ball.style.top = `${ballY}px`;
        

            // Attendre 1.5 secs avant de reprendre le mouvement
            setTimeout(() => {
                ballSpeedX = 2;
                ballSpeedY = 2;
                if (!GamePaused)
                    requestAnimationFrame(updateBallPosition);
            }, 1500);
            if (!Tournament)
                return;
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
        if (ia === true)
            iaPlayer(ballY, ballX, player2Y, direction);
        animationFrameId = requestAnimationFrame(updateBallPosition);
    }
}

////////// TOURNAMENT HANDLE ///////////////////

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
    console.log('test');
    player1_visualizer.style.display = 'block';
    player2_visualizer.style.display = 'block';
    vs_visualizer.style.display = 'block';
    document.getElementById('tournament-winner-pong').style.display = 'none';
    tournamentVizualizer.style.display = 'none';
    PlayersScore.fill(0);
    firstMatch = true;
    GamePaused = true;
    hideSectionPong('ball');
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
            hideSectionPong('tournament-visualizer-pong');
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
            hideSectionPong('ball');
            displayMatch(Players[1], Players[2]);
            await waitForButtonClick('play-pong');
            player1_score.textContent = 0;
            player2_score.textContent = 0;
            firstMatch = false;
            secondMatch = true;
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
            hideSectionPong('ball');
            let firstFinalist = PlayersScore[0] > PlayersScore[3] ? Players[0] : Players[3];
            let secondFinalist = PlayersScore[1] > PlayersScore[2] ? Players[1] : Players[2];
    
            displayMatch(firstFinalist, secondFinalist);
            await waitForButtonClick('play-pong');
            player1_score.textContent = 0;
            player2_score.textContent = 0;
            secondMatch = false;
            finalMatch = true;
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
            hideSectionPong('ball');
            if (winner === 1)
                displayWinner(firstFinalist);
            else
                displayWinner(secondFinalist);
            await waitForButtonClickBack('Home-pong')
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
        displayMatch(Players[0], Players[3]);
        GamePaused = false;
        Tournament = true;

        document.getElementById('play-pong').style.display = 'flex';
    } 
    else 
    {
        alert('Please enter 4 unique player (3-10 caracters)');
    }
});