var svg = d3.select("#metanetwork"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var g = svg.append("g")
.attr("class", "everything");

//add zoom capabilities 
var zoom_handler = d3.zoom()
  .on("zoom", zoom_actions);

  zoom_handler(svg);     
  var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody().strength(-250))
  .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("./data/meta.json", function(error, graph) {
    if (error) throw error;


    var link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = g.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("image")
      //.attr("r", function(d) { return  d.value * 2 ; })
      //.attr("fill", function(d) { return color(d.id); })
      .attr("xlink:href", function(d) { return "./images/" + d.representative; })
      .attr("width", function (d) { return d.value * 6 })
     // .attr("height", function (d) { return 10 })
      .on("click", function(d) {alert ("you clicked on node" + d.id + " value " + d.value + " representative: " + d.representative);})
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
    
    node.append("title")
      .text(function(d) { return d.id; });
    

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x + d.source.value * 3; })
        .attr("y1", function(d) { return d.source.y + 5; })
        .attr("x2", function(d) { return d.target.x + d.target.value * 3; })
        .attr("y2", function(d) { return d.target.y + 5 ; });

      node
        //.attr("cx", function(d) { return d.x; })
        //.attr("cy", function(d) { return d.y; });
       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

  });

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//Zoom functions 
function zoom_actions(){
  g.attr("transform", d3.event.transform)
}
