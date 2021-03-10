let websocket = new WebSocket('ws://localhost:4443');

const parse_message = (ws, message) => {
    handle_json_data(ws, JSON.parse(message.data));
}

const handle_json_data = (ws, data) => {
    if (handlers[data.result_type]) {
        handlers[data.result_type](ws, data);
    }
}

const handlers = {};

websocket.addEventListener('open', _ => {
    websocket.addEventListener('message', message => parse_message(websocket, message));
    websocket.addEventListener('close', _ => console.log('websocket client closed'));
    websocket.addEventListener('error', error => console.error(error));

    websocket.send(JSON.stringify({
        action: 'options_request'
    }));

    websocket.send(JSON.stringify({
        action: 'modules_request',
        request: 'list'
    }));

    if(document.getElementById('fast-players')){
        websocket.send(JSON.stringify({
            action: 'players_request'
        }));
    }
});

const active_menu = _ => {
    const menu = document.getElementById('menu');

    menu.classList.remove('d-none');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.addEventListener('animationend', _ => {
            if (menu.classList.contains('hidden')) menu.classList.add('d-none');
        });
        menu.classList.add('hidden');
    }
}

const draw_fast_icons = icons => {
    const container = document.getElementById('fast-icons');

    if (container) {
        container.innerHTML = '';

        const icons_nodes = icons.map(icon => {
            const fast_icon_container = document.createElement('div');
            fast_icon_container.classList.add('fast-icon-container', 'animated');

            const fast_icon = document.createElement(icon.option === 'true' ? 'div' : 'a');
            fast_icon.classList.add('fast-icon', 'center');
            if(icon.option === 'true'){
                fast_icon.classList.remove('fast-icon');
                fast_icon.classList.add('fast-icon-unselectable');
            }else{
                fast_icon.onclick = _ => {
                    websocket.send(JSON.stringify({
                        action: 'execute_request',
                        value: icon.code
                    }));
                }
            }

            const fast_icon_src = document.createElement('img');
            fast_icon_src.src = icon.img_src;

            fast_icon.appendChild(fast_icon_src);

            const fast_icon_txt = document.createElement('a');
            fast_icon_txt.classList.add('fast-icon-txt');
            fast_icon_txt.innerText = `${icon.name}${(icon.autor ? ` - ${icon.autor}` : '')}`;
            fast_icon_txt.href = 'http://localhost:8080/scripts/index.html';
            fast_icon_txt.onclick = _ => {
                localStorage.setItem('js-code-stored', icon.code);
            }

            const fast_icon_rmv = document.createElement('a');
            fast_icon_rmv.classList.add('fast-icon-rmv', 'center');
            fast_icon_rmv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x full" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>'
            fast_icon_rmv.onclick = _ => {
                websocket.send(JSON.stringify({
                    action: 'modules_request',
                    request: 'remove',
                    value: icon.name
                }));
            }

            fast_icon_container.appendChild(fast_icon);
            fast_icon_container.appendChild(fast_icon_txt);
            fast_icon_container.appendChild(fast_icon_rmv);

            return fast_icon_container;
        });

        icons_nodes.forEach(n => {
            container.appendChild(n);
        });
    }
}

const draw_fast_players = (players) => {
    const container = document.getElementById('fast-players');

    if (container) {
        container.innerHTML = '';

        const player_nodes = players.map(player => {
            const fast_icon_container = document.createElement('div');
            fast_icon_container.classList.add('fast-icon-container', 'animated');

            const fast_icon = document.createElement('a');
            fast_icon.classList.add('fast-icon', 'fast-icon-round', 'center');
            fast_icon.href = `/characters/index.html?id=${player.name}_${player.id}`;
            /*if(icon.option === "true"){
                fast_icon.classList.remove('fast-icon');
                fast_icon.classList.add('fast-icon-unselectable');
            }
            fast_icon.href = '#';
            fast_icon.onclick = _ => {
                websocket.send(JSON.stringify({
                    action: 'execute_request',
                    value: icon.code
                }));
            }*/

            const fast_icon_src = document.createElement('img');
            fast_icon_src.classList.add('full', 'img-round');
            fast_icon_src.src = `http://aivy.ml/assets/mini_${player.breed}_${player.sex ? 1 : 0}.png`;

            fast_icon.appendChild(fast_icon_src);

            const fast_icon_txt = document.createElement('a');
            fast_icon_txt.classList.add('fast-icon-txt');
            fast_icon_txt.innerText = `${player.name} Lv.${player.level} (${player.id})`;
            fast_icon_txt.href = `/characters/index.html?id=${player.name}_${player.id}`;

            const fast_icon_rmv = document.createElement('a');
            fast_icon_rmv.classList.add('fast-icon-rmv', 'center');
            fast_icon_rmv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x full" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>'
            fast_icon_rmv.onclick = _ => {
                /*websocket.send(JSON.stringify({
                    action: 'modules_request',
                    request: 'remove',
                    value: icon.name
                }));*/
            }

            fast_icon_container.appendChild(fast_icon);
            fast_icon_container.appendChild(fast_icon_txt);
            fast_icon_container.appendChild(fast_icon_rmv);

            return fast_icon_container;
        });

        player_nodes.forEach(player => {
            container.appendChild(player);
        });
    }
}

handlers['logs_result'] = (socket, request) => {
    console.log(request.obj);
}

handlers['modules_result'] = (socket, request) => {
    if (request.modules) draw_fast_icons(request.modules);
}

handlers['players_result'] = (socket, request) => {
    if(request.value) draw_fast_players(request.value);
}