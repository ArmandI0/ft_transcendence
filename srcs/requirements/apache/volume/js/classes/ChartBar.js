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

	calculateValuesY(nbObj, groupSize)
	{
		let listLabels = [];
		var i = 1;
		var sum = 0;
		const nbEl = roundUpUnlessInt(nbObj/ groupSize);
		this.datas.forEach((obj, index, array) => 
		{
			sum += obj.won;
			if (i === groupSize)
			{
				const barHeight = (sum / i * 100).toFixed(2);
				listLabels.push(barHeight);
				sum = 0;
				i = 0;
			}
			else if (index === array.length - 1)
			{
				const barHeight = (sum / i * 100).toFixed(2);
				listLabels.push(barHeight);				
			}
			i++;
		});
		return (listLabels);
	}

	calculateLabelX(nbObj, groupSize)
	{
		let listLabels = [];
		var i = 0;
		for (i = 1; i <= nbObj; i++)
		{
			if (i % groupSize === 0)
			{
				const x2 = i;
				const x1 = x2 - groupSize + 1;
				let x = `${x1} - ${x2}`;
				listLabels.push(x);
			}
			else if (i === nbObj)
			{
				const x2 = nbObj;		
				const x1 = x2 - nbObj % groupSize + 1;
				let x = `${x1} - ${x2}`;
				listLabels.push(x);
			}
		}
		return listLabels;	
	}

	generate()
	{

		const labelsX = this.calculateLabelX(this.nb_obj, this.groupSize);
		const valuesY = this.calculateValuesY(this.nb_obj, this.groupSize);

		Chart.defaults.color = '#FFFFFF';
		const chartBar = new Chart(this.ctx, 
		{
			type: 'bar',
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
				animaiton:false,
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
		addCanvasId(chartBar);
	}
};