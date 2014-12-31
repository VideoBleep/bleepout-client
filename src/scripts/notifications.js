/**
 *  user notifications 12/27/14 jessica.marcus@gmail.com
 *
 */
var notify = notify || {};

notify.modal = document.getElementById('notification');
notify.button = document.getElementById('notify-ok');

// hide modal
notify.dismiss = function () {
    notify.modal.className = 'hidefade';
    if (document.getElementById('notify-ok')) {document.getElementById('notify-ok').className = 'hidden'}
    if (document.getElementById('notify-yes')) {document.getElementById('notify-yes').className = 'hidden'}
    if (document.getElementById('notify-no')) {document.getElementById('notify-no').className = 'hidden'}
    notify.modal.firstElementChild.innerHTML = '';
};


// this is the first screen a new user sees; it remains until the user is taken out of the queue state
notify.queued = function () {
    var logo = document.getElementById('logo'),
        textNode = document.getElementById('intro-text');
    // change to white text underneath the logo
    logo.className = 'logo';

    textNode.className = 'queued-msg';
    textNode.innerHTML = notify.msg.queued;
};

// a user's device must be calibrated in order to control a paddle properly
// we walk the user through the process:
notify.calibration = function (callback) {
    var content = notify.modal.firstElementChild;

    function start() {
        // "let's begin calibration!"
        notify.modal.className = 'notify';
        content.innerHTML = notify.msg.calibration1;

        // enable button
        notify.button.className = 'ok';
        notify.button.addEventListener('click', controller, false);
    }

    function calibrate() {
        // user initiates calibration method
        content.innerHTML = notify.msg.calibration2;
        callback();
    }

    function confirm() {
        // ask user if things are ok
        content.innerHTML = notify.msg.calibration3;
        // hide ok button
        notify.button.className = 'hidden';

        // enable yes/no buttons
        var buttonYes = document.getElementById('notify-yes'),
            buttonNo = document.getElementById('notify-no');
        notify.showYesNo();

        buttonYes.addEventListener('click', yesListener, false);
        buttonNo.addEventListener('click', noListener, false);

    // user clicks yes, calibration is good
        function yesListener() {
            content.innerHTML = notify.msg.getready;
            notify.hideYesNo();
            setTimeout(notify.dismiss, 5000);
            // remove all listeners
            buttonNo.removeEventListener('click', noListener, false);
            buttonYes.removeEventListener('click', yesListener, false);
            notify.button.removeEventListener('click', controller, false);
        }

    // user clicks no, calibration is off
        function noListener() {
            // return user to calibrate step
            notify.hideYesNo();
            recalibrate();

        }
    }

    function ok() {
        notify.dismiss();
    }

    function recalibrate() {
        notify.button.className = 'ok';
        calibrate();
    }

    function controller() {
        switch (notify.modal.firstElementChild.innerHTML) {
            case "":
                start();
                break;
            case notify.msg.calibration1:
                calibrate();
                break;
            case notify.msg.calibration2:
                confirm();
                break;
            default:

                break;
        }
    }
    start();
};

// if a user's device changes orientation, display a message to the user to suggest disabling screen rotation.
// note: this notification uses its own specific elements for display to user, not the general ones
notify.orientation = function () {
    var modal = document.getElementById('notify-orient'),
        button = document.getElementById('notify-ok-orient'),
        listener = function () {
            modal.className = 'hidden';
            window.removeEventListener('orientationchange', notify.orientation, false);
        };

    modal.className = 'notify';
    modal.style.background = 'rgba(255, 255, 255, 1)';
    modal.firstElementChild.innerHTML = notify.msg.orientation;

    // enable dismissal button
    button.className = 'ok';
    button.addEventListener('click', listener, false);
};

// the round has ended, but the player will be allowed to continue if they desire
notify.roundEnd = function (continueCallback) {
    var buttonYes = document.getElementById('notify-yes'),
        buttonNo = document.getElementById('notify-no'),
        // user decides to keep playing:
        yesListener = function () {
            notify.modal.firstElementChild.innerHTML = notify.msg.waitnext;
            notify.hideYesNo();
            setTimeout(notify.dismiss, 5000);
            buttonNo.removeEventListener('click', yesListener, false);
            continueCallback();
        },
        // user decides to stop when prompted to; send to "are you sure?" notification
        noListener = function () {
            notify.hideYesNo();
            buttonNo.removeEventListener('click', noListener, false);
            buttonYes.removeEventListener('click', yesListener, false);
            notify.quit();
        };
    notify.modal.className = 'notify';
    notify.modal.firstElementChild.innerHTML = notify.msg.roundend;
    notify.showYesNo();

    buttonYes.addEventListener('click', yesListener, false);
    buttonNo.addEventListener('click', noListener, false);
};

// the round has ended, and the user's time is up and will be removed from the game
notify.gameOver = function (quitCallback) {
    var listener = function () {
        notify.dismiss();
        quitCallback();
        notify.button.removeEventListener('click', listener, false);
    };
    notify.modal.className = 'notify';
    notify.modal.firstElementChild.innerHTML = notify.msg.gameover;
    notify.button.className = 'ok';
    notify.button.addEventListener('click', listener, false);
};

// shows the quit button that is visible during play
notify.showQuit = function (callback) {
    var button = document.getElementById('quit-button');
    button.className = '';
    button.addEventListener('click', notify.quit.call(this, callback), false);
};

// user is about to quit; show confirmation notification
notify.quit = function (quitCallback) {
    //TODO: this method is used in two places: a player deciding to quit in the middle of a session, or at roundEnd;
    //TODO: modify this method to account for both scenarios
    var buttonYes = document.getElementById('notify-yes'),
        buttonNo = document.getElementById('notify-no'),

        // user decides not to quit game
        noListener = function () {
            notify.modal.firstElementChild.innerHTML = notify.msg.sweet;
            notify.hideYesNo();
            setTimeout(notify.dismiss, 1000);
            buttonNo.removeEventListener('click', noListener, false);
        },

    // user confirms that yes, they want to quit
        yesListener = function () {
            notify.modal.firstElementChild.innerHTML = notify.msg.goodbye;
            document.getElementById('quit-button').className = 'hidden';
            notify.hideYesNo();
            buttonNo.removeEventListener('click', yesListener, false);
            quitCallback();
    };
    notify.modal.className = 'notify';
    notify.modal.firstElementChild.innerHTML = notify.msg.quit;
    notify.showYesNo();

    buttonYes.addEventListener('click', yesListener, false);
    buttonNo.addEventListener('click', noListener, false);
};

// when everything is ready to go for the user's device, show button and begin play on click
notify.startPlay = function (callback) {
    var startButton = document.getElementById('start-button'),
        goPlay = function () {
            startButton.className = 'hidden';
            startButton.removeEventListener('click', goPlay, false);
            callback();
        };
    startButton.className = 'button';
    startButton.addEventListener('click', goPlay, false);
};

// helpers
notify.showYesNo = function () {
    var buttonYes = document.getElementById('notify-yes'),
        buttonNo = document.getElementById('notify-no');
    buttonYes.className = 'ok';
    buttonNo.className = 'ok';
};
notify.hideYesNo = function () {
    var buttonYes = document.getElementById('notify-yes'),
        buttonNo = document.getElementById('notify-no');
    buttonYes.className = 'hidden';
    buttonNo.className = 'hidden';
};

notify.test = function () {
    var background = document.getElementById('background'),
        button = document.getElementById('quit-button'),
        listener = function () {
            background.className = 'background';
        };

    // enable dismissal button
    button.className = '';
    button.addEventListener('click', listener, false);
};

// this obj stores all message text strings
notify.msg = {
    queued: "<div>Welcome to Bleepout!</div><div>You are in the queue; please wait for the next round.</div>",
    orientation: "Bleepout will be even more awesome if you turn off your phone's screen rotation!",
    calibration1: "Let's begin calibration.",
    calibration2: "Please find your paddle on the wall, point your phone at it, and press OK!",
    calibration3: "is it ok?",
    quit: "Do you really want to quit?",
    goodbye: "Thanks for Bleeping Out with us!",
    roundend: "Round over. Would you like to keep playing?",
    waitnext: "Awesome! Please wait for the next round to begin.",
    gameover: "Round over. Your time is up: thanks for Bleeping Out with us!",
    getready: "Great! Get ready, we're about to begin.",
    sweet: "Sweet!",
    test: "Test message"
};

// we want modal to appear when the user turns their phone
//window.addEventListener('orientationchange', notify.orientation, false);

// test events - delete when complete
//notify.showQuit();
notify.queued();
window.addEventListener('orientationchange', notify.startPlay, false);