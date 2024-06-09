// Initial data
const initialData = {
  nodes: [
    { id: "A", group: "1" },
    { id: "B", group: "1" },
    { id: "C", group: "2" },
    { id: "D", group: "2" },
    { id: "E", group: "3" },
    { id: "F", group: "3" },
    { id: "G", group: "4" },
    { id: "H", group: "4" },
  ],
  links: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "C" },
    { source: "B", target: "D" },
    { source: "C", target: "D" },
    { source: "D", target: "E" },
    { source: "D", target: "F" },
    { source: "E", target: "F" },
    { source: "E", target: "B" },
    { source: "F", target: "C" },
    { source: "G", target: "A" },
    { source: "H", target: "A" },
  ]
};

// Clone the initial data for reset purposes
let data = JSON.parse(JSON.stringify(initialData));

// Stack to keep track of deleted nodes and links for undo functionality
let deleteHistory = [];

// Set up SVG canvas dimensions
const width = 960;
const height = 600;

// Define the color scale
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Create a simulation with forces
let simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(d => {return d.source.group === d.target.group ? 50 : 100;}))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

// Create the SVG container.
const svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Create links (edges)
let link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-width", d => Math.sqrt(d.value));

// Create nodes
let node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g");

const nodeEnter = node.append("circle")
    .attr("r", 8)
    .attr("fill", d => color(d.group))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

node.append("text")
    .attr("x", 12)
    .attr("y", 3)
    .text(d => d.id);

node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

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
    // Update the links
    link = link.data(data.links);
    link.exit().remove();
    link = link.enter().append("line")
        .attr("stroke", "#999")
        .attr("stroke-width", 1.5)
        .merge(link);

    // Update the nodes
    node = node.data(data.nodes);
    node.exit().remove();
    const nodeEnter = node.enter().append("g");

    nodeEnter.append("circle")
        .attr("r", 8)
        .attr("fill", d => color(d.group))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    nodeEnter.append("text")
        .attr("x", 12)
        .attr("y", 3)
        .text(d => d.id);

    nodeEnter.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
        .each(function(d) {
            if (!d.fx && !d.fy) {
                d.fx = width * 0.25;
                d.fy = height * 0.25;
            }
        });

    node = nodeEnter.merge(node);

    // Restart the simulation with new data
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);
    simulation.alpha(1).restart();
}

// Set the position attributes of links and nodes each time the simulation ticks.
function ticked() {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("transform", d => `translate(${d.x}, ${d.y})`);
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

document.getElementById("nodeForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const nodeId = document.getElementById("nodeId").value;
  const nodeGroup = document.getElementById("nodeGroup").value;
  data.nodes.push({ id: nodeId, group: nodeGroup });
  updateGraph();
  document.getElementById("nodeForm").reset();
});

document.getElementById("linkForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const sourceId = document.getElementById("sourceId").value;
  const targetId = document.getElementById("targetId").value;
  data.links.push({ source: sourceId, target: targetId });
  updateGraph();
  document.getElementById("linkForm").reset();
});

document.getElementById("deleteNodeForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const nodeIdToDelete = document.getElementById("nodeIdToDelete").value;
  const topNode = data.nodes[data.nodes.length - 1];

  if (topNode.id === nodeIdToDelete) {
    const linksToDelete = data.links.filter(link => link.source.id === nodeIdToDelete || link.target.id === nodeIdToDelete);

    // Save the deleted node and links to the history stack
    deleteHistory.push({ node: topNode, links: linksToDelete });

    // Delete the node and its links from data
    data.nodes.pop();
    data.links = data.links.filter(link => link.source.id !== nodeIdToDelete && link.target.id !== nodeIdToDelete);
    updateGraph();
    alert("The top node has been deleted!");
  } else {
    alert("Error: You must delete the top node!");
  }
  document.getElementById("deleteNodeForm").reset();
});

// Undo button functionality
document.getElementById("undoButton").addEventListener("click", function() {
  if (deleteHistory.length > 0) {
    const lastDeleted = deleteHistory.pop();
    data.nodes.push(lastDeleted.node);
    data.links.push(...lastDeleted.links);
    updateGraph();
    document.getElementById("message").innerText = "Undo successful!";
  } else {
    document.getElementById("message").innerText = "Nothing to undo!";
  }
});

// Restart button functionality
document.getElementById("restartButton").addEventListener("click", function() {
  // Reset the data to initial data
  data = JSON.parse(JSON.stringify(initialData));
  deleteHistory = []; // Clear the delete history

  // Restart the graph with initial data and positions
  updateGraph();
  document.getElementById("message").innerText = "Graph reset to initial state.";
});
