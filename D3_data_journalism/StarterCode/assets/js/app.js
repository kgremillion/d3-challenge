var svgWidth = 1100;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
// Import Data
d3.csv('assets/data/data.csv').then(function(stateData, err) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.state = data.state;
      console.log(data);
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear().range([0, width]);
    var yLinearScale = d3.scaleLinear().range([height, 0]);

     // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Create min/max for axis
    var xMin = d3.min(stateData, function(data) {
      return data.poverty;
     });
  
    var xMax = d3.max(stateData, function(data) {
      return data.poverty;
     });
  
    var yMin = d3.min(stateData, function(data) {
      return data.healthcare;
     });
  
    var yMax = d3.max(stateData, function(data) {
      return data.healthcare;
     });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    // Step 5: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 6: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty +1))
    .attr("cy", d => yLinearScale(d.healthcare +.5))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".60");

    // Step 7: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      // .offset([90, -60])
      // .html(function(d) {
        return (stateData.abbr + '%');
      ;

    // Step 8: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 9: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .style("font-size", "12px")
      .selectAll("tspan")
      .data(stateData)
      .enter()
      .append("tspan")
        .attr("x", function(data) {
          return xLinearScale(data.poverty -0);
        })
        .attr("y", function(data) {
          return yLinearScale(data.healthcare -.1);
        })   
        .text(function(data) {
          return data.abbr
        });  
      
    chartGroup.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);

    chart.append("g")
      .call(leftAxis);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty Percentage (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Healthcare Percentage (%)");
      }).catch(function(error) {
    console.log(error);
  });
