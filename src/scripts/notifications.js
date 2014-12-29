/**
 *  user notifications 12/27/14 jessica.marcus@gmail.com
 *
 */
var notify = notify || {};

notify.modal = document.getElementById('notification');
notify.button = document.getElementById('notify-ok');

// hide modal
notify.dismiss = function () {
    notify.modal.className = 'hidden';
};

// a user's device must be calibrated in order to control a paddle properly
notify.calibration = function (callback) {
    // show first set of instructions to user
    notify.modal.className = 'notify';
    notify.modal.firstElementChild.innerHTML = notify.msg.calibration1;

    // guide the user through recording these two values:
    var heading, offset,
        getHeading = function () {
            // record heading and then move to the second calibration stage
            heading = 'something';
            notify.modal.firstElementChild.innerHTML = notify.msg.calibration2;
        },

        getOffset = function () {
            // record offset and then dismiss the notification
            offset = 'something else';
            notify.dismiss();
            notify.button.removeEventListener('click', listener, false);
        },

        listener = function () {
            if (!heading) {
                getHeading();
            } else {
                getOffset();
            }
            //notify.dismiss();
            //callback();
            //notify.button.removeEventListener('click', listener, false);
        };

    // enable button
    notify.button.className = 'ok';
    notify.button.addEventListener('click', listener, false);
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

// this message is visible until the user is taken out of the queue state
notify.queued = function () {
    notify.modal.className = 'notify';
    notify.modal.firstElementChild.innerHTML = notify.msg.queued;
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
            notify.modal.firstElementChild.innerHTML = "Sweet!";
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

// this obj stores all message text strings
notify.msg = {
    queued: "Welcome to Bleepout! You are in the queue; please wait for the next round.",
    orientation: "Bleepout will be even more awesome if you turn off your phone's screen rotation!",
    calibration1: "Let's begin calibration.",
    calibration2: "Please find your paddle on the wall, point your phone at it, and press OK!",
    quit: "Do you really want to quit?",
    goodbye: "Thanks for Bleeping Out with us!",
    roundend: "Round over. Would you like to keep playing?",
    waitnext: "Awesome! Please wait for the next round to begin.",
    gameover: "Round over. Your time is up: thanks for Bleeping Out with us!"
};

// we want modal to appear when the user turns their phone
window.addEventListener('orientationchange', notify.orientation, false);


// test events - delete when complete
notify.startPlay();
//notify.calibration();
//window.addEventListener('orientationchange', notify.showQuit, false);