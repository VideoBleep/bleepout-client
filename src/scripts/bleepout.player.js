/**
 * Created by Jim Ankrom on 12/12/2014.
 */
var bleepout = bleepout || {};
bleepout.debug = true;

// convert yaw, pitch, roll to arraybuffer
function serializeablePlayer (id, red, green, blue) {
    return {
        toString: function () {
            return 'new|' + id + '|' + red + '|' + green + '|' + blue;
        }
    };
}

// Connect to sway

// wait for channel config
// connect to socket
// send socket message 'new' + id + red + green + blue
(function () {
    // eio = engine.io
    var socket = eio('ws://localhost:3500', { "transports": ['websocket']});
    //socket.binaryType = 'blob';
    socket.on('open', function(){
        socket.on('message', function (data){
            console.log('Message: ' + data);
        });
        socket.on('close', function (){});
        socket.on('error', function (error) {
            if (bleepout.debug && console) console.log('Socket Error: ' + error.message);
        });
    });
})();