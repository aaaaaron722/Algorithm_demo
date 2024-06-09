const width = 960;
const height = 600;
// Create the SVG container.
const svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Define the initial graph data
const initialData = {
    nodes: [
      { id: "A", neighbors: [] },
      { id: "B", neighbors: [] },
      { id: "C", neighbors: [] },
      { id: "D", neighbors: [] },
      { id: "E", neighbors: [] }
    ],
    links: [
      { source: "A", target: "B", weight: 7 },
      { source: "A", target: "C", weight: 2 },
      { source: "B", target: "D", weight: 9 },
      { source: "B", target: "E", weight: 1},
      { source: "C", target: "E", weight: 3 },
      { source: "D", target: "E", weight: 6 }
    ]
};
const nodeMap = new Map(initialData.nodes.map(node => [node.id, node]));

function populateNeighbors() {
    initialData.links.forEach(link => {
        const sourceNode = nodeMap.get(link.source);
        const targetNode = nodeMap.get(link.target);
        if (sourceNode && targetNode) {
            sourceNode.neighbors.push(targetNode);
            targetNode.neighbors.push(sourceNode); //For undirected graph
        }
    });
}

// populate initial neighbors
populateNeighbors();

// Create a simulation with forces
let simulation = d3.forceSimulation(initialData.nodes)
    .force("link", d3.forceLink(initialData.links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

// Set the position attributes of links and nodes each time the simulation ticks.
function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  
    node
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
    linkText
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2);
}


// Create links (edges)
let link = svg.append("g").attr("class", "links").selectAll("line")
    .data(initialData.links)
    .enter().append("line")
    .attr("stroke", "#999")
    .attr("stroke-width", 2.5);

// Add text to the middle of the links
let linkText = svg.append("g").attr("class", "link-text").selectAll("text")
    .data(initialData.links)
    .enter().append("text")
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2)
    .text(d => d.weight)
    .style("font-size", "20px")  // Change the font size
    .style("fill", "#333")       // Change the text color
    .style("font-family", "Arial");  // Change the font family

// Create nodes
let node = svg.append("g").attr("class", "nodes").selectAll("g")
    .data(initialData.nodes)
    .enter().append("g");

// draw circle
node.append("circle")
    .attr("r", 20)
    .attr("fill", "none")
    .attr("stroke", "#000")

// text
node.append("text")
    .text(d => d.id)
    .attr("dx", -5)
    .attr("dy", 5);
    
node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;
    
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > queueElement.priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
    
        if (!added) {
            this.items.push(queueElement);
        }
    }
    
    dequeue() {
        return this.items.shift().element;
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}
    
function performDijkstra(startNode) {
    // Initialize distances, previous nodes and visited nodes
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    initialData.nodes.forEach(node => {
        distances.set(node.id, Infinity);
        previous.set(node.id, null);
    });
    distances.set(startNode.id, 0);

    // Create a priority queue to store nodes with their distances
    const queue = new PriorityQueue();
    queue.enqueue(startNode.id, 0);
    while (!queue.isEmpty()) {
        const currentNodeId = queue.dequeue();
        visited.add(currentNodeId);

        const currentNode = initialData.nodes.find(node => node.id === currentNodeId);

        currentNode.neighbors.forEach(neighbor => {
            if (!visited.has(neighbor.id)) {
                const distance = distances.get(currentNodeId) + getWeight(currentNodeId, neighbor.id);
                if (distance < distances.get(neighbor.id)) {
                    distances.set(neighbor.id, distance);
                    previous.set(neighbor.id, currentNodeId); // Store the previous node
                    queue.enqueue(neighbor.id, distance);
                }
            }
        });
    }
    createInitialData("InitialDataTable");
    createTable("traversalTable", distances, previous);
}
function getWeight(sourceNodeId, targetNodeId) {
    const link = initialData.links.find(link => 
        (link.source.id === sourceNodeId && link.target.id === targetNodeId) ||
        (link.source.id === targetNodeId && link.target.id === sourceNodeId)
    );
    return link ? link.weight : Infinity;
}

function createInitialData(outputContainerId) {
    // Output the results in the table
    const tableBody = document.querySelector(`#${outputContainerId} tbody`);
    tableBody.innerHTML = ""; // Clear existing table rows

    initialData.nodes.forEach(node => {
        const row = `<tr>
                        <td>${node.id}</td>
                        <td>${node.neighbors.map(neighbor => `${neighbor.id}`).join(", ")}</td>
                        <td>${node.neighbors.map(neighbor => `${neighbor.id}: ${getWeight(node.id, neighbor.id)}`).join("<br>")}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

function createTable(outputContainerId, distances, previous){
    // Output the results in the table
    const tableBody = document.querySelector(`#${outputContainerId} tbody`);
    tableBody.innerHTML = ""; // Clear existing table rows

    distances.forEach((distance, nodeId) => {
        const previousNode = previous.get(nodeId);
        const previousNodeId = previousNode ? previousNode : "-";
        const row = `<tr>
                        <td>${nodeId}</td>
                        <td>${distance === Infinity ? "NULL" : distance}</td>
                        <td>${previousNodeId}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}
// Reheat the simulation when drag starts, and fix the subject position.
function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}
  
// Update the subject (dragged node) position during drag.
function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}
  
// Restore the target alpha so the simulation cools after dragging ends.
// Unfix the subject position now that it’s no longer being dragged.
function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}

function populateDropdown() {
    // Populate the dropdown
    initialData.nodes.forEach(node => {
        const option = document.createElement("option");
        option.value = node.id;
        option.textContent = node.id;
        nodeDropdown.appendChild(option);
    });
}

// Node dropdown
const nodeDropdown = document.getElementById("nodeDropdown");
populateDropdown();

// Event listener for Dijkstra
document.getElementById("dijkstraButton").addEventListener("click", function() {
    const startNodeId = document.getElementById("nodeDropdown").value;
    const startNode = nodeMap.get(startNodeId);
    if (startNode) {
        performDijkstra(startNode);
    }
});
