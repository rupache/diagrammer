import config from '../core/config.js';


export function getNodeAtPosition(nodes, x, y) {
    return Object.values(nodes).find(
        (node) => x > node.x && x < node.x + node.width && y > node.y && y < node.y + node.height
    );
}


// Get node at position with expanded bounds (includes connection point area)
export function getNodeAtPositionExpanded(nodes, x, y) {
    const padding = 10;  // Extra area around node for hover detection
    return Object.values(nodes).find(
        (node) => 
            x > node.x - padding && 
            x < node.x + node.width + padding && 
            y > node.y - padding && 
            y < node.y + node.height + padding
    );
}


export function getResizeHandles(node) {
    const x = node.x;
    const y = node.y;
    const w = node.width;
    const h = node.height;
    const s = config.HANDLE_SIZE / 2;


    return [
        { name: 'tl', x: x - s, y: y - s },
        { name: 'tm', x: x + w / 2 - s, y: y - s },
        { name: 'tr', x: x + w - s, y: y - s },
        { name: 'ml', x: x - s, y: y + h / 2 - s },
        { name: 'mr', x: x + w - s, y: y + h / 2 - s },
        { name: 'bl', x: x - s, y: y + h - s },
        { name: 'bm', x: x + w / 2 - s, y: y + h - s },
        { name: 'br', x: x + w - s, y: y + h - s },
    ];
}


export function getHandleAt(node, mouseX, mouseY) {
    const handles = getResizeHandles(node);
    return handles.find(
        (h) =>
            mouseX >= h.x &&
            mouseX <= h.x + config.HANDLE_SIZE &&
            mouseY >= h.y &&
            mouseY <= h.y + config.HANDLE_SIZE
    )?.name || null;
}


// ========== CONNECTION POINTS (PORTS) ==========

export function getConnectionPoints(node) {
    const x = node.x;
    const y = node.y;
    const w = node.width;
    const h = node.height;
    
    return [
        { name: 'top', x: x + w / 2, y: y },              // Top center
        { name: 'right', x: x + w, y: y + h / 2 },        // Right center
        { name: 'bottom', x: x + w / 2, y: y + h },       // Bottom center
        { name: 'left', x: x, y: y + h / 2 },             // Left center
    ];
}


export function getConnectionPointAt(node, mouseX, mouseY) {
    const points = getConnectionPoints(node);
    const radius = 10;  // Increased click detection radius
    
    return points.find(
        (p) => {
            const distance = Math.sqrt((mouseX - p.x) ** 2 + (mouseY - p.y) ** 2);
            return distance <= radius;
        }
    ) || null;
}


// Find connection point on any node at position
export function findConnectionPointAtPosition(nodes, mouseX, mouseY) {
    for (const node of Object.values(nodes)) {
        const point = getConnectionPointAt(node, mouseX, mouseY);
        if (point) {
            return { node, point };
        }
    }
    return null;
}