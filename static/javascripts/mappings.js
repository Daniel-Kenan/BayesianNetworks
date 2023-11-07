   // Define the data mapping for options
   const optionData = [
    { Zero: 0.85, Low: 0.1, Med: 0.04, High: 0.01 },
    { Zero: 0.25, Low: 0.6, Med: 0.1, High: 0.05 },
    { Zero: 0.05, Low: 0.1, Med: 0.6, High: 0.25 },
   { Zero: 0.01, Low: 0.04, Med: 0.1, High: 0.85 }
   ];

const form = document.getElementById('assessment-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Select all the select elements in the form
    const selectElements = form.querySelectorAll('select');

  
    const selectedDataValues = [];
    let nodenames = "", nodevalues = ""
    // Iterate through the select elements
    selectElements.forEach(function (select) {
        // Get the selected option value
        const selectedOption = select.value;
        const selectedOptionNumber  = select.selectedIndex;
        nodenames += select.parentNode.parentNode.children[0].innerText+","
        nodevalues += JSON.stringify(optionData[selectedOptionNumber])+","
        // Map the selected option to its data-value
      
    });

    // Output the selected data-values
    document.write(nodenames+"\n"+nodevalues)
    senddata(nodenames,nodevalues)
});



function senddata(val1,val2){

    const string1 = val1;
const string2 = val2;
const serverURL = "/api/generate_excel"; // Replace with your server's URL

const data = {
  string1: string1,
  string2: string2
};

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
};

fetch(serverURL, requestOptions)
  .then(response => {
    if (response.ok) {
      return response.blob();
    } else {
      throw new Error('Failed to generate the Excel file');
    }
  })
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error('Error:', error);
  });

}