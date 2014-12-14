/**
 *
 *   Sway Socket Extensions
 *   Created by Jim Ankrom on 12/14/2014.
 *
 *   - Multicast Events
 *   -
 *
 *   Requires:
 *   - Engine.io ( repo at https://github.com/Automattic/engine.io-client )
 *   - Multicast ( clone at https://gist.github.com/087c895971dc20ce9e37.git )
 *
 */
var sway = sway || {};

sway.Socket = function (config) {
    var self = this;
    this.verbose = false;
    var delimiter = config.delimiter || '|';
    var socket = eio(config.socketAddress, { "transports": ['websocket']});

    this.log = function (data) {
        if (self.verbose) console.log(data);
    };

    // Assign handlers
    this.onMessage = multicast(self.log);
    this.onClose = multicast(self.log);
    this.onError = multicast(function (error) {
        if (bleepout.debug && console) console.log('Socket Error: ' + error.message);
    });
    this.onOpen = multicast(function () {
        socket.on('message', self.onMessage);
        socket.on('close', self.onClose);
        socket.on('error', self.onError);
    });

    function open () {
        socket.on('open', self.onOpen);
    }



    return this;
};
