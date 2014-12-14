/**
 * Created by Jim Ankrom on 12/12/2014.
 */
var bleepout = bleepout || {};
bleepout.debug = true;

// Realtime Message Serializers
bleepout.messages = {
    // convert yaw, pitch, roll to arraybuffer
    newPlayer: function (id, red, green, blue)
    {
        return {
            toString: function () {
                return 'new|' + id + '|' + red + '|' + green + '|' + blue;
            }
        };
    },

    // convert yaw, pitch, roll to arraybuffer
    control: function (yaw, pitch, roll) {
        return {
            toString: function () {
                return 'ypr|' + yaw + '|' + pitch + '|' + roll;
            }
        };
    }
};

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