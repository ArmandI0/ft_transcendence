import { generateChart } from "../charts.js";

export async function launchFunctions(page)
{
    if (page === 'charts')
    {
		generateChart('bars-score-by-game');
    }
}