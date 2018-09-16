function buildMetadata(sample) {
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ); 

  d3.json(`/metadata/${sample}`).then((data)=>{
     console.log(data)
     var metapanel = d3.select("#sample-metadata");
     metapanel.html("");
 
     var startcount = 0
 
     Object.entries(data).forEach(function([key, value]){
       metapanel
       .append("p")
       .attr("class", `meta meta${startcount}`)
       .html(`<b>${key
       .toUpperCase()}: ${value}</b>`);
       startcount += 1;
     });
     buildGauge(data.WFREQ);
    })
 };
 

 function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  d3.json(`/samples/${sample}`).then((pdata)=>{
     console.log(pdata);
     
     var labels = pdata.otu_ids.slice(0,10);
     var values = pdata.sample_values.slice(0,10);
     var text = pdata.otu_labels.slice(0,10);
 
     var tracePie = {
       labels: labels,
       values: values,
       text: text,
       textinfo: 'value',
       type: "pie"};
     var Pie = [tracePie];
 
     var layout = {
       title: "Pie Chart of Samples",
       height: 500
       
     }
 
     Plotly.newPlot("pie", Pie, layout);
 

     var traceBubble = {
       x: pdata.otu_ids,
       y: pdata.sample_values,
       text: pdata.otu_labels,
       mode: "markers",
       marker: {
         size: pdata.sample_values,
         color: pdata.otu_ids,
         colorscale: "Earth"
       }
     };
     var Bub = [traceBubble]
 
     var layout = {
       title: "Bubble Chart of Samples",
       xaxis: {title: "OTU ID"}
     }
     
     Plotly.newPlot("bubble", Bub, layout);
     
   });
 }
 
 function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
 
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
     sampleNames.forEach((sample) => {
       selector
         .append("option")
         .text(`BB_${sample}`)
         
         .property("value", sample);
     });
 
     // Use the first sample from the list to build the initial plots
     const firstSample = sampleNames[0];
     buildCharts(firstSample);
     buildMetadata(firstSample);
   });
 }
 
 function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
 }
 
 // Initialize the dashboard
 init();
