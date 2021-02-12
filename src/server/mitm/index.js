const net = require('net');

const createServer = (dataHandler) => {
    const server = new net.Server();

    server.on('listening', () => {console.log('mitm started')});
    server.on('close', () => {console.log('mitm closed')});
    server.on('error', (error) => {console.error(error)});
    server.on('connection', (socket) => {
        console.log('new client');
    });

    return server;
}

module.exports = {
    createServer: createServer
}