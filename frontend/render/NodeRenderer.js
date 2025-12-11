import config from '../core/config.js';
import { getResizeHandles, getConnectionPoints } from '../utils/geometry.js';


// Use an object so we can modify its properties from other modules
export const selection = {
    node: null
};

// Track hovered node for showing connection points
export const hover = {
    node: null
};

// Track if we're in connection mode
export const connectionMode = {
    active: false
};

export function setSelectedNode(node) {
    selection.node = node;
}

export function getSelectedNode() {
    return selection.node;
}

export function setHoveredNode(node) {
    hover.node = node;
}

export function getHoveredNode() {
    return hover.node;
}

export function setConnectionMode(active) {
    connectionMode.active = active;
}

export function isConnectionMode() {
    return connectionMode.active;
}

export function drawNode(ctx, node) {
    const isSelected = selection.node && selection.node.id === node.id;
    const isHovered = hover.node && hover.node.id === node.id;
    
    // Set stroke style based on selection
    ctx.strokeStyle = isSelected ? config.node.selectedStrokeColor : config.node.strokeColor;
    ctx.lineWidth = isSelected ? config.node.selectedStrokeWidth : config.node.strokeWidth;

    // Draw shape based on type
    switch (node.type) {
        case 'circle':
            drawCircle(ctx, node);
            break;
        case 'diamond':
            drawDiamond(ctx, node);
            break;
        case 'rectangle':
        default:
            drawRectangle(ctx, node);
            break;
    }

    // Draw text (centered)
    ctx.font = config.node.font;
    ctx.fillStyle = config.node.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.text, node.x + node.width / 2, node.y + node.height / 2);

    // Draw resize handles if selected
    if (isSelected) {
        const handles = getResizeHandles(node);
        ctx.fillStyle = config.node.selectedStrokeColor;
        handles.forEach((h) => ctx.fillRect(h.x, h.y, config.HANDLE_SIZE, config.HANDLE_SIZE));
    }

    // Draw connection points if:
    // - Node is hovered or selected, OR
    // - We're in connection mode (show on ALL nodes)
    if (isHovered || isSelected || connectionMode.active) {
        drawConnectionPoints(ctx, node);
    }
}


// ========== SHAPE DRAWING FUNCTIONS ==========

function drawRectangle(ctx, node) {
    ctx.strokeRect(node.x, node.y, node.width, node.height);
}

function drawCircle(ctx, node) {
    // Calculate center and radius
    const centerX = node.x + node.width / 2;
    const centerY = node.y + node.height / 2;
    const radiusX = node.width / 2;
    const radiusY = node.height / 2;
    
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
}

function drawDiamond(ctx, node) {
    const centerX = node.x + node.width / 2;
    const centerY = node.y + node.height / 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX, node.y);                    // Top point
    ctx.lineTo(node.x + node.width, centerY);       // Right point
    ctx.lineTo(centerX, node.y + node.height);      // Bottom point
    ctx.lineTo(node.x, centerY);                    // Left point
    ctx.closePath();
    ctx.stroke();
}


// ========== CONNECTION POINTS ==========

function drawConnectionPoints(ctx, node) {
    const points = getConnectionPoints(node);
    const radius = 5;
    
    points.forEach((p) => {
        // Outer circle (border)
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}