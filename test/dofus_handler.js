const {add_handler, remove_handler, d2_handler_class} = require('./../src/dofus/messages/handlers/index');

class test_all extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    async handle(){
        console.log(this.message_informations);
    }
}

//add_handler('all', test_all);