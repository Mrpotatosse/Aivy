import './App.css';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import { useCallback, useState, useEffect } from 'react';

let _client_ = new WebSocket('ws://localhost:5556');

function App() {
  const [currentClient, setCurrentClient] = useState(_client_);
  const [reloadState, setReloadState] = useState(false);

  const reconnectOnClose = useCallback(event => {
    if (event.code !== 1000) {
      setCurrentClient(new WebSocket(currentClient.url));
      setReloadState(true);
      console.error(`RECONNECTING TO ${currentClient.url} . . .`);
    }
  }, [currentClient.url]);

  const refreshOnOpen = useCallback(event => {
    if (reloadState) window.location.reload();

    currentClient.send(JSON.stringify({
      action: 'option_request'
    }));
  }, [reloadState, currentClient]);

  const onConsoleShow = useCallback(message => {
    const data = JSON.parse(message.data);
    if (data.result_type === 'console_show') {
      console.log(data.value);
    }
    if (data.result_type === 'alert_show') {
      alert(data.value);
    }
  }, []);

  useEffect(() => {
    currentClient.addEventListener('close', reconnectOnClose);
    currentClient.addEventListener('open', refreshOnOpen);
    currentClient.addEventListener('message', onConsoleShow);

    return () => {
      currentClient.removeEventListener('close', reconnectOnClose);
      currentClient.removeEventListener('open', refreshOnOpen);
      currentClient.removeEventListener('message', onConsoleShow);
    }
  }, [currentClient, reconnectOnClose, refreshOnOpen, onConsoleShow]);

  return (
    <div className="App">
      <Header Client={currentClient}></Header>
      <Body Client={currentClient}></Body>
      <Footer></Footer>
    </div>
  );
}

export default App;
