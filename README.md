# <img src='https://raw.githubusercontent.com/robin-rpr/monosync/master/public/monosync_white.png' height='50'/>

### Installation
1. `git clone `
2. `cd monosync/ && (npm i || yarn i)`

### Configuration
```$xslt
{
  "api": {
    "secret": "foobar", /* Your super secret API key */
    "host": "localhost",
    "ssl": false,
    "port": 3000,
    "debug": true
  },

  "database": { /* TypeORM Configuration */
    "type": "mongodb", /* mysql, mariadb, postgres, sqlite, mssql, oracle, cordova, nativescript, react-native, expo, or mongodb */
    "host": "localhost",
    "port": 3306,
    "username": "root", /* Database username */
    "password": "admin", /* Database password */
    "database": "test",
    "entities": [ /* Do NOT touch */
      "User",
      "Issue"
    ],
    "synchronize": true, /* Synchonize entities */
    "logging": false
  },

  "monorail": {
    "host": "example.org",
    "port": 80,
    "ssl": true,
    "account": { /* Your OpenID Monorail Account */
      "email": "example@example.com",
      "id": "XXX"
    },
    "google_oauth2": { /* Your Google OAuth2 credentials */
      "client_id": "XXX.apps.googleusercontent.com",
      "client_secret": "XXX",
      "scope": "https://www.googleapis.com/auth/userinfo.email",
      "cronRefresh": "*/30 * * * *" /* Cron Timer */
    },
    "project": "myProject", /* The Monorail Project */
    "sync": {
      "hotlist": {
        "origin": "theirHotlist",
        "target": {
          "name": "myHotlist",
          "id": "1234" /* ID of your Hotlist */
        }
      },
      "interval": 3.6e+6 /* Sync Hotlists every */
    }
  }
}
```