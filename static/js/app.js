

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
	radius = Math.min(width, height) / 2;
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
		return { label: label, value: Math.random()}
	});
	return curdata;
}

function append(){
	var labels = color.domain();
	curdata.push({ label: labels[curdata.length], value: Math.random() });
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
	.each(function(d){
 		var data = getData();
 		var tree = d3.layout.tree()
			.size([100, 50]);
 		var nodes = tree.nodes(root).reverse();
			var links = tree.links(nodes);
			
			nodes.forEach(function(n){
				treeEnter.append("circle")
					.attr("class", "node")
					.attr("cx",n.x-50)
					.attr("cy",n.y+30)
					.attr("r",5);
					
			})

			links.forEach(function(l){
				treeEnter.insert("svg:line")
				.attr("class", "link")
				.attr("x1",l.target.x -50)
				.attr("y1",l.target.y +30)
				.attr("x2",l.source.x -50)
				.attr("y2",l.source.y +30);
					
			})
  	})
  	
tree.attr("transform",function(d){
  		this.pos = arc.centroid(d);
  		this.angle = midAngle(d);
  		return "translate( " + this.pos[0] + " " + this.pos[1]+" ) rotate("+(((this.angle*180)/Math.PI) - 180)+")"}
  		);

tree.exit()
	.remove();
}
/* ------- TEXT LABELS -------

var text = svg.select(".labels").selectAll("text")
	.data(pie(data), key);

text.enter()
	.append("text")
	.attr("dy", ".35em")
	.text(function(d) {
		return d.data.label;
	})
	.each(function(d){
  	this._current = {
    	startAngle: 2*Math.PI,
    	endAngle: 2*Math.PI
  	}});

function midAngle(d){
	return d.startAngle + (d.endAngle - d.startAngle)/2;
}

text.transition().duration(animationTime)
	.attrTween("transform", function(d) {
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) {
			var d2 = interpolate(t);
			var pos = outerArc.centroid(d2);
			pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
			return "translate("+ pos +")";
		};
	})
	.styleTween("text-anchor", function(d){
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) {
			var d2 = interpolate(t);
			return midAngle(d2) < Math.PI ? "start":"end";
		};
	});


text.exit()
	.remove();
	*/

/* ------- SLICE TO TEXT POLYLINES -------

var polyline = svg.select(".lines").selectAll("polyline")
	.data(pie(data), key);

polyline.enter()
	.append("polyline")
	.each(function(d){
  	this._current = {
    	startAngle: 2*Math.PI,
    	endAngle: 2*Math.PI
  	}});

polyline.transition().duration(animationTime)
	.attrTween("points", function(d){
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) {
			var d2 = interpolate(t);
			var pos = outerArc.centroid(d2);
			pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
			return [arc.centroid(d2), outerArc.centroid(d2), pos];
		};			
	});

polyline.exit()
	.remove();
};*/

function getData() {
	return {
	    "name": "root",
	        "children": [
	        	{
	        	"name": "c1",
	        	"var": 12
	    		},
	        	{
	        	"name": "c2",
	        	"var": 12
	    		}
	       	]
	};
	}


});