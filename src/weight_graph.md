---
toc: false
title: Weight_Graph
---
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
  position: relative; /* 設置容器的位置為相對定位 */
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

#background {
  background: #f0f0f0;
}

#traversalTable {
  position: absolute; /* 將表格設置為絕對定位 */
  top: 0; /* 距離容器頂部的距離為 0 */
  left: 0; /* 距離容器左側的距離為 0 */
  width: 30%;
  border-collapse: collapse;
  margin-top: 0px;
}

#traversalTable th, #traversalTable td {
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  background-color: #f2f2f2;
  width: 50px;
}
#traversalTable td {
  font-size: 15px;
}

#InitialDataTable {
  position: absolute; /* 將表格設置為絕對定位 */
  top: 30%; /* 距離容器頂部的距離為 0 */
  left: 0; /* 距離容器左側的距離為 0 */
  width: 30%;
  border-collapse: collapse;
  margin-top: 0px;
}
#InitialDataTable th, #InitialDataTable td {
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  background-color: #f2f2f2;
  width: 50px;
}
#InitialDataTable td {
  font-size: 15px;
}

</style>
# Graph having weight
<div id="background">
  <div class="button-container">
    <h3>Algorithm here:</h3>
    <button id="dijkstraButton">Dijkstra's</button>
  </div>

  <div id="nodeDropdownContainer">
    <label for="nodeDropdown">
      Select Start Node:
      <select id="nodeDropdown"></select>
    </label>
  </div>
</div>
<div id="graph-container">
  <div id="graph"></div>
    <table id="traversalTable">
      <thead>
        <tr>
              <th>Node</th>
              <th>Distance</th>
              <th>Previous Node</th>
        </tr>
      </thead>
      <tbody>
        <!-- 這裡將動態生成表格內容 -->
      </tbody>
    </table>
    <table id="InitialDataTable">
      <thead>
        <tr>
              <th>NodeID</th>
              <th>Neighbor</th>
              <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <!-- 這裡將動態生成表格內容 -->
      </tbody>
    </table>
  <div id="output-container"></div>
</div>
<!--JavaScript imports-->
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="weight_graph.js" type="module"></script>

