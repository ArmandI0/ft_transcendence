let gameTypeData = "Cyberpong";
let canvasID= [];
let setSize = 5;

export function drawLine(ctx, startX, startY, endX, endY, color, lineWidth)
{
	ctx.save();
	ctx.lineWidth = lineWidth; 
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX,endY);
	ctx.stroke();
	ctx.restore();
}

export function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle, color)
{
	ctx.save();
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	ctx.stroke();
	ctx.restore();
}

export function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, fillColor, strokeColor, lineWidth) 
{
    ctx.save();
	ctx.lineWidth = lineWidth; 
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();
    ctx.restore();
}

export function getGameTypeData()
{
	return gameTypeData;
}

export function setGameTypeData(type)
{
	gameTypeData = type;
}

export function addCanvasId(id)
{
	canvasID.push(id);
}

export function destroyCanvas()
{
	canvasID.forEach(element => {
		element.destroy();
	});
}

export function getSetSize()
{
	return setSize;
}

export function setSetSize(nb)
{
	setSize = nb;
}