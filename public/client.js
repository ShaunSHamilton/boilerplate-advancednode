$(document).ready(function () {
    /*global io*/
    let socket = io();

    socket.on('user count', function (data) {
        console.log(data);
    });

    // Form submittion with new message in field with id 'm'
    $('form').submit(function () {
        let messageToSend = $('#m').val();
        //send message to server here?
        $('#m').val('');
        return false; // prevent form submit from refreshing page
    });



});
