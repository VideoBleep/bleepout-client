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

// Set up listeners for game events
bleepout.controller = function (socket) {
    var prefixes = {
        "config": "cfg",
        "calibrate": "cal",
        "color": "col",
        "play": "play",
        "queued": "que",
        "quit": "quit",
        "ready": "rdy",
        "start": "start"
    };

    // Parse & handle incoming messages
    function handleMessage (msg) {
        var pre,
            pos = data.indexOf(socket.delimiter);
        if (pos >= 0) {
            pre = data.substring(0, pos);

            switch (pre) {
                case prefixes.color:
                    // Player needs to select color. For now, we will assign one.
                    this.stateChooseColor();
                    break;
                case prefixes.queued:
                    // Player is queued, waiting for game ready
                    this.stateQueued();
                    break;
                case prefixes.calibrate:
                    // Player should calibrate.
                    this.stateCalibration();
                    break;
                case prefixes.ready:
                    // Game is ready, awaiting player ready
                    this.stateReady();
                    break;
                case prefixes.play:
                    // Game is playing, send control
                    this.statePlay();
                    break;
                default:
                    break;
            }
        }
    }

    handleMessage.stateChooseColor = function () {};
    handleMessage.stateQueued = function () {};
    handleMessage.stateCalibration = function () {};
    handleMessage.stateReady = function () {};
    handleMessage.statePlay = function () {};

    socket.onMessage.add(handleMessage.bind(this));

    return handleMessage;
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

// Set up views for game states
bleepout.views = function () {

}();