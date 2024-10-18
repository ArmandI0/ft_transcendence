import { dataPostCard, dataPostPong, setPongData , setCardData } from "./SendGameData.js";
import * as gameStatus from './gameStatus.js' ;
import { getUsername} from '../charts.js';

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

export async function SendDataPong(player1_score, player2_score, tournament_id, game, startTime, player1, player2)
{
    let username;

    if (gameStatus.getStatus('ia'))
    {
        const dataUser = await getUsername();
        username = dataUser.username;
        dataPostPong.mode = 'IA';
        dataPostPong.player1 = username;
        dataPostPong.player2 = 'bot';
        dataPostPong.score_player1 = player1_score;
        dataPostPong.score_player2 = player2_score;
        dataPostPong.game = game;
        dataPostPong.tournament_id = tournament_id;
        
        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
    else if (gameStatus.getStatus('isCoop'))
    {
        dataPostPong.mode = 'COOP';
        dataPostPong.player1 = 'number of exchanges :';
        dataPostPong.player2 = '-----';
        dataPostPong.score_player1 = player1_score;
        dataPostPong.score_player2 = '------';
        dataPostPong.game = game;
        dataPostPong.tournament_id = tournament_id;

        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
    else if (gameStatus.getStatus('tournamentMod'))
    {
        dataPostPong.mode = 'TOURNAMENT';
        dataPostPong.player1 = player1;
        dataPostPong.player2 = player2;
        dataPostPong.score_player1 = player1_score;
        dataPostPong.score_player2 = player2_score;
        dataPostPong.game = game;
        dataPostPong.tournament_id = tournament_id;
        
        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
    else
    {
        const dataUser = await getUsername();
        username = dataUser.username;
        dataPostPong.mode = 'LOCAL1V1';
        dataPostPong.player1 = username;
        dataPostPong.player2 = gameStatus.getStatus('namePlayer2');
        dataPostPong.score_player1 = player1_score;
        dataPostPong.score_player2 = player2_score;
        dataPostPong.game = game;
        dataPostPong.tournament_id = tournament_id;
        
        let stopTime = Date.now();
        let elapsedTimeInSeconds = Math.floor((stopTime - new Date(startTime).getTime()) / 1000);

        dataPostPong.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostPong.date = getCurrentFormattedDate();
        
        setPongData();
    }
}

export async function SendDataCard(elapsedTime, id, player)
{
    const dataUser = await getUsername();
    let username = dataUser.username;
    let elapsedTimeInSeconds = Math.floor(elapsedTime / 1000);

    if (!gameStatus.getStatus('tournamentCard'))
    {
        dataPostCard.mode = 'SOLO';
        dataPostCard.player1 = username;
        dataPostCard.game = 'Card';
        dataPostCard.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostCard.date = getCurrentFormattedDate();
        dataPostCard.tournament_id = id;
        setCardData();
    }
    else
    {
        dataPostCard.mode = 'TOURNAMENT';
        dataPostCard.player1 = player;
        dataPostCard.game = 'Card';
        dataPostCard.game_duration = formatGameDuration(elapsedTimeInSeconds);
        dataPostCard.date = getCurrentFormattedDate();
        dataPostCard.tournament_id = id;
        setCardData();
    }
}
