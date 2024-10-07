function roundUpUnlessInt(num) 
{
    if (Number.isInteger(num))
        return num;
    return Math.ceil(num);
}

export default class ChartBar 
{
	constructor(datas, html_container, legendYText, legendXText)
	{
		this.datas = datas;
		this.html_container = html_container;
		this.nb_obj = datas.length;
		this.legendYText = legendYText;
		this.legendXText = legendXText;
	}

	generateBars(div_chart) 
	{
		var i = 1;
		var sum = 0;
		const nb_el = roundUpUnlessInt(this.nb_obj / 10);
		this.datas.forEach((obj, index, array) => 
		{
			sum += obj.won;
			if (i === 10 || index === array.length - 1)
			{
				var newBar = document.createElement("div");
				const prct_height = (sum / i * 100).toFixed(2);
				const prct_width = (100 / nb_el).toFixed(2);
				newBar.style.height = `${prct_height}%`;
				newBar.style.width = `${prct_width - 5}%`;
				newBar.classList.add('bar_chart_el');
				div_chart.appendChild(newBar); 
				sum = 0;
				i = 1;
			}
			i++;
		});
	}

	generateLegendX(div)
	{
		let legend_x = document.createElement("p");
		legend_x.innerHTML = this.legendXText;
		div.appendChild(legend_x);
	}

	generateLegendY(div)
	{
		let legend_y = document.createElement("canvas");
		var ctx = legend_y.getContext('2d');
		div.appendChild(legend_y);
		legend_y.style.width = "100%";
		legend_y.style.height = "100%";
		legend_y.width = legend_y.offsetWidth;
		legend_y.height = legend_y.offsetHeight;

		ctx.save();
		ctx.translate(0, legend_y.height);
		ctx.rotate( - Math.PI / 2);
	  
		ctx.font = "12px Arial";
		ctx.fillStyle = "black";
		const textWidth = ctx.measureText(this.legendYText).width;
		ctx.fillText(this.legendYText, legend_y.height / 2 - textWidth / 2, legend_y.width / 2);
		ctx.restore(); 
	}

	generateAxeY()
	{
		var axe_y_and_legend = document.createElement("div");
		axe_y_and_legend.classList.add('axe_y_and_legend');
		var legendY = document.createElement("div");
		legendY.classList.add('legend_y');	
		var axe_y = document.createElement("div");
		axe_y.classList.add('axe_y_chart');
		axe_y_and_legend.appendChild(legendY);
		axe_y_and_legend.appendChild(axe_y);
		this.html_container.appendChild(axe_y_and_legend);
		this.generateLegendY(legendY);

		for (let i = 1; i <= 10; i++)
		{
			var div = document.createElement("div");
			if (i % 2 === 0)
				div.classList.add('item_axe_y_line');
			else
			{
				let y = 20 * (6 - (i + 1) / 2);
				var p = document.createElement("p");
				div.classList.add('item_axe_y_txt')
				p.innerHTML =  y + '%';
				div.appendChild(p);
			}
			axe_y.appendChild(div);
		}
	}

	generateOrigin()
	{
		var origin = document.createElement("div");
		origin.classList.add('origin_chart');
		this.html_container.appendChild(origin);
		for (let i = 11; i <= 12; i++)
			{
				var div = document.createElement("div");
				if (i % 2 === 0)
					div.classList.add('item_axe_y_line');
				else
				{
					let y = 20 * (6 - (i + 1) / 2);
					var p = document.createElement("p");
					div.classList.add('item_axe_y_txt')
					p.innerHTML =  y + '%';
					div.appendChild(p);
				}
				origin.appendChild(div);
			}		
	}

	generateAxeX()
	{
		var axe_x_and_legend = document.createElement("div");
		axe_x_and_legend.classList.add('axe_x_and_legend');
		this.html_container.appendChild(axe_x_and_legend);

		var axe_x = document.createElement("div");
		axe_x.classList.add('axe_x_chart');
		axe_x_and_legend.appendChild(axe_x);
		var legendX = document.createElement("div");
		legendX.classList.add('legend_x');	
		axe_x_and_legend.appendChild(legendX);

		const nb_el = roundUpUnlessInt(this.nb_obj / 10);
		const prct_width = (100 / nb_el).toFixed(2);
		const el_width = prct_width - 5;

		var i = 0;
		for (i = 1; i <= this.nb_obj; i++)
		{
			if (i % 10 === 0 || i === this.nb_obj)
			{
				var div = document.createElement("div");
				let x = `${roundUpUnlessInt(i / 10)}`;
				var p = document.createElement("p");
				div.classList.add('item_axe_x_txt')
				p.innerHTML =  x;
				div.style.width = `${el_width}%`;
				div.style.marginLeft = `${5 + el_width / 2}%`;
				div.appendChild(p);
				axe_x.appendChild(div);
			}
		}
		//this.generateLegendX(legendX);
	}
	
	generate()
	{
		this.generateAxeY();
		
		var div_chart = document.createElement("div");
		this.generateBars(div_chart);
		div_chart.classList.add('bar_chart');
		this.html_container.appendChild(div_chart);

		this.generateOrigin();
		this.generateAxeX();
	}
};