const {d2_handler_class, add_handler, remove_handler} = require('./../../../../../dofus/messages/handlers/index');

let current_sockets = [];
let options = [];

class _ui_options_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    async handle(){
        let result = undefined;
        options.forEach(option => {
            switch(option.href){
                case '#logs': 
                    if(option.checked){
                        result = {
                            result_type: 'logs_result',
                            obj: this.message_informations.message_data_parsed
                        };

                        current_sockets.forEach(socket => socket.send(JSON.stringify(result)));
                    }
                break;
            }
        });
    }
}

const set_option = (socket, opt) => {
    options = [];
    options.push(...opt);

    current_sockets.push(socket);
    current_sockets = Array.from(new Set(current_sockets.filter(s => s.readyState === 1)));

    remove_handler('all', _ui_options_handler);
    add_handler('all', _ui_options_handler);
}

module.exports = set_option;