document.addEventListener('DOMContentLoaded', (event) => {
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const ball = document.getElementById('ball');
    const ballStyles = window.getComputedStyle(ball);
    const ballDiam = parseFloat(ballStyles.height);

    const container = document.getElementById('game-container');
    const containerStyles = window.getComputedStyle(container);
    const containerHeight = parseFloat(containerStyles.height);
    const containerWidth = parseFloat(containerStyles.width);
    
    console.log(`Container height: ${containerHeight}px`);

    let player1Y = containerHeight/ 2 - player1.offsetHeight / 2;
    let player2Y = containerHeight / 2 - player2.offsetHeight / 2;
    
    let ballX = containerWidth / 2;
    let ballY = containerHeight / 2;

    // vitesse de la balle
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    const playerCollisionOffset1 = 50;
    const playerCollisionOffset2 = 350;

    // Initial position
    player1.style.top = `${player1Y}px`;
    player2.style.top = `${player2Y}px`;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    const keysPressed = {};
    
    //vitesse deplacement des joueurs
    const step = 8;

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });

    function updatePlayersPosition() 
    {
        if (keysPressed['w'])
            player1Y = Math.max(playerCollisionOffset1, player1Y - step);
        if (keysPressed['s'])
            player1Y = Math.min(playerCollisionOffset2, player1Y + step);
        if (keysPressed['ArrowUp'])
            player2Y = Math.max(playerCollisionOffset1, player2Y - step);
        if (keysPressed['ArrowDown'])
            player2Y = Math.min(playerCollisionOffset2, player2Y + step);

        player1.style.top = `${player1Y}px`;
        player2.style.top = `${player2Y}px`;

        requestAnimationFrame(updatePlayersPosition);
    }

    const ballDiameter1 = containerHeight - (containerHeight - (ballDiam / 2));
    const ballDiameter2 = containerHeight - (ballDiam / 2);
    
    //effet enfonctement leger de la balle dans le plateau joueur
    const playerWidth1 = 15;
    const playerWidth2 = 765;

    const accuracyWallHit_left = -5;
    const accuracyWallHit_right = 785;
    
    function updateBallPosition()
    {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY <= ballDiameter1 || ballY >= ballDiameter2)
            ballSpeedY = -ballSpeedY;
        // Collision avec joueur 1
        else if (ballX <= playerWidth1 && ballY >= player1Y - playerCollisionOffset1 && ballY <= player1Y + playerCollisionOffset1)
            ballSpeedX = -ballSpeedX;
        // Collision avec joueur 2
        else if (ballX >= playerWidth2 && ballY >= player2Y - playerCollisionOffset1 && ballY <= player2Y + playerCollisionOffset1)
            ballSpeedX = -ballSpeedX;
        // Collision avec les bords du conteneur
        else if (ballX <= accuracyWallHit_left || ballX >= accuracyWallHit_right )
        {
            ballX = containerWidth / 2;
            ballY = containerHeight / 2;
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(updateBallPosition);
    }

    requestAnimationFrame(updatePlayersPosition);
    requestAnimationFrame(updateBallPosition);
});