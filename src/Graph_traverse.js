import PriorityQueue from "js-priority-queue";

// Define the initial graph data
export const initialData = {
    nodes: [
      { id: "A", group: "1", neighbors: [] },
      { id: "B", group: "1", neighbors: [] },
      { id: "C", group: "2", neighbors: [] },
      { id: "D", group: "2", neighbors: [] },
      { id: "E", group: "3", neighbors: [] }
    ],
    links: [
      { source: "A", target: "B"},
      { source: "A", target: "C" },
      { source: "B", target: "C" },
      { source: "B", target: "D" },
      { source: "C", target: "D" },
      { source: "D", target: "E" }
    ]
};

// Clone the initial data for reset purposes
let data = cloneData(initialData);
// Create a map of node IDs to node objects
const nodeMap = new Map(data.nodes.map(node => [node.id, node]));

function populateNeighbors() {
    data.links.forEach(link => {
        const sourceNode = nodeMap.get(link.source);
        const targetNode = nodeMap.get(link.target);
        if (sourceNode && targetNode) {
            sourceNode.neighbors.push(targetNode);
            targetNode.neighbors.push(sourceNode); // For undirected graph
        }
    });
}

// populate initial neighbors
populateNeighbors();

const width = 960;
const height = 600;
const svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height);
const color = d3.scaleOrdinal(d3.schemeCategory10);

// calculate a initial position
function calculatePositions(nodes) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3; // Radius of the circle
    const angleStep = (2 * Math.PI) / nodes.length; // Angle between nodes

    nodes.forEach((node, index) => {
        const angle = index * angleStep;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
    });
}

// Calculate initial positions
calculatePositions(data.nodes);

// Create links (edges)
let link = svg.append("g").attr("class", "links").selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("stroke", "#999")
    .attr("stroke-width", 1.5);

// Create nodes
let node = svg.append("g").attr("class", "nodes").selectAll("g")
    .data(data.nodes)
    .enter().append("g");
// draw circle
node.append("circle")
    .attr("r", 10)
    .attr("fill", d => color(d.group))
// text
node.append("text")
    .attr("x", 12)
    .attr("y", 3)
    .text(d => d.id);

// Add tooltip div
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Mouseover event handler for nodes
function handleMouseOver(event, d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(`ID: ${d.id}<br>Group: ${d.group}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
}

// Mouseout event handler for nodes
function handleMouseOut() {
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
}

function updateGraph() {
    // Calculate positions for all nodes
    calculatePositions(data.nodes);

    // Clear old links and nodes
    svg.selectAll(".links line").remove();
    svg.selectAll(".nodes g").remove();
    svg.selectAll(".link-text").remove();

    // Update the links
    link = svg.select(".links").selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-width", 1.5);

    // Update the nodes
    node = svg.append("g").attr("class", "nodes").selectAll("g")
        .data(data.nodes)
        .enter().append("g");

    node.append("circle")
        .attr("r", 10)
        .attr("fill", d => color(d.group))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    node.append("text")
        .attr("x", 12)
        .attr("y", 3)
        .text(d => d.id);

    // Set positions for nodes
    node.attr("transform", d => `translate(${d.x},${d.y})`);

    // Update link positions
    link.attr("x1", d => nodeMap.get(d.source).x)
        .attr("y1", d => nodeMap.get(d.source).y)
        .attr("x2", d => nodeMap.get(d.target).x)
        .attr("y2", d => nodeMap.get(d.target).y);
}

// Clone data
function cloneData(data) {
    return {
        nodes: data.nodes.map(node => ({
            id: node.id,
            group: node.group,
            neighbors: [] // This will be populated later
        })),
        links: data.links.map(link => ({
            source: link.source,
            target: link.target
        }))
    };
}

// Add a new node
document.getElementById("nodeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const nodeId = document.getElementById("nodeId").value;
    const nodeGroup = document.getElementById("nodeGroup").value;
    const newNode = { id: nodeId, group: nodeGroup, neighbors: [] };
    data.nodes.push(newNode);
    nodeMap.set(nodeId, newNode); // Add new node to nodeMap
    updateGraph();
    populateDropdown();
    document.getElementById("nodeForm").reset();
});

// Create a link between two nodes
document.getElementById("linkForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const sourceId = document.getElementById("sourceId").value;
    const targetId = document.getElementById("targetId").value;
    const sourceNode = nodeMap.get(sourceId);
    const targetNode = nodeMap.get(targetId);
    if (sourceNode && targetNode) {
        data.links.push({ source: sourceId, target: targetId});
        sourceNode.neighbors.push(targetNode);
        targetNode.neighbors.push(sourceNode); // For undirected graph
        updateGraph();
        document.getElementById("linkForm").reset();
    } else {
        alert("Both nodes must exist to create a link.");
    }
});
// Event listener for restart 
document.getElementById("restartButton").addEventListener("click", function() {
    data = cloneData(initialData); // Reset data to initial state
    nodeMap.clear();
    data.nodes.forEach(node => nodeMap.set(node.id, node)); // Populate the nodeMap with cloned nodes
    populateNeighbors(); // Populate neighbors in the cloned nodes
    calculatePositions(data.nodes); // Calculate positions for the cloned nodes
    updateGraph(); // Update the graph with cloned data
    populateDropdown();
    document.getElementById("message").innerText = "Graph reset to initial state.";
});

function performDFS(startNode, outputId) {
    const stack = [startNode];
    const visited = new Set();
    document.getElementById(outputId).innerText = "";

    while (stack.length > 0) {
        const node = stack.pop();
        if (visited.has(node.id)) continue;
        visited.add(node.id);
        document.getElementById(outputId).innerText += node.id + " ";
        node.neighbors.forEach(neighbor => {
            if (!visited.has(neighbor.id)) {
                stack.push(neighbor);
            }
        });
    }
}

function performBFS(startNode, outputId) {
    const visited = new Set();
    const queue = [startNode];
    document.getElementById(outputId).innerText = "";

    while (queue.length > 0) {
        const node = queue.shift();
        if (visited.has(node.id)) continue;
        visited.add(node.id);
        document.getElementById(outputId).innerText += node.id + " ";
        node.neighbors.forEach(neighbor => {
            if (!visited.has(neighbor.id)) {
                queue.push(neighbor);
            }
        });
    }
}

function populateDropdown() {
    // Clear the dropdown
    while (nodeDropdown.firstChild) {
        nodeDropdown.removeChild(nodeDropdown.firstChild);
    }

    // Populate the dropdown
    data.nodes.forEach(node => {
        const option = document.createElement("option");
        option.value = node.id;
        option.textContent = node.id;
        nodeDropdown.appendChild(option);
    });
}

// Node dropdown
const nodeDropdown = document.getElementById("nodeDropdown");
populateDropdown();

// Event listener for DFS
document.getElementById("dfsButton").addEventListener("click", function() {
    const startNodeId = document.getElementById("nodeDropdown").value;
    const startNode = nodeMap.get(startNodeId);
    if (startNode) {
        performDFS(startNode, "output-container");
    }
});

// Event listener for BFS
document.getElementById("bfsButton").addEventListener("click", function() {
    const startNodeId = document.getElementById("nodeDropdown").value;
    const startNode = nodeMap.get(startNodeId);
    if (startNode) {
        performBFS(startNode, "output-container");
    }
});

updateGraph();