/**
 *  user notifications 12/27/14 jessica.marcus@gmail.com
 *
 */
var notify = notify || {};

notify.modal = document.getElementById('notification');
notify.button = document.getElementById('notify-ok');

notify.init = function () {
    document.getElementById('quit-button').addEventListener('click', notify.quit, false);
};

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

notify.quit = function () {
    var buttonQuit = document.getElementById('notify-quit'),
        buttonNoquit = document.getElementById('notify-noquit'),
        hideButtons = function () {
            buttonQuit.className = 'hidden';
            buttonNoquit.className = 'hidden';
        },
        noListener = function () {
            notify.modal.firstElementChild.innerHTML = "Sweet!";
            hideButtons();
            setTimeout(notify.dismiss, 1000);
            buttonNoquit.removeEventListener('click', noListener, false);
        };
        yesListener = function () {
            notify.modal.firstElementChild.innerHTML = notify.msg.goodbye;
            document.getElementById('quit-button').className = 'hidden';
            hideButtons();
            buttonNoquit.removeEventListener('click', yesListener, false);
            //TODO: call bleepout.controller.actionPlayerQuit();
    };
    notify.modal.className = 'notify';
    notify.modal.firstElementChild.innerHTML = notify.msg.quit;
    buttonQuit.className = 'ok';
    buttonNoquit.className = 'ok';

    buttonQuit.addEventListener('click', yesListener, false);
    buttonNoquit.addEventListener('click', noListener, false);
};

// this obj stores all message text strings
notify.msg = {
    queued: "Welcome to Bleepout! You are in the queue; please wait for the next round.",
    orientation: "Bleepout will be even more awesome if you turn off your phone's screen rotation!",
    calibration1: "Let's begin calibration.",
    calibration2: "Please find your paddle on the wall, point your phone at it, and press OK!",
    quit: "Do you really want to quit?",
    goodbye: "Thanks for Bleeping Out with us!"
};

// we want modal to appear when the user turns their phone
window.addEventListener('orientationchange', notify.orientation, false);

notify.init();

// test events - delete when complete
//notify.quit();
//notify.calibration();
//window.addEventListener('orientationchange', notify.calibration, false);