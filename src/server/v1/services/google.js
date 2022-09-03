const { google } = require('googleapis');

/* Google ENVs */
const CLIENT_ID = process.env.GOOGLE_OAUTH_ID
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_SECRET
const CLIENT_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
const CLIENT_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN

/* Set Google Auth Credentias */
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: CLIENT_REFRESH_TOKEN })

/* Google Drive API */
const Drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

module.exports = { Drive }