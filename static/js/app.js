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

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
.domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var curdata;

function randomData (){
	var labels = color.domain().slice(0,Math.round(Math.random()*6));
	curdata = labels.map(function(label){
		return { label: label, value: 1,treeData: getData()}
	});
	return curdata;
}

function append(){
	if(curdata.length < 6)
	{
	var labels = color.domain();
	curdata.push({ label: labels[curdata.length], value: 1 ,treeData:getData()});
	}
	return curdata;
}

function remove(){
	curdata = curdata.slice(0,curdata.length-1);
	return curdata;
}

change(randomData());

d3.select(".randomize")
	.on("click", function(){
		change(randomData());
});

d3.select(".append")
	.on("click", function(){
		change(append());
});

d3.select(".remove")
	.on("click", function(){
		change(remove());
});

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

function computeTextTransform(sx,sy,tx,ty)
{
	var midx = (tx+sx)/2;
	var midy = (ty+sy)/2;
	
	var ang = Math.atan((ty-sy)/(tx-sx))*180/Math.PI;
	
	return "translate("+midx+","+midy+") rotate("+ang+")";
}

function change(data) {
/* ------- PIE SLICES -------*/
var slice = svg.select(".slices").selectAll("path.slice")
	.data(pie(data), key);

  slice.enter()
	.insert("path")
	.style("fill", function(d) {
	  return color(d.data.label);
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

slice.exit().transition().duration(animationTime)
	.attrTween("d", function(d) {
		var endAt = { //<-- have the arc end where it's supposed to
	    startAngle: d.endAngle, 
	    endAngle: d.endAngle
	 };
	var interpolate = d3.interpolate(this._current, endAt);
	return function(t) {
	return arc(interpolate(t));
	};
})
	.remove();

function midAngle(d){
	return d.startAngle + (d.endAngle - d.startAngle)/2;
}

var tree = svg.select(".trees").selectAll("g.tree")
	.data(pie(data), key);

var treeEnter = tree.enter()
	.insert("g")
	.attr("class", "tree")
	.attr("id", function(d,i){return "tree_"+i;})
	.each(function(d){this.angle = 3*Math.PI/2});


	
tree.each(function(d){
 		this.tdata = d.data.treeData;
		var sector = Math.abs(d.endAngle-d.startAngle)*1.3;
		if(sector > Math.PI)
		{
			sector = Math.PI;
		}
		var h = 50;
 		this.skilltree = d3.layout.tree()
			.size([sector, 250]);
 		var nodes = this.skilltree.nodes(this.tdata).reverse();
		nodes.forEach(function(d) {	
			var angle = (d.x-sector/2)+Math.PI/2;
			var radius = d.y;
			d.x = Math.cos(angle)*radius;
			d.y = Math.sin(angle)*radius;
			});
		var links = this.skilltree.links(nodes);
		tree.selectAll("circle").remove();
		tree.selectAll("line").remove();
		tree.selectAll("text").remove();
		
		links.forEach(function(l){
			tree.insert("svg:line")
			.attr("class", "link")
			.attr("x1",l.target.x)
			.attr("y1",l.target.y)
			.attr("x2",l.source.x)
			.attr("y2",l.source.y)
			.style("stroke",edgeColor(l.target.var,l.source.var));
			
			tree.insert("text")
			.style("text-anchor","middle")
			.attr("transform", computeTextTransform(l.source.x,l.source.y,l.target.x,l.target.y))
			.text(l.target.name);
		});
		nodes.forEach(function(n){
			tree.append("circle")
				.attr("class", "node")
				.attr("cx",n.x)
				.attr("cy",n.y)
				.attr("r",5)
				.style("fill",nodeColor(n.var))
				.style("stroke",nodeColor(n.var));
		});
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
.data(pie(data), key)
var classnamesenter = classnames.enter()
					.append("text")
					.attr("class", "className")
					.attr("dx", function(d){return (Math.abs(d.endAngle-d.startAngle)/(Math.PI*2))*Math.PI*radius*0.8;})  
					.attr("dy", radius*0.15)
					.append("textPath")
					.style("text-anchor","middle")
					.attr("xlink:href",function(d,i){return "#class_"+i;})
					.text(function(d){return d.data.treeData.name;});
classnames.transition().duration(animationTime).attr("dx", function(d){return (Math.abs(d.endAngle-d.startAngle)/(Math.PI*2))*Math.PI*radius*0.7;})  
classnames.exit().remove();
d3.selectAll(".node")
	.on("click", function(){
		d3.select(this).style("fill", chosenColor)
	})
	.on("mouseover", function(){
		d3.select(this).style("stroke", "red");
	})
	.on("mouseout", function(){
		d3.select(this).style("stroke", nodeColor(d3.select(this).attr("var")));
	});
}

function getData() {
	return {
	    "name": "ClassName",
		"var": 2,
		"children": [
			{
			"name": "name",
			"var": 1,
			"children": [
				{
				"name": "name",
				"var": 0,
				"children": [
					{
					"name": "name",
					"var": 0
					},
					{
					"name": "name",
					"var": 0
					}
				]
				},
				{
				"name": "name",
				"var": 0,
				"children": [
					{
					"name": "name",
					"var": 0
					},
					{
					"name": "name",
					"var": 0
					}
				]
				}
			]
			},
			{
			"name": "name",
			"var": 1,
			"children": [
				{
				"name": "name",
				"var": 0,
				"children": [
					{
					"name": "name",
					"var": 0
					},
					{
					"name": "name",
					"var": 0
					}
				]
				},
				{
				"name": "name",
				"var": 0,
				"children": [
					{
					"name": "name",
					"var": 0
					},
					{
					"name": "name",
					"var": 0
					}
				]
				}
			]
			}
		]
	};
}

});