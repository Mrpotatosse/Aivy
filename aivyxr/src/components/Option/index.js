import './option.css';

import { useCallback, useEffect, useRef, useState } from "react";

export default function Option({ Client }) {
    const ClientRef = useRef(Client);

    const [currentOption, setCurrentOption] = useState({});
    const [currentOptionHtml, setCurrentOptionHtml] = useState(<div></div>);

    const mapOptionElement = useCallback((key, value) => {
        if (value === true || value === false) {
            return (
                <div className="centered">
                    <span>{`${key}`} <span className="bold">{value ? 'On' : 'Off'}</span></span>
                    <label className="switch App-option-input">
                        <input type="checkbox" onChange={event => {
                            ClientRef.current.send(JSON.stringify({
                                action: 'option_request/update',
                                name: key,
                                value: event.target.checked
                            }));
                        }} checked={value}></input>
                        <span className="slider round"></span>
                    </label>
                </div>
            );
        }

        if (Array.isArray(value)) {
            return (
                <div className="centered">
                    <span>{`${key}`}</span>
                    <select value={value.findIndex((v => v.startsWith(':')))} className="App-script-editor-header-button App-option-input" style={{ width: '12vh' }} onChange={event => {
                        ClientRef.current.send(JSON.stringify({
                            action: 'option_request/update',
                            name: key,
                            value: value.map((v,i) => {
                                return `${event.target.selectedIndex === i ? ':' : ''}${v.replace(':', '')}`;
                            })
                        }));
                    }}>
                        {value.map((v, i) => {
                            return <option key={v + '_' + i} value={`${i}`}>{v.replace(':', '')}</option>;
                        })}
                    </select>
                </div>
            );
        }

        return <div>??</div>
    }, []);

    const mapOption = useCallback(option => {
        const keys = Object.keys(option);

        return keys.map(key => {
            return <div className="centered App-option-container" key={key}>{mapOptionElement(key, option[key])}</div>;
        });
    }, [mapOptionElement]);

    const onOptionReceived = useCallback(message => {
        const data = JSON.parse(message.data);
        if (data.result_type === 'option_result') {
            setCurrentOption(data.value);
        }
    }, []);

    const sendOptionRequest = useCallback(_ => {
        ClientRef.current.send(JSON.stringify({
            action: 'option_request'
        }));
    }, []);

    useEffect(_ => {
        setCurrentOptionHtml(mapOption(currentOption));
    }, [currentOption, mapOption]);

    useEffect(_ => {
        const currentClient = ClientRef.current;

        currentClient.addEventListener('message', onOptionReceived);
        if (currentClient.readyState === 1) sendOptionRequest();
        else currentClient.addEventListener('open', sendOptionRequest);

        return _ => {
            currentClient.removeEventListener('message', onOptionReceived);
            currentClient.removeEventListener('open', sendOptionRequest);
        };
    }, [onOptionReceived, sendOptionRequest]);

    return <div>
        {currentOptionHtml}
    </div>;
}