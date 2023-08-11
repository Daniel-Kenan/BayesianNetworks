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
  // drawArrows();
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

function drawArrows() {
  const arrowsContainer = document.getElementById('arrowsContainer');
  arrowsContainer.innerHTML = ''; // Clear previous arrows

  nodeData.forEach(node => {
    const sourceElement = document.getElementById(node.name);
    const sourceCircleTop = findNearestCircle(sourceElement, 'circle', 'top');
    const sourceCircleRight = findNearestCircle(sourceElement, 'circle', 'right');
    const sourceCircleBottom = findNearestCircle(sourceElement, 'circle', 'bottom');
    const sourceCircleLeft = findNearestCircle(sourceElement, 'circle', 'left');

    node.children.forEach(childName => {
      const destinationElement = document.getElementById(childName);
      const destinationCircleTop = findNearestCircle(destinationElement, 'circle', 'top');
      const destinationCircleRight = findNearestCircle(destinationElement, 'circle', 'right');
      const destinationCircleBottom = findNearestCircle(destinationElement, 'circle', 'bottom');
      const destinationCircleLeft = findNearestCircle(destinationElement, 'circle', 'left');

      if (sourceCircleTop && destinationCircleTop) {
        const sourceCenter = getCenterCoordinates(sourceCircleTop);
        const destinationCenter = getCenterCoordinates(destinationCircleTop);

        const arrowOptions = {
          source: sourceCenter,
          destination: destinationCenter,
          color: 'whitesmoke',
          style: 'solid',
          thickness: 0.3,
          curvature: 0.5,
        };

        arrowLine(arrowOptions);
      }

      // Repeat similar code for other directions (right, bottom, left)
    });
  });
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

