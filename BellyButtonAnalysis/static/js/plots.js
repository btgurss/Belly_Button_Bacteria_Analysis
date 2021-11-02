function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("../samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("../samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  //Create the buildCharts function.
function buildCharts(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("../samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      var personId = data.samples;
      console.log(personId);
      // Create a variable that filters the samples for the object with the desired sample number.
      var personStats = personId.filter(stats => stats.id == sample);
      console.log(personStats);
      //  Create a variable that holds the first sample in the array.
      var result1 = personStats[0];
      console.log(result1);
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIdsResults = result1.otu_ids;
      console.log(otuIdsResults);

      var otuLabelsResults = result1.otu_labels;
      console.log(otuLabelsResults);

      var sampleResults = result1.sample_values
      console.log(sampleResults)


      // Create the yticks for the bar chart.
      // The top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      // Also mapped OTU into name of output
      var Test = otuIdsResults.slice(0,10).reverse().map(input => "OTU " + input);
      var top10x = sampleResults.slice(0,10).reverse();
  
      // Create the trace for the bar chart. 
      var barData = {
        x: top10x,
        y: Test,
        type: "bar",
        text: otuLabelsResults,
        orientation: "h"
      };
      // Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
       };
      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", [barData], barLayout);

      // Bar and Bubble charts
      // Create the trace for the bubble chart.
      var bubbleData = {
        x: otuIdsResults,
        y: sampleResults,
        mode: "markers",
        marker: {size: sampleResults,
                color: otuIdsResults,
                colorscale: 'Picnic'},
        text: otuLabelsResults
      };
  
      // Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"}
      };
  
      // Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

      //Variable to hold metadata array
      var metaPersonId = data.metadata;
      console.log(metaPersonId);
      // Filtering metadata array category to only chosen sample
      var metaPersonStats = metaPersonId.filter(stats => stats.id == sample);
      console.log(metaPersonStats);
      //  Create a variable that holds the first sample in the array.
      var result2 = metaPersonStats[0];
      console.log(result2);
      
      // Create variable for washing frequency
      var washFreq = result2.wfreq;
      console.log(washFreq);
          // Create the trace for the gauge chart.
          var gaugeData = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFreq,
              title: { text: "Belly Button Washing Frequency <br> Scrubs Per Week"},
              annotations: {text: "Testing"},
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: {range: [null, 10], tickwidth: 1, tickcolor: "black"},
                bar: { color: "black" },
                steps: [
                  { range: [0, 2], color: "red" },
                  { range: [2, 4], color: "orange" },
                  { range: [4, 6], color: "yellow" },
                  {range: [6, 8], color: "limegreen"},
                  {range: [8, 10], color: "darkgreen"}]
                }
            }
          ];
          
          // Create the layout for the gauge chart.
          var gaugeLayout = { 
             width: 600, height: 500, margin: { t: 0, b: 0 }
          };
      
          // Use Plotly to plot the gauge data and layout.
          Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });
  }