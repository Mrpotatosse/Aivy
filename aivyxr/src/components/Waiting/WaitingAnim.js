import { useEffect, useState } from "react";

export default function WaitingAnim({ counterStart, totalSquareStart, animTimeoutMs }) {
    const [totalSquare] = useState(totalSquareStart ?? 10);
    const [counter, setCounter] = useState((counterStart ?? -1) % totalSquare);
    const [animTimeout] = useState(animTimeoutMs ?? 500);

    useEffect(_ => {
        const updater = setTimeout(() => setCounter((counter + 1) % totalSquare), animTimeout);

        return _ => {
            clearTimeout(updater);
        }
    }, [counter, totalSquare, animTimeout]);

    const currentSquares = [...Array(totalSquare).keys()].map((v) => {
        const current = v;

        let className = 'lil-square';
        if(current === counter){
            className += ' waiting-animated';
        }

        return (<div key={v} className={className}></div>);
    });

    return (<div className="App-waiting-anim">
        {currentSquares}
    </div>);
}