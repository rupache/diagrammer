import { drawDiagram } from '../render/diagramRenderer.js';
import { getNodeAtPosition, getHandleAt } from '../utils/geometry.js';
import { getSelectedNode, setSelectedNode } from '../render/nodeRenderer.js';
import { resizeNode } from './resize.js';

let currentNode = null;
let resizingNode = null;
let resizeHandle = null;
let offsetX = 0;
let offsetY = 0;

// Counter for generating unique node IDs
let nodeCounter = 100;

// Function to create a new node
function createNode(x, y, shapeType = 'rectangle') {
    nodeCounter++;
    const newNode = {
        id: `n${nodeCounter}`,
        type: shapeType,
        x: x - 60,      // Center the node on click position
        y: y - 30,      // Center the node on click position
        width: 120,
        height: 60,
        text: `Node ${nodeCounter}`
    };
    return newNode;
}


export function initCanvasEvents(canvas, diagram) {

    // ========== DRAG AND DROP FROM SIDEBAR ==========

    // Allow drop on canvas
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();  // Required to allow drop
    });

    // Handle drop on canvas
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();

        // Get the shape type from the dragged element
        const shapeType = e.dataTransfer.getData('text/plain');

        if (shapeType) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Create new node at drop position
            const newNode = createNode(mouseX, mouseY, shapeType);

            // Add to diagram data
            diagram.nodes[newNode.id] = newNode;

            // Select the new node
            setSelectedNode(newNode);

            // Redraw
            drawDiagram(diagram);

            console.log('New node created via drag:', newNode);
        }
    });

    // ========== SIDEBAR DRAG START ==========
    // Setup drag events on shape items
    const shapeItems = document.querySelectorAll('.shape-item');
    shapeItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            const shapeType = item.getAttribute('data-shape');
            e.dataTransfer.setData('text/plain', shapeType);
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    // ========== DOUBLE-CLICK: Add new node ==========
    canvas.addEventListener('dblclick', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if we double-clicked on an existing node
        const existingNode = getNodeAtPosition(diagram.nodes, mouseX, mouseY);

        if (!existingNode) {
            // Create new node at click position
            const newNode = createNode(mouseX, mouseY);

            // Add to diagram data
            diagram.nodes[newNode.id] = newNode;

            // Select the new node
            setSelectedNode(newNode);

            // Redraw
            drawDiagram(diagram);

            console.log('New node created:', newNode);
        }
    });

    // ========== MOUSE DOWN: Select or start drag/resize ==========
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const node = getNodeAtPosition(diagram.nodes, mouseX, mouseY);
        const selectedNode = getSelectedNode();
        const handle = selectedNode ? getHandleAt(selectedNode, mouseX, mouseY) : null;

        if (handle) {
            resizingNode = selectedNode;
            resizeHandle = handle;
            currentNode = null;
            return;
        }

        if (node) {
            setSelectedNode(node);
            currentNode = node;
            offsetX = mouseX - node.x;
            offsetY = mouseY - node.y;
        } else {
            setSelectedNode(null);
        }

        drawDiagram(diagram);
    });

    // ========== MOUSE MOVE: Drag or resize ==========
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

    // ========== MOUSE UP: Stop drag/resize ==========
    canvas.addEventListener('mouseup', () => {
        currentNode = null;
        resizingNode = null;
        resizeHandle = null;
    });
}