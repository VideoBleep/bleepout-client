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
    var self = this;
    var states = this.states = {
        "new": "new",
        "config": "cfg",
        "calibrate": "cal",
        "calibrationSet": "cst",
        "color": "col",
        "play": "play",
        "queued": "que",
        "quit": "quit",
        "ready": "rdy",
        "start": "start"
    };
    this.state = states.new;

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
        // Throw up a message saying 'wait for game to start'
        notify.queued();
    }
    function onStateCalibration () {
        // Take us out of Queued state
        notify.dismiss();
        // start calibration routines
        notify.calibration(actionSetCalibration);
    }
    function onStateReady() {
        // Show the "Start Game" button
        var start = document.getElementById('start-button');
        start.className = 'button';

        start.addEventListener('click', function () {
            actionPlayerStart();
            start.className = 'hidden';
        }, false);
    }
    function onStatePlay() {
        // TODO:
    }

    // Action methods -------------------------
    // these are the UI doing stuff
    function actionSetColor () {
        // get color from picker
        // For now, we will assign one from sway config
        socket.send(delimit(socket.delimiter, states.config, red, green, blue));
    }
    function actionSetCalibration () {
        // Set state to calibrationSet, which waits for game ready but also freezes our current calibration
        self.state = states.calibrationSet;
        // TODO: Take current calibration settings and calculate our offset
        // this should be initial.yaw - calibration.yaw
        // TODO: Despite the sequence diagram, I believe nothing really gets sent here, calibration should be done in the UI
        // TODO: notify bleepout that we are done with calibration
        // TODO: OR we should just proceed to game ready
    }
    function actionPlayerStart () {
        socket.send(delimit(socket.delimiter, states.start));
    }
    function actionPlayerQuit () {
        self.state = states.quit;
        socket.send(delimit(socket.delimiter, states.quit));
    }

    // Parse & handle incoming messages
    function handleMessage (msg) {
        var state,
            pos = msg.indexOf(socket.delimiter);
        if (pos >= 0) {
            state = msg.substring(0, pos);

            switch (state) {
                case states.color:
                    self.state = state;
                    // Player needs to select color.
                    onStateColor();
                    break;
                case states.queued:
                    self.state = state;
                    // Player is queued, waiting for round start / calibrate
                    onStateQueued();
                    break;
                case states.calibrate:
                    self.state = state;
                    // Round start: Player should calibrate.
                    onStateCalibration();
                    break;
                case states.ready:
                    self.state = state;
                    // Game is ready, awaiting player ready
                    notify.quit(actionPlayerQuit);
                    onStateReady();
                    break;
                case states.play:
                    self.state = state;
                    // Game is playing, send control
                    onStatePlay();
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
    var currentCalibration = null;
    var initialCalibration = null;
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
        if (!initialCalibration) initialCalibration = values;
        // Switch between calibration modes and free control
        var s = ctl.states;
        switch (ctl.state) {
            case s.quit:
                break;
            case s.calibrate:
                // While in calibration, orientation messages should only update controller calibration
                currentCalibration = values;
                break;
            default:
                conn.send(delimit(cfg.delimiter, 'ypr', values.alpha, values.beta, values.gamma));
                break;
        }
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