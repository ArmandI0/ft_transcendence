document.addEventListener('DOMContentLoaded', (event) => {
    const button_play = document.getElementById('play_pong');
    const button_back = document.getElementById('back_play_pong');
    const gameContainer = document.getElementById('game-container');

    button_play.addEventListener('click', () => {
        button_play.style.display = 'none';
        button_back.style.display = 'block';
        gameContainer.style.display = 'block';
    });

    button_back.addEventListener('click', () => {
        button_play.style.display = 'block';
        button_back.style.display = 'none';
        gameContainer.style.display = 'none';
    });
});