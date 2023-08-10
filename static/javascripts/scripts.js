let currentNodeType = 'bar'; // Default chart type

function showChart(chartType) {
  currentNodeType = chartType;
  updateNodeCharts();
}

function updateNodeCharts() {
  const nodeGraphsContainer = document.getElementById('nodeGraphsContainer');
  const nodeListBtns = document.getElementById("nodeListBtns");
  nodeGraphsContainer.innerHTML = ''; // Clear previous content
  // nodeListBtns.innerHTML = 
  var nodeListBtnsHtml = "" ; 
  nodeData.forEach(node => {

    const nodeGraph = document.createElement('div');
    nodeGraph.style.left = node.left ; 
    nodeGraph.style.top = node.top ; 
    nodeGraph.setAttribute("id",node.name);
    nodeGraph.setAttribute("data-parents",node.parents.join(" "));

    nodeGraph.classList.add('node-graph');
    nodeListBtnsHtml += `<a href="#">${node.name}</a>` ; 
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
      let elem =  document.createElement("div")
      elem.setAttribute("class",circle.className);
      nodeGraph.appendChild(elem)
    }        
    
  }
  );
  nodeListBtnsHtml += `<a href="#" onclick="addNode()">Add Node</a>`;
  nodeListBtns.innerHTML = nodeListBtnsHtml; 
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

