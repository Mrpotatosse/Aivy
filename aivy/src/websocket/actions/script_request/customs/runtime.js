console.log('[RUNTIME]');

Array.from(global.mitm_server.clients.values()).forEach(cl => {
    if(cl.get_current_instance_id() > 0){
       global.send_dofus_data(cl, true, {
           __name: 'ChatClientMultiMessage',
           channel: 0,
           content: 'Vive les femmes \' yes'
       });
    } 
});
