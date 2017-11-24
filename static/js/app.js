$(document).ready(function() {
    var svg = d3.select("#class-diagram")
        .append("svg")
		.attr("width",  "100%")
		.attr("height", "100%")
        .append("g")



var ClassesData = [];

for(var i=0;i<content.data.length;i++)
{
	ClassesData.push(JSON.parse(content.data[i].content.replace(/'/g ,"\"")));
}

var noskills = true;
if(ClassesData.length > 0)
{
	noskills = false;
}

var defs;
if(!noskills)
{
	defs = svg.append("svg:defs");
	svg.append("g")
		.attr("class", "slices");
	svg.append("g")
		.attr("class", "trees");
}


var userData = [];
if(content.saved_state != "[]" && !noskills)
{
	var userData = content.saved_state.replace('[','').replace(']','').replace(/'/g ,'').split(',');
}

var focusedID = null;

if(content.class_page && !noskills)
{
	focusedID = ClassesData[0].id;
}
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


if(content.class_page && !noskills)
{
	svg.attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");
}
else
{
	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
}

//draw the "action" button
if(!noskills)
{
	var selected = false;
	for(var i=0;i<userData.length;i++)
	{
		if(userData[i] == ClassesData[0].id)
		{
			selected = true;
		}
	}

	var actionText = content.class_page ? "Select" : "Export";
	var btncolor = content.class_page && selected ? "grey" : "#0b708c";
	svg.append("circle")
		.attr("class", "actionbutton")
		.attr("cx",0)
		.attr("cy",0)
		.attr("r",radius*0.3)
		.style("fill",btncolor)
		.attr("id","actionButton")
		.style("stroke","white")
	svg.append("text")
			.style("text-anchor","middle")
			.attr("class", "actionbutton")
			.attr("id","actionText")
			.attr("x",0)
			.attr("y",0)
			.style("fill","lightgrey")
			.style("dominant-baseline","middle")
			.style("font-size","12px")
			.text(actionText)

	applyUserData(userData);

	setFocusTree(focusedID);

	if(!(selected && content.class_page))
	{
	d3.selectAll(".actionbutton")
		.on("click", function(){
			if(content.class_page)
			{
				SelectClass();
			}
			else
			{
				exportToPng();
			}
		})
		.on("mouseout", function(){
			d3.select("#actionButton").style("stroke", "white");
			d3.select("#actionText").style("fill","lightgrey");
		})
		.on("mouseover", function(){
			d3.select("#actionButton").style("stroke", "none");
			d3.select("#actionText").style("fill","white");
		});
	}
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
	function SelectClass()
	{
		if(content.class_page)
		{
			//check if class already selected
			var newRoot = ClassesData[0].id;
			for(var i=0;i<userData.length;i++)
			{
				if(userData[i] == newRoot)
				{
					console.log("already chosen");
					return;
				}
			}
			userData.push(newRoot);
			console.log(userData);
			setClassesData(newRoot);
			change(ClassesData);
			savetoDB(userData);
			
			d3.selectAll(".actionbutton")
			.on("click", function(){
				
			})
			.on("mouseout", function(){
				
			})
			.on("mouseover", function(){
			
			});
			d3.select("#actionButton").style("fill","grey");
		}
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
			var updateDB = false;
			if(d.var == 1)
			{
				updateDB = true;
				d.var = 2;
				userData.push(id);
				if(d.children)
				{
					for(var i=0;i<d.children.length;i++)
					{
					   d.children[i].var = 1;
					}
				}
			}else if(d.var == 2)
			{
				//toggle back to unselected, can do only if no children have var == 2
				if(d.children)
				{
					for(var i=0;i<d.children.length;i++)
					{
					   if(d.children[i].var == 2)
					   {
							//cant toggle
							return;						
					   }
					}
					for(var i=0;i<d.children.length;i++)
					{
					   d.children[i].var = 0;
					}
				}
				d.var = 1;
				var index = userData.indexOf(id);
				if (index > -1) {
					userData.splice(index, 1);
				}
				updateDB = true;
			}
			if(updateDB)
			{
				change(ClassesData);
				savetoDB(userData);
			}
			
		}
	}
	function savetoDB(udata)
	{
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
		str = str.concat("]");
		console.log(str);
		
		console.log("Ajax POST");
		//save to DB
		$.ajax({
			type: 'POST',
			url: '/save',
			dataType: 'json',
			data: {'state': str},
		});
	}
	function setFocusTree(treeid)
	{
		if(!treeid)
		{
			fucusedID = null;
		}
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
					//cant unfocus in class view
					if(!content.class_page)
					{
						ClassesData[i].value = 1;
						focusedID = null;
					}
				}
				else
				{
					ClassesData[i].value = 100;
					focusedID = ClassesData[i].id;
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

	function NodeidToTreeid(nodeid)
	{
		if(nodeid)
		{
			for(var n = 0;n<ClassesData.length;n++)
			{
				if(idMatch(nodeid,ClassesData[n].id) > 0)
				{
					return ClassesData[n].id;
				}
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
		var midx = tx;
		var midy = ty+16;
		return "translate("+midx+","+midy+")";
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

	if(focusedID)
	{
		svg.transition().duration(animationTime).attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");
	}
	else
	{
		svg.transition().duration(animationTime).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	}

	tree.each(function(d,i){
			var sector = Math.abs(d.endAngle-d.startAngle)*1.5;
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
			var skillR = radius*2;
			if(focusedID)
			{
				skillR = radius*2.5;
			}
			var skilltree = d3.layout.tree()
					.size([sector, skillR]);
			
			var a0 = midAngle(d)-Math.PI;
			var x0 = Math.cos(a0+Math.PI*0.5)*radius*0.8;
			var y0 = Math.sin(a0+Math.PI*0.5)*radius*0.8;
			
			var nodes = skilltree.nodes(d.data);
			
			//DFSnode(nodes[0],sector,0.1);
			nodes.forEach(function(n) {	
				var angle = a0 + (n.x-sector*0.5)+Math.PI*0.5;
				var rad = n.y;
				n.x = x0 + Math.cos(angle)*rad;
				n.y = y0 + Math.sin(angle)*rad;
				n.angle = angle;
				n.radius = rad;
				n.angle0 = a0;
				});
			
			var imgradius = 12;
			
			var icons = defs.selectAll(".pattern")
			.data(nodes,function(n){return n.id})
			
			
			var links = skilltree.links(nodes);
			
			var link = d3.select("#tree_"+i).selectAll(".link").data(links);
			
			if(!hidden)
			{
			link.style("visibility",function(l){return varToVsibility(l.target.var)}).transition().duration(animationTime)
				.attrTween("x1",function(d){
										var r = d.target.radius;
										var interpolate = d3.interpolate(this.curangle1,d.target.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.target.angle0);
										return function(t)
										{
											return Math.cos(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.cos(interpolate(t))*r;
										}})
				.attrTween("y1",function(d){
										var r = d.target.radius;
										var interpolate = d3.interpolate(this.curangle1,d.target.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.target.angle0);
										this.curangle1 = d.target.angle;
										return function(t)
										{
											return Math.sin(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.sin(interpolate(t))*r;
										}})
				.attrTween("x2",function(d){
										var r = d.source.radius;
										var interpolate = d3.interpolate(this.curangle2,d.source.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.source.angle0);
										return function(t)
										{
											return Math.cos(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.cos(interpolate(t))*r;
										}})
				.attrTween("y2",function(d){
										var r = d.source.radius;
										var interpolate = d3.interpolate(this.curangle2,d.source.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.source.angle0);
										this.curangle2 = d.source.angle;
										this.curangle0 = d.target.angle0;
										return function(t)
										{
											return Math.sin(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.sin(interpolate(t))*r;
										}})
				.style("stroke",function(l){ return edgeColor(l.target.var,l.source.var)})
				
				
			var linksenter = link.enter().insert("svg:line")
				.attr("class", "link")
				.attr("x1",function(l){ return l.target.x})
				.attr("y1",function(l){ return l.target.y})
				.attr("x2",function(l){ return l.source.x})
				.attr("y2",function(l){ return l.source.y})
				.style("stroke",function(l){ return edgeColor(l.target.var,l.source.var)})
				.style("visibility",function(l){return varToVsibility(l.target.var)})
				.each(function(l){
				
					this.curangle1 = l.target.angle;
					this.curangle2 = l.source.angle;
					this.curangle0 = l.source.angle0;
				})
			
			}
			else{
				link.style("visibility","hidden")
				.each(function(l){
				
					this.curangle1 = l.target.angle;
					this.curangle2 = l.source.angle;
					this.curangle0 = l.source.angle0;
				})
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
			node.style("visibility",function(n){return varToVsibility(n.var)})
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
					.transition().duration(animationTime)
					.attrTween("cx",function(d){
										var r = d.radius;
										var interpolate = d3.interpolate(this.curangle,d.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.angle0);
										return function(t)
										{
											return Math.cos(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.cos(interpolate(t))*r;
										}})
					.attrTween("cy",function(d)
									{
										var r = d.radius;
										var interpolate = d3.interpolate(this.curangle,d.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.angle0);
										this.curangle = d.angle;
										this.curangle0 = d.angle0;
										return function(t)
										{
											return Math.sin(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.sin(interpolate(t))*r;
										}
									})
					
					
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
					.each(function(n){
						this.curangle = n.angle;
						this.curangle0 = n.angle0;
					})
					
			}
			else{
				node.style("visibility","hidden")
				.each(function(n){
						this.curangle = n.angle;
						this.curangle0 = n.angle0;
					})
			}		
			var text = d3.select("#tree_"+i).selectAll("text").data(links);
			if(!hidden)
			{
			text.style("visibility",function(l){return varToVsibility(l.target.var)}).transition().duration(animationTime)
			.attrTween("x",function(d){
										var r = d.target.radius;
										var interpolate = d3.interpolate(this.curangle1,d.target.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.target.angle0);
										return function(t)
										{
											return Math.cos(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.cos(interpolate(t))*r;
										}})
				.attrTween("y",function(d){
										var r = d.target.radius;
										var interpolate = d3.interpolate(this.curangle1,d.target.angle);
										var interpolate0 = d3.interpolate(this.curangle0,d.target.angle0);
										this.curangle1 = d.target.angle;
										this.curangle0 = d.target.angle0;
										return function(t)
										{
											return Math.sin(interpolate0(t)+Math.PI*0.5)*radius*0.8 + Math.sin(interpolate(t))*r+25;
										}})
			
			var textenter = text.enter()
				.insert("text")
				.style("text-anchor","middle")
				.attr("x",function(l){ return l.target.x})
				.attr("y",function(l){ return l.target.y+25})
				.style("visibility",function(l){return varToVsibility(l.target.var)})
				.text(function(l){return l.target.name})
				.each(function(l){
					this.curangle1 = l.target.angle;
					this.curangle0 = l.target.angle0;
				})
			}
			else{
				text.style("visibility","hidden")
				.each(function(l){
					this.curangle1 = l.target.angle;
					this.curangle0 = l.target.angle0;
				})
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
		.on("mouseout", function(){
			d3.select(this).style("stroke", "none");
		})
		.on("mouseover", function(){
			d3.select(this).style("stroke", "grey");
		});
	d3.selectAll(".node")
		.on("click", function(){
			if(focusedID)
			{
				updateClassesData(d3.select(this).attr("id"));
			}
			else
			{
				setFocusTree(NodeidToTreeid(d3.select(this).attr("id")));
			}
		})
		.on("mouseout", function(){
			d3.select(this).style("stroke", "none");
		})
		.on("mouseover", function(){
			d3.select(this).style("stroke", "grey");
		});
		
}
}
else
{
	svg.append("text")
		.text("You have no Skills selected!")
		.style("text-anchor","middle")
		.attr("dy",-50)
		.style("font-size","40px");
	svg.append("text")
		.text("Please go to the Browse section and choose skills to your liking")
		.style("text-anchor","middle")
		.style("font-size","20px");
	svg.append("text")
		.text("Once you have selected skills, they will be shown here.")
		.style("text-anchor","middle")
		.style("font-size","20px")
		.attr("dy",30);
	
}
});