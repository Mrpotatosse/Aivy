/*const http = require('http');
const path = require('path');

const purl = 'http://localhost:8080/protocol'
const pmurl = `${purl}/messages`;
const pturl = `${purl}/types`;

const get_message_by_url = (url, callback) => {
    const url_info = new URL(url);

    const http_options = {
        hostname: url_info.hostname,
        port: url_info.port,
        path: url_info.pathname,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const request = http.request(http_options, result => {
        let chunk = '';
        
        result.on('data', data => {            
            chunk += data.toString();
        });

        result.on('end', _ => {
            if(chunk.startsWith('redirect:')){
                const id = url_info.pathname.split('/').pop();
                const name = chunk.split(':/')[1];                
                
                get_message_by_url(url_info.href.replace(id, `${name}`), callback);
            }else{
                try{
                    const protocol_element = JSON.parse(chunk);                
                    callback(protocol_element);
                }catch{

                }
            }
        });
    });

    request.end();
}

const get_message_by_name = (url, message_name, callback) => {
    get_message_by_url(`${url}/${message_name}.json`, callback);
}

const get_message_by_id = (url, message_id, callback) => {
    get_message_by_url(`${url}/${message_id}`, callback);
}

for(let i = 0;i<10000;i++){
    get_message_by_name(pmurl, 'ProtocolRequired', message => {
        delete message;
    });
}

console.log('end protocoul');*/

/**
 * const http = require('http');

const get_message_by_url = (url, callback) => {
    const url_info = new URL(url);

    const http_options = {
        hostname: url_info.hostname,
        port: url_info.port,
        path: url_info.pathname,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const request = http.request(http_options, result => {
        let chunk = '';
        
        result.on('data', data => {            
            chunk += data.toString();
        });

        result.on('end', _ => {
            if(chunk.startsWith('redirect:')){
                const id = url_info.pathname.split('/').pop();
                const name = chunk.split(':/')[1];                
                
                get_message_by_url(url_info.href.replace(id, `${name}`), callback);
            }else{
                try{
                    const protocol_element = JSON.parse(chunk);                
                    callback(protocol_element);
                }catch(error){
                    console.error(error);
                }
            }
        });
    });

    request.end();
}

const get_message_by_name = (url, message_name, callback) => {
    get_message_by_url(`${url}/${message_name}.json`, callback);
}

const get_message_by_id = (url, message_id, callback) => {
    get_message_by_url(`${url}/${message_id}`, callback);
}

const get_multi_messages_by_name = (url, message_types, message_name, callback) => {
    message_types.forEach(message_type => {
        get_message_by_url(`${url}/${message_type}/${message_name}.json`, callback);
    });
}

const get_multi_messages_by_id = (url, message_types, message_name, callback) => {
    message_types.forEach(message_type => {
        get_message_by_url(`${url}/${message_type}/${message_name}`, callback);
    });
}
 */

/*const fs = require('fs');
const path = require('path');

const read_file = path => {
    const buffer = fs.readFileSync(path, {encoding: 'utf-8'});
    return JSON.parse(buffer.toString());
}

for(let i = 0;i<10000;i++){
    const obj = read_file(path.join(__dirname, './../src/ui/client/protocol/messages/ProtocolRequired.json'));
    
}*/

const path = require('path');
const {init_dofus_protocol, get_protocol_elements_by_id} = require('../src/dofus/messages/protocol');

const protocol_folder_path = path.join(__dirname, './../src/ui/client/protocol');
const protocol_name = 'updated';
const protocol_types = [
    {
        name: 'messages',
        ids_list_name: 'MessageIds.json'
    },
    {
        name: 'types',
        ids_list_name: 'TypeIds.json'
    }
];

init_dofus_protocol(protocol_folder_path, protocol_name, protocol_types);

console.log(get_protocol_elements_by_id(protocol_folder_path, protocol_name, protocol_types.map(x => x.name), 6660));