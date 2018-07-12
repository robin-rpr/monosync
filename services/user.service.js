const CONFIG = require('../config');

const queryString = require('querystring');

/* START:Service */
const httpService = require('./http.service');
/* END:Service */

/***
 * Adds a new editor to the target hotlist
 * @param {String} email_address
 * @param {any} mono_session_key
 * @returns {Promise<void>}
 */
addEditor = (email_address, mono_session_key) => {

    const options = {
        // TODO: Create URI builder to avoid long arguments
        uri: `${(CONFIG.monorail.ssl?'https://':'http://')+CONFIG.monorail.host}/u/${CONFIG.monorail.account.id}/hotlists/${CONFIG.monorail.sync.hotlist.target}/people.do`,
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en-GB;q=0.9,en;q=0.8,en-AU;q=0.7',
            'cache-control': 'max-age=0',
            'content-length': '137',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': '_ga=' + config.sync.account.auth.cookie._ga + '; _gid=' + config.sync.account.auth.cookie._gid + '; SACSID=' + config.sync.account.auth.cookie.SACSID,
            'origin': 'null'
        }
    };

    const payload = queryString.stringify({
        token: mono_session_key,
        changeowners: '',
        becomeeditor: 'on',
        addmembers: email_address,
        role: 'editor',
        addbtn: 'Save changes'
    }).replace('%20', '+'); // Fix %20

    return new Promise((resolve, reject) => {
        httpService.post(options, payload)
            .then(body => resolve(body))
            .catch(err => reject(err));
    });

};

module.exports = {
      addEditor: addEditor
};