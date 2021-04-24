const path = require('path');

const websocket_handler = (socket, message) => {
    try{
        if(message.action){
            const parent_dir = path.join(__dirname, './../');
            const handler_index = require(`${parent_dir}/actions/${message.action}`);
            handler_index(socket, message);
        }
    }catch(error){
        console.error(error);
    }
}

module.exports = websocket_handler;