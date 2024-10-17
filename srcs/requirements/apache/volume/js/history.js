import { getCookie } from "./htmlRequest.js";

const test = {
    game: 'Pong',
    mode: 'LOCAL1V1',
    player1: 'player1',
    player1_s: 4,
    player2: 'player2',
    player2_s: 1,
    date: '10/08/2024'
};

async function getGameHistory() {
    try {
        const csrfToken = getCookie('csrftoken');

        const response = await fetch('/api/get_game_history/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erreur lors de la requête :', response.status, errorData);
            return null;
        }

        const dataReturn = await response.json();
        console.log('Succès :', dataReturn);
        return dataReturn;

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
        return null;
    }
}

function fillCompartments(data) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    const compartments = [
        data.game,
        data.mode,
        data.player1,
        data.player1_s,
        data.player2,
        data.player2_s,
        data.date
    ];

    compartments.forEach(content => {
        const compartment = document.createElement('div');
        compartment.className = 'grid-compartment';
        compartment.textContent = content;
        gridItem.appendChild(compartment);
    });

    return gridItem;
}

export async function fillHistory()
{
    const json = await getGameHistory();

    // console.log(json);

    const historyContainer = document.getElementById('history-container');
    const newGridItem = fillCompartments(test);
    historyContainer.appendChild(newGridItem);
}