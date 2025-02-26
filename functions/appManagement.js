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
  switch (event.httpMethod) {
    case 'POST':
      return handlePostRequest(event);
    case 'GET':
      return handleGetRequest();
    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};

const handlePostRequest = async (event) => {
  const data = readData();
  const body = JSON.parse(event.body);
  const newApp = {
    applicationId: Date.now().toString(),
    email: body.email,
    url: body.url || '',
    blocked: body.blocked || false,
    approved: body.approved || false,
  };
  data.push(newApp);
  writeData(data);
  return { statusCode: 201, body: JSON.stringify(newApp) };
};

const handleGetRequest = async () => {
  const data = readData();
  return { statusCode: 200, body: JSON.stringify(data) };
};
