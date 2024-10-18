
/////////// IA /////////////////

export function iaPlayer(ball_vX, ball_vY, ball_Y, ball_X, p_Y, data)
{
    let keyPress = null;
    let delay;
    const playerRange = 100;
    const playerCenterY = p_Y + playerRange / 2;
    const IA = document.getElementById('visuIA');
    
    let ballCollisionX = 770;

    let timeToReachPlayer = (ballCollisionX - ball_X) / ball_vX;

    if (ball_vX === 0)
        timeToReachPlayer = 9999;

    let futureBallY = ball_Y + ball_vY * timeToReachPlayer;

    while (futureBallY < 0 || futureBallY > 400)
    {
        if (futureBallY < 0)
            futureBallY = -futureBallY;
        else if (futureBallY > 400)
            futureBallY = 800 - futureBallY;
    }

    if (data === 1)
    {
        if (futureBallY < playerCenterY - 10)
            keyPress = 'ArrowUp'; 
        else if (futureBallY > playerCenterY + 10) 
            keyPress = 'ArrowDown';
        else
            keyPress = null;
    }
    delay = 200;

    if (IA)
        IA.style.top = futureBallY + 'px';

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