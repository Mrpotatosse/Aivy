//import React, { useCallback, useEffect, useState } from 'react';
import { render } from 'react-dom';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';

import './editor.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import useKeyPress from './../../controllers/useCases/useKeyPress';
import EditorHeader from './EditorHeader';

export default function Editor({ Client, hasHeader=true, value=undefined }){
    const ClientRef = useRef(Client);

    const [currentCode, setCurrentCode] = useState(value ?? localStorage.getItem('App.editor.code'));

    const ctrlPressed = useKeyPress('Control');

    const sPressed = useKeyPress('s'); // save
    const ePressed = useKeyPress('e'); // execute

    const setEditor = useCallback(_ => {
        render(
            <AceEditor
                onChange={newValue => localStorage.setItem('App.editor.code', newValue)}
                mode="javascript"
                theme="xcode"
                name="App-ace-editor"
                value={currentCode}
                setOptions={{
                    useWorker: false,
                    enableBasicAutocompletion: true,
                    showLineNumbers: true,
                    highlightActiveLine: true,
                    printMargin: false,
                    enableLiveAutocompletion: true
                }}
                width="100%"
                height="82vh"
                useSoftTabs={true}
                tabSize={4}
            />,
            document.getElementById('App-script-editor-code')
        );
    }, [currentCode]);

    /*const parseScriptResult = useCallback(message => {
        const data = JSON.parse(message.data);
        if(data.result_type === 'script_result'){
            for(let code in data.value){
                if(code.name === localStorage.getItem('App.editor.name')){
                    setCurrentCode(code.value);
                    break;
                }
            }
            setEditor();
        }
    }, []);*/

    const sendScriptRequest = useCallback(_ => {
        ClientRef.current.send(JSON.stringify({
            action: 'script_request'
        }));
    }, []);

    const saveScript = useCallback(_ => {
        switch(localStorage.getItem('App.editor.mode')){
            default: 
                const mod = {
                    action: 'module_request/add',
                    value: {
                        id: parseInt(localStorage.getItem('App.editor.id')),
                        name: localStorage.getItem('App.editor.name'),
                        icon: localStorage.getItem('App.editor.icon')
                    }
                }
                
                if(localStorage.getItem('App.editor.link') !== '') mod.value.link = localStorage.getItem('App.editor.link');
                if(localStorage.getItem('App.editor.code') !== '') mod.value.action = localStorage.getItem('App.editor.code');
        
                ClientRef.current.send(JSON.stringify(mod));
                break;
            case 'file_save': 
                const name = localStorage.getItem('App.editor.name');
                const scr = {
                    action: 'script_request/add',
                    location: name === '' ? `no_name_${new Date().getTime()}.js` : name,
                    value: localStorage.getItem('App.editor.code')
                }

                ClientRef.current.send(JSON.stringify(scr));
                break;
        }
    }, []);

    const executeScript = useCallback(_ => {
        ClientRef.current.send(JSON.stringify({
            action: 'execute_request',
            value: localStorage.getItem('App.editor.code')
        }));
    }, []);

    const clearScript = useCallback(_ => {
        setCurrentCode('');
        setEditor();

        localStorage.setItem('App.editor.id', 0);
        localStorage.setItem('App.editor.name', '');
        localStorage.setItem('App.editor.icon', '');
        localStorage.setItem('App.editor.link', '');
        localStorage.setItem('App.editor.code', '');
    }, [setCurrentCode, setEditor]);
    
    useEffect(_ => {    
        const currentClient = ClientRef.current;
        
        //currentClient.addEventListener('message', parseScriptResult);
        currentClient.addEventListener('open', sendScriptRequest);

        return _ => {
            //currentClient.removeEventListener('message', parseScriptResult);
            currentClient.removeEventListener('open', sendScriptRequest);
        };
    });

    useEffect(setEditor, [setEditor]);

    useEffect(_ => {
        if(ctrlPressed){
            if(sPressed) {
                saveScript();
            }

            if(ePressed){
                executeScript();
            }
        }
    }, [ctrlPressed, sPressed, ePressed, saveScript, executeScript]);

    return (
        <div className="App-script-editor full">
            <div className="App-script-editor-header">
                {hasHeader ? <EditorHeader Client={ClientRef.current} onRun={executeScript} onSave={saveScript} onClear={clearScript} setScript={code => {
                    setCurrentCode(code);
                    setEditor();
                }}></EditorHeader> : undefined}
            </div>
            <div id="App-script-editor-code" className="App-script-editor-code full"></div>
        </div>
    );
}