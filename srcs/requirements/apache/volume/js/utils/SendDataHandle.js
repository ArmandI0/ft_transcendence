import { dataPostCard, dataPostPong, setPongData } from "./SendGameData.js";
import * as gameStatus from './gameStatus.js' ;

export function getCurrentFormattedDate() 
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

export function SendDataPong(player1, player2, tournament)
{
    if (gameStatus.getStatus('ia'))
    {
        console.log('SENDING PONG IA DATA....')
        dataPostPong.mode = 'IA';
        dataPostPong.player2 = 'bot';
        dataPostPong.score_player1 = player1.score;
        dataPostPong.score_player2 = player2.score;
        dataPostPong.game = 'RollandGapong';
        // dataPostPong.tournament_id = 34;
        
        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(player1.startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
    else if (gameStatus.getStatus('isCoop'))
    {
        console.log('SENDING PONG COOP DATA....')
        dataPostPong.mode = 'COOP';
        dataPostPong.player2 = 'COOP';
        dataPostPong.score_player1 = player1.score;
        dataPostPong.score_player2 = player2.score;
        dataPostPong.game = 'RollandGapong';
        // dataPostPong.tournament_id = -1;

        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(player1.startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
    else if (gameStatus.getStatus('tournamentMod'))
    {
        console.log('SENDING PONG TOURNAMENT DATA....')
        dataPostPong.mode = 'TOURNAMENT';
        dataPostPong.player2 = 'player_tournament';
        dataPostPong.score_player1 = player1.score;
        dataPostPong.score_player2 = player2.score;
        dataPostPong.game = 'RollandGapong';
        dataPostPong.tournament_id = tournament.id;
        
        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(player1.startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
    else
    {
        console.log('SENDING PONG 1V1 DATA....')
        dataPostPong.mode = 'LOCAL 1V1';
        dataPostPong.player2 = 'player2';
        dataPostPong.score_player1 = player1.score;
        dataPostPong.score_player2 = player2.score;
        dataPostPong.game = 'RollandGapong';
        dataPostPong.tournament_id = -1;
        
        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(player1.startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
}

export function SendDataCard(elapsedTime, id)
{
    if (!gameStatus.getStatus('tournamentCard'))
    {
        console.log('SENDING CARD SOLO DATA....')
        dataPostCard.mode = 'SOLO';
        dataPostCard.game_duration = elapsedTime;
        dataPostCard.date = getCurrentFormattedDate();
        dataPostCard.tournament_id = id;
    }
    else
    {
        console.log('SENDING CARD TOURNAMENT DATA....')
        dataPostCard.mode = 'TOURNAMENT';
        dataPostCard.game_duration = elapsedTime;
        dataPostCard.date = getCurrentFormattedDate();
        dataPostCard.tournament_id = id;
    }
}
