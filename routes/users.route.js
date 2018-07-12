let express = require('express');
let router = express.Router();
let routeValidator = require('express-route-validator');

/* START:Controller */
const userController = require('../controller/user.controller');
/* END:Controller */

/***
 * Add a new Member to the destination Hotlist
 * @Type: GET
 * @URI: /join/:apiKey/?email
 * @Param: {String} apiKey [API Key from Config]
 * @Param: {String} email [E-Mail address connected with a Monorail Account]
 */
router.get('/add/editor/:apiKey/', routeValidator.validate({
    query: {
        email: { isEmail: true, isRequired: true },
    },
    params: {
        apiKey: { isRequired: true }
    }
}), function (req, res) {

    userController.verifyRoutePrivileges(req.params.apiKey)
        .then(() => userController.emitMonoAuthToken())
        .then(mono_session_key => userController.addHotlistEditor(req.query.email, mono_session_key))
        .then(email_address => userController.saveUserToDatabase(email_address))
        .then(res.sendStatus(200))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });

});

module.exports = router;
