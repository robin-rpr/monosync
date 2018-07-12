const CONFIG = require('../config');

/* START:Service */
const authService = require('../services/auth.service');
const storageService = require('../services/storage.service');
const userService = require('../services/user.service');
const cronService = require('../services/cron.service');
const databaseService = require('../services/database.service');
/* END:Service */

/* START:Models */
const userModel = require('../models/user.model');
/* END:Models */

/***
 * Checks if the Caller issued the correct API key
 * @param {String} api_key
 * @returns {Promise<any>}
 */
verifyRoutePrivileges = (api_key) => {
    return new Promise((resolve, reject) => {
        !authService.validateApiSecret(api_key)?reject('Request Blocked. The caller issued an invalid API key.'):resolve();
    });
};

/***
 * Emits Monorail Single Request Auth token
 * @returns {Promise<*>}
 */
emitMonoAuthToken = () => {
    return new Promise((resolve, reject) => {
        authService.getMonoSessionKey(`http${(CONFIG.monorail.ssl ? 's://' : '://')+CONFIG.monorail.host}/u/${CONFIG.monorail.account.id}/hotlists/${CONFIG.monorail.sync.hotlist.target}/people`, 'dom')
            .then(mono_session_key => resolve(mono_session_key))
            .catch(err => reject(err));
    });
};

/***
 * Adds a new editor to the target hotlist
 * @param email_address
 * @param mono_session_key
 * @returns {Promise<any>}
 */
addHotlistEditor = (email_address,mono_session_key) => {
    return new Promise((resolve, reject) => {
        userService.addEditor(email_address, mono_session_key)
            .then(() => resolve(email_address)) // Bounce E-mail
            .catch(err => reject(err));
    });
};

saveUserToDatabase = (email_address) => {
    return new Promise((resolve, reject) => {
        databaseService.saveData(userModel.User,{email: email_address})
            .catch(err => reject(err));
    });
};

module.exports = {
    verifyRoutePrivileges: verifyRoutePrivileges,
    emitMonoAuthToken: emitMonoAuthToken,
    addHotlistEditor: addHotlistEditor,
    saveUserToDatabase: saveUserToDatabase
};