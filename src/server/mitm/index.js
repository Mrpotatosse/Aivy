const net = require('net');

// connectionHandler = socket:Socket -> () # called when the socket is successfully linked
// dataHandler = socket:Socket * data:Buffer * from_client:Boolean -> new_data:Buffer # called when data is received
const create_MITM_server = (connectionHandler, dataHandler) => {
    const server = new net.Server();
    server.clients = new Set();

    server.on('listening', () => {console.log('mitm started')});
    server.on('close', () => {console.log('mitm closed')});
    server.on('error', (error) => {console.error(error)});
    server.on('connection', (socket) => {
        console.log('client connected to MITM');  
        server.clients.add(socket);

        socket.remote = new net.Socket();
        connectionHandler(socket);
        
        socket.on('data', data => {
            const data_str = data.toString();
            
            if(data_str.startsWith('ORIGINAL')){
                const remote_ip = parse_data_str(data_str);
                
                const remote_close_handler = () => {
                    remote_closed(socket);
                }
                
                socket.remote.on('data', data => {
                    socket.write(dataHandler(socket, data, false));
                });
                socket.remote.on('close', () => remote_close_handler(socket));
                socket.remote.on('error', error => remote_error(error, socket));

                console.log(remote_ip);
                socket.process_id = remote_ip.pid;
                socket.is_connected = true;
                socket.remote.connect({
                    host: remote_ip.host,
                    port: remote_ip.port
                }); 
            }else{
                socket.remote.write(dataHandler(socket, data, true));
            }
        });
        
        socket.on('close', () => {
            server.clients.delete(socket);
            local_closed(socket);
        });
        socket.on('error', error => 
        { 
            server.clients.delete(socket);
            local_error(error, socket);
        });
    });

    return server;
}

const local_closed = (socket) => {
    console.log('local closed');
    socket.remote.destroy();
};
const remote_closed = (socket) => {
    console.log('remote closed'); 
    socket.destroy();
};

const local_error = (error, socket) => {
    console.error('local error:', error);
    socket.remote.destroy();
};
const remote_error = (error, socket) => {console.error('remote error:', error); socket.destroy();};

const parse_data_str = data_str => { // [0]:ORIGINAL [1]:xxx.xxx.xxx.xxx(IP):xxxx(PORT) [2]:xxxx(PID)
    const splitted = data_str.split(' ');
    const ip_splitted = splitted[1].split(':');

    return {
        host: ip_splitted[0],
        port: parseInt(ip_splitted[1]),
        pid: parseInt(splitted[2])
    };
};

module.exports = {
    create_MITM_server: create_MITM_server
}