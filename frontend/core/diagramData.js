export async function loadDiagram(file) {
    const response = await fetch(file);
    const data = await response.json();
    return data;
}