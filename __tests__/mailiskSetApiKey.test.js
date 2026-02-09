const MailiskCommands = require('../src/mailiskCommands');
const { mockCyEnv } = require('./testUtils');

global.cy = {
  env: mockCyEnv(),
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} }),
};

describe('mailiskSetApiKey', () => {
  test('should set API key and create new Request instance', async () => {
    const instance = new MailiskCommands();
    const newApiKey = 'new-api-key';

    await instance.mailiskSetApiKey(newApiKey);

    expect(instance.request).toBeDefined();
    expect(instance.request.apiKey).toBe(newApiKey);
    expect(instance.request.apiUrl).toBe('https://api.test/');
  });

  test('falls back to Cypress env API url when one is not provided', async () => {
    const instance = new MailiskCommands();
    await instance.mailiskSetApiKey('override-key');

    expect(instance.request.apiUrl).toBe('https://api.test/');
  });
});
