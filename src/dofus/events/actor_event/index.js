const { d2handler_class, add_handler } = require('../../messages/message_handler');
const {get_event} = require('./../index');

class _character_selected_handler_event extends d2handler_class{    
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    handle(){
        const message_data = this.message_informations.message_data_parsed;
        
        this.socket.dofus_informations = {
            selected_character: {
                breed: message_data.infos.breed,
                entityLook: message_data.infos.entityLook,
                id: message_data.infos.id,
                level: message_data.infos.level,
                name: message_data.infos.name,
                sex: message_data.infos.sex
            }
        }

        get_event('character_selected_event').forEach(event => event(this.socket));
    }

    endHandle(){}
}

class _new_map_handler_actor_event extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    handle(){
        console.log(this.socket.dofus_informations);
        console.log(this.message_informations);
        
        const message_data = this.message_informations.message_data_parsed;
        this.socket.dofus_informations = {
            ...this.socket.dofus_informations,
            map: {
                actors: message_data.actors,
                fights: message_data.fights,
                fightStartPositions: message_data.fightStartPositions,
                houses: message_data.houses,
                interactiveElements: message_data.interactiveElements,
                mapId: message_data.mapId,
                obstacles: message_data.obstacles,
                statedElements: message_data.statedElements,
                subAreaId: message_data.subAreaId
            }
        }
    }

    endHandle(){}
}

class _show_player_handler_actor_event extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    handle(){

    }

    endHandle(){}
}

class _show_multiple_player_handler_actor_event extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    handle(){

    }

    endHandle(){}
}

class _test_zobi extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    handle(){
        //console.log(this.socket.dofus_informations);
    }

    endHandle(){}
}

add_handler('all', _test_zobi);

add_handler('CharacterSelectedSuccessMessage', _character_selected_handler_event);

add_handler('MapComplementaryInformationsDataMessage', _new_map_handler_actor_event);
add_handler('GameRolePlayShowActorMessage', _show_player_handler_actor_event);
add_handler('GameRolePlayShowMultipleActorsMessage', _show_multiple_player_handler_actor_event);

console.log('actor event initied');