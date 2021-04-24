const path = require('path');
const fs = require('fs');

const HISTORY_MAX_COUNT = 100;

const message_requests_history = [];
const type_requests_history = [];

const ids = {
    message: {
        ids_path: path.join(__dirname, 'MessageIds.json'),
        elts_path: path.join(__dirname, './messages'),
        list: undefined
    },
    type: {
        ids_path: path.join(__dirname, 'TypeIds.json'),
        elts_path: path.join(__dirname, './types'),
        list: undefined
    }
}

const get_message_ids = _ => {
    try {
        if (ids.message.list) return ids.message.list;

        ids.message.list = JSON.parse(fs.readFileSync(ids.message.ids_path).toString());
        return ids.message.list;
    } catch {
        return {};
    }
}

const get_type_ids = _ => {
    try {
        if (ids.type.list) return ids.type.list;

        ids.type.list = JSON.parse(fs.readFileSync(ids.type.ids_path).toString());
        return ids.type.list;
    } catch {
        return {};
    }
}

const get_message_from_name = name => {
    try {
        if (!name) return undefined;

        const saved = message_requests_history.filter(x => x.name === name)[0];

        if (saved) return saved;

        const message = JSON.parse(fs.readFileSync(path.join(ids.message.elts_path, `${name}.json`)).toString());
        message_requests_history.push(message);

        if (message_requests_history.length > HISTORY_MAX_COUNT) message_requests_history.shift();
        return message;
    } catch {
        return undefined;
    }
}

const get_message_from_id = id => {
    try {
        const ids = get_message_ids();
        return get_message_from_name(ids[id]);
    } catch {
        return undefined;
    }
}

const get_type_from_name = name => {
    try {
        if (!name) return undefined;

        const saved = type_requests_history.filter(x => x.name === name)[0];

        if (saved) return saved;

        const type = JSON.parse(fs.readFileSync(path.join(ids.type.elts_path, `${name}.json`)).toString());
        type_requests_history.push(type);

        if (type_requests_history.length > HISTORY_MAX_COUNT) type_requests_history.shift();
        return type;
    } catch {
        return undefined;
    }
}

const get_type_from_id = id => {
    try {
        const ids = get_type_ids();
        return get_type_from_name(ids[id]);
    } catch {
        return undefined;
    }
}

const get_message_and_type_from_name = name => {
    return [
        get_message_from_name(name),
        get_type_from_name(name)
    ].filter(x => x);
}

const get_message_and_type_from_id = id => {
    return [
        get_message_from_id(id),
        get_type_from_id(id)
    ].filter(x => x);
}

module.exports = {
    get_message_ids,
    get_type_ids,

    get_message_from_id,
    get_message_from_name,

    get_type_from_id,
    get_type_from_name,

    get_message_and_type_from_id,
    get_message_and_type_from_name
}