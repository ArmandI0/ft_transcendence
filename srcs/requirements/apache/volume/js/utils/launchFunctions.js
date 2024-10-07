import { generateCharts } from "../charts.js";
const datas = 
[
    { gameid: 1, won:0, time: 50 },
    { gameid: 2, won:1, time: 20 },
    { gameid: 3, won:0, time: 30 },
    { gameid: 4, won:0, time: 50 },
    { gameid: 5, won:0, time: 100 },
    { gameid: 6, won:1, time: 120 },
    { gameid: 7, won:1, time: 150 },
    { gameid: 8, won:0, time: 50 },
    { gameid: 9, won:1, time: 200 },
    { gameid: 10, won:1, time: 50 },
    { gameid: 11, won:0, time: 50 },
    { gameid: 12, won:1, time: 50 },
    { gameid: 13, won:1, time: 50 },
    { gameid: 14, won:1, time: 100 },
    { gameid: 15, won:0, time: 50 },
    { gameid: 16, won:0, time: 20 },
    { gameid: 17, won:1, time: 10 },
    { gameid: 18, won:1, time: 120 },
    { gameid: 19, won:1, time: 50 },
    { gameid: 20, won:0, time: 10 }, 
    { gameid: 21, won:1, time: 20 },
    { gameid: 22, won:1, time: 50 },
    { gameid: 23, won:1, time: 50 },
    { gameid: 24, won:1, time: 10 },
    { gameid: 25, won:1, time: 15 }    
]


export async function launchFunctions(page)
{
    if (page === 'charts')
		  generateCharts(datas);
}