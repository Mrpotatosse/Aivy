import './header.css';

import Card from '../Card';
import { useCallback, useRef, useState } from 'react';

const getCardClass = toAdd => {
    return `App-header-btn-content${(toAdd ? ` ${toAdd}` : '')}`;
}

export default function HeaderButtonContent({Client, content, onClick, title}){
    const ClientRef = useRef(Client);
    const [fullContent] = useState(content);
    const [maximumPage] = useState(Math.max(0, Math.floor((fullContent.length - 1) / 9)));
    const [currentPage, setCurrentPage] = useState(0);
    const [cardContentClass, setCardContentClass] = useState(getCardClass(undefined));

    const mapContent = useCallback((Client, content, page) => {
        return content.slice(page * 9, (page * 9) + 9).map((value, index) => {
            return <div key={index} className={`bg-img-centered centered b${index + 1}`} onClick={event => {
                if(event.ctrlKey){
                    if(value.id){
                        const a = document.createElement('a');
                        a.href = '/editor';
                        a.click();

                        localStorage.setItem('App.editor.mode', '');
                        localStorage.setItem('App.editor.id', value.id ?? 0);
                        localStorage.setItem('App.editor.name', value.name ?? '');
                        localStorage.setItem('App.editor.icon', value.icon ?? '');
                        localStorage.setItem('App.editor.link', value.link ?? '');
                        localStorage.setItem('App.editor.code', value.action ?? '');
                    }
                    
                    return;
                }

                if(value.action){
                    Client.send(JSON.stringify({
                        action: 'execute_request',
                        value: value.action
                    }));
                }
    
                if(value.link){
                    window.location.href = value.link;
                }
            }}
            style={{
                background: (value.icon && value.icon !== '' ? `url(${value.icon}) center center / 6vh no-repeat` : 'transparent')
            }}><span>{value.name}</span></div>
        });
    }, []);

    const [mappedContent, setMappedContent] = useState(mapContent(ClientRef.current, fullContent, currentPage));

    const changePage = useCallback(newPage => {
        const target = document.getElementById('header-btn-content');
        target.onanimationend = _ => {
            const ntargetClassList = [...target.classList.values()];
            if(ntargetClassList.includes('App-header-btn-content-disapear')){
                setCardContentClass(getCardClass(`App-header-btn-content-apear`));
                setMappedContent(mapContent(ClientRef.current, fullContent, newPage));
            }              
        };

        setCardContentClass(getCardClass(`App-header-btn-content-disapear`));
        document.getElementById('page-selector').selectedIndex = newPage;
        setCurrentPage(c => newPage);
    }, [fullContent, mapContent]);

    const cardContent = (
        <div id="header-btn-content-wrapper" className="App-header-btn-content-wrapper full">
            <div id="header-btn-content" className={cardContentClass}>
                {mappedContent}
            </div>
        </div>
    );

    const pageSelector = maximumPage > 0 ? (
        <select id="page-selector" className="App-header-btn-content-page-selector bold" autoComplete="off" name="pages" onChange={event => {
            changePage(event.target.selectedIndex);
        }}>
            {[...Array(maximumPage + 1).keys()].map(x => (<option key={x}>{x + 1}</option>))}
        </select>
    ) : undefined;

    return (
        <Card
            height="50vh"
            width="calc(40vh + 5vmin)"
            title={<div>{`${title} `}{maximumPage === 0 ? 1 : pageSelector}{`/${maximumPage + 1}`}</div>}
            titleBackground="rgb(160 158 158)"
            onClick={onClick}
            text={cardContent}
        >
        </Card>
    );
}