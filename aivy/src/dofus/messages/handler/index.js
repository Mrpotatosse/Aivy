const handlers_manager = {
    all: [],
    client: [],
    server: []
};

const active_handler_class = async (socket, handler_class, message_informations) => {
    const instancied_class = new handler_class(message_informations, socket);
    try{
        await instancied_class.handle().then(async _ => {
            await instancied_class.endHandle();
        });
    }catch(error){
        instancied_class.error(error);
    }
}

const active_handler = async (socket, handler_name, message_informations) => {
    if(handlers_manager[handler_name]){
        handlers_manager[handler_name].forEach(async handler_class => {
            await active_handler_class(socket, handler_class, message_informations);
        });
    }
}

const dofus_message_handler = async (socket, message_informations) => {
    if(message_informations.message_data_parsed.__name){
        try{
            await active_handler(socket, 'all', message_informations);
            await active_handler(socket, message_informations.from_client ? 'client' : 'server', message_informations);
            await active_handler(socket, message_informations.message_data_parsed.__name, message_informations);
        }catch(error){
            console.error(error);
        }
    }
}

const add_handler = (handler_name, handler_class) => {
    remove_handler(handler_name, handler_class);
    if(!handlers_manager[handler_name]) handlers_manager[handler_name] = [];
    handlers_manager[handler_name].push(handler_class);
}

const remove_handler = (handler_name, handler_class, classname_check=false) => {
    if(handlers_manager[handler_name]){
        const instance = new handler_class(undefined, undefined);        
        handlers_manager[handler_name] = handlers_manager[handler_name].filter(handler_c => {
            const cmp_instance = new handler_c(undefined, undefined);
            return classname_check ? instance.constructor.name !== cmp_instance.constructor.name : handler_class !== handler_c;
        });
    }
}

class d2_handler_class{
    constructor(message_informations, socket){
        this.message_informations = message_informations;
        this.socket = socket;
    }

    async handle(){

    }

    async endHandle(){

    }
    
    error(exception) {
        console.error(exception);
    }
}

module.exports = {
    dofus_message_handler,

    d2_handler_class,
    add_handler,
    remove_handler
};