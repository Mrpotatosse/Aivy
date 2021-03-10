/**MODULE_INFORMATIONS
name=Player Event
autor=Aivy
img_src=https://static.ankama.com/g/modules/masterpage/block/header/idbar/characters.png
option=true
END**/
const {d2_handler_class, add_handler, remove_handler} = require('../src/dofus/messages/handlers/index');

// map info
class _actor_event_map_info_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('MapComplementaryInformationsDataMessage', _actor_event_map_info_handler);
remove_handler('MapComplementaryInformationsDataMessage', _actor_event_map_info_handler, true);

// show actor
class _actor_event_show_actor_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('GameRolePlayShowActorMessage', _actor_event_show_actor_handler);
remove_handler('GameRolePlayShowActorMessage', _actor_event_show_actor_handler, true);

class _actor_event_show_multiple_actor_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('GameRolePlayShowMultipleActorsMessage', _actor_event_show_multiple_actor_handler);
remove_handler('GameRolePlayShowMultipleActorsMessage', _actor_event_show_multiple_actor_handler, true);

class _actor_event_show_actor_with_event_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('GameRolePlayShowActorWithEventMessage', _actor_event_show_actor_with_event_handler);
remove_handler('GameRolePlayShowActorWithEventMessage', _actor_event_show_actor_with_event_handler, true);

// remove
class _actor_event_remove_element_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('GameContextRemoveElementMessage', _actor_event_remove_element_handler);
remove_handler('GameContextRemoveElementMessage', _actor_event_remove_element_handler, true);

class _actor_event_remove_multiple_element_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('GameContextRemoveMultipleElementsMessage', _actor_event_remove_multiple_element_handler);
remove_handler('GameContextRemoveMultipleElementsMessage', _actor_event_remove_multiple_element_handler, true);

class _actor_event_remove_element_with_event_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('GameContextRemoveElementWithEventMessage', _actor_event_remove_element_with_event_handler);
remove_handler('GameContextRemoveElementWithEventMessage', _actor_event_remove_element_with_event_handler, true);

class _actor_event_remove_multiple_element_with_event_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
}
add_handler('GameContextRemoveMultipleElementsWithEventsMessage', _actor_event_remove_multiple_element_with_event_handler);
remove_handler('GameContextRemoveMultipleElementsWithEventsMessage', _actor_event_remove_multiple_element_with_event_handler, true);