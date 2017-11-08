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

})