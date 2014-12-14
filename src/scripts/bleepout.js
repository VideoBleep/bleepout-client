/**
 * Created by Jim Ankrom on 12/12/2014.
 *
 * Controller Library for Bleepout Client
 *
 * Handles Client Workflow for Bleepout Game.
 *
 */

// Delimit all optional arguments with delimiter
function delimit (delimiter) {
    var out;
    for (var i=1; i < arguments.length; i++)
    {
        if (out) { out+=delimiter; }
        out+=arguments[i];
    }
    return out;
}

// Bleepout Namespace
var bleepout = bleepout || {};

// Test config - will be removed later
bleepout.playerConfig = {
    "socketAddress": "ws://localhost:3500",
    "color": "FFCC66",
    "red": 255,
    "green": 204,
    "blue": 102,
    "delimiter": "|"
};

// Initialize bleepout
bleepout.init = function () {
    // Sway has initialized before reaching here
    // TODO: Set player preferences
    var cfg = bleepout.playerConfig;
    var socket = new sway.Socket(cfg);

    // Add onOpen tasks
    // Create new player message
    socket.onOpen.add(function () {
        // message 'new' + id + red + green + blue
        socket.send(delimit(cfg.delimiter, 'new',  cfg.id, cfg.red, cfg.blue, cfg.green));
    });

    // Handle orientation event
    // convert yaw, pitch, roll to arraybuffer (FUTURE) and send it
    sway.motion.onOrientation.add(function (values) {
        socket.send(delimit(delimiter, 'ypr', values.alpha, values.beta, values.gamma));
    });

    // listen for close & message events
    //socket.onClose.add( FOO );
    //socket.onMessage.add( FOO );

    // open the socket
    socket.open();
};

bleepout.verbose = false;

// Handle sway initialization with
sway.oninitialized.add(bleepout.init);

// initialize sway
sway.init();


