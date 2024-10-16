import { iaPlayer } from "./utils/pong_ia.js";
import { hideSection, showSection } from './utils/showAndHideSections.js';
import * as gameStatus from './utils/gameStatus.js' ;
import { SendDataPong } from "./utils/SendDataHandle.js";
import { dataPostTournament, setTournament } from "./utils/SendGameData.js";
import { getCurrentFormattedDate } from "./utils/SendDataHandle.js";

let Players = [];
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
            this.startTime = Date.now();
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
            this.baseSpeed = 3.5;
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
        console.log("TOURNAMENT CREATED");
        this.firstMatch = true;
        this.secondMatch = false;
        this.finalMatch = false;
        this.playersNames = Players;
        this.playersScore = [0, 0, 0, 0];
        this.firstFinalist = '------';
        this.secondFinalist = '------';
        dataPostTournament.date = getCurrentFormattedDate();
        dataPostTournament.game_type = 'RollandGapong';
    }
    async init() {
        this.id = await setTournament();
        console.log("BLABLA " + this.id);
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

export async function startPong()
{
    gameStatus.setStatus('firstCall', true);
    gameStatus.setStatus('isPaused', false);;

    let player1 = new Player('player1');
    let player2 = new Player('player2');
    let player3 = new Player('player3');
    
    let ball = new Ball('ball');
    let court = new Court('game-container-pong');

    if (gameStatus.getStatus('tournamentMod') === true && gameStatus.getStatus('tournamentInProgress') === false)
    {
        console.log('NEW TOURNAMENT');
        tournament = new Tournament();
        gameStatus.setStatus('tournamenetInProgress', true);
        await tournament.init(); 
    }
    // Appliquer les positions initiales
    player1.setPosition (200);
    player2.setPosition(200);
    player3.setPosition(150);
    ball.setPosition(400, 200);

    setupKeyboardEvents();
    showSection('ball');
    requestAnimationFrame(() => updatePlayersPosition(player1, player2, player3));
    requestAnimationFrame(() => updateBallPosition(ball, player1, player2, player3, court, tournament));
}

function getRandomPower() {
    return Math.random() < 1 / 3; // 1/3 chance de retourner true
}

// Fonction pour mettre à jour la position des joueurs
function updatePlayersPosition(player1, player2, player3)
{
    let player1Y;
    let player2Y;

    if (!gameStatus.getStatus('isPaused'))
    {   
        if (keysPressed['w'])
            player1Y = Math.max(player1.CollisionBot, player1.y - player1.step);
        if (keysPressed['s'])
            player1Y = Math.min(player1.CollisionTop, player1.y + player1.step);
        if (keysPressed['ArrowUp'])
            player2Y = Math.max(player2.CollisionBot, player2.y - player2.step);
        if (keysPressed['ArrowDown'])
            player2Y = Math.min(player2.CollisionTop, player2.y + player2.step);
        if (gameStatus.getStatus('isCoop'))
        {
            let player3Y;

            if (keysPressed['g'])
                player3Y = Math.max(player3.CollisionBot - 50, player3.y - player3.step);
            if (keysPressed['b'])
                player3Y = Math.min(player3.CollisionTop - 50, player3.y + player3.step);
            player3.setPosition(player3Y);
        }
            
        
        // Appliquer les positions mises à jour
        player1.setPosition(player1Y);
        player2.setPosition(player2Y);

        // Appeler la fonction à nouveau pour une animation continue
        requestAnimationFrame(() => updatePlayersPosition(player1, player2, player3));
    }
}


// Fonction pour vérifier le score des joueurs et arrêter le jeu si nécessaire
function checkCoop(player1, player2, player3, ball, ok)
{
    if (!ok)
    {
        SendDataPong(player1.score, player2.score, -1, 'RollandGapong', player1.startTime);
        gameStatus.setStatus('isPaused', true);
        hideSection('ball');
        document.getElementById('play-pong').style.display = 'block';
        player1 = null;
        player2 = null;
        player3 = null;
        ball = null;
    }
}

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
            console.log('PLAYER1 WIN!');
            player1_score.textContent = 'W';
            player2_score.textContent = 'L';
            if (gameStatus.getStatus('tournamentMod') === true)
            {
                SendDataPong(player1.score, player2.score, tournament.id, 'RollandGapong', player1.startTime);
                tournamentFct(1, player1, player2, ball, tournament, court);
            }
            else
            {
                SendDataPong(player1.score, player2.score, -1, 'RollandGapong', player1.startTime);
                document.getElementById('play-pong').style.display = 'block';
                
            }
        } 
        else
        {
            console.log('PLAYER2 WIN!');
            player2_score.textContent = 'W';
            player1_score.textContent = 'L';
            if (gameStatus.getStatus('tournamentMod') === true)
            {
                SendDataPong(player1.score, player2.score, tournament.id, 'RollandGapong', player1.startTime);
                tournamentFct(2, player1, player2, ball, tournament, court);
            }
            else
            {
                SendDataPong(player1.score, player2.score, -1 , 'RollandGapong', player1.startTime);
                document.getElementById('play-pong').style.display = 'block';
            }
        }

        player1 = null;
        player2 = null;
        ball = null;

        if (gameStatus.getStatus('tournamentMod') === false)
        {
            hideSection('ball');
            cancelAnimationFrame(animationFrameId);
        }
    }
}

export function resetPower()
{
    const p1Green = document.getElementById('player1');
    const p2Green = document.getElementById('player2');

    p1Green.style.backgroundColor = 'grey';
    p2Green.style.backgroundColor = 'grey';
    gameStatus.setStatus('player1Power', false);
    gameStatus.setStatus('player2Power', false);
}

///////// BALL MOVMENT ///////////

let lastCallTime = Date.now();
let previousDirection = null;
let previousDirectionCoop = null;
let ok = null;

function updateBallPosition(ball, player1, player2, player3, court, tournament)
{
    let greenPlayer1 = document.getElementById('player1');
    let greenPlayer2 = document.getElementById('player2');
    let greenPlayer3 = document.getElementById('player3');
    const player1_score = document.getElementById('player1-score');
    const player2_score = document.getElementById('player2-score');


    
    if (gameStatus.getStatus('isPaused') === false) 
    {
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        let direction = ball.speedX > 0 ? 'right' : 'left';

        player1_score.textContent = player1.score;
        player2_score.textContent = player2.score;

        if (previousDirection !== direction)
        {
            if (direction === 'right')
            {
                if (gameStatus.getStatus('isPower'))
                    gameStatus.setStatus('player2Power', getRandomPower());
                if (gameStatus.getStatus('player2Power') === true)
                {
                    greenPlayer2.style.backgroundColor = 'lightgreen';
                    console.log('2 POWER');
                }
            }
            else if (direction === 'left')
            {
                if (gameStatus.getStatus('isPower'))
                    gameStatus.setStatus('player1Power', getRandomPower());
                if (gameStatus.getStatus('player1Power') === true)
                {
                    greenPlayer1.style.backgroundColor = 'lightgreen';
                    console.log('1 POWER');
                }
            }
            previousDirection = direction;
        }

        if (!gameStatus.getStatus('isCoop'))
            checkPlayerScore(player1, player2, ball, tournament, court);

        const maxAngle = 70 * (Math.PI / 180);
        const maxSpeedY = Math.tan(maxAngle) * Math.abs(ball.speedX);

        // Collision avec les murs haut et bas
        if (ball.y - ball.rad <= 0 || ball.y + ball.rad >= court.height)
            ball.speedY = -ball.speedY;
        if (ball.y < -11)
            ball.y = 10;
        if (ball.y > 411)
            ball.y = 410;

        // 'Collision' avec le joueur central
        if (gameStatus.getStatus('isCoop') && ball.x >= 390 && ball.x <= 410)
        {
            if ((ball.y + 10) >= (player3.y + 10) && (ball.y + 10) <= (player3.y + 90))
            {
                if (previousDirectionCoop != direction && !gameStatus.getStatus('FirstCall'))
                {   
                    player1.score += 1;
                    player2.score += 1;
                }
                previousDirectionCoop = direction;
                ok = true;
                
                greenPlayer3.style.backgroundColor = 'green';
                setTimeout(() => {
                    greenPlayer3.style.backgroundColor = 'grey';
                }, 1000);
            }
            else
            {
                ok = false;
            }
        }
        if (ball.x >= 420 && ball.x <= 380)
            gameStatus.setStatus('FirstCall', false);

        // Collision avec joueur 1 (joueur gauche)
        if (ball.x - ball.rad <= 20 && ball.x - ball.rad >= 0)
        {
            if (gameStatus.getStatus('isCoop'))
                checkCoop(player1, player2, player3, ball, ok);
            if (ball.y >= player1.y - player1.height2 && ball.y <= player1.y + player1.height2)
            {
                if (gameStatus.getStatus('player1Power') === true)
                {
                    console.log('BOOOOM');
                    ball.speedX = -ball.speedX * 4;
                    ball.speedX = Math.min(ball.speedX, 9);
                    ball.speedY = 0;
                    greenPlayer1.style.backgroundColor = 'grey';
                }
                else
                {    
                    let hitPosition = ball.y - player1.y;

                    ball.speedX = -ball.speedX;
                    ball.speedY = hitPosition * 0.3;

                    if (Math.abs(ball.speedY) > maxSpeedY)
                        ball.speedY = Math.sign(ball.speedY) * maxSpeedY;
                }
            }
            else if (ball.y + ball.rad >= player1.y - player1.height2 && ball.y <= player1.y)
                ball.speedY = -Math.abs(ball.speedY);
            else if (ball.y - ball.rad <= player1.y + player1.height2 && ball.y >= player1.y)
                ball.speedY = Math.abs(ball.speedY);
        }
        // Collision avec joueur 2 (joueur droite)
        else if (ball.x + ball.rad >= 780)
        {
            if (gameStatus.getStatus('isCoop'))
                checkCoop(player1, player2, player3, ball, ok);
            if (ball.y >= player2.y - player2.height2 && ball.y <= player2.y + player2.height2)
            {
                if (gameStatus.getStatus('player2Power') === true)
                {
                    console.log('BOOOOM');
                    ball.speedX = -ball.speedX * 4;
                    ball.speedX = Math.min(ball.speedX, 9);
                    ball.speedY = 0;
                    greenPlayer2.style.backgroundColor = 'grey';
                }
                else
                {
                    let hitPosition = ball.y - player2.y;

                    ball.speedX = -ball.speedX;
                    ball.speedY = hitPosition * 0.3;

                    if (Math.abs(ball.speedY) > maxSpeedY)
                        ball.speedY = Math.sign(ball.speedY) * maxSpeedY;
                }
            }
            else if (ball.y + ball.rad >= player2.y - player2.height2 && ball.y <= player2.y)
                ball.speedY = -Math.abs(ball.speedY);
            else if (ball.y - ball.rad <= player2.y + player2.height2 && ball.y >= player2.y)
                ball.speedY = Math.abs(ball.speedY);
        }

        if (gameStatus.getStatus('isCoop') && (ball.x <= 5 || ball.x >= court.width - 5))
        {
            ok = false;
            checkCoop(player1, player2, player3, ball, ok);
        }
        // Collision avec les bords gauche et droit du conteneur (score)
        else if (ball.x <= 5 || ball.x >= court.width - 5)
        {
            if (ball.x <= 5)
                player2.score += 1;
            if (ball.x >= court.width - 5)
                player1.score += 1;
            
            greenPlayer1.style.backgroundColor = 'grey';
            greenPlayer2.style.backgroundColor = 'grey';
            
            // Reset position ball et joueurs
            gameStatus.setStatus('isPaused', true);
            
            player1.setPosition(200);
            player2.setPosition(200);
            ball.setPosition(400, 200);

            // Mettre le jeu en pause
            cancelAnimationFrame(animationFrameId);

            // Attendre 1.5 secs avant de reprendre le mouvement
            setTimeout(() => {
                ball.speedX = 3 * (Math.random() > 0.5 ? 1 : -1);
                ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
                gameStatus.setStatus('isPaused', false);
                requestAnimationFrame(() => updateBallPosition(ball, player1, player2, player3, court, tournament));
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

        animationFrameId = requestAnimationFrame(() => updateBallPosition(ball, player1, player2, player3, court, tournament));
    }
}


////////// TOURNAMENT HANDLE ///////////////////

export function startTournament()
{
    Players = [];
    const inputElements = document.querySelectorAll('.form-control');
    for (let i = 0; i < inputElements.length && i < 4; i++) {
        Players.push(inputElements[i].value);
    }
    
    console.log(Players);
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

export function resetVisualizerTournament()
{
    let player1_visualizer = document.getElementById('player1_tv-pong');
    let player2_visualizer = document.getElementById('player2_tv-pong');
    let vs_visualizer = document.getElementById('vs_tv-pong');

    player1_visualizer.style.display = 'flex';
    player2_visualizer.style.display = 'flex';
    vs_visualizer.style.display = 'flex';
    document.getElementById('tournament-winner-pong').style.display = 'none';
}

function displayWinner(winner)
{
    let player1_visualizer = document.getElementById('player1_tv-pong');
    let player2_visualizer = document.getElementById('player2_tv-pong');
    let vs_visualizer = document.getElementById('vs_tv-pong');

    player1_visualizer.style.display = 'none';
    player2_visualizer.style.display = 'none';
    vs_visualizer.style.display = 'none';
    document.getElementById('tournament-winner-pong').style.display = 'flex';
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
            tournament.firstFinalist = tournament.playersScore[0] > tournament.playersScore[3] ? tournament.playersNames[0] : tournament.playersNames[3];
            tournament.secondFinalist = tournament.playersScore[1] > tournament.playersScore[2] ? tournament.playersNames[1] : tournament.playersNames[2];
            
            displayMatch(tournament.firstFinalist, tournament.secondFinalist);
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

        if (winner === 1 || winner === 2)
        {
            tournament.finalMatch = false;
            hideSection('ball');
            if (winner === 1)
                displayWinner(tournament.firstFinalist);
            else
                displayWinner(tournament.secondFinalist);
            await waitForButtonClickBack('Home-pong')
            gameStatus.setStatus('tournamentMod', false);
            gameStatus.setStatus('tournamenetInProgress', false);
        }
    }
}