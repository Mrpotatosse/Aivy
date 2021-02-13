/**
 * func decode metadata byteArray: 
 *  decode metadata.super byteArray if metadata.super_serialize
 *  write bools
 *  write props
 * 
 * func write bools:
 *  
 * func write props:
 * 
 * asy flemme de finir mais vous avez compris
 */ 
const {bbw_get_flag, bbw_set_flag} = require('../io/custom_stream_buffer');
const dofus_writer = require('../io/dofus_writer');
const {json_protocol_name} = require('../../../aivy_config.json');
const json_protocol = require(`../../../${json_protocol_name}`);

const dofus_messages = json_protocol.messages;
const dofus_types = json_protocol.types;
const dofus_messages_and_types = [...dofus_messages, ...dofus_types];

function encode_message(metadata, message){
    const result = new dofus_writer([]);

    // parse super
    if(metadata.super_serialize){
        const super_metadata = dofus_messages_and_types.filter(mt => mt.name === metadata.super).shift();
        result.writeBytes(encode_message(super_metadata, message).data());
    }

    // parse bool
    const bools = metadata.fields.filter(v => v.use_boolean_byte_wrapper).sort((a, b) => a.boolean_byte_wrapper_position - b.boolean_byte_wrapper_position);
    const flags = []
    bools.forEach(b => {
        const w_pos = b.boolean_byte_wrapper_position - 1;
        flags[b.position] = bbw_set_flag(flags[b.position], w_pos % 8, message[b.name]);
    });
    result.writeBytes(flags);
    // parse properties
    const properties = metadata.fields.filter(v => !v.use_boolean_byte_wrapper).sort((a, b) => a.position - b.position);
    properties.forEach(p => {
        function write_var(value){
            if(dofus_messages_and_types.filter(v => v.name === p.type).shift() === undefined){ // primitiv case
                result[p.write_method](value);
                return;
            }

            if(p.write_false_if_null_method){
                if(value === null || value === undefined){
                    result[p.write_false_if_null_method](0);
                    return;
                }
            }

            const type_metadata = dofus_types.filter(v => v.name === value.__name).shift();
            if(p.prefixed_by_type_id){ // object case
                result[p.write_type_id_method](type_metadata.protocolID);
            }
            result.writeBytes(encode_message(type_metadata, value).data());
        }

        // if array
        if(p.is_vector || p.type === 'ByteArray'){
            const l = p.constant_length ? p.constant_length : message[p.name].length;
            if(!p.constant_length){
                result[p.write_length_method](l);
            }
            if(p.type === 'ByteArray') result.writeBytes(message[p.name]);
            else message[p.name].forEach(el => write_var(el));
        }else{
            write_var(message[p.name]);
        }
    });

    return result;
}

function decode_data(metadata, data_reader){    
    let result = {
        __name: undefined,
        __protocol_id: undefined
    };

    // parse super
    if(metadata.super_serialize){
        const super_metadata = dofus_messages_and_types.filter(mt => mt.name === metadata.super).shift();

        result = {
            ...result, // this is useless x) but it's okay =D
            ...decode_data(super_metadata, data_reader)
        };
    }

    // parse bools
    const bools = metadata.fields.filter(v => v.use_boolean_byte_wrapper).sort((a, b) => a.boolean_byte_wrapper_position - b.boolean_byte_wrapper_position);
    let flag = 0;
    bools.forEach(b => {
        const w_pos = b.boolean_byte_wrapper_position - 1;
        if (w_pos % 8 === 0){
            flag = data_reader.readByte();
        }

        result[b.name] = bbw_get_flag(flag, w_pos % 8);
    });

    // parse properties
    const properties = metadata.fields.filter(v => !v.use_boolean_byte_wrapper).sort((a, b) => a.position - b.position);
    properties.forEach(p => {
        function read_var(){
            if(dofus_messages_and_types.filter(v => v.name === p.type).shift() === undefined){ // primitiv case
                return data_reader[p.write_method.replace('write', 'read')]();
            }
            
            if(p.write_false_if_null_method){
                if(data_reader[p.write_false_if_null_method.replace('write', 'read')]() === 0) return null;
            }

            if(p.prefixed_by_type_id){ // object case
                const protocol_id = data_reader[p.write_type_id_method.replace('write', 'read')]();
                return decode_data(dofus_types.filter(v => v.protocolID === protocol_id).shift(), data_reader);
            }
            return decode_data(dofus_types.filter(v => v.name === p.type).shift(), data_reader);;
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
        __name: metadata.name,
        __protocol_id: metadata.protocolID
    };
    return result;
}

module.exports = {
    encode: encode_message,
    decode: decode_data,

    json_protocol: json_protocol,
    d_messages: dofus_messages,
    d_types: dofus_types,
    d_messages_and_types: dofus_messages_and_types
}