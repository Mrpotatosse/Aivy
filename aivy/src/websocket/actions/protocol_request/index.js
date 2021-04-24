const { get_message_and_type_from_name,
        get_message_from_name, get_message_from_id,
        get_type_from_name, get_type_from_id } = require('./../../../dofus/messages/protocol');

const get_element_with_full_properties = element => {
    if(!element) return undefined;

    const element_super = get_message_and_type_from_name(element.super).shift();

    if(!element_super) return element;
    
    const element_super_with_properties = get_element_with_full_properties(element_super);

    return {
        ...element,
        fields: [...element.fields, ...element_super_with_properties.fields].sort((a, b) => a.position - b.position)
    };
}

module.exports = (socket, message) => {
    let element = undefined;
    let request_name = isNaN(parseInt(message.id));

    switch (message.type.toLowerCase()) {
        case 'message': 
        element = request_name ? get_message_from_name(message.id) : get_message_from_id(parseInt(message.id)); break;
        case 'type': 
        element = request_name ? get_type_from_name(message.id) : get_type_from_id(parseInt(message.id)); break;
    }

    if (element) {
        socket.send(JSON.stringify({
            result_type: 'protocol_result',
            value: get_element_with_full_properties(element)
        }));
    }
};