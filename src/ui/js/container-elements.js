/**
 * Web socket client
 * 
 * 
 * 
 * 
 */
const ws_client = new WebSocket('ws://localhost:5556');
let code_editor;
if(!localStorage.getItem('js-code')) localStorage.setItem('js-code', '/* Vive les Femmes */');
if(!localStorage.getItem('js-code-save')) localStorage.setItem('js-code-save', '');
if(!localStorage.getItem('js-code-load')) localStorage.setItem('js-code-load', '');

const message_handler = (message, client) => {
    const data = JSON.parse(message.data);
    // to do
    console.log(data);
    switch(data.result_type){
        case 'info_result': 
            const bot_data = data.result_data;            
            if(localStorage.getItem('selected') === 'bot'){
                const div = clear_waiting();
                if(bot_data.length > 0){
                    const parent = document.createElement('div');
                    parent.classList.add('container-fluid');

                    const ul = document.createElement('ul');
                    ul.classList.add('nav', 'nav-fill', 'flex-column');

                    const childs = bot_data.map(x => {
                        const selected = x.dofus_informations.selected_character;

                        const li = document.createElement('li');
                        li.classList.add('nav-item');
                        const card = document.createElement('div');
                        card.classList.add('card', 'alert', 'alert-dark', 'w-100', 'mb-2');
                
                        const card_body = document.createElement('div');
                        card_body.classList.add('card-body');
                
                        const card_title = document.createElement('h5');
                        card_title.classList.add('card-title');
                        card_title.innerText = `Character : ${selected.name} Lv.${selected.level} - (${x.process_id})`;
                
                        const card_btn = document.createElement('div');
                        card_btn.classList.add('btn','btn-dark');
                        card_btn.innerText = 'Informations';
                        card_btn.onclick = _ => {
                            alert('information requested');
                        };
                
                        card_body.appendChild(card_title);
                        card_body.appendChild(card_btn);
                
                        card.appendChild(card_body);
                        li.appendChild(card);
                        return li;
                    });
                    
                    childs.forEach(child => ul.appendChild(child));
                    parent.appendChild(ul);
                    div.appendChild(parent);
                }
                else {
                    div.classList.add('align-items-center');
                    const spinner = document.getElementById('spinner');
                    spinner.classList.remove('d-none');                    
                }
            }
            break;
        case 'load_result': 
            const code_loaded = data.result_data; 
            code_editor.setValue(code_loaded);
            break;
    }
}

ws_client.addEventListener('open', _ => {
    ws_client.addEventListener('message', message => message_handler(message, ws_client));
    ws_client.addEventListener('close', _ => console.log('client closed'));
    ws_client.addEventListener('error', error => console.error(error));
});

/**
 * CONTAINER
 * 
 * 
 * 
 * 
 */

const clear_waiting = _ => {
    const div = document.getElementById('waiting-div');
    div.classList.remove('align-items-center');
    const spinner = document.getElementById('spinner');
    spinner.classList.add('d-none');
    div.innerHTML = '';
    div.appendChild(spinner);
    return div;
}

const map_array_to_card = arr => {
    return arr.map(element => {
        const card = document.createElement('div');
        card.classList.add('card', 'alert', 'alert-dark', 'w-100', 'mb-2');

        const card_body = document.createElement('div');
        card_body.classList.add('card-body');

        const card_title = document.createElement('h5');
        card_title.classList.add('card-title');
        card_title.innerText = element.title;

        const card_btn = document.createElement('div');
        card_btn.classList.add('btn','btn-dark');
        card_btn.innerText = element.button_txt;
        card_btn.onclick = element.onclick;

        card_body.appendChild(card_title);
        card_body.appendChild(card_btn);

        card.appendChild(card_body);

        return card;
    });
}

const load_aivy = _ => {    
    const div = clear_waiting();
    localStorage.setItem('selected', 'aivy');

    const parent = document.createElement('div');
    parent.classList.add('container-fluid');

    const childs = map_array_to_card([
    {
        title: 'open game',
        button_txt: 'game',
        onclick: _ => {
            ws_client.send(JSON.stringify({
                action: 'run_script',
                value: 'const {getRunner} = require(`${__SRC}runner`);\ngetRunner()["run_instance"]();'
            }));
        }
    },
    {
        title: 'open config',
        button_txt: 'config'
    },
    {
        title: 'open news',
        button_txt: 'news'
    },
    {
        title: 'open logs',
        button_txt: 'logs'
    },
    {
        title: 'add shortcuts',
        button_txt: 'add'
    }]);

    childs.forEach(child => parent.appendChild(child));

    div.appendChild(parent);
};

const load_bot = _ => {
    const div = clear_waiting();

    div.classList.add('align-items-center');
    const spinner = document.getElementById('spinner');
    spinner.classList.remove('d-none');

    localStorage.setItem('selected', 'bot');
    
    if(ws_client.readyState === 1){
        ws_client.send(JSON.stringify({
            action: 'info_request'
        }));
    }else{
        ws_client.onopen = _ => {
            ws_client.send(JSON.stringify({
                action: 'info_request'
            }));
        }
    }
};

const create_editor = editor_id => {
    const editor = document.createElement('div');
    editor.classList.add('editor');

    const editor_wrapper = document.createElement('div');
    editor_wrapper.classList.add('editor__wrapper');
    editor.appendChild(editor_wrapper);

    const editor_body = document.createElement('div');
    editor_body.classList.add('editor__body');
    editor_wrapper.appendChild(editor_body);

    const editor__code = document.createElement('div');
    editor__code.classList.add('editor__code');
    editor__code.id = editor_id;
    editor_body.appendChild(editor__code);

    return editor;
}

const load_script = _ => {
    const div = clear_waiting();
    localStorage.setItem('selected', 'script');

    const parent = document.createElement('div');
    parent.classList.add('container-fluid');

    const card = document.createElement('div');
    card.classList.add('card', 'alert', 'alert-dark', 'w-100');

    const card_body = document.createElement('div');
    card_body.classList.add('card-body');

    const card_title = document.createElement('h5');
    card_title.classList.add('card-title');
    card_title.innerText = 'script';

    const card_btn_run = document.createElement('div');
    card_btn_run.classList.add('btn','btn-dark', 'mx-1');
    card_btn_run.innerText = 'run';
    card_btn_run.onclick = _ => {
        ws_client.send(JSON.stringify({
            action: 'run_script',
            value: localStorage.getItem('js-code')
        }));
    }

    const card_btn_save = document.createElement('div');
    card_btn_save.classList.add('btn','btn-dark', 'mx-1');
    card_btn_save.innerText = 'save';
    card_btn_save.onclick = _ => {
        const input_save_name = document.getElementById('card-btn-save-name');
        input_save_name.classList.remove('is-invalid', 'is-valid');
        const save_name = input_save_name.value;
        if(save_name && save_name.split('.').pop() === 'js'){
            input_save_name.classList.add('is-valid');

            ws_client.send(JSON.stringify({
                action: 'save',
                value: localStorage.getItem('js-code'),
                filename: save_name
            }));
            localStorage.setItem('js-code-save', save_name);
        }else{
            input_save_name.classList.add('is-invalid');
        }
    }

    const card_btn_save_name = document.createElement('input');
    card_btn_save_name.id = 'card-btn-save-name'
    card_btn_save_name.classList.add('form-control', 'btn', 'btn-dark', 'mx-1', 'd-inline', 'w-25');
    card_btn_save_name.type = 'text';
    card_btn_save_name.value = localStorage.getItem('js-code-save');

    const card_btn_load = document.createElement('div');
    card_btn_load.classList.add('btn', 'btn-dark', 'mx-1');
    card_btn_load.innerText = 'load';
    card_btn_load.onclick = _ => {
        const input_load_name = document.getElementById('card-btn-load-name');
        input_load_name.classList.remove('is-invalid', 'is-valid');
        const load_name = input_load_name.value;
        if(load_name && load_name.split('.').pop() === 'js'){
            input_load_name.classList.add('is-valid');

            ws_client.send(JSON.stringify({
                action: 'load',
                value: load_name
            }));
            localStorage.setItem('js-code-load', load_name);
        }else{
            input_load_name.classList.add('is-invalid');
        }
    }

    const card_btn_load_name = document.createElement('input');
    card_btn_load_name.id = 'card-btn-load-name'
    card_btn_load_name.classList.add('form-control', 'btn', 'btn-dark', 'mx-1', 'd-inline', 'w-25');
    card_btn_load_name.type = 'text';
    card_btn_load_name.value = localStorage.getItem('js-code-load');

    card_body.appendChild(card_title);
    card_body.appendChild(card_btn_run);
    card_body.appendChild(card_btn_save);
    card_body.appendChild(card_btn_save_name);
    card_body.appendChild(card_btn_load);
    card_body.appendChild(card_btn_load_name);

    card.appendChild(card_body);

    parent.appendChild(card);

    const editor = create_editor('code-editor');

    parent.appendChild(editor);
    div.appendChild(parent);
    
    ace.require('ace/ext/language_tools');
    code_editor = ace.edit('code-editor', {
        theme: 'ace/theme/monokai',
        mode: 'ace/mode/javascript',
        showPrintMargin: false,
        value: localStorage.getItem('js-code'),
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });    
    code_editor.getSession().on('change', () => {
        localStorage.setItem('js-code', code_editor.getValue());
    });
};

const loader = {
    aivy: load_aivy,
    bot: load_bot,
    script: load_script
};
