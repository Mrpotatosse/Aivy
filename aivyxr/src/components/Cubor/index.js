import './cubor.css';
import Card from './../Card';
import { useRef } from 'react';

export default function Cubor({ Client }){
    const ClientRef = useRef(Client);

    return <div className="App-cubor full centered">
        <Card
            height="50vh"
            width="50vh"
            title="Cubor"
            text={'Cubor cubor'}
        ></Card>
    </div>;
}