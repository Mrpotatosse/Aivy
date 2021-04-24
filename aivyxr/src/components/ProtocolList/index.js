import { useCallback, useEffect, useRef, useState } from "react";

export default function ProtocolList({ Client, type=undefined }){
    const ClientRef = useRef(Client);

    const [requestedType] = useState(type);
    const [currentList, setCurrentList] = useState({});

    const sendListRequest = useCallback(_ => {      
        ClientRef.current.send(JSON.stringify({
            action: 'protocol_request/list',
            type: type
        }));
    }, [type]);

    const onListResult = useCallback(message => {
        const data = JSON.parse(message.data);
        if(data.result_type === 'protocol_result'){
            setCurrentList(data.list);
        }
    }, []);

    useEffect(_ => {
        const currentClient = ClientRef.current;

        currentClient.addEventListener('message', onListResult);
        if(currentClient.readyState === 1) sendListRequest();
        else currentClient.addEventListener('open', sendListRequest);

        return _ => {
            currentClient.removeEventListener('message', onListResult);
            currentClient.removeEventListener('open', sendListRequest);
        }
    }, [sendListRequest, onListResult]);

    if(!requestedType){
        return ['type', 'message'].map(module => {
            return (<div key={module} className="App-body-module-link centered">
                <a className="full centered" href={`/protocol/${module}`}>{module}</a>
            </div>);
        })
    }

    return <div>
        <div key={module} className="App-body-module-link centered">
            <a className="full centered" href={`/protocol/`}>Back</a>
        </div>
        {Object.keys(currentList).sort((a, b) => currentList[a].localeCompare(currentList[b])).map(module => {
            return (<div key={module} className="App-body-module-link centered">
                <a className="full centered" href={`/protocol/${requestedType}/${currentList[module]}`} target="_blank" rel="noreferrer">{currentList[module]} ({module})</a>
            </div>);
        })
    }</div>;
}