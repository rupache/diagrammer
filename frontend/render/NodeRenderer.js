import config from '../core/config.js';
import { getResizeHandles } from '../utils/geometry.js';


// Use an object so we can modify its properties from other modules
export const selection = {
    node: null
};

export function setSelectedNode(node) {
    selection.node = node;
}

export function getSelectedNode() {
    return selection.node;
}

export function drawNode(ctx, node) {
    const isSelected = selection.node && selection.node.id === node.id;
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