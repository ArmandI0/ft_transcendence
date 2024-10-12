import {padsWidth, padGeom, ballGeom, pad1Z, pad2Z, tableGeom, ballStartDir} from '../globals/pong3D_const.js';

/////////// IA /////////////////

export function preventKeys(key)
{
	document.addEventListener('keydown', function(event) {
		if (event.key === key) {
			console.log(event.key);
			event.preventDefault();
		}
	});
	document.addEventListener('keyup', function(event) {
		if (event.key === key) {
			event.preventDefault();
		}
	});	
	document.addEventListener('keypress', function(event) {
		if (event.key === key) {
			event.preventDefault();
		}
	});		
}

export function iaPlayer(ball_dir, ball, padIA, recenter)
{
    let keyPress = null;
    let delay = 200;
    const playerRange = tableGeom.getX();
    const padCenterX = padIA.position.x;

	// // Ajustement pour tenir compte de la taille de la balle et du joueur
	// let ballCollisionZ = tableGeom.getY() - ballGeom.getX();

	// let timeToReachPlayer;
	
	// // vitesse = distance / temps ==> temps = distance / vitesse
	// // Protection contre les divisions par zero
	// if (ball_dir.getZ() === 0)
	//     timeToReachPlayer = 9999;
	// else
	// 	timeToReachPlayer = (ballCollisionZ - ball.position.z) / ball_dir.getZ();

	// // d = v * t ==> Position probable de la balle en Y
	// let futureBallX = ball.position.x + ball_dir.getX() * timeToReachPlayer;

	// // Gestion des rebonds sur les murs
	// while (futureBallX < - tableGeom.getX() / 2 || futureBallX > tableGeom.getX() / 2)
	// {
	// 	console.log("boucle IA chelou");
	//     if (futureBallX < - tableGeom.getX() / 2)
	//         futureBallX = -futureBallX;
	//     else if (futureBallX > tableGeom.getX() / 2)
	//         futureBallX = tableGeom.getX() / 2 - futureBallX;
	// }

	if (recenter)
	{
		if (ball.position.x < padCenterX - padGeom.getX() / 3)
			keyPress = 'ArrowRight';
		else if (ball.position.x > padCenterX + padGeom.getX() / 3) 
			keyPress = 'ArrowLeft'; 
		else
			keyPress = null;
	}
	else
	{
		// if (padCenterX - padGeom.getX() / 3 > 0)
		// 	keyPress = 'ArrowRight';
		// else if (padCenterX + padGeom.getX() / 3 < 0)
		// 	keyPress = 'ArrowLeft'; 
		// else
		// 	keyPress = null;
	}
	
    if (keyPress)
    {
        const keyCode = keyPress === 'ArrowRight' ? 39: 37;
        
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