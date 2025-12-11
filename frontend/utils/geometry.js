import config from '../core/config.js';


export function getNodeAtPosition(nodes, x, y) {
    return Object.values(nodes).find(
        (node) => x > node.x && x < node.x + node.width && y > node.y && y < node.y + node.height
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