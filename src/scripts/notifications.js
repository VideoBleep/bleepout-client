/**
 *  device orientation notification 12/27/14 jessica.marcus@gmail.com
 *
 *  if a user's devices changes orientation, display a message to the user to suggest disabling screen rotation.
 */

var notify = notify || {};

notify.orientation = function () {
    var modal = document.getElementById('notification-orientation'),
        button = document.getElementById('notify-ok');
    modal.className = 'notification';

    button.addEventListener('click', notify.dismiss, false);
};

notify.dismiss = function (event) {
    event.preventDefault();
    var modal = document.getElementById('notification-orientation');
    modal.className = 'hidden';

    // modal should only appear once, so remove listener once dismissed
    window.removeEventListener('orientationchange', notify.orientation, false);
};

// we want modal to appear when the user turns their phone
window.addEventListener('orientationchange', notify.orientation, false);