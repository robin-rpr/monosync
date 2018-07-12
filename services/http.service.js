const CONFIG = require('../config');

const http = require('request');

/***
 * Outgoing POST request
 * @param {Object<any>} options
 * @param {Object<any>} payload
 * @returns {Promise<any>}
 */
post = async (options, payload) => {
    return await new Promise((resolve, reject) => {
        http({
            headers: options.headers,
            uri: options.uri,
            body: payload,
            method: 'POST'
        }, function (err, res, body) {
            if (err) {
                reject(err);
            }
            console.log('OUTGOING POST: ' + res.statusCode + ' - ' + res.statusMessage + ' - ' + res.request.uri.href);
            resolve(body);
        });
    });
};

/***
 * Outgoing GET request
 * @param {Object<any>} options
 * @returns {Promise<any>}
 */
get = async (options) => {
    return await new Promise((resolve, reject) => {
        http({
            headers: options.headers,
            uri: options.uri,
            method: 'GET'
        }, function (err, res, body) {
            if (err) {
                reject(err);
            }
            console.log('OUTGOING GET: ' + res.statusCode + ' - ' + res.statusMessage + ' - ' + res.request.uri.href);
            resolve(body);
        });
    });
};

module.exports = {
    post: post,
    get: get
};