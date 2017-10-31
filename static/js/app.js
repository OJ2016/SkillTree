$(document).ready(function() {
    console.log(content);

    var svg = d3.select("#class-diagram")
        .append("svg")
		.attr("width",  "100%")
		.attr("height", "100%")
        .append("g")


svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "trees");
ClassesData_orig = [{
	    "name": "ClassName1",
		"id":"0",
		"var": 0,
		"color":"#98abc5",
		"value":1,
		"children": [
			{
			"name": "name",
			"id":"0.0",
			"var": 0,
			"children": [
				{
				"name": "name",
				"id":"0.0.0",
				"var": 0,
				"children": [
					{
					"name": "name",
					"id":"0.0.0.0",
					"var": 0
					},
					{
					"name": "nf2",
					"id":"0.0.0.1",
					"var": 0
					}
				]
				},
				{
				"name": "name",
				"id":"0.0.1",
				"var": 0,
				"children": [
					{
					"name": "name",
					"id":"0.0.1.0",
					"var": 0
					},
					{
					"name": "name",
					"id":"0.0.1.1",
					"var": 0
					}
				]
				}
			]
			}
		]
	}, {
	    "name": "ClassName2",
		"id":"1",
		"var": 0,
		"color":"#aaaaaa",
		"value":1,
		"children": [
			{
			"name": "name",
			"id":"1.0",
			"var": 0,
			"children": [
				{
				"name": "name",
				"id":"1.0.0",
				"var": 0,
				"children": [
					{
					"name": "name",
					"id":"1.0.0.0",
					"var": 0
					},
					{
					"name": "namhhhe",
					"id":"1.0.0.1",
					"var": 0
					}
				]
				},
				{
				"name": "name",
				"id":"1.0.1",
				"var": 0,
				"children": [
					{
					"name": "name",
					"id":"1.0.1.0",
					"var": 0
					},
					{
					"name": "name",
					"id":"1.0.1.1",
					"var": 0
					}
				]
				}
			]
			}
		]
		}
		, {
	    "name": "ClassName3",
		"id":"2",
		"var": 0,
		"color":"#aaaaff",
		"value":1,
		"children": [
			{
			"name": "name",
			"id":"2.0",
			"var": 0,
			"children": [
				{
				"name": "name",
				"id":"2.0.0",
				"var": 0,
				"children": [
					{
					"name": "name",
					"id":"2.0.0.0",
					"var": 0
					},
					{
					"name": "namhhhe",
					"id":"2.0.0.1",
					"var": 0
					}
				]
				},
				{
				"name": "name",
				"id":"2.0.1",
				"var": 0,
				"children": [
					{
					"name": "name",
					"id":"2.0.1.0",
					"var": 0
					},
					{
					"name": "name",
					"id":"2.0.1.1",
					"var": 0
					}
				]
				}
			]
			}
		]
		}
	];
ClassesData = ClassesData_orig;
var width = parseInt(d3.select("#class-diagram").select("svg").style("width"), 10);
var height = parseInt(d3.select("#class-diagram").select("svg").style("height"), 10);
	radius = Math.min(width, height) / 6;

console.log(height)
var animationTime = 300;
var pie = d3.layout.pie()
	.startAngle(-Math.PI/2)
	.endAngle(3*Math.PI/2)
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4)

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9)

var lockedColor = "#838c89";
var availableColor = "#177177";
var chosenColor = "#3f97b5";

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

change(ClassesData);

d3.select(".randomize")
	.on("click", function(){
		removeAll();
		ClassesData = ClassesData_orig;
		change(ClassesData);
});

d3.select(".append")
	.on("click", function(){
		change(append());
});

d3.select(".remove")
	.on("click", function(){
		change(remove());
});
function idMatch(id1,id2)
{
	//returns 0 if no match
	//returns 1 if id2 is the beginning of id1
	//returns 2 if identical
	if(id1 == id2){
		return 2;
	}
	if(id1.startsWith(id2))
	{
		return 1;
	}
	else
	{
		return 0;
	}
	
}
function updateClassesData(id,list)
{
	for(var n = 0;n<list.length;n++)
	{
		var match = idMatch(id,list[n].id);
		if(match == 2)
		{
			list[n].var = 2;
			change(ClassesData);
			return 1;
		}
		else if(match == 1)
		{
			if(updateClassesData(id,list[n].children)==1)
			{
				return 1;
			}
		}
	}
	return 0
}
function SelectClass(id)
{
	var n = Number(id.substring(6));
	for(var i=0;i<ClassesData.length;i++)
	{
		if(i != n)
		{
			ClassesData[i].value = 1;
		}
		else
		{
			if(ClassesData[i].value > 1)
			{
				ClassesData[i].value = 1;
			}
			else
			{
				ClassesData[i].value = 10;
			}
		}
	}
	change(ClassesData);
}
function nodeColor(nodevar)
{
	if(nodevar == 0)
	{
		return lockedColor;
	}
	if(nodevar == 1)
	{
		return availableColor;
	}
	if(nodevar == 2)
	{
		return chosenColor;
	}
}
function edgeColor(var1,var2)
{
	if(var1 + var2 > 1)
	{
		return chosenColor;
	}
	else
	{
		return lockedColor;
	}
	
}
var key = function(d){ return d.data.id; };
function computeTextTransform(sx,sy,tx,ty)
{
	var midx = (tx+sx)/2;
	var midy = (ty+sy)/2;
	
	var ang = Math.atan((ty-sy)/(tx-sx))*180/Math.PI;
	
	return "translate("+midx+","+midy+") rotate("+ang+")";
}
function removeAll()
{
	svg.select(".slices").selectAll("path.slice").remove();
	svg.select(".trees").selectAll("g.tree").remove();
	svg.selectAll(".className").remove();
}
function change(data) {
/* ------- PIE SLICES -------*/
var slice = svg.select(".slices").selectAll("path.slice")
	.data(pie(data),key);

  slice.enter()
	.insert("path")
	.style("fill", function(d) {
	  return d.data.color;
	})
	.attr("class", "slice")
	.attr("id", function(d,i) { return "class_"+i; }) //Give each slice a unique ID
	.each(function(d){
	 	this._current = {
	    	startAngle: 3*Math.PI/2,
	    	endAngle: 3*Math.PI/2
  	};
});

slice
	.transition().duration(animationTime)
	.attrTween("d", function(d) {
		var endAt = { //<-- have the arc end where it's supposed to
	    startAngle: d.startAngle, 
	    endAngle: d.endAngle
	 };
	var interpolate = d3.interpolate(this._current, endAt);
	this._current = endAt; //<-- store this for next cycle
	return function(t) {
	return arc(interpolate(t));
	};
})

slice.exit()
	.remove();

function midAngle(d){
	return d.startAngle + (d.endAngle - d.startAngle)/2;
}

var tree = svg.select(".trees").selectAll("g.tree")
	.data(pie(data),key);

var treeEnter = tree.enter()
	.insert("g")
	.attr("class", "tree")
	.attr("id", function(d,i){return "tree_"+i;})
	.each(function(d){this.angle = 3*Math.PI/2});
	
tree.each(function(d,i){
		var sector = Math.abs(d.endAngle-d.startAngle)*1.3;
		if(sector > Math.PI)
		{
			sector = Math.PI;
		}
		var skilltree = d3.layout.tree()
			.size([sector, 250]);
 		var nodes = skilltree.nodes(d.data).reverse();
		nodes.forEach(function(n) {	
			var angle = (n.x-sector/2)+Math.PI/2;
			var radius = n.y;
			n.x = Math.cos(angle)*radius;
			n.y = Math.sin(angle)*radius;
			});
		var links = skilltree.links(nodes);
		
		var link = d3.select("#tree_"+i).selectAll(".link").data(links);
		var linksenter = link.enter().insert("svg:line")
			.attr("class", "link")
			.attr("x1",function(l){ return l.target.x})
			.attr("y1",function(l){ return l.target.y})
			.attr("x2",function(l){ return l.source.x})
			.attr("y2",function(l){ return l.source.y})
			.style("stroke",function(l){ return edgeColor(l.target.var,l.source.var)});
		link.transition().duration(animationTime)
			.attr("x1",function(l){ return l.target.x})
			.attr("y1",function(l){ return l.target.y})
			.attr("x2",function(l){ return l.source.x})
			.attr("y2",function(l){ return l.source.y})
			.style("stroke",function(l){ return edgeColor(l.target.var,l.source.var)});
			
		var node = d3.select("#tree_"+i).selectAll(".node").data(nodes);
		var nodeenter = node.enter().append("circle")
				.attr("class", "node")
				.attr("cx",function(n){return n.x})
				.attr("cy",function(n){return n.y})
				.attr("r",5)
				.attr("id",function(n){return n.id})
				.style("fill",function(n){return nodeColor(n.var)})
				.style("stroke",function(n){return nodeColor(n.var)});
		node.transition().duration(animationTime)
				.attr("cx",function(n){return n.x})
				.attr("cy",function(n){return n.y})
				.style("fill",function(n){return nodeColor(n.var)})
				.style("stroke",function(n){return nodeColor(n.var)});
  	})

tree.transition().duration(animationTime)
	.attrTween("transform", function(d) {
		var interpolateangle = d3.interpolate(this.angle, midAngle(d));
		this.angle = midAngle(d);
		return function(t) {
			var ang = interpolateangle(t);
			return "translate( " + Math.cos(ang-Math.PI/2)*radius*0.8 + " " + Math.sin(ang-Math.PI/2)*radius*0.8+" ) rotate("+(((ang*180)/Math.PI) - 180)+")";
		};
	})
tree.exit()
	.remove();

var classnames = svg.selectAll(".className")
.data(pie(data),key)
var classnamesenter = classnames.enter()
					.append("text")
					.attr("class", "className")
					.attr("dx", function(d){return (Math.abs(d.endAngle-d.startAngle)/(Math.PI*2))*Math.PI*radius*0.8;})  
					.attr("dy", radius*0.15)
					.append("textPath")
					.style("text-anchor","middle")
					.attr("xlink:href",function(d,i){return "#class_"+i;})
					.text(function(d){return d.data.name;});
classnames.transition().duration(animationTime).attr("dx", function(d){return (Math.abs(d.endAngle-d.startAngle)/(Math.PI*2))*Math.PI*radius*0.7;})  
classnames.exit().remove();
d3.selectAll(".slice")
	.on("click", function(){
		SelectClass(d3.select(this).attr("id"));
	})
d3.selectAll(".node")
	.on("click", function(){
		d3.select(this).style("fill", chosenColor)
		updateClassesData(d3.select(this).attr("id"),ClassesData);
	})
	.on("mouseover", function(){
		d3.select(this).style("stroke", "red");
	})
	.on("mouseout", function(){
		d3.select(this).style("stroke", nodeColor(d3.select(this).attr("var")));
	});
}




});