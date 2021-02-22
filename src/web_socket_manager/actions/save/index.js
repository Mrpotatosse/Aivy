const path = require('path');
const fs = require('fs');

const execute = (_, request) => {
    const script_folder_location = path.join(__dirname, './../../../../saved_scripts');
    const script_file_location = path.join(script_folder_location, request.filename);
    const script_file_parent_name = path.dirname(script_file_location);

    fs.promises.mkdir(script_file_parent_name, {recursive: true}).then(x => {
        fs.promises.writeFile(script_file_location, request.value);
    });
};

module.exports = execute;