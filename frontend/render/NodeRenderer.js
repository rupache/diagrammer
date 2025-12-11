import config from '../core/config.js';
import { getResizeHandles } from '../utils/geometry.js';


export let selectedNode = null;
export function drawNode(ctx, node) {
    const isSelected = selectedNode && selectedNode.id === node.id;
    ctx.strokeStyle = isSelected ? config.node.selectedStrokeColor : config.node.strokeColor;
    ctx.lineWidth = isSelected ? config.node.selectedStrokeWidth : config.node.strokeWidth;


    ctx.strokeRect(node.x, node.y, node.width, node.height);


    ctx.font = config.node.font;
    ctx.fillStyle = config.node.textColor;
    ctx.fillText(node.text, node.x + 10, node.y + 30);


    if (isSelected) {
        const handles = getResizeHandles(node);
        ctx.fillStyle = config.node.selectedStrokeColor;
        handles.forEach((h) => ctx.fillRect(h.x, h.y, config.HANDLE_SIZE, config.HANDLE_SIZE));
    }
}