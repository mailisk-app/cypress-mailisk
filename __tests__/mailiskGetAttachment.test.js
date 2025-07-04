const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key')
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('mailiskGetAttachment', () => {
  test('should get attachment by ID', () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ data: { filename: 'test.pdf' } });
    instance.request = { get: mockGet };
    
    const attachmentId = 'attachment-123';
    
    instance.mailiskGetAttachment(attachmentId);
    
    expect(mockGet).toHaveBeenCalledWith(
      `api/attachments/${attachmentId}`,
      {}
    );
  });

  test('should pass options to request', () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({});
    instance.request = { get: mockGet };
    
    const attachmentId = 'attachment-123';
    const options = { timeout: 5000 };
    
    instance.mailiskGetAttachment(attachmentId, options);
    
    expect(mockGet).toHaveBeenCalledWith(
      `api/attachments/${attachmentId}`,
      options
    );
  });
});