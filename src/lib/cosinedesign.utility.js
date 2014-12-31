/**
 * Created by Jim Ankrom on 12/14/2014.
 */

// Delimit all optional arguments with delimiter
function delimit (delimiter) {
    var out;
    for (var i=1; i < arguments.length; i++)
    {
        if (out) {
            out+=delimiter;
        } else {
            out = '';
        }
        out+=arguments[i];
    }
    return out;
}

// Multicast Delegate for Event Handlers
// TODO: Build a chain into multicast
function multicast(callback) {
    var self = this,
        delegates = [];

    if (callback) delegates.push(callback);

    // Invoke the delegate list
    function invoke () {
        for (var i = 0; i < delegates.length; i++) {
            delegates[i].apply(self, arguments);
        }
    }
    // Add callback to the multicast
    function add (callback) {
        delegates.push(callback);
        return this;
    }

    invoke.items = delegates;
    invoke.add = add;

    return invoke;
}