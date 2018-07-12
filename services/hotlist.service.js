const CONFIG = require('../config');

const queryString = require('querystring');

/* START:Service */
const httpService = require('./http.service');
const authService = require('./auth.service');
/* END:Service */

/***
 * Subscribe to an item of the origin Hotlist
 * @param {String} issue_id
 * @param {any} mono_session_key
 * @returns {Promise<void>}
 */
subscribeTo = async (issue_id, mono_session_key) => {

    const options = {
        uri: `${(CONFIG.monorail.ssl?'https://':'http://')+CONFIG.monorail.host+CONFIG.monorail.port}'/hosting/updateHotlists.do`,
        headers: {
            cookie: `SACSID=${'XXX'}` // TODO: Handle by OAuth2.0 Token
        }
    };

    let payload = queryString.stringify({
        token: mono_session_key,
        issue_refs: `${CONFIG.monorail.project}:${issue_id}`,
        hotlist_ids_remove: '',
        hotlist_ids_add: CONFIG.monorail.sync.hotlist.target.id,
    });

    return new Promise((resolve, reject) => {
        httpService.post(options, payload)
            .then(chunk => {
                resolve(chunk, issue_id);
            })
            .catch(err => reject(err));
    });
};


/***
 * Fetches all items of the origin Hotlist
 * @returns {Promise<*>}
 */
getOriginIssues = async () => {

    const options = {
        uri: `https://monorail-prod.appspot.com/_ah/api/monorail/v1/projects/${CONFIG.monorail.project}/issues?maxResults=500&q=Hotlist%3D${CONFIG.monorail.sync.hotlist.origin}&fields=items%2Fid`,
        headers: {
            authorization: 'Bearer XXX' // TODO: Handle by OAuth2.0 Token
        }
    };

    return new Promise((resolve, reject) => {
        httpService.get(options)
            .then(doc => {
                resolve(doc);
            })
            .catch(err => reject(err));
    });
};

/***
 * Syndicates origin and target Hotlist
 * @returns {Promise<Array>}
 */
syndicateHotlists = async () => {

    // Get issues inventory of origin Hotlist
    let origin = await getOriginIssues().items;

    // Get issues inventory of target Hotlist
    let target = undefined; // TODO: Read tracked inventory from DB

    let a = [], diff = [];

    for (let i = 0; i < origin.length; i++) {
        a[origin[i]] = true;
    }

    for (let i = 0; i < target.length; i++) {
        if (a[target[i]]) {
            delete a[target[i]];
        } else {
            a[target[i]] = true;
        }
    }

    for (let k in a) {
        diff.push(k);
    }

    return diff;
};

/***
 * Subscribes systematically to all issues of origin Hotlist
 * @param {Array<Object<String>>} id_obj_array
 * @param {number} timeout // To prevent API Blocking
 * @returns {Promise<void>}
 */
bulkSubscribe = async (id_obj_array, timeout) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < id_obj_array.length; i++) {
            authService.getMonoSessionKey(`http${(CONFIG.monorail.ssl ? 's://' : '://')+CONFIG.monorail.host}/p/${CONFIG.monorail.project}/issues/detail?id=${id_obj_array[i]["id"]}`, 'regex')
                .then(mono_session_key => subscribeTo(id_obj_array[i]["id"], mono_session_key))
                .then((chunk, issue_id) => setTimeout(() => resolve(issue_id), timeout))
                .catch(err => {
                    break;
                    reject(err);
                });
        }
    });
};

module.exports = {
    syndicateHotlists: syndicateHotlists,
    bulkSubscribe: bulkSubscribe
};