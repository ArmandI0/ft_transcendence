import { iaPlayer } from "./utils/pong_ia.js";
import { hideSection, showSection } from './utils/showAndHideSections.js';
import * as gameStatus from './utils/gameStatus.js' ;

// Variables globale
let GamePaused = true;
// let Tournament = false;
let animationFrameId;
const keysPressed = {};
let iaInterval;
let lastCallTime = Date.now();

/// CLASS PLAYER ////
class Player {

    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (this.element)
        {
            this.height = parseFloat(window.getComputedStyle(this.element).height);
            this.width = parseFloat(window.getComputedStyle(this.element).width);
            this.height2 = this.height / 2;
            this.playerCollisionTop = 350;
            this.playerCollisionBot = 50;
            this.step = 8; // vitesse de deplacement du joueur
            this.y = 0; // Position initiale
            this.score = 0;
        }
    }

    setPosition(y){
        this.y = y;
        this.element.style.top = `${this.y}px`;
    }

}

/// CLASS BALL ////
class Ball{

    constructor(elementId){
        this.element = document.getElementById(elementId);
        if (this.element)
        {
            this.height = parseFloat(window.getComputedStyle(this.element).height);
            this.width = parseFloat(window.getComputedStyle(this.element).width);
            this.rad = this.height / 2;
            this.speedX = 3;
            this.speedY = 3;
            this.y = 400 / 2;
            this.x = 800 / 2;
        }
    }

    setPosition(x, y){
        this.x = x;
        this.element.style.top = `${this.x}px`;
        this.y = y;
        this.element.style.top = `${this.y}px`;
    }

}

/// CLASS FIELD ////
class Court{

    constructor(elementId){
        this.element = document.getElementById(elementId);
        if (this.element)
        {
            this.height = parseFloat(window.getComputedStyle(this.element).height);
            this.width = parseFloat(window.getComputedStyle(this.element).width);
        }
    }
}

class Tournament{
    
    constructor(PlayersNames){
        this.firstMatch = true;
        this.secondMatch = false;
        this.finalMatch = false;
        this.playersNames = PlayersNames;
        this.playersScore = [0, 0, 0, 0];
    }
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

//// START PONG //////
export function startPong()
{
    let player1 = new Player('player1');
    let player2 = new Player('player2');
    
    let ball = new Ball('ball');
    let court = new Court('game-container-pong');

    // Appliquer les positions initiales
    player1.setPosition (200);
    player2.setPosition(200);
    ball.setPosition(400, 200);

    setupKeyboardEvents();
    GamePaused = false;
    showSection('ball');
    requestAnimationFrame(updatePlayersPosition(player1, player2));
    requestAnimationFrame(updateBallPosition(ball, player1, player2, court));
}

// Fonction pour mettre à jour la position des joueurs
function updatePlayersPosition(player1, player2)
{
    let player1Y;
    let player2Y;

    if (keysPressed['w'])
        player1Y = Math.max(playerCollisionTop, player1.y - player1.step);
    if (keysPressed['s'])
        player1Y = Math.min(playerCollisionBot, player1.y + player1.step);
    if (keysPressed['ArrowUp'])
        player2Y = Math.max(playerCollisionTop, player2.y - player2.step);
    if (keysPressed['ArrowDown'])
        player2Y = Math.min(playerCollisionBot, player2.y + player2.step);
    
    // Appliquer les positions mises à jour
    player1.setPosition(player1Y);
    player2.setPosition(player2Y);

    // Appeler la fonction à nouveau pour une animation continue
    requestAnimationFrame(updatePlayersPosition(player1, player2));
}


// Fonction pour vérifier le score des joueurs et arrêter le jeu si nécessaire
function checkPlayerScore(player1, player2, ball)
{
    // const player1Score = parseInt(player1_score.textContent, 10);
    // const player2Score = parseInt(player2_score.textContent, 10);

    if (Tournament)
    {
        tournamentFct(0, player1, player2, ball);
    }
    if (player1.score >= 10 || player2.score >= 10) 
    {
        if (player1.score >= 1)
        {
        //     player1_score.textContent = 'W';
        //     player2_score.textContent = 'L';
            if (Tournament)
                tournamentFct(1, player1, player2, ball);
            else
                document.getElementById('play-pong').style.display = 'block';
        } 
        else
        {
            // player2_score.textContent = 'W';
            // player1_score.textContent = 'L';
            if (Tournament)
                tournamentFct(2, player1, player2, ball);
            else
                document.getElementById('play-pong').style.display = 'block';
        }

        // Arrêter le jeu
        ball.speedX = 0;
        ball.speedY = 0;
        if (!Tournament)
        {
            GamePaused = true;
            hideSection('ball');
            cancelAnimationFrame(animationFrameId);
        }
    }
}


///////// BALL MOVMENT ///////////

function updateBallPosition(ball, player1, player2, court)
{
    let direction = 'right';

    if (!GamePaused)
    {
        ball.setPosition(ball.x + ball.speedX, ball.y + ball.speedY);

        if (ball.speedX > 0)
            direction = 'right';
        else if (ball.speedX < 0)
            direction = 'left';
        
        checkPlayerScore(player1, player2);

        const maxAngle = 70 * (Math.PI / 180);
        const maxSpeedY = Math.tan(maxAngle) * Math.abs(ball.speedX);

        // Collision avec les murs haut et bas
        if (ball.y - ball.rad <= 0 || ball.y + ball.rad >= court.height) 
            ball.speedY = -ball.speedY;

        // Collision avec joueur 1
        if (ball.x - ball.rad <= ball.rad && ball.x - ball.rad >= 0 && ball.y >= player1.y - player1.height2 && ball.y <= player1.y + player1.height2)
        { 
            let hitPosition = ball.y - player1.y;

            ball.speedX = -ball.speedX;

            ball.speedY = hitPosition * 0.3;

            if (Math.abs(ball.speedY) > maxSpeedY)
                ballSpeedY = Math.sign(ball.speedY) * maxSpeedY;
        }
        // Collision avec joueur 2
        else if (ball.x + ball.rad >= 765 && ball.x + ball.rad <= 780 && ball.y >= player2.y - player2.height2 && ball.y <= player2.y + player2.height2)
        { 
            let hitPosition = ball.y - player2.y; // Calcul par rapport au centre de la raquette

            ball.speedX = -ball.speedX;

            ball.speedY = hitPosition * 0.3;

            if (Math.abs(ball.speedY) > maxSpeedY)
                ball.speedY = Math.sign(ball.speedY) * maxSpeedY;
        }

        // Collision avec les bords gauche et droit du conteneur (score)
        if (ball.x <= -10 || ball.x >= court.width - 20)
        {
            if (ball.x <= -10)
                player2.score += 1;
            if (ball.x >= containerWidth - 10)
                player1.score += 1;

            // Reset position ball et joueurs
            player1.setPosition (200);
            player2.setPosition(200);
            ball.setPosition(400, 200);
        

            // Attendre 1.5 secs avant de reprendre le mouvement
            setTimeout(() => {
                ball.speedX = 3;
                ball.speedY = 3;
                if (!GamePaused)
                    requestAnimationFrame(updateBallPosition(ball, player1, player2, court));
            }, 1500);
            if (!Tournament)
                return;
        }
        
        if (gameStatus.getStatus('ia') === true)
        {
            if (!iaInterval)
            {
                iaInterval = setInterval(() => {
                    const currentTime = Date.now();
                    const elapsedTime = currentTime - lastCallTime;

                    if (direction === 'left')
                        inPosition = false;
            
                    if (elapsedTime >= 1000 && ball.x > 500 && direction === 'right')
                    {
                        console.log('focus on ball', ball.x);
                        iaPlayer(ball.speedX, ball.speedY, ball.y, ball.x, player2.y, 1);
                        lastCallTime = currentTime;
                        inPosition = true
                    }
                    else
                    {
                        iaPlayer(ball.speedX, ball.speedY, ball.y, ball.x, player2.y, 0);
                        console.log('go centre');
                    }
                }, 100); // Vérifie toutes les 100ms
            }
        } 
        else 
        {
            clearInterval(iaInterval);
            iaInterval = null;
        }

        animationFrameId = requestAnimationFrame(updateBallPosition(ball, player1, player2, court));
    }
    else
    {
        clearInterval(iaInterval);
        iaInterval = null;
    }
}

////////// TOURNAMENT HANDLE ///////////////////

const tournamentVizualizer = document.getElementById('tournament-visualizer-pong');

const player1_visualizer = document.getElementById('player1_tv-pong');
const player2_visualizer = document.getElementById('player2_tv-pong');
const vs_visualizer = document.getElementById('vs_tv-pong');

let firstMatch = true;
let secondMatch = false;
let finalMatch = false;

export function startTournament()
{
    const Players = [];

    const inputElements = document.querySelectorAll('.form-control');
    for (let i = 0; i < inputElements.length && i < 4; i++) {
        Players.push(inputElements[i].value);
    }
    
    let tournament = new Tournament(Players);

    if (validatePlayers(tournament, playersNames)) 
    {
        hideSection('tournament-container-pong');
        showSection('game-container-pong');
        showSection('tournament-visualizer-pong');
        displayMatch(tournament.playersNames[0], tournament.playersNames[3]);
        GamePaused = false;

        document.getElementById('play-pong').style.display = 'flex';
    }
    else 
    {
        alert('Please enter 4 unique player (3-10 caracters)');
    }
}

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
            hideSection('tournament-visualizer-pong');
            resolve();
        });
    });
}

async function tournamentFct(winner)
{
    const PlayersScore = [4];

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
            hideSection('ball');
            displayMatch(Players[1], Players[2]);
            await waitForButtonClick('play-pong');
            player1.score = 0;
            player2.score = 0;
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
            hideSection('ball');
            let firstFinalist = PlayersScore[0] > PlayersScore[3] ? Players[0] : Players[3];
            let secondFinalist = PlayersScore[1] > PlayersScore[2] ? Players[1] : Players[2];
    
            displayMatch(firstFinalist, secondFinalist);
            await waitForButtonClick('play-pong');
            player1.score = 0;
            player2.score = 0;
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
            GamePaused = true;
            hideSection('ball');
            if (winner === 1)
                displayWinner(firstFinalist);
            else
                displayWinner(secondFinalist);
            await waitForButtonClickBack('Home-pong')
            resetTournament();
        }
    }
}   