const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key'),
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} }),
};

describe('mailiskListSmsNumbers', () => {
  test('delegates to the sms numbers endpoint with provided options', async () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ total_count: 0, data: [] });
    instance.request = { get: mockGet };

    const options = { timeout: 1234, headers: { 'X-Debug': '1' } };
    const response = await instance.mailiskListSmsNumbers(options);

    expect(mockGet).toHaveBeenCalledWith('api/sms/numbers', options);
    expect(response).toEqual({ total_count: 0, data: [] });
  });
});
