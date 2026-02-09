const MailiskCommands = require('../src/mailiskCommands');
const { mockCyEnv } = require('./testUtils');

global.cy = {
  env: mockCyEnv(),
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} }),
};

describe('MailiskCommands - Basic Tests', () => {
  test('should export cypressCommands array', () => {
    const commands = MailiskCommands.cypressCommands;
    expect(commands).toEqual([
      'mailiskSetApiKey',
      'mailiskListNamespaces',
      'mailiskSearchInbox',
      'mailiskGetAttachment',
      'mailiskDownloadAttachment',
      'mailiskSearchSms',
      'mailiskListSmsNumbers',
    ]);
  });

  test('should create instance without initializing request eagerly', () => {
    const instance = new MailiskCommands();
    expect(instance.request).toBeNull();
  });

  test('should set new API key', async () => {
    const instance = new MailiskCommands();
    await instance.mailiskSetApiKey('new-key');
    expect(instance.request).toBeDefined();
  });
});
