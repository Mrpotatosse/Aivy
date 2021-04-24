import './protocol.css';

import { useCallback, useEffect, useRef } from 'react';
import Waiting from './../Waiting';

export default function Protocol({ Client, type, id }){
    const ClientRef = useRef(Client);

    const onMessageReceived = useCallback(message => {        
        const data = JSON.parse(message.data);
        if(data.result_type === 'protocol_result'){
            const txt = JSON.stringify(data.value, null, '\t')
                        .split('\n').join('</br>')
                        .split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;');

            const body = document.getElementById('App-body');
            body.classList.add('no-txt-font');
            body.innerHTML = txt;
        }
    }, []);
    console.log(type);
    const sendProtocolRequest = useCallback(_ => {        
        ClientRef.current.send(JSON.stringify({
            action: 'protocol_request',
            type, 
            id
        }));
    }, [type, id]);

    useEffect(_ => {
        const currentClient = ClientRef.current;

        currentClient.addEventListener('message', onMessageReceived);
        if(currentClient.readyState === 1) sendProtocolRequest();
        else currentClient.addEventListener('open', sendProtocolRequest);

        return _ => {
            currentClient.removeEventListener('message', onMessageReceived);
            currentClient.removeEventListener('open', sendProtocolRequest);
        }
    }, [onMessageReceived, sendProtocolRequest]);

    return <Waiting reason="Protocol not found ..." failed={true} redirectOnFail="/protocol"></Waiting>;
}