const handler_manager = {
    all: [],
    client: [],
    server: []
}

const add_handler = (message_name, handler_class) => {
    // only one handler of the same class
    remove_handler(message_name, handler_class);

    if(handler_manager[message_name] === undefined) 
    { 
        handler_manager[message_name] = [];
    }

    handler_manager[message_name] = [...handler_manager[message_name], handler_class];
    console.log('message', message_name, 'handlers count', handler_manager[message_name].length);
};

/**
 * use classname_check if you add_handler from a script outside the project
 */
const remove_handler = (message_name, handler_class, classname_check=false) => {
    if(handler_manager[message_name]){
        handler_manager[message_name] = handler_manager[message_name].filter(handler_c => {
            return classname_check ? handler_class.constructor.name !== handler_c.constructor.name : handler_class !== handler_c;
        });
    }
};

class d2handler_class {
    /**  
     * @param {Object} message_informations
     * {
     *   from_client: Boolean,
     *   header: Number,
     *   static_header: Number,
     *   id: Number,
     *   instance_id: Number,
     *   data_length: Number,
     *   header_data_blob: ByteArray
     *   message_data_blob: ByteArray,
     *   message_data_parsed: Object,
     *   message_metadata: Object
     * } 
     * @param {Socket} socket 
     */
    constructor(message_informations, socket){
        this.message_informations = message_informations;
        this.socket = socket;

        this.forward_original_message = true;
        this.new_packet = undefined;        
    }

    newPacket(){
        return this.new_packet;
    }

    forwardOriginal(){
        return this.forward_original_message;
    }
    
    handle(){
        console.log('default handle class - handle');
    }

    endHandle(){
        console.log('default handle class - endHandle');
    }

    error(exception){
        console.log(exception);
    }
}

class show_name_log extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
    
    handle(){
        console.log(this.message_informations.message_metadata.name);
    }

    endHandle(){}
}

class show_content_log extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
    
    handle(){
        console.log(this.message_informations.message_data_parsed);
    }

    endHandle(){}
}

class show_full_log extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
    
    handle(){
        console.log(this.message_informations);
    }

    endHandle(){}
}

const handle_msg = (handler_array, msg, socket) => {
    let forward_original = true;
    handler_array.forEach(handler => {
        const instance_handler = new handler(msg, socket);
        try{
            instance_handler.handle();  
            instance_handler.endHandle();          
            
            forward_original = forward_original && instance_handler.forwardOriginal();
            // all handler cannot modified packet data due to obvious reason
        }
        catch(exception){
            instance_handler.error(exception);
        }
    });
    return forward_original;
}

const dofus_message_handler = (msgs_rcvd, socket) => {
    let new_data = [];
    msgs_rcvd.forEach(msg => {
        const msg_name = msg.message_metadata.name;
        let forward_original = true;
        let msg_data = [...msg.new_header_data_blob, ...msg.message_data_blob];

        if(handler_manager[msg_name]){
            handler_manager[msg_name].forEach(handler => {
                const instance_handler = new handler(msg, socket);
                try{
                    instance_handler.handle();  
                    instance_handler.endHandle();         

                    forward_original = forward_original && instance_handler.forwardOriginal();
                    const new_packet = instance_handler.newPacket();
                    msg_data = new_packet ? new_packet : msg_data;
                }
                catch(exception){
                    instance_handler.error(exception);
                }
            });
        }
        
        forward_original = forward_original && handle_msg(handler_manager.all, msg, socket);
        /*handler_manager.all.forEach(handler => {
            const instance_handler = new handler(msg, socket);
            try{
                instance_handler.handle();  
                instance_handler.endHandle();          
                
                forward_original = forward_original && instance_handler.forwardOriginal();
                // all handler cannot modified packet data due to obvious reason
            }
            catch(exception){
                instance_handler.error(exception);
            }
        });*/

        forward_original = forward_original && handle_msg(msg.from_client ? handler_manager.client : handler_manager.server, msg, socket);

        if(forward_original){
            new_data = [...new_data, ...msg_data];
        }
    });

    return Buffer.from(new_data);
}

module.exports = {
    dofus_message_handler: dofus_message_handler,

    add_handler: add_handler,
    remove_handler: remove_handler,

    d2handler_class: d2handler_class,

    show_name_log: show_name_log,
    show_content_log: show_content_log,
    show_full_log: show_full_log
}