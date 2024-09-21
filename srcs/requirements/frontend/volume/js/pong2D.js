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
    ballSpeedX = 4;
    ballSpeedY = 4;

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

// Fonction pour réinitialiser le jeu
function resetGame()
{
    initializeGameElements();
    // Réinitialiser les scores
    player1_score.textContent = 0;
    player2_score.textContent = 0;
    
    // Réinitialiser la position de la balle
    ballX = containerWidth / 2;
    ballY = containerHeight / 2;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Réinitialiser la vitesse de la balle avec une direction aléatoire
    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
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
            tournamentFct(1);
        } 
        else
        {
            player2_score.textContent = 'W';
            player1_score.textContent = 'L';
            tournamentFct(2);
        }

        // Arrêter le jeu
        ballSpeedX = 0;
        ballSpeedY = 0;
        if (!Tournament)
        {
            GamePaused = true;
            cancelAnimationFrame(animationFrameId);
        }
    }
}

// Initialisation du jeu après le chargement du DOM
function startPong()
{
    initializeGameElements();
    setupKeyboardEvents();
    requestAnimationFrame(updatePlayersPosition);
    requestAnimationFrame(updateBallPosition);
}