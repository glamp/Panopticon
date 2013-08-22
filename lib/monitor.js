//require("html2canvas")
//require("jquery")
//var io = require("socket.io")
//var socket = io.connect('http://localhost:3000')

updateScreen = function() {
    html2canvas(document.body, {
        onrendered: function(canvas) {
            var img = canvas.toDataURL("images/png");
            socket.emit('screenshot', {user: $("#username").val(), img: img})
            $.post("http://localhost:3000/", {user: $("#username").val(), img: img})
        }
    })
}

monitor = function(frequency) {
    myInterval = setInterval( "updateScreen()", frequency);
}

monitor(1);

