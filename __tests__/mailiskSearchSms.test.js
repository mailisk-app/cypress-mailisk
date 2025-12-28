const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key'),
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} }),
};

describe('mailiskSearchSms', () => {
  let instance;

  beforeEach(() => {
    instance = new MailiskCommands();
  });

  test('polls via _mailiskSearchSmsAction when wait is enabled by default', async () => {
    const actionSpy = jest.spyOn(instance, '_mailiskSearchSmsAction').mockResolvedValue({ total_count: 1 });
    const fromDate = new Date('2023-01-01T00:00:00.000Z');

    const result = await instance.mailiskSearchSms('1234567890', { from_date: fromDate, limit: 5 });

    expect(actionSpy).toHaveBeenCalledTimes(1);
    const [, passedOptions, urlParams, startTime, timeout] = actionSpy.mock.calls[0];
    expect(passedOptions).toEqual({ timeout: 1000 * 60 * 5 });
    expect(urlParams.get('wait')).toBeNull();
    expect(urlParams.get('limit')).toBe('5');
    expect(urlParams.get('from_date')).toBe(fromDate.toISOString());
    expect(typeof startTime).toBe('number');
    expect(timeout).toBe(1000 * 60 * 5);
    expect(result).toEqual({ total_count: 1 });
  });

  test('performs direct request when wait is disabled', async () => {
    const mockGet = jest.fn().mockResolvedValue({ total_count: 0 });
    instance.request = { get: mockGet };

    const options = { timeout: 5000, headers: { 'X-Test': '1' } };
    const fromDate = new Date('2023-01-02T00:00:00.000Z');
    const params = { wait: false, from_date: fromDate, limit: 3 };
    const response = await instance.mailiskSearchSms('1234567890', params, options);

    expect(mockGet).toHaveBeenCalledTimes(1);
    const [path, passedOptions] = mockGet.mock.calls[0];
    expect(path).toContain('api/sms/1234567890/messages?');
    expect(path).toContain('limit=3');
    expect(path).toContain(`from_date=${encodeURIComponent(fromDate.toISOString())}`);
    expect(path).toContain('wait=false');
    expect(passedOptions).toEqual(options);
    expect(response).toEqual({ total_count: 0 });
  });

  test('includes falsy query parameters such as zero', async () => {
    const mockGet = jest.fn().mockResolvedValue({ total_count: 0 });
    instance.request = { get: mockGet };

    await instance.mailiskSearchSms('1234567890', { wait: false, from_date: '2023-01-01T00:00:00Z', limit: 0 });

    const [path] = mockGet.mock.calls[0];
    expect(path).toContain('limit=0');
    expect(path).toContain('from_date=2023-01-01T00%3A00%3A00Z');
  });

  test('applies default from_date when none provided', async () => {
    const mockGet = jest.fn().mockResolvedValue({ total_count: 0 });
    instance.request = { get: mockGet };

    await instance.mailiskSearchSms('1234567890', { wait: false });

    const [path] = mockGet.mock.calls[0];
    expect(path).toMatch(/from_date=/);
  });

  test('serializes from_date and to_date values', async () => {
    const mockGet = jest.fn().mockResolvedValue({ total_count: 0 });
    instance.request = { get: mockGet };

    const fromDate = new Date('2023-01-01T00:00:00.000Z');
    const toDate = new Date('2023-01-02T00:00:00.000Z');

    await instance.mailiskSearchSms('1234567890', { wait: false, from_date: fromDate, to_date: toDate });

    const [path] = mockGet.mock.calls[0];
    expect(path).toContain(`from_date=${encodeURIComponent(fromDate.toISOString())}`);
    expect(path).toContain(`to_date=${encodeURIComponent(toDate.toISOString())}`);
  });
});
