const MailiskCommands = require('../src/mailiskCommands');

// Mock Cypress before importing
global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key')
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('MailiskCommands - Basic Tests', () => {
  test('should export cypressCommands array', () => {
    const commands = MailiskCommands.cypressCommands;
    expect(commands).toEqual([
      'mailiskSetApiKey',
      'mailiskListNamespaces',
      'mailiskSearchInbox',
      'mailiskGetAttachment',
      'mailiskDownloadAttachment'
    ]);
  });

  test('should create instance with default API key', () => {
    const instance = new MailiskCommands();
    expect(instance.request).toBeDefined();
  });

  test('should set new API key', () => {
    const instance = new MailiskCommands();
    instance.mailiskSetApiKey('new-key');
    expect(instance.request).toBeDefined();
  });
});