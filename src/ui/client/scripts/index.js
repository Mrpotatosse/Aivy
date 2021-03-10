const new_module_header = '/**MODULE_INFORMATIONS\nname=\nautor=\nEND**/\n';

if(!localStorage.getItem('js-code-stored')) localStorage.setItem('js-code-stored', `${new_module_header}/* Vive les femmes */\n`);

let code_editor = undefined;

const init_editor = editor_id => {
    ace.require('ace/ext/language_tools');
    code_editor = ace.edit(editor_id, {
        theme: 'ace/theme/monokai',
        mode: 'ace/mode/javascript',
        showPrintMargin: false,
        value: localStorage.getItem('js-code-stored'),
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });

    code_editor.getSession().on('change', () => {
        localStorage.setItem('js-code-stored', code_editor.getValue());
    });
}

const run = _ => {
    const request = {
        action: 'execute_request',
        value: code_editor.getSession().getValue()
    };

    if(websocket.readyState === 1){
        websocket.send(JSON.stringify(request));
    }else{
        websocket.addEventListener('open', _ => {
            websocket.send(JSON.stringify(request));
        });
    }
}

const save = _ => {
    save_file(code_editor.getSession().getValue());
}

const load = _ => {
    read_file(content => code_editor.getSession().setValue(content));
}

const clearcode = _ => {
    code_editor.getSession().setValue(`${new_module_header}/* Vive les femmes */\n`);
}

const addmodule = _ => {
    let current_value = code_editor.getSession().getValue();
    const module_info_start = '/**MODULE_INFORMATIONS\n';
    const module_info_end = '\nEND**/\n';
    if(!current_value.startsWith(module_info_start)){
        code_editor.getSession().setValue(`${new_module_header}${current_value}`);
    }

    current_value = code_editor.getSession().getValue(); 

    const m_start = current_value.lastIndexOf(module_info_start);
    const m_end = current_value.lastIndexOf(module_info_end);

    const info_string = current_value.substring(m_start + module_info_start.length, m_end);

    const info_string_splitted = info_string.split('\n');

    const info_obj = {};
    info_string_splitted.forEach(info_str => {
        const info_str_sp = info_str.split('=');
        if(info_str_sp.length == 2){
            info_obj[info_str_sp[0]] = info_str_sp[1];
        }
    });

    info_obj['code'] = current_value;
    
    const request = {
        action: 'modules_request',
        request: 'add',
        value: info_obj
    };

    if(request.value.name && request.value.name !== ''){
        if(websocket.readyState === 1){
            websocket.send(JSON.stringify(request));
        }else{
            websocket.addEventListener('open', _ => {
                websocket.send(JSON.stringify(request));
            });
        }
        websocket.send(JSON.stringify({
            action: 'options_request'
        }));
    }else{
        alert('invalid script name');
    }
    
}

const save_file = content => {
    const blob = new Blob([content], {type: 'text/javascript'});

    const a = document.createElement('a');
    a.download = `aivy_script_${new Date().getTime()}.js`;
    a.href = URL.createObjectURL(blob);
    a.click();
}

const read_file = callback => {
    const input = document.getElementById('open_file');

    input.onchange = event => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.readAsText(file, 'utf-8');

        reader.onload = reader_event => {
            const content = reader_event.target.result;

            callback(content);
        }
    }

    input.click();
}