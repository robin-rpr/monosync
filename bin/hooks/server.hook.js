const CONFIG = require('../config');

/* START:Service */
/* END:Service */

printSystemStatus = () => {
    return new Promise((resolve, reject) => {
        /*
        TODO: Log and/or do the following actions:
            - API listening on...
            - Hotlist invite URL
            - Check DB status OK/BAD (If BAD => MUST flush database for clean sync (=report by sync and call panic hook to flush db))
            - Last Sync Date
            - Baud user account, project, host:port
            - LocalStorage status (Current Entries <number>)
         */
    });

};

module.exports = {
    printSystemStatus: printSystemStatus
};