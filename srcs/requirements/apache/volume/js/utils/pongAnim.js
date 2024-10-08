import * as gameStatus from './gameStatus.js' ;

export function slideInRodgerLogo()
{
    const rolandLogo = document.getElementById('rolandLogo');
    const rodgerLogo = document.getElementById('rodgerLogo');

    if (!gameStatus.getStatus('isAnimating'))
	{
        gameStatus.setStatus('isAnimating', true);

        // Réinitialiser les classes d'animation
        rolandLogo.classList.remove('slide-right-roland');
        rodgerLogo.classList.remove('slide-left');

        // Forcer un reflow pour que les classes soient effectivement retirées
        void rolandLogo.offsetWidth;

        rolandLogo.classList.add('slide-right-roland');

        // Attendre la fin de l'animation pour changer l'overlay
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

        // Réinitialiser les classes d'animation
        rodgerLogo.classList.remove('slide-right');
        rolandLogo.classList.remove('slide-left-roland');

        // Forcer un reflow pour que les classes soient effectivement retirées
        void rodgerLogo.offsetWidth;

		rolandLogo.style.top = '0';
		rolandLogo.style.left = '140%';

        rodgerLogo.classList.add('slide-right');

        // Attendre la fin de l'animation pour changer l'overlay
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