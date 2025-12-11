import { loadDiagram } from './diagramData.js';
import { drawDiagram } from '../render/diagramRenderer.js';
import { initCanvasEvents } from '../interaction/canvasEvents.js';
import config from './config.js';


const canvas = document.getElementById('diagramCanvas');
const container = document.getElementById('canvas-container');

// Function to resize canvas to match container
function resizeCanvas() {
    // Get container size (minus padding)
    const width = container.clientWidth - 20;
    const height = container.clientHeight - 20;
    
    // Set canvas internal resolution (important for sharp drawing)
    canvas.width = width;
    canvas.height = height;
}

// Set initial size
resizeCanvas();

// Resize when window changes
window.addEventListener('resize', () => {
    resizeCanvas();
    // Redraw diagram after resize (if loaded)
    if (window.currentDiagram) {
        drawDiagram(window.currentDiagram);
    }
});

canvas.style.background = config.canvasBackground;


loadDiagram('diagram.json').then((diagram) => {
    // Store diagram globally so resize can redraw it
    window.currentDiagram = diagram;
    
    drawDiagram(diagram);
    initCanvasEvents(canvas, diagram);
});