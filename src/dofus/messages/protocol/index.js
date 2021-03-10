const fs = require('fs');
const path = require('path');

const protocol_ids_list = {};

const get_protocol_element = (folder_path, name) => {
    try{
        const buffer = fs.readFileSync(path.join(folder_path, `${name}.json`));
        return JSON.parse(buffer.toString());
    }catch{
        return undefined;
    }
}

const get_protocol_elements_by_id = (folder_path, protocol_name, protocol_types, id) => {
    return protocol_types
    .map(type => {
        const name = protocol_ids_list[protocol_name][type][id];
        if(name){
            const folder_new_path = path.join(folder_path, type);
            return get_protocol_element(folder_new_path, name);
        }
        return undefined;
    })
    .filter(x => x);
}

const get_protocol_ids_list = (ids_list_path) => {
    const ids_buffer = fs.readFileSync(ids_list_path);
    return JSON.parse(ids_buffer.toString());
}

const set_protocol_ids_list = (protocol_name, list_name, ids_list_path) => {
    protocol_ids_list[protocol_name] = {
        ...protocol_ids_list[protocol_name],
        [list_name]: get_protocol_ids_list(ids_list_path)
    };
}

const init_dofus_protocol = (folder_path, protocol_name, element_types) => {
    element_types.forEach(type => {
        const ids_list_path = path.join(folder_path, type.ids_list_name);
        set_protocol_ids_list(protocol_name, type.name, ids_list_path);
    });
}

module.exports = {
    get_protocol_element,
    get_protocol_ids_list,
    set_protocol_ids_list,
    protocol_ids_list,
    init_dofus_protocol,
    get_protocol_elements_by_id
}