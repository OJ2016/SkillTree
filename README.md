## Skill Tree

Skill Tree web application project for CS-E4400 - Design of WWW Services.

## Stuff needed
Node.js  
NPM  
	-> npm install

## Stuff included
Jquery  
Bootstrap  
D3.js

## Stuff used
Express - framework  
EJS - view engine  

### Specifications

#Skilltree json format

nodes should have properties:
'name': 	string, the name displayed in the piechart
'id': 		string, for root only single number, eg. '0' or '123456789', other nodes should have 'parentid.number', eg. '0.1', '0.0.0.0.0.0.0.1','123456789.0'
'var': 		integer, telling the state of the node, should be set to 0, actual value comes from  
'color':	CSS color for the piechart segment eg. '#98abc5' or 'blue',

The root node should also have extra variable:
'value': 	tells the weight of this segment, should be set as 1, this value is manipulated by the code.

In app.js ClassesData contains a list of the skill trees that are displayed.

Example of single skill tree:
{
	'name': 'ClassName1',
	'id':'0',
	'var': 0,
	'color':'#98abc5',
	'value':1,
	'children': [
		{
		'name': 'name',
		'id':'0.0',
		'var': 0,
		'children': [
			{
			'name': 'name',
			'id':'0.0.0',
			'var': 0,
			'children': [
				{
				'name': 'name',
				'id':'0.0.0.0',
				'var': 0
				},
				{
				'name': 'nf2',
				'id':'0.0.0.1',
				'var': 0
				}
			]
			},
			{
			'name': 'name',
			'id':'0.0.1',
			'var': 0,
			'children': [
				{
				'name': 'name',
				'id':'0.0.1.0',
				'var': 0
				},
				{
				'name': 'name',
				'id':'0.0.1.1',
				'var': 0
				}
			]
			}
		]
		}
	]
}

#User skill information

List of chosen node.ids e.g ['0','0.0','0.0.0','1','2']
does not need to be in order.

This information is applied to the set of skilltrees explained above before it is drawn.

