const {
    get_message_from_id,
    get_message_from_name,

    get_type_from_id,
    get_type_from_name,

    get_message_and_type_from_id,
    get_message_and_type_from_name
} = require('./../protocol/index');

const { wrapper_get_flag, wrapper_set_flag } = require('./../../io/index');

const encode = (message, data_writer) => {
    try{
        const metadata = get_message_from_name(message.__name);
        return {
            id: metadata.protocolID,
            data: encode_message(message, metadata, data_writer)
        }
    }catch{
        return Buffer.from([]);
    }
}

const encode_message = (message, message_metadata, data_writer) => {
    if(message_metadata.super_serialize){
        const super_metadata = get_message_and_type_from_name(message_metadata.super).shift();
        data_writer.writeBytes(encode_message(message, super_metadata, data_writer));
    }

    // parse bool
    const bools = message_metadata.fields.filter(v => v.use_boolean_byte_wrapper).sort((a, b) => a.boolean_byte_wrapper_position - b.boolean_byte_wrapper_position);
    const flags = [];
    for (let bit = 0; bit < bools.length; bit++) {
        const b = bools[bit];
        const w_pos = b.boolean_byte_wrapper_position - 1;
        flags[b.position] = wrapper_set_flag(flags[b.position], w_pos % 8, message[b.name]);
    };
    data_writer.writeBytes(flags);

    // parse properties
    const properties = message_metadata.fields.filter(v => !v.use_boolean_byte_wrapper).sort((a, b) => a.position - b.position);
    for (let pit = 0; pit < properties.length; pit++) {
        const p = properties[pit];
        const prop_metadata = get_message_and_type_from_name(p.type).shift(); 
        function write_var(value){
            if(!prop_metadata){ // primitiv case
                data_writer[p.write_method](value);
                return;
            }

            if(p.write_false_if_null_method){
                if(value === null || value === undefined){
                    data_writer[p.write_false_if_null_method](0);
                    return;
                }
            }

            if(p.prefixed_by_type_id){ // object case
                const type_metadata = get_type_from_name(value.__name);
                data_writer[p.write_type_id_method](type_metadata.protocolID);
            }
            data_writer.writeBytes(encode_message(value, prop_metadata, data_writer));
        }

        // if array
        if(p.is_vector || p.type === 'ByteArray'){
            const l = p.constant_length ? p.constant_length : message[p.name].length;
            if(!p.constant_length){
                data_writer[p.write_length_method](l);
            }
            if(p.type === 'ByteArray') data_writer.writeBytes(message[p.name]);
            else message[p.name].forEach(el => write_var(el));
        }else{
            write_var(message[p.name]);
        }
    };

    return data_writer.data();
}

const decode = (message_id, data_reader) => {
    try {
        const metadata = get_message_from_id(message_id);
        if (metadata) return decode_data(metadata, data_reader);
        return { __protocol_id: message_id };
    } catch {
        return { __protocol_id: message_id }
    }
}

const decode_data = (message_metadata, data_reader) => {
    let result = {
        __name: undefined,
        __protocol_id: undefined
    };

    // parse super
    if (message_metadata.super_serialize) {
        const super_metadata = get_message_and_type_from_name(message_metadata.super).shift();

        result = {
            ...decode_data(super_metadata, data_reader)
        };
    }

    // parse bools
    const bools = message_metadata.fields.filter(v => v.use_boolean_byte_wrapper).sort((a, b) => a.boolean_byte_wrapper_position - b.boolean_byte_wrapper_position);
    let flag = 0;
    for (let bit = 0; bit < bools.length; bit++) {
        const b = bools[bit];
        const w_pos = b.boolean_byte_wrapper_position - 1;
        if (w_pos % 8 === 0) {
            flag = data_reader.readByte();
        }

        result[b.name] = wrapper_get_flag(flag, w_pos % 8);
    }

    // parse properties
    const properties = message_metadata.fields.filter(v => !v.use_boolean_byte_wrapper).sort((a, b) => a.position - b.position);
    for (let pit = 0; pit < properties.length; pit++) {
        const p = properties[pit];
        const prop_metadata = get_message_and_type_from_name(p.type).shift();
        function read_var() {
            if (!prop_metadata) { // primitiv case
                return data_reader[p.write_method.replace('write', 'read')]();
            }

            if (p.write_false_if_null_method) {
                if (data_reader[p.write_false_if_null_method.replace('write', 'read')]() === 0) return null;
            }

            if (p.prefixed_by_type_id) { // object case
                const protocol_id = data_reader[p.write_type_id_method.replace('write', 'read')]();
                return decode_data(get_type_from_id(protocol_id), data_reader);
            }
            return decode_data(prop_metadata, data_reader);
        }

        // if array
        if (p.is_vector || p.type === 'ByteArray') {
            const l = p.constant_length ? p.constant_length : data_reader[p.write_length_method.replace('write', 'read')]();
            if (p.type === 'ByteArray') {
                result[p.name] = data_reader.readBytes(l);
            } else {
                result[p.name] = [];
                for (let it = 0; it < l; it++) {
                    result[p.name][it] = read_var();
                }
            }
        } else {
            result[p.name] = read_var();
        }
    }

    result = {
        ...result,
        __name: message_metadata.name,
        __protocol_id: message_metadata.protocolID
    };
    return result;
}

module.exports = {
    encode,
    decode
}