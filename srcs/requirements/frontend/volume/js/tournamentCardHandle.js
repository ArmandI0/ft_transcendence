let tournamentCard = false;

const PlayersCard = [4];

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