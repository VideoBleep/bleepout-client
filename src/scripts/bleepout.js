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
bleepout.controller = function (socket, config) {
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
        notify.startPlay(actionPlayerStart);
    }
    function onStatePlay() {
        // TODO: clear all dialogs
    }

    // Action methods -------------------------
    // these are the UI doing stuff
    function actionPlayerNew () {
        self.state = states.new;
        // 'new' + id + red + green + blue
        //var m =  delimit(config.delimiter, 'new', 666, config.red, config.blue, config.green);
        socket.send('new');
    };
    // Make PlayerNew public
    this.actionPlayerNew = actionPlayerNew;

    // TODO: Set color (NOT IMPLEMENTED IN CURRENT VERSION)
    function actionSetColor () {
        self.state = states.config;
        // get color from picker
        // For now, we will assign one from sway config
        socket.send(delimit(socket.delimiter, states.config, red, green, blue));
    }
    function actionSetCalibration () {
        // TODO: Take current calibration settings and calculate our offset
        // this should be initial.yaw - calibration.yaw
        // TODO: Despite the sequence diagram, I believe nothing really gets sent here, calibration should be done in the UI
        // Set state to calibrationSet, which waits for game ready but also freezes our current calibration
        self.state = states.calibrationSet;
        // TODO: notify bleepout that we are done with calibration
        socket.send(states.calibrate);
        // TODO: OR we should just proceed to game ready
    }
    function actionPlayerStart () {
        self.state = states.start;
        socket.send(delimit(socket.delimiter, states.start));
    }
    function actionPlayerQuit () {
        // Set quit cookie
        var setCookie = function (mins) {
            var expTime = new Date(Date.now() + mins * 60000);
            return 'name=bleepCookie; expires=' + expTime.toUTCString();
        };
        document.cookie = setCookie(5);

        self.state = states.quit;
        socket.send(delimit(socket.delimiter, states.quit));
    }

    // Parse & handle incoming messages
    function handleMessage (msg) {
        var state,
            pos = msg.indexOf(socket.delimiter);


        if (pos >= 0) {
            state = msg.substring(0, pos);
        } else {
            state = msg;
        }
        switch (state) {
            // NOT IN USE
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
            // NOT IN USE
            case states.ready:
                self.state = state;
                // Game is ready, awaiting player ready
                notify.showQuit(actionPlayerQuit);
                onStateReady();
                break;
            // NOT IN USE
            case states.play:
                self.state = state;
                // Game is playing, send control
                onStatePlay();
                break;
            default:
                break;
        }
    }

    // Add socket handlers
    socket.onConnect.add(actionPlayerNew);
    socket.onMessage.add(handleMessage);
};

bleepout.calibration = {
    current: null,
    initial: null,
    offset: null
};

// Initialize bleepout
bleepout.main = function () {
    // Sway has initialized before reaching here
    var cfg = bleepout.playerConfig;
    var conn = new sway.Socket(cfg);
    var ctl = new bleepout.controller(conn, cfg);

    // TODO: Consider moving below to the controller
    // Handle orientation event
    // convert yaw, pitch, roll to arraybuffer (FUTURE) and send it
    sway.motion.onOrientation.add(function (orient) {
        var cal = bleepout.calibration;
        if (!cal.initial) {
            cal.initial = { yaw: orient.alpha };
        }
        // Switch between calibration modes and free control
        var s = ctl.states;
        switch (ctl.state) {
            case s.quit:
                break;
            case s.calibrate:
                // While in calibration, orientation messages should only update controller calibration
                cal.current = { yaw: orient.alpha };
                break;
            default:
                var yaw = orient.alpha;
                if (cal.offset) yaw += cal.offset.yaw;
                conn.send(delimit(cfg.delimiter, 'ypr', orient.alpha, orient.beta, orient.gamma));
                break;
        }
    });

    conn.connect();
};

bleepout.init = function () {
    // HEY GUYS I HAVE AN IDEA LET'S NOT USE SWAY AT ALL
    bleepout.main();

    // TODO: JESS: Check for quit cookie here


    //sway.oninitialized.add(bleepout.main);

    // initialize sway
    //sway.init();
};
