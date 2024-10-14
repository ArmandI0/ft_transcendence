import { dataPostPong, setPongData } from "./utils/SendGameData.js";
import * as gameStatus from './utils/gameStatus.js' ;

function getCurrentFormattedDate() 
{
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function formatGameDuration(durationInSeconds) 
{
    const hours = String(Math.floor(durationInSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((durationInSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(durationInSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export function SendDataPong(player1, player2)
{
    if (gameStatus.getStatus('ia'))
    {
        dataPostPong.score_player1 = player1.score;
        dataPostPong.score_player2 = player2.score;
        dataPostPong.game = 'RollandGapong';
        
        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(player1.startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        console.log(dataPostPong.score_player1);
        console.log(dataPostPong.score_player2);
        console.log(dataPostPong.game);
        console.log(dataPostPong.game_duration);
        console.log(dataPostPong.date)
        setPongData();
    }
}
