import './body.css';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Waiting from './../Waiting';
import Home from './../Home';
import Cubor from './../Cubor';
import Editor from './../Editor';
import Protocol from './../Protocol';
import ProtocolList from '../ProtocolList';
import Option from './../Option';
import Doc from './../Doc';

import Modules from './../Modules';

export default function Body({ Client }) {
    const ClientRef = useRef(Client);
    const [currentContent, setCurrentContent] = useState(<Waiting reason="Waiting ..."></Waiting>);

    const onClientOpened = useCallback(_ => {
        setCurrentContent(
            <BrowserRouter>
                <Switch>
                    <Route path="/option">
                        <Option Client={ClientRef.current}></Option>
                    </Route>
                    <Route path="/editor">
                        <Editor Client={ClientRef.current}></Editor>
                    </Route>
                    <Route path="/cubor">
                        <Cubor Client={ClientRef.current}></Cubor>
                    </Route>
                    <Route path="/home">
                        <Home></Home>
                    </Route>
                    <Route path="/index">
                        <Home></Home>                        
                    </Route>
                    <Route exact path="/">
                        <Home></Home>                        
                    </Route>    
                    <Route exact path="/modules">
                        {Object.keys(Modules).map(module => {
                            return (<div key={module} className="App-body-module-link centered">
                                <a className="full centered" href={`/modules/${module}`}>{module}</a>
                            </div>);
                        })}
                    </Route>              
                    <Route path="/modules/:id" render={
                        ({ match }) => {
                            const SelectedModule = Modules[match.params.id];
                            if(SelectedModule) return <SelectedModule Client={ClientRef.current}></SelectedModule>;
                            return <Waiting reason={`Module [${match.params.id}] not found`} failed={true} redirectOnFail="/modules"></Waiting>;
                        }
                    }></Route> 
                    <Route path="/protocol/:type/:id" render={
                        ({ match }) => {
                            return <Protocol Client={ClientRef.current} type={match.params.type} id={match.params.id}></Protocol>;
                        }
                    }></Route> 
                    <Route exact path="/protocol">
                        <ProtocolList Client={ClientRef.current}></ProtocolList>
                    </Route>
                    <Route exact path="/protocol/:type" render={
                        ({ match }) => {
                            return <ProtocolList Client={ClientRef.current} type={match.params.type}></ProtocolList>;
                        }
                    }>
                    </Route>
                    <Route path="/doc">
                        <Doc></Doc>
                    </Route>
                    {/* Laisser en dernier */}
                    <Route path="/">
                        <Waiting reason="Page not found" failed={true}></Waiting>                     
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }, []);

    const onClientError = useCallback(error => {
        console.error('client error event handled');
    }, []);

    const onClientClosed = useCallback(event => {
        setCurrentContent(<Waiting reason={`Server [${ClientRef.current.url}] not resolved (code: ${event.code})`} failed={true}></Waiting>);
    }, []);

    useEffect(() => {
        const currentClient = ClientRef.current;

        currentClient.addEventListener('open', onClientOpened);
        currentClient.addEventListener('error', onClientError);
        currentClient.addEventListener('close', onClientClosed);

        return () => {
            currentClient.removeEventListener('open', onClientOpened);
            currentClient.removeEventListener('error', onClientError);
            currentClient.removeEventListener('close', onClientClosed);
        }
    }, [onClientOpened, onClientError, onClientClosed]);

    return <div id="App-body" className="App-body">
        {currentContent}
    </div>;
}