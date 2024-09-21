let cardValue = [];
let flippedCards = [];
let stockChronos = [];
playerNumber = 0;


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

function findMinChronoIndex(stockChronos)
{
    if (stockChronos.length === 0)
        return null;
    const minChrono = Math.min(...stockChronos);
    return stockChronos.indexOf(minChrono);
}

function displayChrono(chrono)
{
    const player1Element = document.getElementById('player1_tv');
    const player2Element = document.getElementById('player2_tv');
    const player3Element = document.getElementById('player3_tv');
    const player4Element = document.getElementById('player4_tv');

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

        playerNumber = 0;
        let winner = findMinChronoIndex(stockChronos);
        if (winner === 0)
            player1Element.style.color = 'yellow';
        else if (winner === 1)
            player2Element.style.color = 'yellow';
        else if (winner === 2)
            player3Element.style.color = 'yellow';
        else if (winner === 3)
            player4Element.style.color = 'yellow';
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
    if (flippedCards[0].textContent === flippedCards[1].textContent)
        return 1;
    return 0;
}

function returnCard(cardId)
{
    const cardElement = document.getElementById(cardId);
    
    if (cardElement) 
    {
        cardElement.addEventListener('click', function() {
            
            if (flippedCards.length < 2)
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
    // else
    //     console.error(`Element with ID ${cardId} not found`);
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

function giveValue()
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