let apps = [];

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
  console.log('New app created:', newApp);
  console.log('Data after adding new app:', apps);

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
