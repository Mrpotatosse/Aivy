if(!localStorage.getItem('selected')) localStorage.setItem('selected', '');
let selected = localStorage.getItem('selected');

const construct_grid_element = (options, element_classname, ...element_secondary_classname) => {
    const element = document.createElement('div');
    element.classList.add(element_classname, ...element_secondary_classname);
    element.id = element_classname;
    element.ondblclick = _ => {
        if(selected !== '') return;
        construct_grid(element_classname, options);
    };

    return element;
};

const construct_grid_kanji = (options) => {     
    const kanji = document.createElement('div');
    kanji.classList.add('kanji');

    const kanji_btn = document.createElement('div');
    kanji_btn.classList.add('kanji-button');
    kanji_btn.onclick = _ => {
        if(selected === '') return; 
        construct_grid('', options);
    }

    kanji.appendChild(kanji_btn);
    return kanji;
};

const construct_grid = (selected_class, options) => {
    selected = selected_class;
    localStorage.setItem('selected', selected);
    const root = document.getElementById('root');
    root.innerHTML = ''; // clear
    root.classList.remove('grid-container'); 
    root.classList.remove('grid-container-one');

    root.classList.add(`grid-container${selected_class === '' ? '' : '-one'}`);
    const kanji = construct_grid_kanji(options);
    if(selected_class === ''){
        root.appendChild(construct_grid_element(options, 'reading', 'mini'));
        if(options.reading) options.reading(true);
        root.appendChild(construct_grid_element(options, 'grade', 'mini'));
        if(options.grade) options.grade(true);
        root.appendChild(construct_grid_element(options, 'figures', 'mini'));
        if(options.figures) options.figures(true);
        root.appendChild(construct_grid_element(options, 'meanings', 'mini'));
        if(options.meanings) options.meanings(true);
        root.appendChild(construct_grid_element(options, 'vocabulary', 'mini'));
        if(options.vocabulary) options.vocabulary(true);
    }else{
        const alone = construct_grid_element(options, 'alone', 'maxi');
        alone.id = selected_class;
        root.appendChild(alone);
        
        if(options[selected_class]) {
            options[selected_class](false);
        }
    }

    root.appendChild(kanji);
};