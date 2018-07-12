const CONFIG = require('../config');

const schedule = require('node-schedule');

setCron = (cron_ready, cron_schedule, cron_script) => {
    const cron = schedule.scheduleJob(cron_schedule, cron_script);

    return new Promise((resolve, reject) => {
        if(!cron_ready) {
            cron.cancel();
            reject(`Cron-Critical: Cron script terminated after init (cron_ready=${cron_ready})`);
        }
        resolve(`Cron-Info: Successfully Scheduled Cron Job (cron_schedule=${cron_schedule})`);
    });

};

module.exports = {
    setCron: setCron
};