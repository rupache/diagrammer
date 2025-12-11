import { drawDiagram } from '../render/diagramRenderer.js';
import { getNodeAtPosition, getNodeAtPositionExpanded, getHandleAt, getConnectionPointAt, findConnectionPointAtPosition } from '../utils/geometry.js';
import { getSelectedNode, setSelectedNode, setHoveredNode, setConnectionMode } from '../render/nodeRenderer.js';
import { resizeNode } from './resize.js';

let currentNode = null;
let resizingNode = null;
let resizeHandle = null;
let offsetX = 0;
let offsetY = 0;

// Connection mode variables
let isConnecting = false;
let connectionStartNode = null;
let connectionStartPoint = null;
let connectionEndPoint = { x: 0, y: 0 };

// Counter for generating unique IDs
let nodeCounter = 100;
let edgeCounter = 100;

// Function to create a new node
function createNode(x, y, shapeType = 'rectangle') {
    nodeCounter++;
    
    // Set size based on shape type
    let width = 120;
    let height = 60;
    
    if (shapeType === 'circle') {
        width = 80;   // Equal width and height for circle
        height = 80;
    } else if (shapeType === 'diamond') {
        width = 80;
        height = 80;
    }
    
    const newNode = {
        id: `n${nodeCounter}`,
        type: shapeType,
        x: x - width / 2,      // Center the node on click position
        y: y - height / 2,
        width: width,
        height: height,
        text: `Node ${nodeCounter}`
    };
    return newNode;
}

// Function to create a new edge with specific connection points
function createEdge(fromNodeId, toNodeId, fromPoint, toPoint) {
    edgeCounter++;
    return {
        id: `e${edgeCounter}`,
        from: fromNodeId,
        to: toNodeId,
        fromPoint: fromPoint,  // e.g., 'right', 'bottom', etc.
        toPoint: toPoint,      // e.g., 'left', 'top', etc.
        label: ''
    };
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

    // ========== MOUSE DOWN: Select, drag, resize, or connect ==========
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const node = getNodeAtPosition(diagram.nodes, mouseX, mouseY);
        const selectedNode = getSelectedNode();
        const handle = selectedNode ? getHandleAt(selectedNode, mouseX, mouseY) : null;

        // Check if clicked on a connection point (on any node)
        const connectionInfo = findConnectionPointAtPosition(diagram.nodes, mouseX, mouseY);
        
        if (connectionInfo) {
            // Start connection mode
            isConnecting = true;
            setConnectionMode(true);  // Show connection points on ALL nodes
            connectionStartNode = connectionInfo.node;
            connectionStartPoint = connectionInfo.point;
            connectionEndPoint = { x: mouseX, y: mouseY };
            console.log('Connection started from:', connectionInfo.node.id, connectionInfo.point.name);
            return;
        }

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

    // ========== MOUSE MOVE: Drag, resize, hover, or draw connection line ==========
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Connection mode - draw temporary line
        if (isConnecting) {
            connectionEndPoint = { x: mouseX, y: mouseY };
            drawDiagram(diagram);
            drawConnectionLine(canvas, connectionStartPoint, connectionEndPoint);
            return;
        }

        if (resizingNode) {
            resizeNode(resizingNode, resizeHandle, mouseX, mouseY);
            drawDiagram(diagram);
            return;
        }

        if (currentNode) {
            currentNode.x = mouseX - offsetX;
            currentNode.y = mouseY - offsetY;
            drawDiagram(diagram);
            return;
        }

        // Hover detection - show connection points (use expanded bounds)
        const hoveredNode = getNodeAtPositionExpanded(diagram.nodes, mouseX, mouseY);
        setHoveredNode(hoveredNode);
        drawDiagram(diagram);
    });

    // ========== MOUSE UP: Stop drag/resize or complete connection ==========
    canvas.addEventListener('mouseup', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Complete connection
        if (isConnecting) {
            // Check if released on a connection point
            const connectionInfo = findConnectionPointAtPosition(diagram.nodes, mouseX, mouseY);
            
            if (connectionInfo && connectionInfo.node.id !== connectionStartNode.id) {
                // Create new edge with specific connection points
                const newEdge = createEdge(
                    connectionStartNode.id, 
                    connectionInfo.node.id,
                    connectionStartPoint.name,  // e.g., 'right'
                    connectionInfo.point.name   // e.g., 'left'
                );
                diagram.edges[newEdge.id] = newEdge;
                console.log('Connection created:', newEdge);
            }
            
            isConnecting = false;
            setConnectionMode(false);  // Hide connection points on other nodes
            connectionStartNode = null;
            connectionStartPoint = null;
            drawDiagram(diagram);
        }

        currentNode = null;
        resizingNode = null;
        resizeHandle = null;
    });

    // ========== MOUSE LEAVE: Clear hover state ==========
    canvas.addEventListener('mouseleave', () => {
        setHoveredNode(null);
        drawDiagram(diagram);
    });
}


// Draw temporary connection line while dragging
function drawConnectionLine(canvas, startPoint, endPoint) {
    const ctx = canvas.getContext('2d');
    
    // Draw dashed line from connection point to mouse
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);  // Reset to solid line
    
    // Draw arrow at end
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const arrowLength = 10;
    
    ctx.beginPath();
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
        endPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
        endPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
        endPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
        endPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
}