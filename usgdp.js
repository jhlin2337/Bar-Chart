document.addEventListener('DOMContentLoaded', function() {
  request = new XMLHttpRequest();
  request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  request.send();
  request.onload = function() {
    // Acquire US GDP dataset
    json = JSON.parse(request.responseText);
    const dataset = json.data;

    // Set constants
    const WIDTH = 900;
    const HEIGHT = 540;
    const PADDING = 50;
    const TOOLTIP_PADDING = 20;
    const ELEMENT_WIDTH = (WIDTH-(2*PADDING))/dataset.length;

    // Acquire a function that will linearly scale the numbers in the dataset
    // to numbers that can be used to represent the data in the graph
    const domainMax = d3.max(dataset, d => d[1]);
    const yScale = d3.scaleLinear()
                     .domain([0, domainMax])
                     .range([HEIGHT-PADDING, PADDING]);

    const minDate = d3.min(dataset, d => d[0]);
    const maxDate = d3.max(dataset, d => d[0]);
    const xScale = d3.scaleLinear()
                     .domain([minDate.split('-')[0], maxDate.split('-')[0]])
                     .range([PADDING, WIDTH-PADDING])

    // Creates a tooltip that displays data when bar is hovered over
    var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip");

    // Create an svg element
    const svg = d3.select('#chart')
                  .append('svg')
                  .attr('width', WIDTH)
                  .attr('height', HEIGHT);

    // Plot the dataset onto the svg canvas
    svg.selectAll('rect')
       .data(dataset)
       .enter()
       .append('rect')
       .attr("x", (d, i) => i * ELEMENT_WIDTH + PADDING)
       .attr("y", (d, i) => yScale(d[1]))
       .attr("width", ELEMENT_WIDTH)
       .attr("height", (d, i) => HEIGHT-yScale(d[1])-PADDING)
       .attr("fill", "#33ADFF")
       .attr("class", "bar")
       .on("mouseover", function(d) {
          let map = {
            '01': 'Q1',
            '04': 'Q2',
            '07': 'Q3',
            '10': 'Q4'
          };
          let dates = d[0].split('-');
          let quarter = map[dates[1]];
          let content = dates[0] + ' ' + quarter + '<br> $' + d[1] + ' Billion'

          tooltip.style("visibility", "visible")
                 .html(content)
       })
       .on("mousemove", () => tooltip.style("left",(event.pageX+TOOLTIP_PADDING)+"px"))
       .on("mouseout", () => tooltip.style("visibility", "hidden"));


    // Create a y-axis for the graph
    const yAxis = d3.axisLeft(yScale)
    svg.append('g')
       .attr('transform', 'translate(' + PADDING + ', 0)')
       .call(yAxis);

    // Create an x-axis for the graph
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    svg.append('g')
       .attr('transform', 'translate(0, ' + (HEIGHT-PADDING) + ')')
       .call(xAxis);
  }
});