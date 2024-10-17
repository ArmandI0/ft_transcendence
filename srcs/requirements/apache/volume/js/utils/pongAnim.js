import * as gameStatus from './gameStatus.js' ;

export function slideInRodgerLogo()
{
    const rolandLogo = document.getElementById('rolandLogo');
    const rodgerLogo = document.getElementById('rodgerLogo');

    if (!gameStatus.getStatus('isAnimating'))
	{
        gameStatus.setStatus('isAnimating', true);

        rolandLogo.classList.remove('slide-right-roland');
        rodgerLogo.classList.remove('slide-left');

        void rolandLogo.offsetWidth;

        rolandLogo.classList.add('slide-right-roland');

        setTimeout(() => {
            rolandLogo.classList.remove('slide-right-roland');
            rolandLogo.style.display = 'none';
            rodgerLogo.style.display = 'flex';

            setTimeout(() => {
                rodgerLogo.classList.add('slide-left');
				gameStatus.setStatus('isAnimating', false);
            }, 500);
        }, 500);
    }
}

export function slideInRolandLogo()
{
    const rolandLogo = document.getElementById('rolandLogo');
    const rodgerLogo = document.getElementById('rodgerLogo');

    if (!gameStatus.getStatus('isAnimating'))
	{
		gameStatus.setStatus('isAnimating', true);

        rodgerLogo.classList.remove('slide-right');
        rolandLogo.classList.remove('slide-left-roland');

        void rodgerLogo.offsetWidth;

		rolandLogo.style.top = '0';
		rolandLogo.style.left = '140%';

        rodgerLogo.classList.add('slide-right');
        
        setTimeout(() => {
            rodgerLogo.classList.remove('slide-right');
            rodgerLogo.style.display = 'none';
            rolandLogo.style.display = 'flex';

            setTimeout(() => {
                rolandLogo.classList.add('slide-left-roland');
                gameStatus.setStatus('isAnimating', false);
            }, 500);
        }, 500); 
    }
}