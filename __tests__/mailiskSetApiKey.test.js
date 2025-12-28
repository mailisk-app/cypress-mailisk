const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn((key) => {
    if (key === 'MAILISK_API_KEY') return 'test-api-key';
    if (key === 'MAILISK_API_URL') return 'https://api.test/';
    return null;
  }),
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} }),
};

describe('mailiskSetApiKey', () => {
  test('should set API key and create new Request instance', () => {
    const instance = new MailiskCommands();
    const newApiKey = 'new-api-key';

    instance.mailiskSetApiKey(newApiKey);

    expect(instance.request).toBeDefined();
    expect(instance.request.apiKey).toBe(newApiKey);
    expect(instance.request.apiUrl).toBe('https://api.test/');
  });

  test('falls back to Cypress env API url when one is not provided', () => {
    const instance = new MailiskCommands();
    instance.mailiskSetApiKey('override-key');

    expect(instance.request.apiUrl).toBe('https://api.test/');
  });
});
