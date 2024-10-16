import ChartBar from "./classes/ChartBar.js";
import ChartPie from "./classes/ChartPie.js";
import ChartTime from "./classes/ChartTime.js";
import { getCookie } from "./htmlRequest.js";
import { getGameTypeData, getSetSize, destroyCanvas } from "./utils/utils_charts.js";
import { showSection, hideSection } from "./utils/showAndHideSections.js";

function updateCanvasSize(chart) 
{
	const chart_element = document.querySelector("#pie-win-defeat canvas");
	chart_element.width = chart_element.offsetWidth;
	chart_element.height = chart_element.offsetHeight;
	chart.generate();
}


function generateBarsChart(div_id, data, title, legendYtext, legendXtext, groupSize)
{
	const ctx = document.querySelector("#" + div_id + " canvas");
	const options =({
		ctx:ctx,
		data:data,
		title:title,
		legendYText:legendYtext,
		legendXText:legendXtext,
		groupSize:groupSize
	});
	const chart = new ChartBar(options);
	chart.generate();
}

function generateLineChart(div_id, data, title, legendYtext, legendXtext, groupSize)
{
	const ctx = document.querySelector("#" + div_id + " canvas");
	const options =({
		ctx:ctx,
		data:data,
		title:title,
		legendYText:legendYtext,
		legendXText:legendXtext,
		groupSize:groupSize
	});
	const chart = new ChartTime(options);
	chart.generate();
}

function addLegendBoxes(colors, div_id)
{
	const legend = document.querySelectorAll("#" + div_id + " .legend-box-title");
	legend[0].innerHTML = "";
	legend[1].innerHTML = "";

	const boxWon = document.createElement("div");
	boxWon.classList.add("legend-boxes");
	boxWon.style.backgroundColor = `${colors[0]}`

	const boxDefeat = document.createElement("div");
	boxDefeat.classList.add("legend-boxes");
	boxDefeat.style.backgroundColor = `${colors[1]}`

	const legendDefeat = document.createElement("p");
	const legendWon = document.createElement("p");
	legendWon.innerHTML = "Total Games won"
	legendDefeat.innerHTML = "Total Games lost"

	legend[0].appendChild(boxWon);
	legend[0].appendChild(legendWon);
	legend[1].appendChild(boxDefeat);
	legend[1].appendChild(legendDefeat);
}

function generatePieChart(div_id, data, title)
{
	const p_title = document.querySelector("#" + div_id + " p");
	p_title.innerHTML = title;
	var chart = document.querySelector("#" + div_id + " div canvas");
	const colorsSet = ["#80DEEA", "#FFE082", "#FFAE00"]
	var pieChart = new ChartPie(
		{
			canvas: chart,
			datas: data,
			title_options:[title, "#000"],
			colors: colorsSet,
			padding:10
		}
	);
	pieChart.generate();
	addLegendBoxes(colorsSet, div_id);
	window.addEventListener('resize', () => {
		updateCanvasSize(pieChart);
	});	
}

async function getGameDatas() {
    try {
        const csrfToken = getCookie('csrftoken');
        const dataPost = {
            gameType: getGameTypeData()
        };

        const response = await fetch('/api/get_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(dataPost),
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erreur lors de la requête :', response.status, errorData);
            return null;
        }

        const dataReturn = await response.json();
        console.log('Succès :', dataReturn);
        return dataReturn;

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
        return null;
    }
}
export async function generateCharts()
{
    showSection("graphs_charts");
    destroyCanvas();
    let groupSize = getSetSize();
    const datas = await getGameDatas();
    const title_div = document.getElementById("title_charts");
    if (!datas)
    {
        hideSection("graphs_charts");
        title_div.innerHTML = '<h3>Error with loading datas</h3>';
    }
    else if ((Array.isArray(datas) && datas.length === 0) )
    {
        hideSection("graphs_charts");
        title_div.innerHTML = '<h3>No statistics available yet : go play some games !</h3>';        
    }
    else
    {
        title_div.innerHTML = `<h3>Statistics for User : ${getCookie("login")} - Game : ${getGameTypeData()} - Number of Games : ${datas.length}</h3>`;       
        generateBarsChart('bars-score-by-game', datas, `Proportion of games won by ${groupSize}`, "Proportion of games won (%)", `Sets of games played (by sets of ${groupSize})`, groupSize);
        generatePieChart('pie-win-defeat', datas, "Proportion of games won overall");
		if (getGameTypeData() === 'Cards')
        	generateLineChart('time-graph', datas, "Time to win", "Average time (in secs)", `Sets of games won in less than 10 min (by sets of ${groupSize})`, groupSize);
		else
			generateLineChart('time-graph', datas, "Time to win", "Average time (in secs)", `Sets of games won (by sets of ${groupSize})`, groupSize);
	}
}
