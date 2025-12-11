import { drawDiagram } from '../render/diagramRenderer.js';
let currentNode = null;
let resizingNode = null;
let resizeHandle = null;
let offsetX = 0;
let offsetY = 0;


export function initCanvasEvents(canvas, diagram) {
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const node = getNodeAtPosition(diagram.nodes, mouseX, mouseY);
        const handle = selectedNode ? getHandleAt(selectedNode, mouseX, mouseY) : null;


        if (handle) {
            resizingNode = selectedNode;
            resizeHandle = handle;
            currentNode = null;
            return;
        }


        if (node) {
            selectedNode.id = node.id;
            currentNode = node;
            offsetX = mouseX - node.x;
            offsetY = mouseY - node.y;
        } else {
            selectedNode.id = null;
        }


        drawDiagram(diagram);
    });


    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;


        if (resizingNode) {
            resizeNode(resizingNode, resizeHandle, mouseX, mouseY);
            drawDiagram(diagram);
            return;
        }


        if (currentNode) {
            currentNode.x = mouseX - offsetX;
            currentNode.y = mouseY - offsetY;
            drawDiagram(diagram);
        }
    });


    canvas.addEventListener('mouseup', () => {
        currentNode = null;
        resizingNode = null;
        resizeHandle = null;
    });
}