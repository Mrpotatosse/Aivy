const {d2_handler_class, add_handler, remove_handler} = require('./../../../../../dofus/messages/handlers/index');

let current_sockets = [];
let players = [];

class _ui_player_request_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    async handle(){
        players.push(this.message_informations.message_data_parsed.infos);

        let result = {
            result_type: 'players_result',
            value: players
        };
        
        current_sockets.forEach(socket => {
            socket.send(JSON.stringify(result));
        });

        this.socket.addListener('close', _ => {
            players = players.filter(x => x.id !== this.message_informations.message_data_parsed.infos.id);
            result.value = players;

            current_sockets.forEach(socket => {    
                socket.send(JSON.stringify(result));                
            });
        });
    }
}

const init_player = (socket) => {
    current_sockets.push(socket);
    current_sockets = Array.from(new Set(current_sockets.filter(s => s.readyState === 1)));

    remove_handler('CharacterSelectedSuccessMessage', _ui_player_request_handler);
    add_handler('CharacterSelectedSuccessMessage', _ui_player_request_handler);

    let result = {
        result_type: 'players_result',
        value: players
    };

    current_sockets.forEach(socket => {
        socket.send(JSON.stringify(result));
    });
}

module.exports = init_player;