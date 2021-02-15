const editor_parent_id = 'reading';
if(!localStorage.getItem('js-code')) localStorage.setItem('js-code', '');
let js_code = localStorage.getItem('js-code');

const construct_editor_header = header => {
    const run = document.createElement('div');// btn
    run.classList.add('editor__header__button', 'centered');
    run.innerText = 'Run';
    run.onclick = _ => {
        let ws_client = new WebSocket('ws://localhost:5556');

        ws_client.addEventListener('open', _ => {
            ws_client.send(JSON.stringify({
                action: 'run_script',
                value: js_code
            }));

            ws_client.close();
        });
    };  

    const save = document.createElement('div');// btn
    save.classList.add('editor__header__button', 'centered');
    save.innerText = 'Save';
    save.onclick = _ => {
        /*let ws_client = new WebSocket('ws://localhost:5556');

        ws_client.addEventListener('open', _ => {
            ws_client.send(JSON.stringify({
                action: 'save_script',
                value: js_code,
                file_name: 'ui_script.js'
            }));

            ws_client.close();
        });*/
    };

    const imp = document.createElement('div');// btn
    imp.classList.add('editor__header__button', 'centered');
    imp.innerText = 'Import';

    const file_name = document.createElement('div');// txt input
    file_name.classList.add('editor__header__fname');

    header.appendChild(run);
    header.appendChild(save);
    header.appendChild(imp);
    header.appendChild(file_name);
}

const construct_editor_element = (editor_code_id, mini) => {
    const editor = document.createElement('div');
    editor.classList.add('editor');

    const editor_wrapper = document.createElement('div');
    editor_wrapper.classList.add('editor__wrapper');
    editor.appendChild(editor_wrapper);

    const editor_body = document.createElement('div');
    editor_body.classList.add('editor__body');
    editor_wrapper.appendChild(editor_body);

    const editor_header = document.createElement('div');
    editor_header.classList.add('editor__header');
    if(mini) editor_header.classList.add('hidden');
    else {
        editor_body.appendChild(editor_header);
        construct_editor_header(editor_header);
    }

    const editor__code = document.createElement('div');
    editor__code.classList.add('editor__code');
    editor__code.id = editor_code_id;
    editor_body.appendChild(editor__code);

    const reading = document.getElementById(editor_parent_id);
    if(reading === null || reading === undefined){
        console.log('no parent found with id : ', editor_parent_id);
        return;
    } 

    reading.appendChild(editor);
    ace.require('ace/ext/language_tools');
    const code_editor = ace.edit("editorCode", {
        theme: 'ace/theme/monokai',
        mode: 'ace/mode/javascript',
        showPrintMargin: false,
        value: js_code,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });

    code_editor.getSession().on('change', () => {
        js_code = code_editor.getValue();
        localStorage.setItem('js-code', js_code);
    });
}

const editor = mini => {    
    construct_editor_element('editorCode', mini);
}
