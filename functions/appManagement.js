const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'apps.json');

// Helper function to read data from JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) return [];
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Helper function to write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

exports.handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case 'POST':
        return handlePostRequest(event);
      case 'GET':
        return handleGetRequest();
      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};

const handlePostRequest = async (event) => {
  const data = readData();
  const body = JSON.parse(event.body);

  // Generate a unique ID for the new app
  const newAppId = Date.now().toString();
  const newApp = {
    applicationId: newAppId,
    email: body.email,
    url: body.url || '',
    blocked: body.blocked || false,
    approved: body.approved || false,
  };

  data.push(newApp);
  writeData(data);

  // Debugging logs
  console.log('New app created:', newApp);
  console.log('Data after adding new app:', data);

  return { statusCode: 201, body: JSON.stringify(newApp) };
};

const handleGetRequest = async () => {
  const data = readData();
  console.log('Data fetched:', data); // Debugging log
  return { statusCode: 200, body: JSON.stringify(data) };
};
