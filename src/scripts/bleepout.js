/**
 * Created by Jim Ankrom on 12/12/2014.
 *
 * Controller Library for Bleepout Client
 *
 * Handles Client Workflow for Bleepout Game.
 *
 */

// Bleepout Namespace
var bleepout = bleepout || {};

bleepout.verbose = true;

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
bleepout.main = function () {
    // Sway has initialized before reaching here
    // TODO: Set player preferences
    var cfg = bleepout.playerConfig;
    var conn = new sway.Socket(cfg);

    // Add onOpen tasks
    // Create new player message

    conn.onConnect.add(function () {
        // 'new' + id + red + green + blue
        var m =  delimit(cfg.delimiter, 'new',  sway.user.token.uid, cfg.red, cfg.blue, cfg.green);
        if (bleepout.verbose) console.log(m);
        conn.send(m);
    });

    // Handle orientation event
    // convert yaw, pitch, roll to arraybuffer (FUTURE) and send it
    sway.motion.onOrientation.add(function (values) {
        conn.send(delimit(cfg.delimiter, 'ypr', values.alpha, values.beta, values.gamma));
    });

    conn.connect();
};

bleepout.init = function () {
// Handle sway initialization with
    sway.oninitialized.add(bleepout.main);

// initialize sway
    sway.init();
};