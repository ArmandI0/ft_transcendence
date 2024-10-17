import { SendDataCard } from './utils/SendDataHandle.js';
import * as gameStatus from './utils/gameStatus.js' ;

let cardValue = [];
let stockChronos = [];
let finalist = [];
let finalistChronos = [];
let playerNumber = 0;
let startTime;
let timer;

export let cardData = {
    flippedCards: [],
    PlayersCard: [],
};

export function resetCardGame()
{
    let F1 = document.getElementById('player1_finalist');
    let F2 = document.getElementById('player2_finalist');

    F1.style.color = 'white';
    F2.style.color = 'white';

    ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'].forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card.classList.contains('hidden'))
            card.classList.remove('hidden');
    });
    if (typeof timer !== 'undefined')
        stopChrono();
    returnALLFlippedCards();
    document.getElementById('chrono-visualizer').style.display = 'none';
    
    const playerIds = ['player1_tv', 'player2_tv', 'player3_tv', 'player4_tv'];
    
    playerIds.forEach(playerId => {
        const playerElement = document.getElementById(playerId);
        const currentColor = window.getComputedStyle(playerElement).color;

        if (currentColor === 'rgb(255, 255, 0)')
            playerElement.style.color = 'white';
    });
}

function findMinChronoIndex(finalistChronos)
{
    const minChrono = Math.min(...finalistChronos);
    const minIndex = finalistChronos.indexOf(minChrono);
    return minIndex;
}

function demiAndFinal()
{
    const visuPool = document.getElementById('tournament-visualizer-card');
    const visuFinal = document.getElementById('tournament-visualizer-card-final');
    const p1Final = document.getElementById('player1_finalist');
    const p2Final = document.getElementById('player2_finalist');

    if (stockChronos.lenght === 0)
        return null;
    const minChrono1 = Math.min(...stockChronos);
    const minIndex1 = stockChronos.indexOf(minChrono1);
    
    stockChronos[minIndex1] = Infinity;
    
    const minChrono2 = Math.min(...stockChronos);
    const minIndex2 = stockChronos.indexOf(minChrono2);
    
    stockChronos[minIndex1] = minChrono1;
    
    finalist.push(cardData.PlayersCard[minIndex1]);
    finalist.push(cardData.PlayersCard[minIndex2]);

    let toto = cardData.PlayersCard[minIndex1];
    let roro = cardData.PlayersCard[minIndex2];

    p1Final.textContent = ` ${toto}`;
    p2Final.textContent = ` ${roro}`;
    visuPool.style.display = 'none';
    visuFinal.style.display = 'flex';
}

function displayChrono(chrono)
{
    const player1Element = document.getElementById('player1_tv');
    const player2Element = document.getElementById('player2_tv');
    const player3Element = document.getElementById('player3_tv');
    const player4Element = document.getElementById('player4_tv');

    const p1Final = document.getElementById('player1_finalist');
    const p2Final = document.getElementById('player2_finalist');
    
    if (playerNumber === 0)
    {
        const formattedChrono = formatTime(chrono);
        player1Element.textContent = ` ${formattedChrono}`;
        stockChronos.push(chrono);
        SendDataCard(chrono, gameStatus.getStatus('id'), cardData.PlayersCard[0]);
        playerNumber = 1;
        document.getElementById('start').style.display = 'flex';
    }
    else if (playerNumber === 1)
    {
        const formattedChrono = formatTime(chrono);
        player2Element.textContent = ` ${formattedChrono}`;
        stockChronos.push(chrono);
        SendDataCard(chrono, gameStatus.getStatus('id'), cardData.PlayersCard[1]);
        playerNumber = 2;
        document.getElementById('start').style.display = 'flex';
    }
    else if (playerNumber === 2)
    {
        const formattedChrono = formatTime(chrono);
        player3Element.textContent = ` ${formattedChrono}`;
        stockChronos.push(chrono);
        SendDataCard(chrono, gameStatus.getStatus('id'), cardData.PlayersCard[2]);
        playerNumber = 3;
        document.getElementById('start').style.display = 'flex';
    }
    else if (playerNumber === 3)
    {
        const formattedChrono = formatTime(chrono);
        player4Element.textContent = ` ${formattedChrono}`;
        stockChronos.push(chrono);
        SendDataCard(chrono, gameStatus.getStatus('id'), cardData.PlayersCard[3]);

        playerNumber = 4;
        demiAndFinal();
        document.getElementById('start').style.display = 'flex';
    }
    else if(playerNumber === 4)
    {
        // FINAL
        const formattedChrono = formatTime(chrono);
        player3Element.textContent = ` ${formattedChrono}`;
        finalistChronos.push(chrono);
        SendDataCard(chrono, gameStatus.getStatus('id'), finalist[0]);
        playerNumber = 5;
        document.getElementById('start').style.display = 'flex';
    }
    else if (playerNumber === 5)
    {
        // RESULT FINAL
        const formattedChrono = formatTime(chrono);
        player4Element.textContent = ` ${formattedChrono}`;
        finalistChronos.push(chrono);
        SendDataCard(chrono, gameStatus.getStatus('id'), finalist[1]);

        playerNumber = 0;

        let winner = findMinChronoIndex(finalistChronos);
        if (winner === 0)
            p1Final.style.color = 'yellow';
        else if (winner === 1)
            p2Final.style.color = 'yellow';
        resetGameData()

    }
}

function resetGameData() {
    finalistChronos.length = 0;
    cardData.flippedCards.length = 0;
    cardData.PlayersCard.length = 0;
    finalist.length = 0;
    stockChronos.length = 0;

}


export async function checkWin() 
{
    const allCards = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'];
    const allHidden = allCards.every(cardId => {
        const card = document.getElementById(cardId);
        return card.classList.contains('hidden');
    });

    if (allHidden)
    {
        const elapsedTime = stopChrono();
        if (gameStatus.getStatus('tournamentCard'))
        {
            displayChrono(elapsedTime);
        }
        else
        {
            SendDataCard(elapsedTime, gameStatus.getStatus('id'), cardData.PlayersCard[0]);
            document.getElementById('start').style.display = 'flex';
        }
        
    }
}

export function compareValue()
{
    if (cardData.flippedCards[0] === cardData.flippedCards[1])
        return (0);
    else if (cardData.flippedCards[0].textContent === cardData.flippedCards[1].textContent)
        return 1;
    return 0;
}

export function returnFlippedCards() 
{
    cardData.flippedCards.forEach(card => {
        card.classList.toggle('card-front');
        card.classList.toggle('card-back');
    });
    cardData.flippedCards = [];
}

function returnALLFlippedCards() 
{
    ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'].forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card.classList.contains('card-front')) {
            card.classList.remove('card-front');
            card.classList.add('card-back');
        }
    });
    cardData.flippedCards = [];
}


function findValueInArray(array, value) 
{
    return array.find(element => element === value);
}

async function giveValue()
{
    let value;
    let banValues = [];
    let banNumbers = [];

    for (let i = 0; i < 9; i++) 
    {
        let cardNumber1 = Math.floor(Math.random() * 18);
        let cardNumber2 = Math.floor(Math.random() * 18);
        while (!(findValueInArray(banNumbers, cardNumber1) === undefined) 
                || !(findValueInArray(banNumbers, cardNumber2) === undefined) 
                || cardNumber1 === cardNumber2)
        {
            cardNumber1 = Math.floor(Math.random() * 18);
            cardNumber2 = Math.floor(Math.random() * 18);
        }

        banNumbers.push(cardNumber1);
        banNumbers.push(cardNumber2);

        value = Math.floor(Math.random() * 9) + 1;
        while (!(findValueInArray(banValues, value) === undefined))
            value = Math.floor(Math.random() * 9) + 1;

        banValues.push(value);


        cardValue[cardNumber1] = value;
        cardValue[cardNumber2] = value;
    }

    for (let i = 0; i < 18; i++)
        document.getElementById(`card${i + 1}`).textContent = cardValue[i];
    
    if (gameStatus.getStatus('isPower'))
    {
        gameStatus.setStatus('isCardClickable', false);
        flipCardsTemporarily(['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8',
            'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18']);
        await reflipCardsTemporarily(['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8',
            'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'], 1000);
    }
}


function flipCardsTemporarily(cardIds) {

    cardIds.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card.classList.contains('card-back')) {
            card.classList.remove('card-back');
            card.classList.add('card-front');
        }
    });
}

async function reflipCardsTemporarily(cardIds, duration) {
    setTimeout(() => {
        cardIds.forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card.classList.contains('card-front')) {
                card.classList.remove('card-front');
                card.classList.add('card-back');
            }
        });
        gameStatus.setStatus('isCardClickable', true);
    }, duration);

}


function formatTime(milliseconds) 
{
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const remainingMilliseconds = milliseconds % 1000;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${remainingMilliseconds < 100 ? '0' : ''}${remainingMilliseconds < 10 ? '0' : ''}${remainingMilliseconds}`;
}

function updateTimer() 
{
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime; // Temps écoulé en millisecondes
    document.getElementById('chrono-visualizer').textContent = formatTime(elapsedTime);
}

function stopChrono() 
{
    clearInterval(timer);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime; // Temps écoulé en millisecondes
    document.getElementById('chrono-visualizer').textContent = formatTime(elapsedTime); // Afficher le temps final formaté
    return elapsedTime;
}

export function startGame() 
{
    document.getElementById('chrono-visualizer').style.display = 'flex';
    startTime = Date.now();
    timer = setInterval(updateTimer, 50); // Mettre à jour toutes les 50 millisecondes pour plus de précision
    giveValue();
}

//////////// TOURNAMENT HANDLE //////////////

export function validatePlayers(players) 
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

export function setNames()
{
    document.getElementById('player1_tv').textContent = cardData.PlayersCard[0];
    document.getElementById('player2_tv').textContent = cardData.PlayersCard[1];
    document.getElementById('player3_tv').textContent = cardData.PlayersCard[2];
    document.getElementById('player4_tv').textContent = cardData.PlayersCard[3];
}
