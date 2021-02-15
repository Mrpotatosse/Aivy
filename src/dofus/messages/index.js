const {message_buffer} = require('./message_buffer');
const {dofus_message_handler, show_name_log, show_content_log, show_full_log, add_handler, remove_handler} = require('./message_handler');
const {message_log_type, message_log_filter} = require('../../../aivy_config.json');

const dofus_data_buffer_handler = (socket, data, from_client) => {
    if(socket.message_buffer) {
        const result = from_client ? socket.message_buffer.parse_data(data) : socket.remote.message_buffer.parse_data(data);
        return result ? dofus_message_handler(result, socket) : data;
    }
    return data;
}

const dofus_new_client_handler = (socket) => {
    socket.message_buffer = new message_buffer(true);
    socket.remote.message_buffer = new message_buffer(false);
}

const set_log = (log_name, log_filter) => {
    remove_handler(log_filter, show_name_log);
    remove_handler(log_filter, show_content_log);
    remove_handler(log_filter, show_full_log);
    switch(log_name){
        case 'name': add_handler(log_filter, show_name_log);break;
        case 'content': add_handler(log_filter, show_content_log); break;
        case 'full': add_handler(log_filter, show_full_log); break;
        default: break;
    }
}

set_log(message_log_type, message_log_filter);

module.exports = {
    dofus_data_buffer_handler: dofus_data_buffer_handler,
    dofus_new_client_handler: dofus_new_client_handler,
    set_log: set_log
};