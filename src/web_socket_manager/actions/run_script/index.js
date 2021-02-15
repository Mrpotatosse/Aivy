const path = require('path');

const replace_all = (input, toReplace, remplacement) => {
    return input.split(toReplace).join(remplacement);
};

const default_value_assignement = [
    { 
        name: '__SRC',
        value: `'${replace_all(path.join(__dirname, '../../../../'), '\\', '/')}'`
    }
]

const default_value_assignement_as_string = () => {
    return default_value_assignement.map(value => {
        return `${value.name} = ${value.value};`;
    }).join('\n');
}

const execute = (_, request) => {
    eval(default_value_assignement_as_string() + request.value);
};
module.exports = execute;