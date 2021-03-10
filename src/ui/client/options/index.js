const draw_options = options => {
    const parent = document.getElementById('options');

    parent.innerHTML = '';

    options.forEach(option => {
        parent.appendChild(create_switch_container(option));
    });
}

const create_splitter = option => {
    const splitter = document.createElement('div');
    
    const splitter_left = document.createElement('div');
    splitter_left.classList.add('splitter');
    
    const splitter_right = document.createElement('div');
    splitter_right.classList.add('splitter');

    const splitter_text = document.createElement('span');
    splitter_text.classList.add('center', 'splitter-text');
    splitter_text.innerText = option.text;
    splitter_text.classList.add('options-link');

    splitter.appendChild(splitter_left);
    splitter.appendChild(splitter_text);
    splitter.appendChild(splitter_right);

    return splitter;
}

const create_switch_container = option => {
    if(option.splitter){
        return create_splitter(option);
    }

    const switch_container = document.createElement('div');
    switch_container.classList.add('switch-container');

    const switch_label = document.createElement('label');
    switch_label.classList.add('switch');

    const switch_input = document.createElement('input');
    switch_input.type = 'checkbox';
    switch_input.checked = option.checked;
    switch_input.onchange = _ => { 
        const request = {
            action: 'options_request',
            change: {
                name: option.text,
                checked: switch_input.checked
            }
        };

        if(websocket.readyState === 1){
            websocket.send(JSON.stringify(request));
        }else{
            websocket.addEventListener('open', _ => {
                websocket.send(JSON.stringify(request));
            });
        }
    };   

    const switch_span = document.createElement('span');
    switch_span.classList.add('slider', 'round');

    switch_label.appendChild(switch_input);
    switch_label.appendChild(switch_span);

    const switch_text = document.createElement('a');
    switch_text.href = option.href;
    switch_text.innerText = option.text;
    switch_text.classList.add('options-link');

    switch_container.appendChild(switch_label);
    switch_container.appendChild(switch_text);

    return switch_container;
}