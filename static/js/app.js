$(document).ready(function() {
    console.log(content);

    var svg = d3.select("#class-diagram")
        .append("svg")
		.attr("width",  "100%")
		.attr("height", "100%")
        .append("g")

var defs = svg.append("svg:defs");


svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "trees");
ClassesData=[{"name":"Presenter","id":"0","var":0,"color":"#98abc5","value":1,"url":"/resources/images/presentations/0.png","children":[{"name":"1st Presentation","id":"0.0","var":0,"url":"/resources/images/presentations/00.png","children":[{"name":"Bilingual","id":"0.0.0","var":0,"url":"/resources/images/presentations/000.png",},{"name":"Group","id":"0.0.1","var":0,"url":"/resources/images/presentations/001.png","children":[{"name":"Crowd","id":"0.0.1.0","url":"/resources/images/presentations/0010.png","var":0}]}]},{"name":"1stSlides","id":"0.1","var":0,"url":"/resources/images/presentations/01.png","children":[{"name":"PowerPoint","id":"0.1.0","var":0,"url":"/resources/images/presentations/010.jpg","children":[{"name":"Keynote","id":"0.1.0.0","url":"/resources/images/presentations/0100.png","var":0}]},{"name":"Animations","id":"0.1.1","var":0,"url":"/resources/images/presentations/011.png","children":[{"name":"Videos","id":"0.1.1.0","url":"/resources/images/presentations/0110.png","var":0,"children":[{"name":"DemoPlay","id":"0.1.1.0.0","url":"/resources/images/presentations/01100.png","var":0}]}]}]}]},{"name":"C++Programer","id":"1","var":0,"color":"#aaaaaa","url":"/resources/images/c_plus_plus/1.png","value":1,"children":[{"name":"HelloWorld","id":"1.0","url":"/resources/images/c_plus_plus/10.png","var":0,"children":[{"name":"Application","id":"1.0.0","var":0,"url":"/resources/images/c_plus_plus/100.png","children":[{"name":"500loc","id":"1.0.0.0","url":"/resources/images/c_plus_plus/1000.png","var":0,"children":[{"name":"5000loc","id":"1.0.0.0.0","url":"/resources/images/c_plus_plus/10000.png","var":0,"children":[{"name":"50000loc","id":"1.0.0.0.0.0","url":"/resources/images/c_plus_plus/100000.png","var":0}]}]},{"name":"Debugging","id":"1.0.0.1","url":"/resources/images/c_plus_plus/1001.png","var":0,"children":[{"name":"UnitTesting","id":"1.0.0.1.0","url":"/resources/images/c_plus_plus/10010.png","var":0}]}]},{"name":"SyntaxTutorial","id":"1.0.1","url":"/resources/images/c_plus_plus/101.png","var":0,"children":[{"name":"Constructor","id":"1.0.1.0","url":"/resources/images/c_plus_plus/1010.png","var":0,"children":[{"name":"Pointer","id":"1.0.1.0.0","url":"/resources/images/c_plus_plus/10100.png","var":0,"children":[{"name":"TemplateProgramming","id":"1.0.1.0.0.0","url":"/resources/images/c_plus_plus/101000.png","var":0}]}]}]}]}]}];
var userData = ["0","0.0","0.0.0","1","2"];
var focusedID = null;

var width = parseInt(d3.select("#class-diagram").select("svg").style("width"), 10);
var height = parseInt(d3.select("#class-diagram").select("svg").style("height"), 10);
	radius = Math.min(width, height) / 6;

var animationTime = 1000;
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

applyUserData(userData);

setFocusTree(focusedID);

d3.select(".randomize")
	.on("click", function(){
		removeAll();
		ClassesData = ClassesData_orig;
		change(ClassesData);
});

d3.select(".append")
	.on("click", function(){
		console.log(getUserData());
});

d3.select(".remove")
	.on("click", function(){
		exportToPng();
});
function exportToPng()
{
	var node = document.getElementById("class-diagram");
	domtoimage.toPng(node)
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
    });
}
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

function applyUserData(userdata)
{
	for(var i=0;i<userdata.length;i++)
	{
		setClassesData(userdata[i]);
	}
}

function getUserData()
{
	return getUserDataDFS(ClassesData);
}

function getUserDataDFS(list)
{
	var idlist = [];
	for(var i=0;i<list.length;i++)
	{
		if(list[i].var == 2)
		{
			idlist.push(list[i].id);
			if(list[i].children)
			{
				idlist = idlist.concat(getUserDataDFS(list[i].children));
			}
		}
	}
	return idlist;
}

function setClassesData(id)
{
	d = findDatabyID(id,ClassesData);
	if(d)
	{
		d.var = 2;
		if(d.children)
		{
			for(var i=0;i<d.children.length;i++)
			{
			   d.children[i].var = 1;
			}
		}
	}
	else{
		console.log("invalid id "+id);
	}
}

function findDatabyID(id,list)
{
	for(var n = 0;n<list.length;n++)
	{
		var match = idMatch(id,list[n].id);
		if(match == 2)
		{
			return list[n];
		}
		else if(match == 1)
		{
			return findDatabyID(id,list[n].children);
		}
	}
	return null;
}

function updateClassesData(id)
{
	if(focusedID)
	{
		d = findDatabyID(id,ClassesData)
		if(d.var == 1)
		{
			d.var = 2;
			d3.select("circle[id='"+id+"']").style("fill",function(n) {return "url(#img"+id+")";})
			if(d.children)
			{
				for(var i=0;i<d.children.length;i++)
				{
				   d.children[i].var = 1;
				   d3.select("circle[id='"+d.children[i].id+"']").style("fill","lightgrey");
				}
			}
			change(ClassesData);
			
			var udata = getUserData();
			console.log(udata);
			//convert to string
			var str = "[";
			
			for(var i=0;i<udata.length;i++)
			{
				if(i < udata.length -1)
				{
					str = str.concat("'",udata[i],"'",",");
				}
				else
				{
					str = str.concat("'",udata[i],"'");
				}
			}
			str.concat("]");
			console.log(str);
			
			//you shall not PAASSSSSS!
			return;
			
			console.log("Ajax POST");
			//save to DB
			$.ajax({
				type: 'POST',
				url: '/save',
				dataType: 'json',
				data: {'state': str},
			});
				
		}
		
	}
}
function setFocusTree(treeid)
{
	if(treeid)
	{
		for(var i=0;i<ClassesData.length;i++)
		{
			if(ClassesData[i].id != treeid)
			{
				ClassesData[i].value = 1;
			}
			else
			{
				if(ClassesData[i].value > 1)
				{
					ClassesData[i].value = 1;
					focusedID = null;
				}
				else
				{
					ClassesData[i].value = 100;
					focusedID = ClassesData[i].id;
				}
			}
		}
	}
	change(ClassesData);
}

function SliceidToTreeid(sliceid)
{
	if(sliceid)
	{
		n = Number(sliceid.substring(6));
		if(n < ClassesData.length)
		{
			return ClassesData[n].id;
		}
	}
}

function ClassNameidToTreeid(sliceid)
{
	if(sliceid)
	{	
		n = Number(sliceid.substring(10));
		if(n < ClassesData.length)
		{
			return ClassesData[n].id;
		}
	}
}

function varToOpacity(varvalue)
{
	
	if(focusedID)
	{
		if(varvalue == 0)
		{
			return 1;
			//return 0.1;
		}
		else if(varvalue == 1)
		{
			return 1;
			//return 0.5;
		}
		else{
			return 1;
		}
	}
	else
	{
		if(varvalue > 1)
		{
			return 1;
		}
		else
		{
			return 0;
		}
		
	}
}

function varToVsibility(varvalue)
{
	
	if(focusedID)
	{
		return "visible";
	}
	else
	{
		if(varvalue > 1)
		{
			return "visible";
		}
		else
		{
			return "hidden";
		}
		
	}
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
	    	startAngle: d.startAngle,
	    	endAngle: d.endAngle
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
	.attr("id", function(d,i){return "tree_"+i;});

function DFSnode(node,sector,r){
	node.y = r;
	if(node.children)
	{
		for(var i =0;i< node.children.length;i++)
		{
			var ch = node.children[i];
			var L = ch.name.length*11+10;
			var a = node.x;
			var b = ch.x;			
			//fancy maths
			
			var r2 = 0.5*(2*r*Math.cos(a-b)+Math.sqrt(2)*Math.sqrt(r*r*Math.cos(2*a-2*b)+2*L*L-r*r) );
			
			if(isNaN(r2))
			{
				r2 = r+L;
			}
			
			DFSnode(ch,sector,r2); 
		}
	}
}
	
tree.each(function(d,i){
		var sector = Math.abs(d.endAngle-d.startAngle);
		var maxsector = Math.PI;
		if(sector > maxsector)
		{
			sector = maxsector;
		}
		var hidden = false;
		var showOnlyChosen = false;
		
		if(focusedID)
		{
			hidden = d.data.id!=focusedID;
		}
		else
		{
			showOnlyChosen = true;
		}
		
		var skilltree = d3.layout.tree()
				.size([sector, 400]);
		
		var a0 = midAngle(d)-Math.PI;
		var x0 = Math.cos(a0+Math.PI*0.5)*radius*0.8;
		var y0 = Math.sin(a0+Math.PI*0.5)*radius*0.8;
		
		var nodes = skilltree.nodes(d.data);
		
		DFSnode(nodes[0],sector,0.1);
		nodes.forEach(function(n) {	
			var angle = a0 + (n.x-sector*0.5)+Math.PI*0.5;
			var rad = n.y;
			n.x = x0 + Math.cos(angle)*rad;
			n.y = y0 + Math.sin(angle)*rad;
			});
		
		var imgradius = 15;
		
		var icons = defs.selectAll(".pattern")
		.data(nodes,function(n){return n.id})
		
		
		var links = skilltree.links(nodes);
		
		var link = d3.select("#tree_"+i).selectAll(".link").data(links);
		
		if(!hidden)
		{
		link.style("visibility",function(l){return varToVsibility(l.target.var)}).transition().duration(animationTime)
			.attr("x1",function(l){ return l.target.x})
			.attr("y1",function(l){ return l.target.y})
			.attr("x2",function(l){ return l.source.x})
			.attr("y2",function(l){ return l.source.y})
			.style("stroke",function(l){ return edgeColor(l.target.var,l.source.var)})
			
			
		var linksenter = link.enter().insert("svg:line")
			.attr("class", "link")
			.attr("x1",function(l){ return l.target.x})
			.attr("y1",function(l){ return l.target.y})
			.attr("x2",function(l){ return l.source.x})
			.attr("y2",function(l){ return l.source.y})
			.style("stroke",function(l){ return edgeColor(l.target.var,l.source.var)})
			.style("visibility",function(l){return varToVsibility(l.target.var)})
		
		}
		else{
			link.style("visibility","hidden")
		}
		
		
	
		icons.enter().append("pattern")
		.attr("id", function(d) { return "img"+d.id; })
		.attr("width", imgradius*2)
		.attr("height", imgradius*2)
		.attr("class", "pattern")
		.append("image")
		.attr("xlink:href", function(d) { return d.url; })
		.attr("width", imgradius*2)
		.attr("height", imgradius*2)
		.attr("x",-imgradius)
		.attr("y",-imgradius)
		.attr("transform","translate("+imgradius+" "+imgradius+")");
		
		
		var node = d3.select("#tree_"+i).selectAll(".node").data(nodes);
		if(!hidden)
		{
		node.style("visibility",function(n){return varToVsibility(n.var)}).transition().duration(animationTime)
				.attr("cx",function(n){return n.x})
				.attr("cy",function(n){return n.y})
				
		var nodeenter = node.enter()
				.append("circle")
				.attr("class", "node")
				.attr("cx",function(n){return n.x})
				.attr("cy",function(n){return n.y})
				.attr("r",imgradius)
				.attr("id",function(n){return n.id})
				.style("fill",function(n) {
					if(n.var == 0)
					{
						return "grey";
					}	
					if(n.var == 1)
					{
						return "lightgrey";
					}
					return "url(#img"+n.id+")";
				})
				.style("visibility",function(n){return varToVsibility(n.var)})
				
		}
		else{
			node.style("visibility","hidden")
		}		
		var text = d3.select("#tree_"+i).selectAll("text").data(links);
		if(!hidden)
		{
		text.style("visibility",function(l){return varToVsibility(l.target.var)}).transition().duration(animationTime)
		.attr("transform", function(l){return computeTextTransform(l.source.x,l.source.y,l.target.x,l.target.y)})
		
		var textenter = text.enter()
			.insert("text")
			.style("text-anchor","middle")
			.attr("transform", function(l){return computeTextTransform(l.source.x,l.source.y,l.target.x,l.target.y)})
			.style("visibility",function(l){return varToVsibility(l.target.var)})
			.text(function(l){return l.target.name})
			
		}
		else{
			text.style("visibility","hidden")
			//.style("opacity",0);
		}
  	})

tree.exit()
	.remove();

var classnames = svg.selectAll(".className")
.data(pie(data),key)
var classnamesenter = classnames.enter()
					.append("text")
					.attr("class", "className")
					.attr("id", function(d,i){return "classname_"+i;})
					.attr("dx", function(d){return (Math.abs(d.endAngle-d.startAngle)/(Math.PI*2))*Math.PI*radius*0.8;})  
					.attr("dy", radius*0.15)
					.append("textPath")
					.style("text-anchor","middle")
					.attr("xlink:href",function(d,i){return "#class_"+i;})
					.text(function(d){return d.data.name;});
classnames.transition().duration(animationTime).attr("dx", function(d){return (Math.abs(d.endAngle-d.startAngle)/(Math.PI*2))*Math.PI*radius*0.7;})
.style("opacity",function(d){
	if(focusedID){
		if(focusedID == d.data.id)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}
	else{
		return 1;
	}
});
classnames.exit().remove();
d3.selectAll(".className")
	.on("click", function(){
			setFocusTree(ClassNameidToTreeid(d3.select(this).attr("id")));
		})
d3.selectAll(".slice")
	.on("click", function(){
		setFocusTree(SliceidToTreeid(d3.select(this).attr("id")));
	})
d3.selectAll(".node")
	.on("click", function(){
		updateClassesData(d3.select(this).attr("id"));
	})
	.on("mouseout", function(){
		d3.select(this).style("stroke", "none");
	})
	.on("mouseover", function(){
		d3.select(this).style("stroke", "blue");
	});
	
}




});