import { getCookie } from "../htmlRequest.js";

export const dataPostPong = {
    mode: '-----',
    player1: "toto",
    player2: "Alice Johnson",
    score_player1: "8",
    score_player2: "5",
    game: "Cyberpong",
    game_duration: "00:20:00",
    date: "2024-10-01T14:30:00",
    tournament_id: 1,

};


export const dataPostCard = {
    mode: '-----',
    player1: 'player',
    date: "2024-10-01T15:30:00",
    game_duration: "00:30:00",
    tournament_id: 2               
};

export const dataPostTournament = {
    game_type: "RollandGapong",
    date: "2024-10-01T15:30:00"      
};

export async function setPongData() {
    try {
        const csrfToken = getCookie('csrftoken');

        const response = await fetch('/api/set_pong_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(dataPostPong),
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erreur lors de la requête :', response.status, errorData);
            return null;
        }

        const dataReturn = await response.json();
        return dataReturn;

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
        return null;
    }
}

export async function setCardData() {
    try {
        const csrfToken = getCookie('csrftoken');

        const response = await fetch('/api/set_card_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(dataPostCard),
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erreur lors de la requête :', response.status, errorData);
            return null;
        }

        const dataReturn = await response.json();
        return dataReturn;

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
        return null;
    }
}

export async function setTournament() {
    try {
        const csrfToken = getCookie('csrftoken');

        const response = await fetch('/api/set_tournament/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(dataPostTournament),
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erreur lors de la requête :', response.status, errorData);
            return null;
        }

        const dataReturn = await response.json();
        return dataReturn.id;

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
        return null;
    }
}