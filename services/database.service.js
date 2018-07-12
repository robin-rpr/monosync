const CONFIG = require('../config');

const { databaseConnection } = require('../app');

saveData = (model, data) => {
    return new Promise((resolve, reject) => {
        databaseConnection
            .then(connection => {
                const model = new model(data); // TODO: Fail-check

                return connection.manager
                    .save(model)
                    .then(data => resolve(data)); // Bounce Data
            })
            .catch(err => reject(err));
    });

};

module.exports = {
    saveData: saveData
};