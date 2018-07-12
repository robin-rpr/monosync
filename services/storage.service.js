const CONFIG = require('../config');

const writeStorage = new require('node-localstorage');
const readStorage = new require('node-localstorage');

/***
 * Write data to LocalStorage
 * @param file_key
 * @param storage_key
 * @param storage_content
 * @param stringify_content
 * @returns {Promise<Boolean>}
 */
writeData = (file_key, storage_key, storage_content, stringify_content) => {
    return new Promise((resolve, reject) => {
        writeStorage
            .LocalStorage('../tmp/'+file_key);

        writeStorage.setItem(storage_key, (stringify_content?JSON.stringify(storage_content):storage_content))
            .then(resolve(true))
            .catch(err => {
                console.error(err);
                reject(false);
            })
    });
};

/***
 * Read data from LocalStorage
 * @param file_key
 * @param storage_key
 * @param parse_content
 * @returns {Promise<String>}
 */
readData = (file_key, storage_key, parse_content) => {
    return new Promise(async (resolve, reject) => {
        readStorage
            .LocalStorage('../tmp'+file_key);

        const content = readStorage.getItem(storage_key)
            .catch(err => {
                reject(err);
            });

        resolve(parse_content?JSON.parse(await content):content);
    });
};

module.exports = {
    writeData: writeData,
    readData: readData
};