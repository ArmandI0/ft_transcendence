import { generateChart } from "../charts.js";
const data = [
  { y: 3, x:1 },
  { y: 50, x:1 },
  { y: 5, x:1 },
  { y: 10, x:1 },
  { y: 2, x:1 }
];

export async function launchFunctions(page)
{
    if (page === 'charts')
    {
		  generateChart('bars-score-by-game', data, 'bars', "Proportion of games won every 10 games");
		  generateChart('pie-win-defeat', data, 'pie', "Proportion of games won overall");
    }
}