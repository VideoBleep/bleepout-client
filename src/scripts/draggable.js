/**
 * drag via touch 12/27/14 jessica.marcus@gmail.com
 *
 * if a user's accelerometer sensors are not working, we can offer touchscreen control as an alternative.
 *
 */

var drag = drag || {};

drag.element = document.getElementById('draggable');
drag.element.style.position = 'absolute';

drag.init = function () {
    drag.element.className = 'paddle';
    drag.centerElement();
    drag.calcBounds();

    drag.element.addEventListener('touchmove', drag.touchHandler, false);
    window.addEventListener('orientationchange', drag.refreshInterface, false);
};

drag.centerElement = function () {
    var elem = drag.element;
    // recalculate screen center and reposition element
    elem.style.left = (window.innerWidth / 2) - (elem.offsetWidth / 2) + 'px';
    elem.style.top = (window.innerHeight / 2) - (elem.offsetHeight / 2) + 'px';
};

drag.calcBounds = function () {
    // determine how far right/down an element could be dragged before it would go offscreen
    // the browser will always position an element's top/left point at the x,y coords given
    drag.boundX = window.innerWidth - drag.element.offsetWidth / 2;
};

drag.resetParams = function () {
    drag.centerElement();
    drag.calcBounds();
};

drag.touchHandler = function (event) {
    event.preventDefault();
    var touch = event.targetTouches[0],
        elem = drag.element;
    // constrain paddle to screen
    if (touch.pageX > elem.offsetWidth / 2 && touch.pageX < drag.boundX) {
        elem.style.left = touch.pageX - (elem.offsetWidth / 2) + 'px';
    }
    // restrict Y axis; only allow movement along X axis
    elem.style.top = (window.innerHeight / 2) - (elem.offsetHeight / 2) + 'px';
};

drag.refreshInterface = function (event) {
    // if a user changes orientation,
    event.preventDefault();
    var elem = drag.element;
    elem.removeEventListener('touchmove', drag.touchHandler, false);

    // reset screen values before adding back event listener
    drag.resetParams();
    elem.addEventListener('touchmove', drag.touchHandler, false);
};

// if a device's browser happens to have the lockOrientation method, let's use it
if (screen.lockOrientation) { screen.lockOrientation('landscape-primary') }
if (screen.mozLockOrientation) { screen.mozLockOrientation('landscape-primary') }
if (screen.msLockOrientation) { screen.msLockOrientation('landscape-primary') }
