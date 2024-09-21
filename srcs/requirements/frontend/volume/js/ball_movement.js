function updateBallPosition()
{
    if (!GamePaused)
    {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        checkPlayerScore();

        const maxAngle = 70 * (Math.PI / 180);
        const maxSpeedY = Math.tan(maxAngle) * Math.abs(ballSpeedX);

        // Collision avec les murs haut et bas
        if (ballY - ballRad <= 0 || ballY + ballRad >= containerHeight_variation) // a regler 
            ballSpeedY = -ballSpeedY;

        // Collision avec joueur 1
        if (ballX - ballRad <= ballRad && ballX - ballRad >= 0 && ballY >= player1Y - player1_height2 && ballY <= player1Y + player1_height2)
        { 
            const hitPosition = ballY - player1Y;

            ballSpeedX = -ballSpeedX;

            ballSpeedY = hitPosition * 0.3;

            if (Math.abs(ballSpeedY) > maxSpeedY)
                ballSpeedY = Math.sign(ballSpeedY) * maxSpeedY;
        }
        // Collision avec joueur 2
        else if (ballX + ballRad >= 765 && ballX + ballRad <= 780 && ballY >= player2Y - player2_height2 && ballY <= player2Y + player2_height2)
        { 
            const hitPosition = ballY - player2Y; // Calcul par rapport au centre de la raquette

            ballSpeedX = -ballSpeedX;

            ballSpeedY = hitPosition * 0.3;

            if (Math.abs(ballSpeedY) > maxSpeedY)
                ballSpeedY = Math.sign(ballSpeedY) * maxSpeedY;
        }

        // Collision avec les bords gauche et droit du conteneur (score)
        if (ballX <= -10 || ballX >= containerWidth - 20)
        {
            if (ballX <= -10)
                player2_score.textContent++;
            if (ballX >= containerWidth - 20)
                player1_score.textContent++;

            // Reset la balle au centre
            ballX = containerWidth / 2 - ballRad;
            ballY = containerHeight / 2 - ballRad;
            ball.style.left = `${ballX}px`;
            ball.style.top = `${ballY}px`;
           

            // Attendre 1.5 secs avant de reprendre le mouvement
            setTimeout(() => {
                ballSpeedX = 2;
                ballSpeedY = 2;
                if (!GamePaused)
                    requestAnimationFrame(updateBallPosition);
            }, 1500);
            if (!Tournament)
                return;
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        animationFrameId = requestAnimationFrame(updateBallPosition);
    }
}