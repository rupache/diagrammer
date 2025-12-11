import config from '../core/config.js';


export function drawEdge(ctx, edge, nodes) {
    const from = nodes[edge.from];
    const to = nodes[edge.to];


    const fromCenterX = from.x + from.width / 2;
    const fromCenterY = from.y + from.height / 2;
    const toCenterX = to.x + to.width / 2;
    const toCenterY = to.y + to.height / 2;


    const startX = toCenterX > fromCenterX ? from.x + from.width : from.x;
    const startY = fromCenterY;
    const endX = fromCenterX > toCenterX ? to.x + to.width : to.x;
    const endY = toCenterY;


    ctx.strokeStyle = config.edge.strokeColor;
    ctx.lineWidth = config.edge.strokeWidth;


    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}