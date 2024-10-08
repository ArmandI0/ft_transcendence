import ChartBar from "./classes/ChartBar.js";
import ChartPie from "./classes/ChartPie.js";
import { drawLine } from "./utils/utils_charts.js";
import { drawArc } from "./utils/utils_charts.js";
import { drawPieSlice } from "./utils/utils_charts.js";

function updateCanvasSize(chart) 
{
	const chart_element = document.querySelector("#pie-win-defeat canvas");
	chart_element.width = chart_element.offsetWidth;
	chart_element.height = chart_element.offsetHeight;
	chart.generate();
}

function createTitle(title, div_parent)
{
	var title_div = document.createElement("h2");
	title_div.innerHTML=title;
	title_div.style.fontSize = "1.5vw";
	div_parent.appendChild(title_div);
}

function generateBarsChart(div_id, data, title, legendYtext, legendXtext)
{
	var chart;
	var div_chart = document.getElementById(div_id);
	//createTitle(title, div_chart);

	var chart_body = document.createElement("div");
	chart_body.classList.add('chart_body')
	div_chart.appendChild(chart_body);
	chart = new ChartBar(data, chart_body, legendYtext, legendXtext);
	chart.generate();
}

function generatePieChart(div_id, data, title)
{
	var chart = document.querySelector("#" + div_id + " canvas");

	var pieChart = new ChartPie(
		{
			canvas: chart,
			datas: data,
			title_options:[title, "#000"],
			colors: ["#80DEEA", "#FFE082", "#FFAE00"],
			padding:40
		}
	);
	pieChart.generate();

	window.addEventListener('resize', () => {
		updateCanvasSize(pieChart);
	});	
}

export function generateCharts(datas)
{
	generateBarsChart('bars-score-by-game', datas['bars'], "Proportion of games won every 10 games", "Proportion of games won (%)", "Pack of games played (by 10)");
	generatePieChart('pie-win-defeat', datas['pie'], "Proportion of games won overall");
	generateBarsChart('other-graph', datas['bars'], "Proportion of games won every 10 games", "Proportion of games won (%)", "Pack of games played (by 10)");
}

// export function generateChart(div_id, data, type, title)
// {
// 	var chart;
// 	var div_chart = document.getElementById(div_id);
// 	createTitle(title, div_chart);

// 	var chart_body = document.createElement("div");
// 	chart_body.classList.add('chart_body')
// 	div_chart.appendChild(chart_body);

// 	if (type === 'bars')
// 		chart = new ChartBar(data, chart_body);
// 	else if (type === 'pie')
// 		chart = new ChartPie(data, chart_body);
// 	chart.generate();
// }

