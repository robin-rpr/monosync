const CONFIG = require('../config');
const OPENID_CONFIG = require('../openid-config');

const { google } = require('googleapis');
const { JSDOM } = require("jsdom");
const queryString = require('querystring');

/* START:Service */
const httpService = require('./http.service');
const hotlistService = require('./hotlist.service');
const hookService = require('./hook.service');
/* END:Service */

/***
 * Generates OAuth2.0 URL with Node Google API
 * @returns {string}
 */
getOAuthUrl = () => {

    const oauth2Client = new google.auth.OAuth2(
        CONFIG.monorail.google_oauth2.client_id,
        CONFIG.monorail.google_oauth2.client_secret,
        `${(CONFIG.api.ssl?'https://':'http://')+CONFIG.api.host+CONFIG.api.port}/auth/oauth2/authorization/redirect/`
    );

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [CONFIG.monorail.google_oauth2.scope]
    });

};

/***
 * Check Access privileges
 * @param api_secret
 * @returns {boolean}
 */
validateApiSecret = (api_secret) => {
    try { return (api_secret === CONFIG.api.secret); }
    catch { return false }
};

/***
 * Exchange OAuth2.0 code with token
 * @param oauth_code
 * @returns {Promise<any>}
 */
exchangeOAuthCodeWithToken = (oauth_code) => {

    const options = {
        uri: OPENID_CONFIG.token_endpoint,
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    };

    const payload = queryString.stringify({
        code: oauth_code,
        redirect_uri: `${(CONFIG.api.ssl?'https://':'http://')+CONFIG.api.host+CONFIG.api.port}/auth/oauth2/authorization/redirect/`,
        client_id: CONFIG.monorail.google_oauth2.client_id,
        client_secret: CONFIG.monorail.google_oauth2.client_secret,
        scope: '', // Must be empty
        grant_type: 'authorization_code',
        prompt: 'consent'
    });

    return new Promise((resolve, reject) => {
        httpService.post(options, payload)
            .then(body => resolve(body))
            .catch(err => reject(err));
    });

};

/***
 * Fetches SessionKey from an specific Path
 * @param {String} path
 * @param {String} parse
 * @returns {Promise<any>}
 */
getMonoSessionKey = (uri, parse) => {

    const options = {
        uri: uri,
        method: 'GET',
        headers: {
            cookie: `SACSID=${'XXX'}` // TODO: Handle by OAuth2.0 Token
        }
    };

    return new Promise((resolve, reject) => {

        httpService.get(options)
            .then(doc => {
                if(parse === "dom") { // Obtain token via DOM query
                    const dom = new JSDOM(doc);
                    resolve(dom.window.document.querySelectorAll('[name="token"]')["0"].defaultValue);
                } else if(parse === "regex") { // Obtain token via RegEx doc search
                    let string = `{${doc.toString().match(/\'token': .*Aw'/)["0"]}}`;
                    resolve(JSON.parse(string.replace(/'/g, '"')).token)
                }
            })
            .catch(err => reject(err));
        });

};

// TODO: header review
instructTokenRefresh = (oauth_token) => {
    // TODO: Request new refreshed Token and return it ...
    console.log('Ta dam.. Instructed Token refresh!')
};

module.exports = {
    getOAuthUrl: getOAuthUrl,
    validateApiSecret: validateApiSecret,
    exchangeOAuthCodeWithToken: exchangeOAuthCodeWithToken,
    instructTokenRefresh: instructTokenRefresh,
    getMonoSessionKey: getMonoSessionKey
};