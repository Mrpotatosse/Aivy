const path = require('path');

const message_handler = (socket, message) => {
    try{
        if(message.action){
            const parent_dir = path.join(__dirname, './../');
            const handler_index = require(`${parent_dir}/actions/${message.action}/index`);
            handler_index(socket, message);
        }
    }catch(error){
        console.error(error);
    }
}

module.exports = message_handler;