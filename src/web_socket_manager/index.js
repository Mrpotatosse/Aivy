const {getRunner} = require('./../../runner');
const {set_event} = require('./../dofus/events/index');

const web_socket_handler = (socket, request) => {
    console.log('web socket request', request);
    try{
        const handler_index = require(`./actions/${request.action}/index`);
        handler_index(socket, request);
    }catch(error){
        console.error(error);
    }
}

set_event('character_selected_event', socket => {
    const info_result = require('./actions/info_request/index');
    const web_server = getRunner()['webserver'];
    web_server.clients.forEach(client => {
        info_result(client, {});
    });

    socket.on('close', _ => {
        web_server.clients.forEach(client => {
            info_result(client, {});
        });
    });
});
module.exports = {
    web_socket_handler: web_socket_handler
}