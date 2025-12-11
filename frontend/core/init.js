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


// ========== SAVE FUNCTION ==========
function saveDiagram() {
    const diagram = window.currentDiagram;
    
    // Convert diagram to JSON string (pretty printed)
    const jsonString = JSON.stringify(diagram, null, 4);
    
    // Create a blob (file-like object)
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';  // filename
    
    // Trigger download
    a.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
    
    console.log('Diagram saved!');
}


// ========== LOAD FUNCTION ==========
function loadFromFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            // Parse the JSON file
            const diagram = JSON.parse(e.target.result);
            
            // Update global diagram
            window.currentDiagram = diagram;
            
            // Redraw canvas
            drawDiagram(diagram);
            
            // Re-initialize events with new diagram
            initCanvasEvents(canvas, diagram);
            
            console.log('Diagram loaded!', diagram);
        } catch (error) {
            alert('Error loading file: Invalid JSON');
            console.error(error);
        }
    };
    
    reader.readAsText(file);
}


// ========== SETUP BUTTONS ==========
function setupButtons() {
    // Save button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', saveDiagram);
    
    // Load button
    const loadBtn = document.getElementById('loadBtn');
    const fileInput = document.getElementById('fileInput');
    
    loadBtn.addEventListener('click', () => {
        fileInput.click();  // Open file picker
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadFromFile(file);
        }
    });
}


// ========== INITIALIZE ==========
loadDiagram('diagram.json').then((diagram) => {
    // Store diagram globally so resize can redraw it
    window.currentDiagram = diagram;
    
    drawDiagram(diagram);
    initCanvasEvents(canvas, diagram);
    setupButtons();
});