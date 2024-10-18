import {padsWidth, padGeom, ballGeom, pad1Z, pad2Z, tableGeom, ballStartDir} from '../globals/pong3D_const.js';

/////////// IA /////////////////

function checkAlignementPad(ball, padIA)
{
	const padIA_right = padIA.position.x - padGeom.getX()/2; 
	const padIA_left = padIA.position.x + padGeom.getX()/2; 
	const ball_right = ball.position.x - ballGeom.getX();
	const ball_left = ball.position.x + ballGeom.getX();

		if (ball_left < padIA_right || ball_right > padIA_left)
			return false;
		else
			return true;

}

export function preventKeys(key)
{
	document.addEventListener('keydown', function(event) {
		if (event.key === key) {
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
    const padCenterX = padIA.position.x;

	if (!recenter)
	{
		if (checkAlignementPad(ball, padIA))
			keyPress = null;
		else if (ball.position.x > padCenterX )
			keyPress = 'ArrowRight';
		else
			keyPress = 'ArrowLeft'; 

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