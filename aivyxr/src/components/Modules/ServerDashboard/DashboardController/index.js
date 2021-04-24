import { useCallback, useEffect, useRef, useState } from 'react';
import './dashboardController.css';

export default function DashboardController({Client}){
    const ClientRef = useRef(Client);
    const [isEnabled, setIsEnabled] = useState(false);
    const [serverPort, setServerPort] = useState(7778);

    const onEnable = useCallback(event => {
        setIsEnabled(event.target.checked);

        if(event.target.checked){
            ClientRef.current.send(JSON.stringify({
                action: 'execute_request',
                value: `global.mitm_server.start(${serverPort});`
            }));
        }else{
            ClientRef.current.send(JSON.stringify({
                action: 'execute_request',
                value: `global.mitm_server.stop();`
            }));
        }
    }, [serverPort]);

    const onPort = useCallback(event => {
        const value = parseInt(event.target.value);
        
        event.target.value = event.target.value ? `${isNaN(value) ? '' : value}`.substr(0, 5) : '';

        setServerPort(isNaN(value) ? 0 : value);
    }, []);

    const onStatusReceived = useCallback(message => {
        const data = JSON.parse(message.data);
        if(data.result_type === 'status_result'){
            setIsEnabled(data.value.mitm);
        }
    }, []);

    const sendStatusRequest = useCallback(_ => {
        ClientRef.current.send(JSON.stringify({
            action: 'status_request'
        }));
    }, []);

    useEffect(_ => {        
        const currentClient = ClientRef.current;

        currentClient.addEventListener('message', onStatusReceived);
        if(currentClient.readyState === 1) sendStatusRequest();
        else currentClient.addEventListener('open', sendStatusRequest);

        return _ => {
            currentClient.removeEventListener('message', onStatusReceived);
            currentClient.removeEventListener('open', sendStatusRequest);
        }
    }, [onStatusReceived, sendStatusRequest]);
    
    return (
    <div className="App-modules-dashboard-controller centered">
        <div className="centered">
            <label className="switch">
                <input type="checkbox" onChange={onEnable} checked={isEnabled ?? false}></input>
                <span className="slider round"></span>
            </label>
            <span id="enable-txt">{`Server ${isEnabled ? 'On' : 'Off'}`}</span>
        </div>
        <div className="centered">
            <input className="App-modules-dashboard-controller-input" type="text" onChange={onPort} defaultValue={serverPort} disabled={isEnabled}></input>
            <span>Server Port</span>
        </div>
    </div>);
}