export default class ChartBar 
{
	constructor(data_yx, html_container)
	{
		this.data_yx = data_yx;
		this.html_container = html_container;
		this.y_max = data_yx.reduce((max, obj) => obj.y > max ? obj.y : max, data_yx[0].y);
		this.nb_obj = data_yx.length;
	}

	generateBars(div_chart) 
	{
		this.data_yx.forEach(obj => 
		{
			var newBar = document.createElement("div");
			const prct_height = obj.y;
			const prct_width = 100 / this.nb_obj;
			newBar.style.height = `${prct_height}%`;
			newBar.style.width = `${prct_width - 5}%`;
			newBar.classList.add('bar_chart_el');
			div_chart.appendChild(newBar);  
		});
	}

	generateAxeY()
	{
		var axe_y = document.createElement("div");
		axe_y.classList.add('axe_y_chart');
		this.html_container.appendChild(axe_y);

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
		var axe_x = document.createElement("div");
		axe_x.classList.add('axe_x_chart');
		this.html_container.appendChild(axe_x);
		const prct_width = 100 / this.nb_obj;
		const el_width = prct_width - 5;

		for (let i = 1; i <= this.nb_obj; i++)
		{
			var div = document.createElement("div");
			let x = 'x'
			var p = document.createElement("p");
			div.classList.add('item_axe_x_txt')
			p.innerHTML =  x;
			div.style.width = `${el_width}%`;
			div.style.marginLeft = `${5 + el_width / 2}%`;
			div.appendChild(p);

			axe_x.appendChild(div);
		}			
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