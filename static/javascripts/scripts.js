let currentNodeType = 'bar'; // Default chart type

function showChart(chartType) {
  currentNodeType = chartType;
  updateNodeCharts();
}

function updateNodeCharts() {
  const nodeGraphsContainer = document.getElementById('nodeGraphsContainer');
  const nodeListBtns = document.getElementById("nodeListBtns");
  nodeGraphsContainer.innerHTML = ''; // Clear previous content
  var nodeListBtnsHtml = ""; 
  nodeData.forEach(node => {
    const nodeGraph = document.createElement('div');
    nodeGraph.style.left = node.left; 
    nodeGraph.style.top = node.top; 
    nodeGraph.setAttribute("id", node.name);
    nodeGraph.setAttribute("data-children", node.children.join(" "));
    nodeGraph.classList.add('node-graph');
    nodeListBtnsHtml += `<a href="#">${node.name}</a>`; 
    const nodeChartContainer = document.createElement('div');
    nodeChartContainer.classList.add('node-chart-container');
    nodeChartContainer.innerHTML = `<h3>${node.name}</h3>`;
    nodeGraph.appendChild(nodeChartContainer);
    nodeGraphsContainer.appendChild(nodeGraph);
    const ctx = document.createElement('canvas');
    ctx.classList.add('node-chart');
    nodeChartContainer.appendChild(ctx);
    const chartConfig = {
      type: currentNodeType,
      data: {
        labels: node.states.map(state => state.name),
        datasets: [{
          label: node.name,
          data: node.states.map(state => state.probability),
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: false
        }
      }
    };
    new Chart(ctx, chartConfig);
    dragElement(nodeGraph);
    const circles = [
      { className: "circle top" },
      { className: "circle right" },
      { className: "circle bottom" },
      { className: "circle left" }
    ]
    for (const circle of circles) {
      let elem = document.createElement("div")
      elem.setAttribute("class", circle.className);
      nodeGraph.appendChild(elem);
    }        
    let delButton = document.createElement("button")
    delButton.appendChild(document.createTextNode("X"));
    delButton.setAttribute("class", "delete-node-btn visible");
    delButton.setAttribute("onclick", `deleteNode('${node.name}')`);
    nodeGraph.appendChild(delButton);
  });
  nodeListBtnsHtml += `<a href="#" onclick="addNode()">Add Node</a>`;
  nodeListBtns.innerHTML = nodeListBtnsHtml;
  if (init){
    socket.emit('update_node_data', { data: nodeData });
  }
  drawArrows();
}

function getCenterCoordinates(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function findNearestCircle(element, circleClassName, direction) {
  const circles = element.querySelectorAll(`.${circleClassName}.${direction}`);
  const sourceCenter = getCenterCoordinates(element);
  let nearestCircle = null;
  let minDistance = Number.MAX_VALUE;

  circles.forEach(circle => {
    const circleCenter = getCenterCoordinates(circle);
    const distance = Math.sqrt(
      Math.pow(circleCenter.x - sourceCenter.x, 2) +
      Math.pow(circleCenter.y - sourceCenter.y, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestCircle = circle;
    }
  });

  return nearestCircle;
}

var arrowLines = [];

function drawArrows() {
  const arrowsContainer = document.getElementById('arrowsContainer');
// console.trace(arrowLines);  
  // Clear previous arrow lines from the container and the array
  var body = document.body;
  
  // Get all SVG elements inside the body
  var svgElements = body.querySelectorAll("svg");
  
  // Loop through each SVG element and remove it
  svgElements.forEach(function(svgElement) {
    svgElement.remove();
  });
  
  arrowsContainer.innerHTML = '';
  arrowLines.length = 0;

  nodeData.forEach(node => {
    const sourceElement = document.getElementById(node.name);
    node.children.forEach(childName => {
      const destinationElement = document.getElementById(childName);

      // Check if the arrow line already exists in the array
      const existingLine = arrowLines.find(line =>{
      // console.log(line);
      // console.log(line.start.getAttribute("id"),line.end.getAttribute("id"),"==>",node.name,childName)
      // console.log(sourceElement.getAttribute("id"),destinationElement.getAttribute("id"))
      //  return line.start.getAttribute("id").includes(node.name) && line.end.getAttribute("id").includes(childName)
       return  line.start == sourceElement && line.end == destinationElement
    });
    console.log("================================")
      if (existingLine) {
               // Update existing line properties if needed
        existingLine.startPlugColor = '#1a6be0';
        existingLine.endPlugColor = '#1efdaa';
        existingLine.middleLabel.text = `P(${node.name}U${childName})`;

        // Update options and redraw the line
        existingLine.setOptions({
          color: 'rgba(30, 130, 250, 0.5)',
          startPlugColor: 'rgb(241, 76, 129)',
          endPlugColor: 'rgba(241, 76, 129, 0.5)',
          startPlugSize: 5,
          endPlugSize: 8,
          endPlugOutline: true,
        });
        existingLine.position();
          console.log("modifying existing line...");
      } else {
        // Create a new LeaderLine instance
        const line = new LeaderLine(sourceElement, destinationElement, {
          startPlug: 'disc',
          endPlug: 'arrow3',
          startPlugColor: '#1a6be0',
          endPlugColor: '#1efdaa',
          middleLabel: LeaderLine.captionLabel({
            text: `P( ${childName} | ${node.name} )`,
            color: 'whitesmoke',
            outlineColor: '',
            fontWeight: "500"
          }),
        });
        line.size = 0.5;
        line.setOptions({
          color: 'rgba(30, 130, 250, 0.5)',
          startPlugColor: 'rgb(241, 76, 129)',
          endPlugColor: 'rgba(241, 76, 129, 0.5)',
          startPlugSize: 5,
          endPlugSize: 8,
          endPlugOutline: true,
        });
        // console.log("making new line...");
        // Store the line instance in the array
        arrowLines.push({ line, start: sourceElement, end: destinationElement });
      }
    });
  });
  // console.trace(arrowLines[0].start.getAttribute("id"));
}




function deleteNode(id){
  let node = nodeData.find(({name})=> name == id) ; 
  nodeData.pop(node) ; 
  document.getElementById("delNode").classList.remove("delColor"); 
  updateNodeCharts() ; 
}
// Initial chart display
updateNodeCharts();

// Function to toggle dropdown content on hover
function toggleDropdown(element, show) {
  const dropdownContent = element.querySelector('.dropdown-content');
  if (show) {
    dropdownContent.classList.add('show');
  } else {
    dropdownContent.classList.remove('show');
  } 
}

// Dropdown toggle functionality
$(document).ready(function() {
  $('.dropdown-toggle').click(function() {
    $(this).siblings('.dropdown-content').toggleClass('show');
  });
});

