import * as gameStatus from './utils/gameStatus.js' ;

let cardValue = [];
let flippedCards = [];
let stockChronos = [];
let finalist = [];
let finalistChronos = [];
let playerNumber = 0;
let startTime;
let timer;
let tournamentCard = false;

const PlayersCard = [4];


['card1', 'card2', 'card3', 'card4', 'card5', 'card6'
        , 'card7', 'card8', 'card9', 'card10', 'card11', 'card12'
        , 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'].forEach(returnCard);

function resetCardGame()
{
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
    
    finalist.push(PlayersCard[minIndex1]);
    finalist.push(PlayersCard[minIndex2]);

    let toto = PlayersCard[minIndex1];
    let roro =PlayersCard[minIndex2];

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
        playerNumber = 1;
    }
    else if (playerNumber === 1)
    {
        const formattedChrono = formatTime(chrono);
        player2Element.textContent = ` ${formattedChrono}`;
        stockChronos.push(chrono);
        playerNumber = 2;
    }
    else if (playerNumber === 2)
    {
        const formattedChrono = formatTime(chrono);
        player3Element.textContent = ` ${formattedChrono}`;
        stockChronos.push(chrono);
        playerNumber = 3;
    }
    else if (playerNumber === 3)
    {
        const formattedChrono = formatTime(chrono);
        player4Element.textContent = ` ${formattedChrono}`;
        stockChronos.push(chrono);

        playerNumber = 4;
        demiAndFinal();
    }
    else if(playerNumber === 4)
    {
        // FINAL
        const formattedChrono = formatTime(chrono);
        player3Element.textContent = ` ${formattedChrono}`;
        finalistChronos.push(chrono);
        playerNumber = 5;
    }
    else if (playerNumber === 5)
    {
        // RESULT FINAL
        const formattedChrono = formatTime(chrono);
        player4Element.textContent = ` ${formattedChrono}`;
        finalistChronos.push(chrono);

        playerNumber = 0;

        let winner = findMinChronoIndex(finalistChronos);
        if (winner === 0)
            p1Final.style.color = 'yellow';
        else if (winner === 1)
            p2Final.style.color = 'yellow';
    }
}

function checkWin() 
{
    const allCards = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18'];
    const allHidden = allCards.every(cardId => {
        const card = document.getElementById(cardId);
        return card.classList.contains('hidden');
    });

    if (allHidden)
    {
        const elapsedTime = stopChrono();
        if (tournamentCard)
        {
            displayChrono(elapsedTime);
        }
        document.getElementById('start').style.display = 'flex';
        
    }
}

function compareValue()
{
    if (flippedCards[0] === flippedCards[1])
        return (0);
    else if (flippedCards[0].textContent === flippedCards[1].textContent)
        return 1;
    return 0;
}

function returnCard(cardId)
{
    const cardElement = document.getElementById(cardId);
    
    if (cardElement) 
    {
        
        cardElement.addEventListener('click', function() {
            
            if (flippedCards.length < 2 && gameStatus.getStatus('isCardClickable'))
            {
                this.classList.toggle('card-front');
                this.classList.toggle('card-back');
                flippedCards.push(this);

                if (flippedCards.length === 2)
                {
                    if (compareValue() === 0)
                        setTimeout(returnFlippedCards, 500);
                    else 
                    {
                        flippedCards.forEach(card => {
                            card.classList.add('hidden');
                        });
                        checkWin();
                        flippedCards = [];
                    }
                }
            }
        });
    }
}

function returnFlippedCards() 
{
    flippedCards.forEach(card => {
        card.classList.toggle('card-front');
        card.classList.toggle('card-back');
    });
    flippedCards = [];
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
    flippedCards = [];
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
        // Sélection aleatoire des paires
        let cardNumber1 = Math.floor(Math.random() * 18);
        let cardNumber2 = Math.floor(Math.random() * 18);
        while (!(findValueInArray(banNumbers, cardNumber1) === undefined) 
                || !(findValueInArray(banNumbers, cardNumber2) === undefined) 
                || cardNumber1 === cardNumber2)
        {
            cardNumber1 = Math.floor(Math.random() * 18);
            cardNumber2 = Math.floor(Math.random() * 18);
        }

        // Ajout des numeros de cartes aux numeros bannis
        banNumbers.push(cardNumber1);
        banNumbers.push(cardNumber2);

        // Attribution aleatoire des valeurs
        value = Math.floor(Math.random() * 9) + 1;
        while (!(findValueInArray(banValues, value) === undefined))
            value = Math.floor(Math.random() * 9) + 1;

        // Ajout de la valeur aux valeurs bannies
        banValues.push(value);

        // Attribution des valeurs aux cartes
        cardValue[cardNumber1] = value;
        cardValue[cardNumber2] = value;
    }

    // Mise a jour des elements HTML avec les valeurs des cartes
    for (let i = 0; i < 18; i++)
        document.getElementById(`card${i + 1}`).textContent = cardValue[i];
    // Utilisation de la fonction avec une durée de 3 secondes (3000 millisecondes)
    
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

function startGame() 
{
    document.getElementById('chrono-visualizer').style.display = 'flex';
    startTime = Date.now();
    timer = setInterval(updateTimer, 50); // Mettre à jour toutes les 50 millisecondes pour plus de précision
    giveValue();
}


//////////// MENU INTERACTIONS //////////////////////

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
    showSectionCard('Home');
    document.getElementById('start').style.display = 'flex';
});

document.getElementById('button-tournament-card').addEventListener('click', function() 
{
    hideSectionCard('main-menu-buttons-card');
    showSectionCard('tournament-container-card');
    showSectionCard('Home');
});

document.getElementById('start').addEventListener('click', function() 
{
    resetCardGame();
    startGame();
    document.getElementById('start').style.display = 'none';
});

document.getElementById('Parameters').addEventListener('click', function() {
    const isSectionVisible = gameStatus.getStatus('paramSectionVisible');
    
    const section = document.getElementById('select-param');

    if (isSectionVisible) 
    {
        section.classList.remove('show');
        setTimeout(() => {
            section.style.display = 'none';
        }, 500);
    }
    else
    {
        section.style.display = 'flex'; 
        setTimeout(() => {
            section.classList.add('show');
        }, 10);
    }
    
    gameStatus.setStatus('paramSectionVisible', !isSectionVisible);
});

document.querySelectorAll('.btn-custom4-card').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.btn-custom4-card').forEach(btn => {
            btn.classList.remove('selected');
            btn.classList.add('not-selected');
        });
        
        this.classList.add('selected');
        this.classList.remove('not-selected');
    });
});

document.querySelectorAll('.btn-custom5-card').forEach(button => {
    button.addEventListener('click', function() {

        if (this.classList.contains('selected')) {
            gameStatus.setStatus('isPower', false);
            this.classList.remove('selected');
            this.classList.add('not-selected');
        } else {
            gameStatus.setStatus('isPower', true);
            document.querySelectorAll('.btn-custom5-card').forEach(btn => {
                btn.classList.remove('selected');
                btn.classList.add('not-selected');
            });

            this.classList.add('selected');
            this.classList.remove('not-selected');
        }
    });
});

document.getElementById('white').addEventListener('click', function() {
    const cardBacks = document.getElementsByClassName('card-back');
    const cardFronts = document.getElementsByClassName('card-front');

    for (let i = 0; i < cardFronts.length; i++) {
        cardFronts[i].style.backgroundColor = 'white';
    }
    for (let i = 0; i < cardBacks.length; i++) {
        cardBacks[i].style.backgroundColor = 'white';
    }
});

document.getElementById('grey').addEventListener('click', function() {
    const cardBacks = document.getElementsByClassName('card-back');
    const cardFronts = document.getElementsByClassName('card-front');

    for (let i = 0; i < cardFronts.length; i++) {
        cardFronts[i].style.backgroundColor = 'grey';
    }
    for (let i = 0; i < cardBacks.length; i++) {
        cardBacks[i].style.backgroundColor = 'grey';
    }
});

document.getElementById('blue').addEventListener('click', function() {
    const cardBacks = document.getElementsByClassName('card-back');
    const cardFronts = document.getElementsByClassName('card-front');

    for (let i = 0; i < cardBacks.length; i++) {
        cardBacks[i].style.backgroundColor = 'lightblue';
    }
    for (let i = 0; i < cardFronts.length; i++) {
        cardFronts[i].style.backgroundColor = 'lightblue';
    }
});

document.getElementById('yellow').addEventListener('click', function() {
    const cardBacks = document.getElementsByClassName('card-back');
    const cardFronts = document.getElementsByClassName('card-front');
    
    for (let i = 0; i < cardFronts.length; i++) {
        cardFronts[i].style.backgroundColor = '#FFFFE0';
    }
    for (let i = 0; i < cardBacks.length; i++) {
        cardBacks[i].style.backgroundColor = '#FFFFE0';
    }
});

document.getElementById('Home').addEventListener('click', function()
{
    resetCardGame();
    gameStatus.setStatus('isPower', false);
    hideSectionCard('tournament-visualizer-card-final');
    hideSectionCard('hide-game-container');
    hideSectionCard('tournament-container-card');
    hideSectionCard('tournament-visualizer-card');
    hideSectionCard('Home');
    showSectionCard('main-menu-buttons-card');
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


//////////// TOURNAMENT HANDLE //////////////

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

function setNames()
{
    document.getElementById('player1_tv').textContent = PlayersCard[0];
    document.getElementById('player2_tv').textContent = PlayersCard[1];
    document.getElementById('player3_tv').textContent = PlayersCard[2];
    document.getElementById('player4_tv').textContent = PlayersCard[3];
}
