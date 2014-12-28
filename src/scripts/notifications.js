/**
 *  user notifications 12/27/14 jessica.marcus@gmail.com
 *
 */
var notify = notify || {};

notify.modal = document.getElementById('notification');
notify.button = document.getElementById('notify-ok');

// remove modal
notify.dismiss = function () {
    notify.modal.className = 'hidden';
};
notify.calibration = function (callback) {
    notify.modal.className = 'notify';
    notify.modal.firstElementChild.innerHTML = notify.msg.calibration;

    var listener = function () {
        notify.dismiss();
        callback();
        notify.button.removeEventListener('click', listener, false);
    };
    // enable dismissal button
    notify.button.className = 'ok';
    notify.button.addEventListener('click', listener, false);
};

// if a user's device changes orientation, display a message to the user to suggest disabling screen rotation.
// note: this notification uses its own specific elements, not the general ones
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

// this obj stores all message text strings
notify.msg = {
    queued: "Welcome to Bleepout! You are in the queue; please wait for the next round.",
    orientation: "Bleepout will be even more awesome if you turn off your phone's screen rotation!",
    calibration: "Please find your paddle on the wall, point your phone at it, and press OK!"
};

//TODO: as written, there could be collisions with multiple messages being triggered for the one #notification div
//TODO: add  this orientation event listener when user is taken out of queue state
// we want modal to appear when the user turns their phone
window.addEventListener('orientationchange', notify.orientation, false);
notify.queued();

// temp. test event
//window.addEventListener('orientationchange', notify.queued, false);