const { get_message_by_id, get_message_by_name,
        get_type_by_id, get_type_by_name,
        get_messages_and_types_by_id, get_messages_and_types_by_name } = require('./../protocol/dofus_protocol');
const { wrapper_get_flag, wrapper_set_flag } = require('./../../io/index');

const encode = (message, data_writer) => {
    const metadata = get_message_by_name(message.__name);
    const data_stream = encode_message(message, metadata, data_writer);
    return {
        metadata,
        data_stream
    };
}

const encode_message = (message, message_metadata, data_writer) => {
    // parse super
    if(message_metadata.super_serialize){
        const super_metadata = get_messages_and_types_by_name(message_metadata.super).shift();
        data_writer.writeBytes(encode_message(message, super_metadata, data_writer));
    }

    // parse bool
    const bools = message_metadata.fields.filter(v => v.use_boolean_byte_wrapper).sort((a, b) => a.boolean_byte_wrapper_position - b.boolean_byte_wrapper_position);
    const flags = [];
    bools.forEach(b => {
        const w_pos = b.boolean_byte_wrapper_position - 1;
        flags[b.position] = wrapper_set_flag(flags[b.position], w_pos % 8, message[b.name]);
    });
    data_writer.writeBytes(flags);

    // parse properties
    const properties = message_metadata.fields.filter(v => !v.use_boolean_byte_wrapper).sort((a, b) => a.position - b.position);
    properties.forEach(p => {
        function write_var(value){
            const prop_metadata = get_messages_and_types_by_name(p.type).shift(); 

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

            //const type_metadata = get_type_by_name(value.__name);//dofus_types.filter(v => v.name === value.__name).shift();
            if(p.prefixed_by_type_id){ // object case
                const type_metadata = get_type_by_name(value.__name);
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
    });

    return data_writer.data();
}

const decode = (message_id, data_reader) => {
    const metadata = get_message_by_id(message_id);
    return metadata ? decode_data(metadata, data_reader) : {
        __name: undefined,
        __protocol_id: message_id
    };
}

const decode_data = (message_metadata, data_reader) => {
    let result = {
        __name: undefined,
        __protocol_id: undefined
    }

    // parse super
    if(message_metadata.super_serialize){
        const super_metadata = get_messages_and_types_by_name(message_metadata.super).shift();

        result = {
            ...decode_data(super_metadata, data_reader)
        };
    }

    // parse bools
    const bools = message_metadata.fields.filter(v => v.use_boolean_byte_wrapper).sort((a, b) => a.boolean_byte_wrapper_position - b.boolean_byte_wrapper_position);
    let flag = 0;
    bools.forEach(b => {
        const w_pos = b.boolean_byte_wrapper_position - 1;
        if (w_pos % 8 === 0){
            flag = data_reader.readByte();
        }

        result[b.name] = wrapper_get_flag(flag, w_pos % 8);
    });

    // parse properties
    const properties = message_metadata.fields.filter(v => !v.use_boolean_byte_wrapper).sort((a, b) => a.position - b.position);
    properties.forEach(p => {
        function read_var(){
            const prop_metadata = get_messages_and_types_by_name(p.type).shift(); 

            if(!prop_metadata){ //dofus_messages_and_types.filter(v => v.name === p.type).shift() === undefined// primitiv case
                return data_reader[p.write_method.replace('write', 'read')]();
            }
            
            if(p.write_false_if_null_method){
                if(data_reader[p.write_false_if_null_method.replace('write', 'read')]() === 0) return null;
            }

            if(p.prefixed_by_type_id){ // object case
                const protocol_id = data_reader[p.write_type_id_method.replace('write', 'read')]();
                return decode_data(get_type_by_id(protocol_id), data_reader); /*dofus_types.filter(v => v.protocolID === protocol_id).shift()*/
            }
            return decode_data(prop_metadata, data_reader);
        }

        // if array
        if(p.is_vector || p.type === 'ByteArray'){
            const l = p.constant_length ? p.constant_length : data_reader[p.write_length_method.replace('write', 'read')]();
            result[p.name] = p.type === 'ByteArray' ? data_reader.readBytes(l) : (l === 0 ? [] : [...Array(l).keys()].map(_ => read_var()));
        }else{
            result[p.name] = read_var();
        }
    });  

    result = {
        ...result,
        __name: message_metadata.name,
        __protocol_id: message_metadata.protocolID
    };
    return result;
}

module.exports = {
    decode,
    encode
}