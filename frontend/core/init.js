import { loadDiagram } from './diagramData.js';
import { drawDiagram } from '../render/diagramRenderer.js';
import { initCanvasEvents } from '../interaction/canvasEvents.js';
import config from './config.js';


const canvas = document.getElementById('diagramCanvas');
canvas.width = config.defaultCanvasWidth;
canvas.height = config.defaultCanvasHeight;
canvas.style.background = config.canvasBackground;


loadDiagram('diagram.json').then((diagram) => {
    drawDiagram(diagram);
    initCanvasEvents(canvas, diagram);
});