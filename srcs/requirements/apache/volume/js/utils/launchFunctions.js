import { generateCharts } from "../charts.js";



export async function launchFunctions(page)
{
    if (page === 'charts')
		  generateCharts();
}