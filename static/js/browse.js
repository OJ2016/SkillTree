$(document).ready(function() {
	
	if(getCookie("showinfo") == "")
	{
		on();
		setCookie("showinfo","no",30);
	}
	
	
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
function on() {
		document.getElementById("overlay").style.display = "block";
	}
function off() {
	document.getElementById("overlay").style.display = "none";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}