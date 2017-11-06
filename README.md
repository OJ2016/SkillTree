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




#Interface manual
DATABASE MODELS
	User
		google           : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    },
		saved_state: String -> 	example: '['0','0.0','0.0.0','1','2']'
								0 being the class id and 0.xx being the id's inside the tree	

	Class	
		name: String,
		id: Number,
		icon: String,
		description: String,
		content: String


URL
	get '/'
		If not logged in -> redirect to '/browse'

		If logged in renders 'canvas_page.ejs'
			content = {
				user : user,
				client : {
					saved_state : saved state of the user (String),
					data: [array of all class objects the user has selected]
				}
			}

	get '/browse'
		Renders 'browse.ejs'
			content = {
				user : user,
				data: [array of all class objects in the database]
			}

	get '/class/:class_id'
		Renders 'canvas_page.ejs'
			content = {
				user : user,
				client: {
					data: whole object of one class matching the given class_id number
				}
			}	

	post '/save'
		Ajax hander for saving changes to user's saved_state when they click trees
		Ajax post should look like this:

			var newState = '['1','1.0','2','2.0','2.1']';
			$.ajax({
		        type: 'POST',
		        url: '/save',
		        dataType: 'json',
		        data: {'state': newState},
			});

		Whole state for the user should be given in string format, wrapped in ' and using '' inside the string. No whitespace.
		Client side JS should keep track of the current saved_state of the user ( given by '/' when loading the page).
		Ajax call wont give response.






