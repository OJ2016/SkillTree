

$( document ).ready(function() {
   console.log( content );


var svg = d3.select("body")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "trees");

var width = 960,
    height = 450,
	radius = Math.min(width, height) / 3;
var animationTime = 300;
var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var root = getData();




svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
.domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var curdata;

function randomData (){
	var labels = color.domain().slice(0,Math.round(Math.random()*11));
	curdata = labels.map(function(label){
		return { label: label, value: 1}
	});
	return curdata;
}

function append(){
	var labels = color.domain();
	curdata.push({ label: labels[curdata.length], value: 1 });
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
	.each(function(d){
	 	this._current = {
	    	startAngle: 2*Math.PI,
	    	endAngle: 2*Math.PI
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
	.data(pie(data), key);

var treeEnter = tree.enter()
	.insert("g")
	.attr("class", "tree");
treeEnter.append("text")
	.attr("dy", ".35em")
	.text(function(d) {
		return d.data.label;
	})
	
	
tree.each(function(d){
 		this.data = getData();
		var sector = Math.abs(d.endAngle-d.startAngle);
		//if sector 2*PI w reduces to 0, as sin(PI) = 0, maximum with sector of PI as sin(PI/2) = 1
		if(sector > Math.PI)
		{
			sector = Math.PI;
		}
		var w = Math.sin(sector/2)*radius*2;
		
		var h = 50;
 		this.skilltree = d3.layout.tree()
			.size([w, 100]);
 		var nodes = this.skilltree.nodes(this.data).reverse();
		nodes.forEach(function(d) { d.y = d.depth * h;d.x = d.x - w/2; });
		var links = this.skilltree.links(nodes);
		tree.selectAll("circle").remove();
		tree.selectAll("line").remove();
		
		links.forEach(function(l){
			tree.insert("svg:line")
			.attr("class", "link")
			.attr("x1",l.target.x)
			.attr("y1",l.target.y)
			.attr("x2",l.source.x)
			.attr("y2",l.source.y);
				
		});
		nodes.forEach(function(n){
			tree.append("circle")
				.attr("class", "node")
				.attr("cx",n.x)
				.attr("cy",n.y)
				.attr("r",8)
				.attr("var",n.var);
				
		});
  	})
  	

tree.transition().duration(animationTime)
	.attrTween("transform", function(d) {
		this.angle = this.angle || 2*Math.PI;
		var interpolateangle = d3.interpolate(this.angle, midAngle(d));
		this.angle = midAngle(d);
		return function(t) {
			var ang = interpolateangle(t);
			return "translate( " + Math.cos(ang-Math.PI/2)*radius*0.7 + " " + Math.sin(ang-Math.PI/2)*radius*0.7+" ) rotate("+(((ang*180)/Math.PI) - 180)+")";
		};
	})
tree.exit()
	.remove();
	
d3.selectAll(".node")
	.on("click", function(){
		 d3.select(this).style("fill", "DeepSkyBlue");
});
}

function getData() {
	return {
	    "name": "root",
	        "children": [
	        	{
	        	"name": "c1",
	        	"var": 0,
				"children": [
					{
					"name": "c1",
					"var": 0,
					"children": [
						{
						"name": "c1",
						"var": 0
						},
						{
						"name": "c2",
						"var": 0
						}
					]
					},
					{
					"name": "c2",
					"var": 0,
					"children": [
						{
						"name": "c1",
						"var": 0
						},
						{
						"name": "c2",
						"var": 0
						}
					]
					}
				]
	    		},
	        	{
	        	"name": "c2",
	        	"var": 0,
				"children": [
					{
					"name": "c1",
					"var": 0
					}
				]
	    		}
	       	]
	};
	}


});