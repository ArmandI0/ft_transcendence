document.addEventListener('DOMContentLoaded', (event) => {
    const button_play = document.getElementById('play_pong');
    const button_back = document.getElementById('back_play_pong');
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const gameContainer = document.getElementById('game-container');

    let player1Y = gameContainer.offsetHeight / 2 - player1.offsetHeight / 2;
    let player2Y = gameContainer.offsetHeight / 2 - player2.offsetHeight / 2;

    // Initial position
    player1.style.top = `${player1Y}px`;
    player2.style.top = `${player2Y}px`;

    button_play.addEventListener('click', () => {
        button_play.style.display = 'none';
        button_back.style.display = 'block';
        gameContainer.style.display = 'block';
        player1.style.display = 'block';
        player2.style.display = 'block';
    });

    button_back.addEventListener('click', () => {
        button_play.style.display = 'block';
        button_back.style.display = 'none';
        gameContainer.style.display = 'none';
        player1.style.display = 'none';
        player2.style.display = 'none';
    });

    document.addEventListener('keydown', (event) => {
        const step = 10;
        switch (event.key) {
            case 'w':
                player1Y = Math.max(0, player1Y - step);
                break;
            case 's':
                player1Y = Math.min(gameContainer.offsetHeight - player1.offsetHeight, player1Y + step);
                break;
            case 'ArrowUp':
                player2Y = Math.max(0, player2Y - step);
                break;
            case 'ArrowDown':
                player2Y = Math.min(gameContainer.offsetHeight - player2.offsetHeight, player2Y + step);
                break;
        }
        player1.style.top = `${player1Y}px`;
        player2.style.top = `${player2Y}px`;
    });
});