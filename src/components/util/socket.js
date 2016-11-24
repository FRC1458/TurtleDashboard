import io from "socket.io-client";

var socket;

// If socket exists, returns socket.
// Else instantiates socket and returns new instance.
export default socket ? socket : socket = io();