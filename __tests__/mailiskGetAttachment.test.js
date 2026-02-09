const MailiskCommands = require('../src/mailiskCommands');
const { mockCyEnv } = require('./testUtils');

global.cy = {
  env: mockCyEnv(),
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('mailiskGetAttachment', () => {
  test('should get attachment by ID', async () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ data: { filename: 'test.pdf' } });
    instance.request = { get: mockGet };
    
    const attachmentId = 'attachment-123';
    
    await instance.mailiskGetAttachment(attachmentId);
    
    expect(mockGet).toHaveBeenCalledWith(
      `api/attachments/${attachmentId}`,
      {}
    );
  });

  test('should pass options to request', async () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({});
    instance.request = { get: mockGet };
    
    const attachmentId = 'attachment-123';
    const options = { timeout: 5000 };
    
    await instance.mailiskGetAttachment(attachmentId, options);
    
    expect(mockGet).toHaveBeenCalledWith(
      `api/attachments/${attachmentId}`,
      options
    );
  });
});
