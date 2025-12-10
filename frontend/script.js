// VARIABLES
let currentNode = null;     // which node is being dragged
let offsetX = 0;            // mouse offset inside the node
let offsetY = 0;
let diagramData = null;     // save the loaded diagram

let selectedNode = null;

const HANDLE_SIZE = 10;
let resizingNode = null;
let resizeHandle = null;


// 1. Load the JSON file
fetch("diagram.json")
    .then(response => response.json())
    .then(data => {
        diagramData = data;
        drawDiagram(diagramData);
        enableMouseEvents();
    });

// 2. Main drawing code
function drawDiagram(diagram) {
    const canvas = document.getElementById("diagramCanvas");
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges first
    for (let edgeId in diagram.edges) {
        const edge = diagram.edges[edgeId];
        drawEdge(ctx, edge, diagram.nodes);
    }

    // Draw nodes
    for (let nodeId in diagram.nodes) {
        const node = diagram.nodes[nodeId];
        drawNode(ctx, node);
    }
}

// 3. Draw a single node (rectangle + text)
function drawNode(ctx, node) {
    // CHECK IF THIS NODE IS SELECTED
    if (selectedNode && selectedNode.id === node.id) {
        ctx.strokeStyle = "#007bff";  // blue border
        ctx.lineWidth = 3;
    } else {
        ctx.strokeStyle = "#333";     // normal border
        ctx.lineWidth = 2;
    }

    // rectangle
    ctx.strokeRect(node.x, node.y, node.width, node.height);

    // text
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(node.text, node.x + 10, node.y + 30);

    // If selected → draw resize handle
    if (selectedNode && selectedNode.id === node.id) {
        const handles = getResizeHandles(node);
        ctx.fillStyle = "#007bff";

        handles.forEach(h => {
            ctx.fillRect(h.x, h.y, HANDLE_SIZE, HANDLE_SIZE);
        });
    }

}

// 4. Draw an edge (line between nodes)
function drawEdge(ctx, edge, nodes) {
    const from = nodes[edge.from];
    const to = nodes[edge.to];

    const fromCenterX = from.x + from.width / 2;
    const fromCenterY = from.y + from.height / 2;
    const toCenterX = to.x + to.width / 2;
    const toCenterY = to.y + to.height / 2;

    let startX, startY, endX, endY;

    // Decide exit side for FROM node
    if (toCenterX > fromCenterX) {
        // connect from right side
        startX = from.x + from.width;
        startY = fromCenterY;
    } else {
        // connect from left side
        startX = from.x;
        startY = fromCenterY;
    }

    // Decide entry side for TO node
    if (fromCenterX > toCenterX) {
        endX = to.x + to.width;
        endY = toCenterY;
    } else {
        endX = to.x;
        endY = toCenterY;
    }

    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}


// Detect clicks on a node (hit detection)
function getNodeAtPosition(x, y) {
    for (let nodeId in diagramData.nodes) {
        const node = diagramData.nodes[nodeId];

        if (
            x > node.x &&
            x < node.x + node.width &&
            y > node.y &&
            y < node.y + node.height
        ) {
            return node;
        }
    }
    return null;
}

function isOnResizeHandle(node, mouseX, mouseY) {
    return (
        mouseX >= node.x + node.width - HANDLE_SIZE &&
        mouseX <= node.x + node.width &&
        mouseY >= node.y + node.height - HANDLE_SIZE &&
        mouseY <= node.y + node.height
    );
}

// All sided resize handles code
function getResizeHandles(node) {
    const x = node.x;
    const y = node.y;
    const w = node.width;
    const h = node.height;

    return [
        { name: "tl", x: x - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2 },           // top-left
        { name: "tm", x: x + w / 2 - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2 },         // top-middle
        { name: "tr", x: x + w - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2 },          // top-right

        { name: "ml", x: x - HANDLE_SIZE / 2, y: y + h / 2 - HANDLE_SIZE / 2 },   // middle-left
        { name: "mr", x: x + w - HANDLE_SIZE / 2, y: y + h / 2 - HANDLE_SIZE / 2 },   // middle-right

        { name: "bl", x: x - HANDLE_SIZE / 2, y: y + h - HANDLE_SIZE / 2 },     // bottom-left
        { name: "bm", x: x + w / 2 - HANDLE_SIZE / 2, y: y + h - HANDLE_SIZE / 2 },     // bottom-middle
        { name: "br", x: x + w - HANDLE_SIZE / 2, y: y + h - HANDLE_SIZE / 2 }      // bottom-right
    ];
}

// track the handle click
function getHandleClicked(node, mouseX, mouseY) {
    const handles = getResizeHandles(node);

    for (let h of handles) {
        if (
            mouseX >= h.x &&
            mouseX <= h.x + HANDLE_SIZE &&
            mouseY >= h.y &&
            mouseY <= h.y + HANDLE_SIZE
        ) {
            return h.name; // return handle name like "tl", "tr", etc.
        }
    }

    return null;
}


// Enable mouse input
function enableMouseEvents() {
    const canvas = document.getElementById("diagramCanvas");

    // When mouse is pressed
    canvas.addEventListener("mousedown", (e) => {

        const rect = canvas.getBoundingClientRect(); // Get Canvas location relative to the browser defaults to 0
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        console.log("Mouse Down at:", mouseX, mouseY);

        const node = getNodeAtPosition(mouseX, mouseY);

        // Check if we clicked on resize handle of selected node
        const handle = selectedNode ? getHandleClicked(selectedNode, mouseX, mouseY) : null;

        if (handle) {
            console.log("Resize handle clicked:", handle);
            resizingNode = selectedNode;
            resizeHandle = handle;  // <-- NEW
            currentNode = null;     // disable dragging
            return;
        }


        if (node) {
            selectedNode = node;// Highlight
            currentNode = node;

            document.getElementById("info").innerHTML =
                `<b>Selected Node:</b><br>
                    ID: ${node.id}<br>
                    X: ${node.x}<br>
                    Y: ${node.y}<br>
                    Width: ${node.width}<br>
                    Height: ${node.height}`;

            offsetX = mouseX - node.x;
            offsetY = mouseY - node.y;
        }
        else {
            selectedNode = null;  // click empty canvas = deselect
        }

        drawDiagram(diagramData);
    });

    // When mouse moves
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Debug
        console.log("Mouse Move | resizingNode =", resizingNode);

        // 👉 RESIZE MODE
        if (resizingNode) {
            const node = resizingNode;

            const startX = node.x;
            const startY = node.y;
            const startW = node.width;
            const startH = node.height;

            switch (resizeHandle) {
                case "br": // bottom-right
                    node.width = mouseX - startX;
                    node.height = mouseY - startY;
                    break;

                case "tr": // top-right
                    node.height = (startY + startH) - mouseY;
                    node.y = mouseY;
                    node.width = mouseX - startX;
                    break;

                case "bl": // bottom-left
                    node.width = (startX + startW) - mouseX;
                    node.x = mouseX;
                    node.height = mouseY - startY;
                    break;

                case "tl": // top-left
                    node.width = (startX + startW) - mouseX;
                    node.x = mouseX;
                    node.height = (startY + startH) - mouseY;
                    node.y = mouseY;
                    break;

                case "tm": // top-middle
                    node.height = (startY + startH) - mouseY;
                    node.y = mouseY;
                    break;

                case "bm": // bottom-middle
                    node.height = mouseY - startY;
                    break;

                case "ml": // middle-left
                    node.width = (startX + startW) - mouseX;
                    node.x = mouseX;
                    break;

                case "mr": // middle-right
                    node.width = mouseX - startX;
                    break;
            }

            drawDiagram(diagramData);
            return;
        }


        // 👉 DRAG MODE
        if (currentNode) {
            currentNode.x = mouseX - offsetX;
            currentNode.y = mouseY - offsetY;

            drawDiagram(diagramData);
        }
    });


    // When mouse is released
    canvas.addEventListener("mouseup", () => {
        currentNode = null;
        resizingNode = null;
        resizeHandle = null;
    });
}

