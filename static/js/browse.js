$(document).ready(function() {

    $('#list').click(function(event) {
        event.preventDefault()
        $('#skills .item').addClass('list-group-item')
    })

    $('#grid').click(function(event) {
        event.preventDefault()
        $('#skills .item').removeClass('list-group-item')
        $('#skills .item').addClass('grid-group-item')
    })

    var skillData = [{
            'name': 'C++ Programming',
            'id': 1,
            'icon': '/resources/images/c_plus_plus.png',
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
            'content': ''
        },
        {
            'name': 'Presentation',
            'id': 1,
            'icon': '/resources/images/presentation.png',
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
            'content': ''
        },
        {
            'name': 'Teamwork',
            'id': 1,
            'icon': '/resources/images/team_work.png',
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
            'content': ''
        },
           {
            'name': 'Software Testing',
            'id': 1,
            'icon': '/resources/images/software_testing.png',
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
            'content': ''
        },
    ]

    initBrowsingPage()

    function initBrowsingPage() {
        skillData.forEach(function(skill) {
            $("#skills").append(createListElement(skill))
        })
    }

    function createListElement(skill) {
    	 return '<div class="item  col-xs-4 col-lg-4"> <div class="thumbnail"><a href="/"><img class="group list-group-image" src="' + skill.icon +'" alt="" /></a><div class="caption"><h4 class="group inner list-group-item-heading">' + skill.name + '</h4><p class="group inner list-group-item-text">' + skill.description + '</p><div class="row"></div></div></div></div>'
    }

})