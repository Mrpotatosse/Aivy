import { useCallback, useEffect, useRef, useState } from 'react';
import './editor.css';

const __BLANK__ = '__blank__';

export default function EditorHeader({Client, onRun, onSave, onClear, setScript}){
    const ClientRef = useRef(Client);
    const [scripts, setScripts] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(0);

    const sendScriptsRequest = useCallback(_ => {
        ClientRef.current.send(JSON.stringify({
            action: 'script_request'
        }));
    }, []);

    const parseScriptsResult = useCallback(message => {
        const data = JSON.parse(message.data);
        if(data.result_type === 'script_result'){
            setScripts(data.value);
        }
    }, []);

    const setScriptEditor = useCallback(event => {
        const target = event.target;    
        setCurrentSelected(target.selectedIndex);
        
        onClear();
        if(target.selectedIndex > 0){
            const script = scripts[target.selectedIndex - 1];

            localStorage.setItem('App.editor.mode', 'file_save');
            localStorage.setItem('App.editor.name', script.name);
            localStorage.setItem('App.editor.code', script.value);
            
            setScript(script.value);
        }        
    }, [onClear, scripts, setScript, setCurrentSelected]);

    useEffect(_ => {
        const currentClient = ClientRef.current;

        currentClient.addEventListener('message', parseScriptsResult);
        if(currentClient.readyState === 1) sendScriptsRequest();
        else currentClient.addEventListener('open', sendScriptsRequest);

        return _ => {
            currentClient.removeEventListener('message', parseScriptsResult);
            currentClient.removeEventListener('open', sendScriptsRequest);
        }
    }, [parseScriptsResult, sendScriptsRequest]);

    useEffect(_ => {
        setCurrentSelected(scripts.findIndex(s => s.name === localStorage.getItem('App.editor.name')) + 1);
    }, [scripts]);

    return (
    <div className="App-script-editor-header">
        <a href="#run" className="App-script-editor-header-button centered" onClick={onRun}>Run</a>
        <a href="#save" className="App-script-editor-header-button centered" onClick={onSave}>Save</a>
        <a href="#clear" className="App-script-editor-header-button centered" onClick={_ => {
            onClear();
            document.getElementById('script-selector').selectedIndex = 0;
        }}>Clear</a>  
        <select id="script-selector" value={currentSelected} className="App-script-editor-header-button" style={{width: '25vh'}} onChange={setScriptEditor}>
            <option value={0}>{__BLANK__}</option>
            {scripts.map((value, index) => {
                return <option key={value.name + '_' + index} value={index + 1}>{value.name}</option>;
            })}
        </select>      
    </div>);
}