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

    // Action methods -------------------------
    // these are the UI doing stuff
    function actionSetColor () {
        // get color from picker
        // For now, we will assign one from sway config
        // TODO: socket.send(delimit(socket.delimiter, prefixes.config, red, green, blue));
    }
    function actionSetCalibration () {
        // TODO: Despite the sequence diagram, I believe nothing really gets sent here, calibration should be done in the UI
    }
    function actionPlayerStart () {
        // TODO: socket.send(delimit(socket.delimiter, prefixes.start);
    }
    function actionPlayerQuit () {
        // TODO: socket.send(delimit(socket.delimiter, prefixes.quit);
    }
    // State control --------------------------
    // These are usually the game telling the UI what state we're in
    function onStateColor() {
        // TODO: launch color picker, and wire up actionSetColor to it as a handler
        // TODO: temporary:
        alert("[Queued] Please wait for the next round to start!");
        // TODO: For now, we will assign a color, this should be removed when complete
        actionSetColor();
    }
    function onStateQueued() {
        // TODO: Throw up a message saying 'wait for game to start'
        // TODO: below is temporary, remove
        alert("[Queued] Please wait for the next round to start!");
    }
    function onStateCalibration () {
        // TODO: Take us out of Queued state
        // TODO: start calibration routines
        // TODO: Below is temporary, remove
        alert("[Calibrate] Please find your paddle, point your phone at it, and press OK!");
    }
    function onStateReady() {
        // Show the "Start Game" button
        // wire up handler to it to send start message
    }
    function onStatePlay() {
        // TODO:
    }
    // Parse & handle incoming messages
    function handleMessage (msg) {
        var pre,
            pos = msg.indexOf(socket.delimiter);
        if (pos >= 0) {
            pre = msg.substring(0, pos);

            switch (pre) {
                case prefixes.color:
                    // Player needs to select color.
                    this.onStateColor();
                    break;
                case prefixes.queued:
                    // Player is queued, waiting for round start / calibrate
                    this.onStateQueued();
                    break;
                case prefixes.calibrate:
                    // Round start: Player should calibrate.
                    this.onStateCalibration();
                    break;
                case prefixes.ready:
                    // Game is ready, awaiting player ready
                    this.onStateReady();
                    break;
                case prefixes.play:
                    // Game is playing, send control
                    this.onStatePlay();
                    break;
                default:
                    break;
            }
        }
    }

    socket.onMessage.add(handleMessage.bind(this));
};

// Initialize bleepout
bleepout.main = function () {
    // Sway has initialized before reaching here
    // TODO: Set player preferences
    var cfg = bleepout.playerConfig;
    var conn = new sway.Socket(cfg);
    var ctl = new bleepout.controller(conn);

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
        // TODO: switch between calibration modes and free control
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

// bleepout View constructor
bleepout.View = function (element) {
    this.el = element;
    this.show = function () {};
    this.hide = function () {};
};

// Set up views for game states
bleepout.views = function () {
    // TODO: assign element
    this.Queue = new bleepout.View();
}();