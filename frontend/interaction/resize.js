export function resizeNode(node, handle, mouseX, mouseY) {
    const startX = node.x;
    const startY = node.y;
    const startW = node.width;
    const startH = node.height;


    switch (handle) {
        case 'br':
            node.width = mouseX - startX;
            node.height = mouseY - startY;
            break;
        case 'tr':
            node.height = (startY + startH) - mouseY;
            node.y = mouseY;
            node.width = mouseX - startX;
            break;
        case 'bl':
            node.width = (startX + startW) - mouseX;
            node.x = mouseX;
            node.height = mouseY - startY;
            break;
        case 'tl':
            node.width = (startX + startW) - mouseX;
            node.x = mouseX;
            node.height = (startY + startH) - mouseY;
            node.y = mouseY;
            break;
        case 'tm':
            node.height = (startY + startH) - mouseY;
            node.y = mouseY;
            break;
        case 'bm':
            node.height = mouseY - startY;
            break;
        case 'ml':
            node.width = (startX + startW) - mouseX;
            node.x = mouseX;
            break;
        case 'mr':
            node.width = mouseX - startX;
            break;
    }
}