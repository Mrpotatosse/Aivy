import './header.css';

import HeaderContentJSON from './HeaderButtonContent.json';

import HeaderButtonContent from './HeaderButtonContent';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export default function Header({ Client }) {
    const ClientRef = useRef(Client);
    const [upperRoot, setUpperRoot] = useState(document.getElementById('upper-root'));
    const [moduleFromServer, setModuleFromServer] = useState([]);

    const parseModuleResult = useCallback(message => {
        const data = JSON.parse(message.data);
        if(data.result_type === 'module_result'){
            setModuleFromServer(data.value);
        }
    }, []);

    const sendModuleRequest = useCallback(_ => {
        ClientRef.current.send(JSON.stringify({
            action: 'module_request'
        }));
    }, []);

    useEffect(_ => {
        const currentClient = ClientRef.current;

        currentClient.addEventListener('message', parseModuleResult);
        if(currentClient.readyState === 1) sendModuleRequest();
        else currentClient.addEventListener('open', sendModuleRequest);

        return _ => {
            currentClient.removeEventListener('message', parseModuleResult);
            currentClient.removeEventListener('open', sendModuleRequest);
        };
    }, [sendModuleRequest, parseModuleResult]);

    useEffect(_ => {
        moduleFromServer.forEach(mod => {
            if(mod.autoinit){
                ClientRef.current.send(JSON.stringify({
                    action: 'execute_request',
                    value: mod.action
                }));
            }
        });
    }, [moduleFromServer]);

    const loadForm = useCallback(_ => {
        if(ClientRef.current.readyState !== 1) return;

        setUpperRoot(document.getElementById('upper-root'));

        upperRoot.classList.remove('d-none');

        ReactDOM.render(
            <React.StrictMode>
              <div className="App-header-upper-root-content">
                  <HeaderButtonContent
                  Client={ClientRef.current}
                  title="Aivy" 
                  content={[...HeaderContentJSON, ...moduleFromServer.sort((a, b) => a.id ? a.id - b.id : -1)]}></HeaderButtonContent>
              </div>
            </React.StrictMode>,
            upperRoot
        );
    }, [moduleFromServer, upperRoot]);

    const onUpperRootClicked = useCallback(event => {
        if(event.target.id === 'upper-root'){                
            upperRoot.classList.add('d-none');
        }
    }, [upperRoot]);

    useEffect(_ => {
        upperRoot.addEventListener('click', onUpperRootClicked);        

        return () => {
            upperRoot.removeEventListener('click', onUpperRootClicked);
        }
    }, [upperRoot, onUpperRootClicked]);

    return (<div className="App-header">
        <a className="App-header-text centered" href="#menu" onClick={loadForm}>
            <img className="App-header-img" alt="App-header-img-icon" src="http://www.aivy.ml/assets/diamond_icon.svg"></img>
                AIVY
        </a>
    </div>);
}