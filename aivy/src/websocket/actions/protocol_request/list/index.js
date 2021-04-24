const { get_message_ids, get_type_ids } = require('./../../../../dofus/messages/protocol'); // to do, change that so websocket is not dependant on dofus

module.exports = (socket, message) => {
    let list = {};

    if(message.type){
        switch (message.type.toLowerCase()) {
            case 'message':
                list = get_message_ids(); break;
            case 'type':
                list = get_type_ids(); break;
        }
    }
    
    socket.send(JSON.stringify({
        result_type: 'protocol_result',
        list
    }));
};