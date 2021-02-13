/***
 * THIS WAS ONLY FOR TEST
 * 
 * 
 * 
 */

let all_ips_redirected = []

const get_ip_information = () => {
    return all_ips_redirected.shift();
};

const set_ip_information = (information) => {
    all_ips_redirected.push(information);
};

module.exports = {
    get_ip_information: get_ip_information,
    set_ip_information: set_ip_information
}