import './card.css';

export default function Card({ width, height, background, backgroundXPos, backgroundYPos, title, titleBackground, titleIcon, subtitle, text, onClick }){
    const modifiableStyle = {
        width: width ?? "100%",
        height: height ?? 75,
        background: 'transparent'
    };
    
    const textStyle = {
        background: background ?? '#ffffff',            
        backgroundSize: 'cover',
        backgroundPositionY: backgroundYPos ?? 0,
        backgroundPositionX: backgroundXPos ?? 0
    }

    const titleImg = <img alt="App-card-title-icon-img" className="App-card-title-icon" src={titleIcon}></img>;

    return (
        <div className={`App-card${subtitle ? ' App-card-template-with-subtitle' : ''}${onClick ? ' App-card-clickable': ''}`} style={modifiableStyle} onClick={onClick}>
            <div className="App-card-title" style={{backgroundColor: titleBackground}}>
                {titleIcon ? titleImg : undefined}
                <span className="App-card-title-text centered">{title ?? 'Untitled'}</span>                
            </div>
            {subtitle ? <div className="App-card-subtitle centered">{subtitle}</div> : undefined}            
            <div className="App-card-text" style={textStyle}>{text}</div>
        </div>
    );
}