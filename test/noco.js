const http = require('http');
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
                console.log(chunk);
                //const protocol_element = JSON.parse(chunk);                
                //callback(protocol_element);
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

get_message_by_url(`${purl}/decode.html`, message => {
    console.log(message);
});