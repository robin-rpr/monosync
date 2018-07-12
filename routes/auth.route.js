let express = require('express');
let router = express.Router();
let routeValidator = require('express-route-validator');

/* START:Controller */
const authController = require('../controller/auth.controller');
/* END:Controller */

/***
 * Obtains OAuth 2.0 authorization code and exchanges it with a token.
 * @OpenIdConfig: https://accounts.google.com/.well-known/openid-configuration
 * @Type: GET
 * @URI: /oauth/v2/consent/redirect/?code
 * @query: {String} code [OAuth2.0 Code]
 */
router.get('/oauth2/authorization/redirect/', routeValidator.validate({
    query: {
        code: { isRequired: true }
    }
}), function (req, res) {

    authController.oAuthExchange(req.query.code)
        .then(auth_token => authController.storeOAuth(auth_token))
        .then((disk_state, oauth_token) => {
            return authController.scheduleTokenRefresh(disk_state, oauth_token)
        })
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });

});

module.exports = router;