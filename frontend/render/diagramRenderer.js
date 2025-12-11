import { drawNode } from './nodeRenderer.js';
import { drawEdge } from './edgeRenderer.js';


export function drawDiagram(diagram) {
    const canvas = document.getElementById('diagramCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    Object.values(diagram.edges).forEach((edge) => drawEdge(ctx, edge, diagram.nodes));
    Object.values(diagram.nodes).forEach((node) => drawNode(ctx, node));
}