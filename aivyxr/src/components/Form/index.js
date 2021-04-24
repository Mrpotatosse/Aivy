import './form.css';

import Card from './../Card';

export default function Form({content, onClick, title}){
    const contentMapped = content.map((value, i) => {
        return (<div key={i} className="App-form-element">
            <span className="App-form-text">{value.name}</span>
            <input className="App-form-input centered" type={value.type}></input>
        </div>);
    });

    return (
        <Card
            height="50vh"
            width="calc(40vh + 5vmin)"
            title={title}
            text={contentMapped}
            titleBackground="#616161b3"
            onClick={onClick}
        >
        </Card>
    );
}