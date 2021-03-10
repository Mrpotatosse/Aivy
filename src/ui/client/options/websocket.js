const request = {
    action: 'options_request'
}

if(websocket.readyState === 1){
    websocket.send(JSON.stringify(request));
}else{
    websocket.addEventListener('open', _ => {
        websocket.send(JSON.stringify(request));
    });
}

const handler_func = (socket, request) => {    
    draw_options(request.options);
}

handlers['options_result'] = handler_func;