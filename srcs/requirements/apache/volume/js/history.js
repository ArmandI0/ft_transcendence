import { getCookie } from "./htmlRequest.js";

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

    if(Array.isArray(json))
    {
        json.forEach((obj, index) => {
            displayLineHistory(obj, index);
        });
    }
}

function displayLineHistory(obj, index)
{
    const historyContainer = document.getElementById('history-container');
    if (obj.game_type === 'RollandGapong')
    {
        const data = {
            game: obj.game_type,
            mode: obj.data.mode,
            player1: obj.data.guest1,
            player1_s: obj.data.score_player1,
            player2: obj.data.guest2,
            player2_s: obj.data.score_player2,
            date: obj.data.date
        };
        const newGridItem = fillCompartments(data);
        historyContainer.appendChild(newGridItem);
    }
    else if (obj.game_type === 'Card')
    {
        const data = {
            game: obj.game_type,
            mode: obj.data.mode,
            player1: obj.data.guest1,
            player1_s: obj.data.score_player1,
            player2: obj.data.game_duration,
            player2_s: obj.data.score_player2,
            date: obj.data.date
        };
        const newGridItem = fillCompartments(data);
        historyContainer.appendChild(newGridItem);
    }
}