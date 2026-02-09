const MailiskCommands = require('../src/mailiskCommands');
const { mockCyEnv } = require('./testUtils');

global.cy = {
  env: mockCyEnv(),
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('mailiskSearchInbox', () => {
  test('should search inbox with parameters', async () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ emails: [], total_count: 0 });
    instance.request = { get: mockGet };
    
    const namespace = 'test-namespace';
    const params = { subject: 'test', wait: false };
    
    await instance.mailiskSearchInbox(namespace, params);
    
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(`api/emails/${namespace}/inbox`),
      expect.any(Object)
    );
  });

  test('should set default from_timestamp', async () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ emails: [], total_count: 0 });
    instance.request = { get: mockGet };
    
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    
    await instance.mailiskSearchInbox('test', { wait: false });
    
    const expectedTimestamp = Math.floor(now / 1000) - 15 * 60;
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(`from_timestamp=${expectedTimestamp}`),
      expect.any(Object)
    );
  });

  test('should allow explicit from_timestamp zero to override default', async () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ emails: [], total_count: 0 });
    instance.request = { get: mockGet };

    await instance.mailiskSearchInbox('test', { wait: false, from_timestamp: 0 });

    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('from_timestamp=0'), expect.any(Object));
  });
});
