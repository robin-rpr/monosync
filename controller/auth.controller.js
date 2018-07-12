const CONFIG = require('../config');

/* START:Service */
const authService = require('../services/auth.service');
const storageService = require('../services/storage.service');
const cronService = require('../services/cron.service');
/* END:Service */

/***
 * Exchange OAuth2.0 code with Token
 * @param {String} oauth_code
 * @returns {Promise<any>}
 */
oAuthExchange = (oauth_code) => {
    return new Promise(async (resolve, reject) => {
        authService.exchangeOAuthCodeWithToken(oauth_code)
            .then(AuthToken => resolve(AuthToken))
            .catch(err => reject(err));
    });
};

/***
 * Stores OAuth2.0 Token in LocalStorage KEY_STORAGE
 * @param {any} oauth_token
 * @returns {Promise<any>}
 */
storeOAuth = (oauth_token) => {
    return new Promise((resolve, reject) => {
        storageService.writeData('KEY_STORAGE', 'oauthToken', oauth_token, true)
            .then(diskState => resolve(diskState, oauth_token))
            .catch(err => reject(err));
    });
};

/***
 * Schedules a Node Cron Job to refresh the OAuth2.0 Token
 * @param {any} disk_state
 * @param {String} oauth_token
 * @returns {Promise<any>}
 */
scheduleTokenRefresh = (disk_state, oauth_token) => {
    return new Promise((resolve, reject) => {
        cronService.setCron(disk_state, CONFIG.monorail.google_oauth2.cronRefresh , async () => {
            const token = await authService.instructTokenRefresh(oauth_token);
            storeOAuth(token)
                .then((disk_state, oauth_token) => resolve(disk_state, oauth_token))
                .catch(err => reject(err));
        })
    });
};

module.exports = {
    oAuthExchange: oAuthExchange,
    storeOAuth: storeOAuth,
    scheduleTokenRefresh: scheduleTokenRefresh
};