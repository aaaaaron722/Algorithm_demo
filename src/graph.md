---
toc: false
title: Social network simulator
---
# Social network simulator

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

label {
  margin-bottom: 5px;
}

.form-container {
  display: flex;
  gap: 20px;
  margin: 20px;
}

input[type="text"] {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px;
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

button[id="restartButton"] {
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  background-color: red;
  border: none;
  border-radius: 4px;
  margin-left: 480px;
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

.background{
  background: #f0f0f0;
}
#message {
  border: 2px dashed #444;
  padding: 10px;
  background-color: #f9f9f9;
}

</style>
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

  <div class="form-container">
    <form id="linkForm">
      <label for="sourceId">Source Node:</label>
      <input type="text" id="sourceId" name="sourceId" required>
      <label for="targetId">Target Node:</label>
      <input type="text" id="targetId" name="targetId" required>
      <button type="submit">Add Link</button>
    </form>
  </div>

  <div class="form-container">
    <form id="deleteNodeForm">
      <label for="nodeIdToDelete">Delete Node:</label>
      <input type="text" id="nodeIdToDelete" name="nodeIdToDelete">
      <button type="submit">Delete Node</button>
      <button id="undoButton" type="button">Undo Delete</button>
    </form>
      <h5>You can only pop the top node due to its data sturcture</h5>
  </div>
</div>

<div id="graph-container">
  <div id="message"></div>
  <button id="restartButton" type="button">Restart</button>
  <div id="graph"></div>
</div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="graph.js" type="module"></script>


### Some bug to fix,
1. If it has a series node like {node : id} = {A: A, B: B, C: C, D: D}, when I delete A the node 
actually be deleted, but the series become {A: B, B: C, C: D} which is the name and its node id 
inconsistency.
