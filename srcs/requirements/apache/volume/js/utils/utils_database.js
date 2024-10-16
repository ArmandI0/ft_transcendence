async function setPongData(dataPost) {
    try {
        const csrfToken = getCookie('csrftoken');

        const response = await fetch('/api/set_pong_result/', {
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

async function setCardData() {
    try {
        const csrfToken = getCookie('csrftoken');
		const dataPost = {
            date: "2024-10-01T15:30:00",   // Date 
            game_duration: "00:30:00",     // Durée du jeu
            // tournament_id: 2               // ID du tournoi si necessaiere
        };

        const response = await fetch('/api/set_card_result/', {
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

// la fonction retourne l'id du tournoi a garder et a passer dans l'enregistrement des parties
async function setTournament() {
    try {
        const csrfToken = getCookie('csrftoken');
		const dataPost = {
			"game_type": "RollandGapong",       // Type de jeu 
			"date": "2024-10-01T15:30:00"       // Date et heure du tournoi
		};

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