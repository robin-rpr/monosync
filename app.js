let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let sassMiddleware = require('node-sass-middleware');
import "reflect-metadata";
let { createConnection } = require('typeorm');

let CONFIG = require('./config');

/* START:Routes */
let indexRouter = require('./routes/index.route');
let usersRouter = require('./routes/users.route');
let authRouter = require('./routes/auth.route');
/* END:Routes */

/* START:Hooks */
// Start Server
const serverHook = require('./bin/hooks/server.hook'); // Get server start Info
const panicHook = require('./bin/hooks/panic.hook'); // Server panic script for Runtime errors -> Calls Shutdown

// Start Application
const fetchHook = require('./bin/hooks/fetch.hook'); // Fetch Monorail Data
const attatchHook = require('./bin/hooks/attatch.hook'); // Save Monorail data to DB
const bootHook = require('./bin/hooks/boot.hook'); // Start application

// Stop Application & Server
const detachHook = require('./bin/hooks/detach.hook'); // Detach Monorail Data from DB & Monorail Hotlist
const shutdownHook = require('./bin/hooks/shutdown.hook'); // Get server shutdown info & log shutdown
/* END:Hooks */

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

/* START:Routes/init */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
/* END:Routes/init */

/* START:DB/Connection */
let databaseConnection = createConnection(CONFIG.database)
    .catch(error => console.log(error));
/* END:DB/Connection */

/* START:Hooks/init */
serverHook.printSystemStatus()
    .then(/* ... */)
    .catch(); // TODO: Call panic hook in catch
/* END:Hooks/init */

module.exports = {
    app: app,
    databaseConnection: databaseConnection
};
