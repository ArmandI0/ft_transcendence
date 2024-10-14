import { getCookie } from "../htmlRequest";

export const dataPostPong = {
    player2: "Alice Johnson",      // Nom du joueur 2 -> pas besoin de mettre joueur car c'est le user connecte
    score_player1: "8",            // Score du joueur 1
    score_player2: "5",            // Score du joueur 2
    game: "Cyberpong",         // Type de jeu voir les nom preetabli par Nico
    game_duration: "00:20:00",     // Durée du jeu
    date: "2024-10-01T14:30:00",   // Date  on verra le format si jamais
    // tournament_id: 1,              // ID du tournoi laisse a enlever si c'est pas un tournoi
    // tournament_phase: "0"    // Phase du tournoi 0=final pui 1 2 3 
};

export const dataPostCard = {
    date: "2024-10-01T15:30:00",   // Date 
    game_duration: "00:30:00",     // Durée du jeu
    // tournament_id: 2               // ID du tournoi si necessaiere
};

export const dataPostTournament = {
    "game_type": "RollandGapong",       // Type de jeu 
    "date": "2024-10-01T15:30:00"       // Date et heure du tournoi
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
        console.log('Succès :', dataReturn);
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
        console.log('Succès :', dataReturn);
        return dataReturn;

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
        return null;
    }
}

// la fonction retourne l'id du tournoi a garder et a passer dans l'enregistrement des parties
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
            body: JSON.stringify(dataPost),
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