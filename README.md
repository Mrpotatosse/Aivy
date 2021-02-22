# AivyCore JS

<p align="center">
  <img src="https://camo.githubusercontent.com/de3e9648ad06c6d749236ad24df6170fd599071f/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f456a5f5a656c65585941492d45514e3f666f726d61743d6a7067266e616d653d6d656469756d"/>
</p>

<h3 align="center"><strong>Aivy Core</strong></h3>

<p align="center">C'est gratuit ( et ça le restera toujours )</p>

MITM pour sniffer les données. ( Avec possibilité de modification ) 
```
 ______   _______  _______           _______ 
(  __  \ (  ___  )(  ____ \|\     /|(  ____ \
| (  \  )| (   ) || (    \/| )   ( || (    \/
| |   ) || |   | || (__    | |   | || (_____ 
| |   | || |   | ||  __)   | |   | |(_____  )
| |   ) || |   | || (      | |   | |      ) |
| (__/  )| (___) || )      | (___) |/\____) |
(______/ (_______)|/       (_______)\_______)
```

# Dependances

- frida (https://frida.re) + fritm script https://github.com/louisabraham/fritm/blob/master/fritm/script.js
- botofu parser (https://gitlab.com/botofu/protocol_parser)
- express (https://expressjs.com)
- ws (https://github.com/websockets/ws)
- node.js (https://nodejs.org/) UTILISEZ LA VERSION LTS
- ace editor (https://github.com/luvuong-le/code-editor-tutorial/tree/configuring-ace/lib/js/ace-editor/src-min)
- bootstrap (je suis trop claqué quand il s'agit de design, vous pourrez remarquez avec la déguaine de l'UI)

# Usage

- Télécharger le projet ou le cloner depuis git
- ``` node launch DOFUS_FOLDER ``` (exemple node launch D:/DOFUS) 

# Informations

- L'UI s'utilise via votre navigateur internet. Il suffit d'utiliser l'addresse renseigner dans la config (addresse http, par défault localhost:8000)
- L'UI n'est encore qu'un prototype
- Le projet n'est pas encore totalement fini, mais il est utilisable.
- Vous aurez plus d'informations un peu plus tard quand j'aurais moins la flemme d'écrire.

# Handlers 

```javascript
// import handler 
// /!\ MAKE SURE TO REQUIRE THE GOOD FOLDER /!\
const {dofus} = require('./index');
const {message_buffer, d2handler_class, add_handler, remove_handler} = dofus.messages;

class YourHandlerClass extends d2handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }

    handle(){
        console.log(this.message_informations.message_data_parsed);
    }

    // idk why i put it in endHandle but it's ok, it's the same thing
    endHandle(){
        // this two lines should show the same thing
        console.log(this.message_informations.message_metadata.name); 
        console.log(this.message_informations.message_data_parsed.__name); 
    
        // if you want the mitm to not send the original message set forward_original_message to false
        // this.forward_original_message = false;
        // don't use this if you want to modify a packet

        // if you want to modify a packet
        // get old message and replace the properties you want to modify
        const new_message = {
            ...this.message_informations.message_data_parsed,
            ...{             
                yourPropertyOne: true,
                yourPropertyTwo: 'allah akbar',
                yourObjectProperty: {
                    ...this.message_informations.message_data_parsed.yourObjectProperty,
                    yourPropertyThree: 666
                },
                yourArrayProperty:[
                    ...this.message_informations.message_data_parsed.yourArrayProperty.slice(0,1)
                    0: 'oklm-zer',
                    ...this.message_informations.message_data_parsed.yourArrayProperty.slice(2,5)
                ]
            }            
        }
        // parse the new message
        const data_blob = new message_buffer(this.message_informations.from_client).parse_message(new_message);
        // modifiy current packet
        this.new_packet = [...data_blob];
        // END PACKET MODIFICATION        

        // if you want to send a new message
        // define if your message if from client or not
        const from_client = true; /*TRUE if from client else FALSE*/
        // define your endpoint socket 
        // this.socket.remote = client connected to original server
        // this.socket = client connected to our MITM
        const send_socket = from_client ? this.socket.remote : this.socket; 
        // create your new message
        const your_new_message = {
            __name: 'YourMessageName',
            __instance_id: -1, // to do add a global instance id | this is REQUIRED IF FROM_CLIENT === TRUE
        }
        // parse the new message
        const your_new_message_data_blob = new message_buffer(from_client).parse_message(your_new_message);
        // send data
        send_socket.write(your_new_message_data_blob);     
        // END PACKET SENDING   
    }

    error(exception){
        console.log('Error handled from ' + this.message_informations.message_metadata.name);
        super.error(exception); // this is equals to console.log(exception);
    }
}

// to add/remove an handler
add_handler('YourMessageName', YourHandlerClass);
remove_handler('YourMessageName', YourHandlerClass); 

// example for protocol required
add_handler('ProtocolRequired', YourHandlerClass);
remove_handler('ProtocolRequired', YourHandlerClass);

// only 1 instance of each handler class is allowed
// this is useless
add_handler('ProtocolRequired', YourHandlerClass);
add_handler('ProtocolRequired', YourHandlerClass);

// an handler class can be used for different messages
add_handler('ProtocolRequired', YourHandlerClass);
add_handler('HelloConnectMessage', YourHandlerClass);

// add to all messages
add_handler('all', YourHandlerClass);
```