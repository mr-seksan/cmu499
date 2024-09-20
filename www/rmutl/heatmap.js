// Set the dimensions and margins of the graph
var margin = { top: 80, right: 25, bottom: 30, left: 60 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Generate dummy data for January
var data = [];
var date = new Date(2024, 0, 1); // January 1, 2024
while (date.getMonth() === 0) {
    data.push({
        date: d3.timeFormat("%Y-%m-%d")(date),
        value: Math.floor(Math.random() * 400) + 1  // Adjusted range to match all color conditions
    });
    date.setDate(date.getDate() + 1);
}

// Parse the date / time
var parseDate = d3.timeParse("%Y-%m-%d");

// Create a new data structure that includes the week and day of the week
data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.week = d3.timeFormat("%U")(d.date); // Week number: 00-53
    d.day = d3.timeFormat("%w")(d.date);   // Day of the week: 0 (Sunday) to 6 (Saturday)
});

// Labels of rows and columns
var weeks = d3.map(data, function (d) { return d.week; }).keys();
var days = ["0", "1", "2", "3", "4", "5", "6"]; // Day names from Sunday (0) to Saturday (6)
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Day names for display

// Build X scales and axis:
var x = d3.scaleBand()
    .range([0, width])
    .domain(weeks)
    .padding(0.01); // Reduce padding between boxes
svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove();

// Build Y scales and axis:
var y = d3.scaleBand()
    .range([height, 0])
    .domain(days)
    .padding(0.01); // Reduce padding between boxes
svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickFormat(function (d) { return dayNames[d]; }).tickSize(0))
    .select(".domain").remove();

// Function to determine color based on value
function getColor(value) {
    if (value <= 50) {
        return '#58e30e';
    } else if (value >= 51 && value <= 100) {
        return '#FCDC2A';
    } else if (value >= 101 && value <= 150) {
        return '#FF9800';
    } else if (value >= 151 && value <= 200) {
        return '#FF0303';
    } else if (value >= 201 && value <= 300) {
        return '#874CCC';
    } else if (value >= 301) {
        return '#8E3E63';
    }
}

// Create a tooltip
var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

// Three functions that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
    tooltip
        .style("opacity", 1);
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
};
var mousemove = function (event, d) {
    tooltip
        .html("The exact value of<br>this cell is: " + d.value)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY) + "px");
};
var mouseleave = function (d) {
    tooltip
        .style("opacity", 0);
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8);
};

// Add the squares with adjusted size
svg.selectAll()
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) {
        return x(d.week) + (x.bandwidth() - x.bandwidth() * 0.5) / 2; // Centering the rectangles
    })
    .attr("y", function (d) {
        return y(d.day) + (y.bandwidth() - y.bandwidth() * 0.5) / 2; // Centering the rectangles
    })
    .attr("width", x.bandwidth() * 0.5) // Width of rectangles
    .attr("height", y.bandwidth() * 0.5) // Height of rectangles
    .style("fill", function (d) { return getColor(d.value); })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);


// Add title to graph
svg.append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "22px")
    .text("A d3.js calendar heatmap");

// Add subtitle to graph
svg.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "grey")
    .style("max-width", 400)
    .text("January 2024: Day by week visualization");
