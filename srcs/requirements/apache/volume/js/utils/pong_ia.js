
/////////// IA /////////////////

export function iaPlayer(ball_vX, ball_vY, ball_Y, ball_X, p_Y, data)
{
    let keyPress = null;
    let delay;

    if (data === 1) // Data dispo une fois pas seconde ==> prediction ball
    {
        // vitesse = distance / temps ==> temps = distance / vitesse
        const timeToReachPlayer = (800 - ball_X) / ball_vX;
    
        // d = v/t 'd = d + d' ==> postition probable en Y
        let futureBallY = ball_Y + ball_vY * timeToReachPlayer;
    
        // Rebonds sur les murs
        while (futureBallY < 0 || futureBallY > 400)
        {
            if (futureBallY < 0)
                futureBallY = -futureBallY;
            else if (futureBallY > 400)
                futureBallY = 800 - futureBallY;
        }
    
        // Deplacement vers la position future de la ball
        if (futureBallY < p_Y)
            keyPress = 'ArrowUp';
        else if (futureBallY > p_Y)
            keyPress = 'ArrowDown';
        delay = 400;
    }
    else  // Pas de data dispo ==> go centre
    {
        const centerY = 180;
        if (p_Y < centerY - 10)
            keyPress = 'ArrowDown';
        else if (p_Y > centerY + 10) 
            keyPress = 'ArrowUp';
        else
            keyPress = null; // already middle
        delay = 300;
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