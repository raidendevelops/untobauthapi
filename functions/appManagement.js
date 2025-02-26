const { google } = require('googleapis');
const drive = google.drive('v3');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'client_secret.json');

let apps = [];

const authorize = (credentials, callback) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
};

const getAccessToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

const uploadFile = (auth, fileName, filePath) => {
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType: 'application/json',
    body: fs.createReadStream(filePath),
  };
  drive.files.create(
    {
      auth,
      resource: fileMetadata,
      media,
      fields: 'id',
    },
    (err, file) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File Id:', file.id);
      }
    }
  );
};

exports.handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case 'POST':
        return handlePostRequest(event);
      case 'GET':
        return handleGetRequest();
      case 'PUT':
        return handlePutRequest(event);
      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};

const handlePostRequest = async (event) => {
  const body = JSON.parse(event.body);

  const newAppId = Date.now().toString();
  const newApp = {
    applicationId: newAppId,
    email: body.email,
    url: body.url || '',
    blocked: body.blocked || false,
    approved: body.approved || false,
  };

  apps.push(newApp);

  const filePath = path.join(__dirname, 'apps.json');
  fs.writeFileSync(filePath, JSON.stringify(apps, null, 2));

  authorize(JSON.parse(fs.readFileSync(CREDENTIALS_PATH)), (auth) => {
    uploadFile(auth, 'apps.json', filePath);
  });

  return { statusCode: 201, body: JSON.stringify(newApp) };
};

const handleGetRequest = async () => {
  console.log('Data fetched:', apps);
  return { statusCode: 200, body: JSON.stringify(apps) };
};

const handlePutRequest = async (event) => {
  const body = JSON.parse(event.body);
  const applicationId = body.applicationId;
  const appIndex = apps.findIndex(app => app.applicationId === applicationId);

  if (appIndex !== -1) {
    if (body.hasOwnProperty('approved')) {
      apps[appIndex].approved = body.approved;
    }
    if (body.hasOwnProperty('blocked')) {
      apps[appIndex].blocked = body.blocked;
    }
    return { statusCode: 200, body: JSON.stringify(apps[appIndex]) };
  }

  return { statusCode: 404, body: 'App not found' };
};
