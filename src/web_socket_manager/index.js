const web_socket_handler = (socket, request) => {
    console.log('web socket request', request);
    try{
        const handler_index = require(`./actions/${request.action}/index`);
        handler_index(socket, request);
    }catch(error){
        console.error(error);
    }
}

module.exports = {
    web_socket_handler: web_socket_handler
}