import { addCanvasId } from "../utils/utils_charts.js";

function roundUpUnlessInt(num) 
{
    if (Number.isInteger(num))
        return num;
    return Math.ceil(num);
}

export default class ChartBar 
{
	constructor(options)
	{
		this.datas = options.data;
		this.ctx = options.ctx;
		this.nb_obj = this.datas.length;
		this.legendYText = options.legendYText;
		this.legendXText = options.legendXText;
		this.title = options.title;
		this.groupSize = options.groupSize;
	}

	calculateValuesY(groupSize)
	{
		let listLabels = [];
		let i = 0;
		let sum = 0;
		this.datas.forEach((obj, index, array) => 
		{
			if (obj.won === 1)
				{
					sum += obj.time;
					i++;
				}
			if (i === groupSize || ((index === array.length - 1) && (i != 0)))
			{
				const lineY = (sum / i).toFixed(1);
				listLabels.push(lineY);
				sum = 0;
				i = 0;
			}
		});
		return (listLabels);
	}

	calculateLabelX(wonGames, groupSize)
	{
		const nb_el = roundUpUnlessInt(wonGames / groupSize);
		let listLabels = [];
		var i = 0;
		for (i = 1; i <= wonGames; i++)
		{
			if (i % groupSize === 0 || i === wonGames)
			{
				let x = `${roundUpUnlessInt(i / groupSize)}`;
				listLabels.push(x);
			}
		}
		return listLabels;	
	}

	generate()
	{

		const wonGames = this.datas.filter(obj => obj.won === 1).length;
		const labelsX = this.calculateLabelX(wonGames, this.groupSize);
		const valuesY = this.calculateValuesY(this.groupSize);

		Chart.defaults.color = '#FFFFFF';
		const chartTime = new Chart(this.ctx, 
		{
			type: 'line',
			data: 
			{
				labels: labelsX,
				datasets: [{
					backgroundColor:"#ffd759",
					color : '#FFFFFF',
					data: valuesY,
					borderWidth: 1,
				}]
			},
			options: 
			{
				plugins: 
				{
					title:
					{
						display : true,
						text : this.title,
						font :
						{
							size: 20
						}
					},
					legend: 
					{
						display: false
					}
				},					
				animations :false,
				scales: {
					x: {
						title: {
							display: true,
							text: this.legendXText, 
							color: '#FFFFFF',
							font: {
								size: 14,
								family: 'Arial',
								weight: 'bold'
							}
						}
					},
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: this.legendYText,
							color: '#FFFFFF',
							font: {
								size: 14,
								family: 'Arial',
								weight: 'bold'
							}
						}
					}
				}
			}
		});
		addCanvasId(chartTime);
	}
};