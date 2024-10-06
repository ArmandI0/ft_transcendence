
/////////// IA /////////////////

export function iaPlayer(ball_vX, ball_vY, ball_Y, ball_X, p_Y, data)
{
    let keyPress = null;
    let delay;
    const playerRange = 100;
    const playerCenterY = p_Y + playerRange / 2;
    

    if (data === 1) // Data dispo une fois par seconde ==> prediction ball
    {
        // Ajustement pour tenir compte de la taille de la balle et du joueur
        let ballCollisionX = 770;
    
        // vitesse = distance / temps ==> temps = distance / vitesse
        let timeToReachPlayer = (ballCollisionX - ball_X) / ball_vX;
    
        // Protection contre les divisions par zero
        if (ball_vX === 0)
            timeToReachPlayer = 9999;
    
        // d = v * t ==> Position probable de la balle en Y
        let futureBallY = ball_Y + ball_vY * timeToReachPlayer;
    
        // Gestion des rebonds sur les murs
        while (futureBallY < 0 || futureBallY > 400)
        {
            if (futureBallY < 0)
                futureBallY = -futureBallY;
            else if (futureBallY > 400)
                futureBallY = 800 - futureBallY;
        }

        if (futureBallY < playerCenterY - playerRange / 2)
            keyPress = 'ArrowUp'; 
        else if (futureBallY > playerCenterY + playerRange / 2) 
            keyPress = 'ArrowDown';
        else
            keyPress = null; // Ne rien faire si la balle est dans la zone cible pour eviter mouvements parasites
    
        delay = 400;
    }

    if (keyPress)
    {
        const keyCode = keyPress === 'ArrowUp' ? 38 : 40;
        
        const keydownEvent = new KeyboardEvent('keydown', {
            key: keyPress,
            code: keyPress,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
        });

        const keyupEvent = new KeyboardEvent('keyup', {
            key: keyPress,
            code: keyPress,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
        });

        document.dispatchEvent(keydownEvent);

        setTimeout(() => {
            document.dispatchEvent(keyupEvent);
        }, delay);
    }
}