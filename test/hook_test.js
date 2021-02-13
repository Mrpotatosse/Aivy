const {spawn_and_hook} = require('../src/hook/index');
spawn_and_hook('D:\\ANKAMA_DOFUS\\Dofus.exe');

/***
 * 
 *  const axios = require('axios');
    if(message.type === 'send'){        
        try{
            const post_form = JSON.parse(message.payload);
            axios
            .post(`http://${hook_options.ip_send_host}:${hook_options.ip_send_port}${hook_options.ip_send_path}`, post_form)
            .catch(error => console.error(error));
        }catch(exception){
            console.error(exception);
        }
    }
 * 
 */