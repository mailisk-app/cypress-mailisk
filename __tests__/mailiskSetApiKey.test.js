const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key')
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('mailiskSetApiKey', () => {
  test('should set API key and create new Request instance', () => {
    const instance = new MailiskCommands();
    const newApiKey = 'new-api-key';
    
    instance.mailiskSetApiKey(newApiKey);
    
    expect(instance.request).toBeDefined();
    expect(instance.request.apiKey).toBe(newApiKey);
  });
});