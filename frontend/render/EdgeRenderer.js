import config from '../core/config.js';
import { getConnectionPoints } from '../utils/geometry.js';


export function drawEdge(ctx, edge, nodes) {
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];
    
    if (!fromNode || !toNode) return;

    // Get connection points
    let startPoint, endPoint;
    
    // Check if edge has specific connection points defined
    if (edge.fromPoint && edge.toPoint) {
        // Use the specific points stored in the edge
        startPoint = getSpecificConnectionPoint(fromNode, edge.fromPoint);
        endPoint = getSpecificConnectionPoint(toNode, edge.toPoint);
    } else {
        // Fallback: find best connection points (for old edges without point data)
        const best = getBestConnectionPoints(fromNode, toNode);
        startPoint = best.startPoint;
        endPoint = best.endPoint;
    }

    // Draw the line
    ctx.strokeStyle = config.edge.strokeColor;
    ctx.lineWidth = config.edge.strokeWidth;

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();

    // Draw arrow at the END (destination)
    drawArrow(ctx, startPoint, endPoint);

    // Draw label if exists
    if (edge.label) {
        const midX = (startPoint.x + endPoint.x) / 2;
        const midY = (startPoint.y + endPoint.y) / 2;
        
        // Draw background for label
        ctx.font = '12px Arial';
        const textWidth = ctx.measureText(edge.label).width;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(midX - textWidth/2 - 2, midY - 10, textWidth + 4, 14);
        
        // Draw label text
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.label, midX, midY - 3);
    }
}


// Get a specific connection point by name
function getSpecificConnectionPoint(node, pointName) {
    const points = getConnectionPoints(node);
    const point = points.find(p => p.name === pointName);
    return point ? { x: point.x, y: point.y } : { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}


// Find the best connection points between two nodes (fallback for old edges)
function getBestConnectionPoints(fromNode, toNode) {
    const fromPoints = getConnectionPoints(fromNode);
    const toPoints = getConnectionPoints(toNode);
    
    let bestDistance = Infinity;
    let bestFromPoint = null;
    let bestToPoint = null;
    
    // Find the pair of points with the shortest distance
    for (const fromPoint of fromPoints) {
        for (const toPoint of toPoints) {
            const distance = Math.sqrt(
                (fromPoint.x - toPoint.x) ** 2 + 
                (fromPoint.y - toPoint.y) ** 2
            );
            
            if (distance < bestDistance) {
                bestDistance = distance;
                bestFromPoint = { x: fromPoint.x, y: fromPoint.y };
                bestToPoint = { x: toPoint.x, y: toPoint.y };
            }
        }
    }
    
    return {
        startPoint: bestFromPoint,
        endPoint: bestToPoint
    };
}


// Draw an arrow at the end of the line (pointing TO the destination)
function drawArrow(ctx, startPoint, endPoint) {
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const arrowLength = 12;
    const arrowWidth = Math.PI / 7;  // ~25 degrees for sharper arrow

    ctx.fillStyle = config.edge.strokeColor;
    ctx.beginPath();
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
        endPoint.x - arrowLength * Math.cos(angle - arrowWidth),
        endPoint.y - arrowLength * Math.sin(angle - arrowWidth)
    );
    ctx.lineTo(
        endPoint.x - arrowLength * Math.cos(angle + arrowWidth),
        endPoint.y - arrowLength * Math.sin(angle + arrowWidth)
    );
    ctx.closePath();
    ctx.fill();
}