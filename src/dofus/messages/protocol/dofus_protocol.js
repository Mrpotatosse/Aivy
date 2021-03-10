const path = require('path');
const {init_dofus_protocol, get_protocol_element, get_protocol_elements_by_id} = require('./index');

const protocol_informations = {
    folder_path: path.join(__dirname, './../../../ui/client/protocol'),
    protocol_name: '2.58',
    protocol_types: [
        { name: 'messages', ids_list_name: 'MessageIds.json' },
        { name: 'types', ids_list_name: 'TypeIds.json' }
    ]
}

init_dofus_protocol(protocol_informations.folder_path, protocol_informations.protocol_name, protocol_informations.protocol_types);

const get_message_by_id = id => {
    return get_protocol_elements_by_id(protocol_informations.folder_path, protocol_informations.protocol_name, ['messages'], id).shift();
}

const get_message_by_name = name => {
    const message_path = path.join(protocol_informations.folder_path, '/messages');
    return get_protocol_element(message_path, name);
}

const get_type_by_id = id => {
    return get_protocol_elements_by_id(protocol_informations.folder_path, protocol_informations.protocol_name, ['types'], id).shift();
}

const get_type_by_name = name => {
    const message_path = path.join(protocol_informations.folder_path, '/types');
    return get_protocol_element(message_path, name);
}

const get_messages_and_types_by_id = id => {
    return get_protocol_elements_by_id(protocol_informations.folder_path, protocol_informations.protocol_name, ['messages', 'types'], id);
}

const get_messages_and_types_by_name = name => {
    return [
        get_message_by_name(name),
        get_type_by_name(name)
    ].filter(x => x);
}

module.exports = {
    get_message_by_id,
    get_message_by_name,

    get_type_by_id,
    get_type_by_name,

    get_messages_and_types_by_id,
    get_messages_and_types_by_name
}