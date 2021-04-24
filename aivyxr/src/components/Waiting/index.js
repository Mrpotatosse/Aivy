import './waiting.css';

import WaitingAnim from './WaitingAnim';

export default function Waiting({ reason, failed = false, redirectOnFail = '/' }) {
    const reasonStyle = failed ? {
        background: 'rgb(255 0 0 / 48%)',
        borderRadius: '5px',
        border: '2px solid rgb(216 0 0)',
        padding: '5px'
    } : {
        background: 'rgb(8 0 0 / 48%)',
        borderRadius: '5px',
        border: '2px solid rgb(0 0 0)',
        padding: '5px'
    };

    const reasonDiv = failed ? (
        <div className="App-waiting-reason-failed centered" style={reasonStyle}>
            <a href={redirectOnFail}><span>{reason}</span></a>
        </div>
    ) : (
        <div style={reasonStyle} className="centered">
            <span>{reason}</span>
        </div>
    );

    return <div className="App-waiting centered">
        <div>
            <div className="centered" style={{
                height: '10vh'
            }}>
                <WaitingAnim></WaitingAnim>
            </div>
            {reasonDiv}
        </div>
    </div>;
}