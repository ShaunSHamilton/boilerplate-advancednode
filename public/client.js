$(document).ready(function () {
    /*global io*/
    var socket = io();

    // Form submittion with new message in field with id 'm'
    $('form').submit(function (e) {
        e.preventDefault();
        var messageToSend = $('#m').val();
        //send message to server here?
        socket.emit('chat message', messageToSend);
        $('#m').val('');
        return false; // prevent form submit from refreshing page
    });

    socket.on('chat message', data => {
        $('#messages').append($('<li>').text(`${data.name}: ${data.message}`));
    })
    socket.on('user', data => {
        $('#num-users').text(data.currentUsers + ' users online');
        let message =
            data.name +
            (data.connected ? ' has joined the chat.' : ' has left the chat.');
        $('#messages').append($('<li>').html('<b>' + message + '</b>'));
    });

});
