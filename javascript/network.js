function clearWindow()
{
  d3.select("#network").remove();
  e = document.createElement("div")
  e.id="network";
  document.getElementById("two").appendChild(e);
}

function loadCluster ()
{
var svg2 = d3.select("#network").append("svg")
    .attr("width", 400)
    .attr("height", 500);

var g2 = svg2.append("g")
.attr("class", "everything");

//add zoom capabilities 

var zoom_handler = d3.zoom()
  .on("zoom", zoom_actions);

  zoom_handler(svg2);     
  var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation2 = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(400 / 2, 500 / 2));

  d3.json("./data/full.json", function(error, graph2) {
    if (error) throw error;

    //filter links and nodes
    var filteredNodes = new Array();
    var filteredLinks = new Array(); 
    var cluster = parseInt(document.getElementById("cid").innerHTML);
    for (var x = 0; x < graph2.nodes.length; x++)
    {
      if (graph2.nodes[x].group == cluster)
      {
        filteredNodes.push(graph2.nodes[x]);
      }
    }

    function inNodes (source)
    {
      for (var i = 0; i< filteredNodes.length; i++)
      {
        if (source == filteredNodes[i].id)
        {
          return true;
        }
      }
      return false;
    }



    for (var x = 0; x < graph2.links.length; x++)
    {
      if (inNodes(graph2.links[x].source) && inNodes(graph2.links[x].target))
      {
        filteredLinks.push(graph2.links[x]);
      }
    }

    var link2 = g2.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredLinks)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value) /5 ; });

    var node2 = g2.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(filteredNodes)
      .enter().append("image")
      .attr("xlink:href", function(d) { return "./images/" + d.id; })
      .attr("height", 20)
      .attr("width", 40)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
    
    node2.append("title")
      .text(function(d) { return d.id; });
    

    simulation2
      .nodes(filteredNodes)
      .on("tick", ticked);

    simulation2.force("link")
      .links(filteredLinks);

    function ticked() {
      link2
        .attr("x1", function(d) { return d.source.x + 20; })
        .attr("y1", function(d) { return d.source.y + 10; })
        .attr("x2", function(d) { return d.target.x + 20; })
        .attr("y2", function(d) { return d.target.y + 10; });

      node2
        //.attr("cx", function(d) { return d.x; })
        //.attr("cy", function(d) { return d.y; });
       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

  });

function dragstarted(d) {
  if (!d3.event.active) simulation2.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation2.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//Zoom functions 
function zoom_actions(){
  g2.attr("transform", d3.event.transform)
}
}
