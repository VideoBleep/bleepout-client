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
    this.verbose = true;
    var delimiter = config.delimiter || '|';
    var socket;

    this.log = function (data) {
        if (self.verbose) console.log(data);
    };

    // Assign handlers
    this.onConnect = multicast(self.log);
    this.onMessage = multicast(self.log);
    this.onClose = multicast(self.log);
    this.onError = multicast(function (error) {
        //if (bleepout.debug && console)
        console.log('Socket Error: ' + error.message);
    });
    this.onOpen = multicast(function () {
        socket.on('message', self.onMessage);
        socket.on('close', self.onClose);
        socket.on('error', self.onError);
        self.onConnect();
    });

    this.connect = function () {
        /*
            ( Engine.io - in reverse order)
            open is emitted by Socket.onOpen and Transport.onOpen
            Socket.onOpen is called by socket.onHandshake
            Socket.onHandshake is called by Socket.onPacket
            Socket.onPacket is a pass-through call from Transport's 'packet' event handler
            Transport's packet event is emitted by Transport.onPacket
            Transport.onPacket is raised by Transport.onData after calling parser.decodePacket
        */
        socket = eio(config.socketAddress, { "transports": ['websocket']});
        socket.on('open', self.onOpen);
    };

    this.send = function (message) {
        if (socket) {
            socket.send(message);
        }
    };

    return this;
};
