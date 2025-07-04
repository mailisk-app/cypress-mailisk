const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key')
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('mailiskSearchInbox', () => {
  test('should search inbox with parameters', () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ emails: [], total_count: 0 });
    instance.request = { get: mockGet };
    
    const namespace = 'test-namespace';
    const params = { subject: 'test', wait: false };
    
    instance.mailiskSearchInbox(namespace, params);
    
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(`api/emails/${namespace}/inbox`),
      expect.any(Object)
    );
  });

  test('should set default from_timestamp', () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ emails: [], total_count: 0 });
    instance.request = { get: mockGet };
    
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    
    instance.mailiskSearchInbox('test', { wait: false });
    
    const expectedTimestamp = Math.floor(now / 1000) - 15 * 60;
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(`from_timestamp=${expectedTimestamp}`),
      expect.any(Object)
    );
  });
});