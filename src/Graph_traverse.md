---
toc: false
title: Graph Traversal
---
# Graph Traversal

<style>
#graph {
  width: 960px;
  height: 600px;
  margin: 0 auto;
}
.node text {
  pointer-events: none;
  font-size: 12px;
}

#graph-container {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

#output-container {
  border: 2px dashed #444;
  padding: 15px;
  background-color: #f9f9f9;
  margin-top: 10px;
}

label {
  margin-bottom: 5px;
}

.form-container {
  display: flex;
  gap: 20px;
  margin: 20px;
}

#linkFormContainer {
  margin-bottom: 0px; /* Add margin-bottom to the container of linkForm */
}

input[type="text"] {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px; /* Add width property to adjust the size of the input */
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.button-container {
  display: flex;
  justify-content: left; /* Align items horizontally at the center */
  align-items: center; /* Align items vertically at the center */
  margin: 0px;
}

.button-container button {
  margin: 10px; /* Apply margin of 10px to the DFS button */
}

button:hover {
  background-color: #0056b3;
}

.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  pointer-events: none;
}
#nodeDropdownContainer {
  margin-bottom: 10px;
}

#nodeDropdownContainer label {
  display: block;
  margin-bottom: 5px;
}

#nodeDropdown {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.background {
  background: #f0f0f0;
}

#message {
  border: 2px dashed #444;
  padding: 10px;
  background-color: #f9f9f9;
}
</style>

<!-- form container -->
<div class="background">
  <div class="form-container">
    <form id="nodeForm">
      <label for="nodeId">Node ID:</label>
      <input type="text" id="nodeId" name="nodeId" required>
      <label for="nodeGroup">Group:</label>
      <input type="text" id="nodeGroup" name="nodeGroup" required>
      <button type="submit">Add Node</button>
    </form>
  </div>
  <!-- link container -->
  <div class="form-container" id= "linkFormContainer">
    <form id="linkForm">
      <label for="sourceId">Source Node:</label>
      <input type="text" id="sourceId" name="sourceId" required>
      <label for="targetId">Target Node:</label>
      <input type="text" id="targetId" name="targetId" required>
      <button type="submit">Add Link</button>
    </form>
  </div>
  <!-- Add buttons for DFS and BFS -->
  <div class="button-container">
    <h3>Algorithm here:</h3>
    <button id="dfsButton">DFS</button>
    <button id="bfsButton">BFS</button>
  </div>

  <div id="nodeDropdownContainer">
    <label for="nodeDropdown">Select Start Node:
      <select id="nodeDropdown"></select>
    </label>
  </div>
</div>

<div id="graph-container">
  <div id="message"></div>
  <button id="restartButton" type="button">Restart</button>
  <div id="graph"></div>
  <div id="output-container"></div>
</div>

<!-- Output container for DFS/BFS traversal -->

<!--JavaScript imports-->
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="Graph_traverse.js" type="module"></script>

## DFS Traversal Demonstration

Here is a step-by-step demonstration of how DFS traversal works:

1. Select a starting node.
2. Check if the node is the target node. If it is, end the search.
3. If the node has already been visited, skip it.
4. Mark the node as visited.
5. Add all unvisited neighbor nodes of the node to the search stack.
6. Take a node from the search stack and go back to step 2.

## BFS Traversal Demonstration

Here is a step-by-step demonstration of how BFS traversal works:

1. Select a starting node.
2. Create an empty queue and enqueue the starting node.
3. Mark the starting node as visited.
4. While the queue is not empty, do the following:
  - Dequeue a node from the queue.
  - Check if the dequeued node is the target node. If it is, end the search.
  - Add all unvisited neighbor nodes of the dequeued node to the queue and mark them as visited.
5. Repeat steps 4 until the queue is empty or the target node is found.

