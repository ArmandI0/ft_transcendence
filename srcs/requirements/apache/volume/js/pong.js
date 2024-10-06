import { iaPlayer } from "./utils/pong_ia.js";
import { hideSection, showSection } from './utils/showAndHideSections.js';
import * as gameStatus from './utils/gameStatus.js' ;


const Players = [];
let tournament;
let animationFrameId;
const keysPressed = {};

/// CLASS PLAYER ////
class Player {

    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (this.element)
        {
            this.height = parseFloat(window.getComputedStyle(this.element).height);
            this.width = parseFloat(window.getComputedStyle(this.element).width);
            this.height2 = this.height / 2;
            this.CollisionTop = 350;
            this.CollisionBot = 50;
            this.step = 8; // vitesse de deplacement du joueur
            this.y = 0; // Position initiale
            this.score = 0;
        }
    }

    setPosition(y)
    {
        if (typeof y === 'undefined')
            return;

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
            this.speedX = 3 * (Math.random() > 0.5 ? 1 : -1);
            this.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
            this.y = 400 / 2;
            this.x = 800 / 2;
        }
    }

    setPosition(x, y){

        if (typeof y === 'undefined' || typeof x === 'undefined')
            return;
        
        this.x = x;
        this.element.style.left = `${this.x}px`;
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
    
    constructor(){
        this.firstMatch = true;
        this.secondMatch = false;
        this.finalMatch = false;
        this.playersNames = Players;
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
    gameStatus.setStatus('isPaused', false);;

    let player1 = new Player('player1');
    let player2 = new Player('player2');
    
    let ball = new Ball('ball');
    let court = new Court('game-container-pong');

    if (gameStatus.getStatus('tournamentMod') === true && gameStatus.getStatus('tournamentInProgress') === false)
    {
        tournament = new Tournament();
        console.log('NEW TOURNAMENT');
    } 
    // Appliquer les positions initiales
    player1.setPosition (200);
    player2.setPosition(200);
    ball.setPosition(400, 200);

    setupKeyboardEvents();
    // gameStatus.setStatus('GamePaused', false);
    showSection('ball');
    requestAnimationFrame(() => updatePlayersPosition(player1, player2));
    requestAnimationFrame(() => updateBallPosition(ball, player1, player2, court, tournament));
}

// Fonction pour mettre à jour la position des joueurs
function updatePlayersPosition(player1, player2)
{
    let player1Y;
    let player2Y;

    if (keysPressed['w'])
        player1Y = Math.max(player1.CollisionBot, player1.y - player1.step);
    if (keysPressed['s'])
        player1Y = Math.min(player1.CollisionTop, player1.y + player1.step);
    if (keysPressed['ArrowUp'])
        player2Y = Math.max(player2.CollisionBot, player2.y - player2.step);
    if (keysPressed['ArrowDown'])
        player2Y = Math.min(player2.CollisionTop, player2.y + player2.step);
    
    // Appliquer les positions mises à jour
    player1.setPosition(player1Y);
    player2.setPosition(player2Y);

    // Appeler la fonction à nouveau pour une animation continue
    requestAnimationFrame(() => updatePlayersPosition(player1, player2));
}


// Fonction pour vérifier le score des joueurs et arrêter le jeu si nécessaire
function checkPlayerScore(player1, player2, ball, tournament, court)
{
    const player1_score = document.getElementById('player1-score');
    const player2_score = document.getElementById('player2-score');

    player1_score.textContent = player1.score;
    player2_score.textContent = player2.score;

    if (player1.score >= 1 || player2.score >= 1) 
    {
        gameStatus.setStatus('isPaused', true);;
        
        if (player1.score >= 1)
        {
            player1_score.textContent = 'W';
            player2_score.textContent = 'L';
            if (gameStatus.getStatus('tournamentMod') === true)
            {
                console.log('PLAYER1 WIN!', tournament.secondMatch);
                tournamentFct(1, player1, player2, ball, tournament, court);
            }
            else
                document.getElementById('play-pong').style.display = 'block';
        } 
        else
        {
            player2_score.textContent = 'W';
            player1_score.textContent = 'L';
            if (gameStatus.getStatus('tournamentMod') === true)
            {
                console.log('PLAYER2 WIN!', tournament.secondMatch);
                tournamentFct(2, player1, player2, ball, tournament, court);
            }
            else
                document.getElementById('play-pong').style.display = 'block';
        }

        // Arrêter le jeu
        ball.speedX = 0;
        ball.speedY = 0;
        if (gameStatus.getStatus('tournamentMod') === false)
        {
            hideSection('ball');
            cancelAnimationFrame(animationFrameId);
        }
    }
}

///////// BALL MOVMENT ///////////

let iaInterval;
let lastCallTime = Date.now();

function updateBallPosition(ball, player1, player2, court, tournament)
{
    let direction = 'right';

    if (gameStatus.getStatus('isPaused') === false) 
    {
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        if (ball.speedX > 0)
            direction = 'right';
        else if (ball.speedX < 0)
            direction = 'left';

        checkPlayerScore(player1, player2, ball, tournament, court);

        const maxAngle = 70 * (Math.PI / 180);
        const maxSpeedY = Math.tan(maxAngle) * Math.abs(ball.speedX);

        // Collision avec les murs haut et bas
        if (ball.y - ball.rad <= 0 || ball.y + ball.rad >= court.height)
            ball.speedY = -ball.speedY;

        // Collision avec joueur 1 (joueur gauche)
        if (ball.x - ball.rad <= 20 && ball.x - ball.rad >= 0)
        {
            if (ball.y >= player1.y - player1.height2 && ball.y <= player1.y + player1.height2)
            {
                let hitPosition = ball.y - player1.y;

                ball.speedX = -ball.speedX;
                ball.speedY = hitPosition * 0.3;

                if (Math.abs(ball.speedY) > maxSpeedY)
                    ball.speedY = Math.sign(ball.speedY) * maxSpeedY;
            }
            else if (ball.y + ball.rad >= player1.y - player1.height2 && ball.y <= player1.y)
                ball.speedY = -Math.abs(ball.speedY);
            else if (ball.y - ball.rad <= player1.y + player1.height2 && ball.y >= player1.y)
                ball.speedY = Math.abs(ball.speedY);
        }
        // Collision avec joueur 2 (joueur droite)
        else if (ball.x + ball.rad >= 780)
        {

            if (ball.y >= player2.y - player2.height2 && ball.y <= player2.y + player2.height2)
            {
                let hitPosition = ball.y - player2.y;

                ball.speedX = -ball.speedX;
                ball.speedY = hitPosition * 0.3;

                if (Math.abs(ball.speedY) > maxSpeedY)
                    ball.speedY = Math.sign(ball.speedY) * maxSpeedY;
            }
            else if (ball.y + ball.rad >= player2.y - player2.height2 && ball.y <= player2.y)
                ball.speedY = -Math.abs(ball.speedY);
            else if (ball.y - ball.rad <= player2.y + player2.height2 && ball.y >= player2.y)
                ball.speedY = Math.abs(ball.speedY);
        }

        // Collision avec les bords gauche et droit du conteneur (score)
        if (ball.x <= 5 || ball.x >= court.width - 5)
        {
            if (ball.x <= -10)
                player2.score += 1;
            if (ball.x >= court.width - 10)
                player1.score += 1;

            // Reset position ball et joueurs
            player1.setPosition(200);
            player2.setPosition(200);
            ball.setPosition(400, 200);

            // Mettre le jeu en pause
            gameStatus.setStatus('isPaused', true);
            cancelAnimationFrame(animationFrameId);

            // Attendre 1.5 secs avant de reprendre le mouvement
            setTimeout(() => {
                ball.speedX = 3 * (Math.random() > 0.5 ? 1 : -1);
                ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
                gameStatus.setStatus('isPaused', false);
                requestAnimationFrame(() => updateBallPosition(ball, player1, player2, court, tournament));
            }, 1500);
            return;
        }

        ball.setPosition(ball.x, ball.y);

        // Vérification du temps écoulé pour appeler iaPlayer
        let currentTime = Date.now();
        if (currentTime - lastCallTime >= 1000) {  // 1 seconde écoulée
            if (gameStatus.getStatus('ia') === true && direction === 'right')
            {
                iaPlayer(ball.speedX, ball.speedY, ball.y, ball.x, player2.y, 1);
                console.log("iaPlayer called...");
            }
            lastCallTime = currentTime;  // Mise à jour du dernier appel
        }
        else
        {
            iaPlayer(ball.speedX, ball.speedY, ball.y, ball.x, player2.y, 0);
        }

        animationFrameId = requestAnimationFrame(() => updateBallPosition(ball, player1, player2, court, tournament));
    }
}


////////// TOURNAMENT HANDLE ///////////////////

export function startTournament()
{
    const inputElements = document.querySelectorAll('.form-control');
    for (let i = 0; i < inputElements.length && i < 4; i++) {
        Players.push(inputElements[i].value);
    }
    
    if (validatePlayers(Players)) 
    {
        hideSection('tournament-container-pong');
        showSection('game-container-pong');
        showSection('tournament-visualizer-pong');
        displayMatch(Players[0], Players[3]);

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
    let player1_visualizer = document.getElementById('player1_tv-pong');
    let player2_visualizer = document.getElementById('player2_tv-pong');

    player1_visualizer.textContent = player1;
    player2_visualizer.textContent = player2;
}

function displayWinner(winner)
{
    let player1_visualizer = document.getElementById('player1_tv-pong');
    let player2_visualizer = document.getElementById('player2_tv-pong');
    let vs_visualizer = document.getElementById('vs_tv-pong');

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

async function tournamentFct(winner, player1, player2, ball, tournament, court)
{
    if (!tournament || !tournament.playersNames)
        return;
    gameStatus.setStatus('tournamentInProgress', true);
    if (tournament.firstMatch)
    {
        displayMatch(tournament.playersNames[0], tournament.playersNames[3]);   
        if (winner === 1 || winner === 2)
        {
            if (winner === 1)
                tournament.playersScore[0]++;
            else
                tournament.playersScore[3]++;
            hideSection('ball');
            displayMatch(tournament.playersNames[1], tournament.playersNames[2]);
            player1.score = 0;
            player2.score = 0;
            tournament.firstMatch = false;
            tournament.secondMatch = true;
            await waitForButtonClick('play-pong');
        }
    }
    else if (tournament.secondMatch)
    {
        if (winner === 1 || winner === 2)
        {
            if (winner === 1)
                tournament.playersScore[1]++;
            else
                tournament.playersScore[2]++;
            hideSection('ball');
            let firstFinalist = tournament.playersScore[0] > tournament.playersScore[3] ? tournament.playersNames[0] : tournament.playersNames[3];
            let secondFinalist = tournament.playersScore[1] > tournament.playersScore[2] ? tournament.playersNames[1] : tournament.playersNames[2];
            
            displayMatch(firstFinalist, secondFinalist);
            player1.score = 0;
            player2.score = 0;
            tournament.secondMatch = false;
            tournament.finalMatch = true;
            console.log('secondMatch');
            await waitForButtonClick('play-pong');
        }    
    }
    else if (tournament.finalMatch)
    {
        console.log('LastMatch');
        let firstFinalist = tournament.playersScore[0] > tournament.playersScore[3] ? tournament.playersScore[0] : tournament.playersScore[3];
        let secondFinalist = tournament.playersScore[1] > tournament.playersScore[2] ? tournament.playersScore[1] : tournament.playersScore[2];

        if (winner === 1 || winner === 2)
        {
            tournament.finalMatch = false;
            hideSection('ball');
            if (winner === 1)
                displayWinner(firstFinalist);
            else
                displayWinner(secondFinalist);
            await waitForButtonClickBack('Home-pong')
            gameStatus.setStatus('tournamentMod', false);
        }
    }
}