import ChartBar from "./classes/ChartBar.js";
import ChartPie from "./classes/ChartPie.js";
import ChartTime from "./classes/ChartTime.js";

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

function generatePieChart(div_id, data, title)
{
	const p_title = document.querySelector("#" + div_id + " p");
	p_title.innerHTML = title;
	var chart = document.querySelector("#" + div_id + " div canvas");

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
	const groupSize = 5;
	generateBarsChart('bars-score-by-game', datas, "Proportion of games won", "Proportion of games won (%)", `Sets of games played (by ${groupSize})`, groupSize);
	generatePieChart('pie-win-defeat', datas, "Proportion of games won overall");
	generateLineChart('time-graph', datas, "Time to win", "Average time (in secs)", `Sets of games played (by ${groupSize})`, groupSize);
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

