const MailiskCommands = require('../src/mailiskCommands');
const { mockCyEnv } = require('./testUtils');

global.cy = {
  env: mockCyEnv(),
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} }),
};

describe('mailisk device commands', () => {
  let instance;

  beforeEach(() => {
    instance = new MailiskCommands();
  });

  test('lists devices with trimmed query parameters and request options', async () => {
    const mockGet = jest.fn().mockResolvedValue({ total_count: 0, options: {}, items: [] });
    instance.request = { get: mockGet };

    const options = { timeout: 1234 };
    const response = await instance.mailiskDeviceList(
      { limit: 20, offset: 0, username: ' qa@example.com ', issuer: ' GitHub ', unused: '' },
      options,
    );

    const [path, passedOptions] = mockGet.mock.calls[0];
    expect(path).toContain('api/devices?');
    expect(path).toContain('limit=20');
    expect(path).toContain('offset=0');
    expect(path).toContain('username=qa%40example.com');
    expect(path).toContain('issuer=GitHub');
    expect(path).not.toContain('unused=');
    expect(passedOptions).toBe(options);
    expect(response).toEqual({ total_count: 0, options: {}, items: [] });
  });

  test('lists devices without a query string when no filters are provided', async () => {
    const mockGet = jest.fn().mockResolvedValue({ total_count: 0, options: {}, items: [] });
    instance.request = { get: mockGet };

    await instance.mailiskDeviceList();

    expect(mockGet).toHaveBeenCalledWith('api/devices', {});
  });

  test.each([
    ['mailiskDeviceCreate', 'api/devices', { shared_secret: 'JBSWY3DPEHPK3PXP' }],
    ['mailiskDeviceCreateCustom', 'api/devices/custom', { secret: 'JBSWY3DPEHPK3PXP', digits: 8 }],
    [
      'mailiskDeviceCreateFromBase32SecretKey',
      'api/devices/base32-secret-key',
      { base32_secret_key: 'JBSWY3DPEHPK3PXP' },
    ],
    [
      'mailiskDeviceCreateFromOtpAuthUrl',
      'api/devices/otpauth-url',
      { otp_auth_url: 'otpauth://totp/GitHub:qa@example.com?secret=JBSWY3DPEHPK3PXP&issuer=GitHub' },
    ],
  ])('%s posts to %s', async (methodName, expectedPath, input) => {
    const mockPost = jest.fn().mockResolvedValue({ id: 'device-id' });
    instance.request = { post: mockPost };
    const options = { timeout: 5000 };

    const response = await instance[methodName](input, options);

    expect(mockPost).toHaveBeenCalledWith(expectedPath, input, options);
    expect(response).toEqual({ id: 'device-id' });
  });

  test('gets OTP by saved device id', async () => {
    const mockGet = jest.fn().mockResolvedValue({ code: '123456', expires: '2026-05-18T12:00:30.000Z' });
    instance.request = { get: mockGet };
    const options = { timeout: 5000 };

    const response = await instance.mailiskDeviceOtpByDeviceId('9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273', options);

    expect(mockGet).toHaveBeenCalledWith('api/devices/9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273/otp', options);
    expect(response.code).toBe('123456');
  });

  test('gets OTP by saved device id with minimum expiry seconds', async () => {
    const mockGet = jest.fn().mockResolvedValue({ code: '123456', expires: '2026-05-18T12:00:30.000Z' });
    instance.request = { get: mockGet };
    const options = { timeout: 5000 };

    const response = await instance.mailiskDeviceOtpByDeviceId(
      '9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273',
      { min_seconds_until_expire: 10 },
      options,
    );

    expect(mockGet).toHaveBeenCalledWith(
      'api/devices/9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273/otp?min_seconds_until_expire=10',
      options,
    );
    expect(response.code).toBe('123456');
  });

  test('gets OTP by saved device id with minimum expiry seconds as the second argument', async () => {
    const mockGet = jest.fn().mockResolvedValue({ code: '123456', expires: '2026-05-18T12:00:30.000Z' });
    instance.request = { get: mockGet };

    await instance.mailiskDeviceOtpByDeviceId('9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273', {
      min_seconds_until_expire: 10,
    });

    expect(mockGet).toHaveBeenCalledWith(
      'api/devices/9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273/otp?min_seconds_until_expire=10',
      {},
    );
  });

  test('encodes device id when getting OTP by saved device id', async () => {
    const mockGet = jest.fn().mockResolvedValue({ code: '123456', expires: '2026-05-18T12:00:30.000Z' });
    instance.request = { get: mockGet };

    await instance.mailiskDeviceOtpByDeviceId(' device/id ');

    expect(mockGet).toHaveBeenCalledWith('api/devices/device%2Fid/otp', {});
  });

  test('rejects blank device ids when getting OTP by saved device id', () => {
    expect(() => instance.mailiskDeviceOtpByDeviceId('   ')).toThrow('deviceId must be a non-empty string.');
  });

  test('gets OTP by shared secret', async () => {
    const mockPost = jest.fn().mockResolvedValue({ code: '123456', expires: '2026-05-18T12:00:30.000Z' });
    instance.request = { post: mockPost };
    const options = { timeout: 5000 };

    const response = await instance.mailiskDeviceOtpBySharedSecret(' JBSWY3DPEHPK3PXP ', options);

    expect(mockPost).toHaveBeenCalledWith('api/devices/otp', { shared_secret: 'JBSWY3DPEHPK3PXP' }, options);
    expect(response.code).toBe('123456');
  });

  test('gets OTP by shared secret with minimum expiry seconds', async () => {
    const mockPost = jest.fn().mockResolvedValue({ code: '123456', expires: '2026-05-18T12:00:30.000Z' });
    instance.request = { post: mockPost };
    const options = { timeout: 5000 };

    const response = await instance.mailiskDeviceOtpBySharedSecret(
      ' JBSWY3DPEHPK3PXP ',
      { min_seconds_until_expire: 10 },
      options,
    );

    expect(mockPost).toHaveBeenCalledWith(
      'api/devices/otp',
      { shared_secret: 'JBSWY3DPEHPK3PXP', min_seconds_until_expire: 10 },
      options,
    );
    expect(response.code).toBe('123456');
  });

  test('gets OTP by shared secret with minimum expiry seconds as the second argument', async () => {
    const mockPost = jest.fn().mockResolvedValue({ code: '123456', expires: '2026-05-18T12:00:30.000Z' });
    instance.request = { post: mockPost };

    await instance.mailiskDeviceOtpBySharedSecret(' JBSWY3DPEHPK3PXP ', { min_seconds_until_expire: 10 });

    expect(mockPost).toHaveBeenCalledWith(
      'api/devices/otp',
      { shared_secret: 'JBSWY3DPEHPK3PXP', min_seconds_until_expire: 10 },
      {},
    );
  });

  test('rejects blank shared secrets when getting OTP by shared secret', () => {
    expect(() => instance.mailiskDeviceOtpBySharedSecret('   ')).toThrow('sharedSecret must be a non-empty string.');
  });

  test('deletes a saved device and resolves without a body', async () => {
    const mockDel = jest.fn().mockResolvedValue('');
    instance.request = { del: mockDel };
    const options = { timeout: 5000 };

    const response = await instance.mailiskDeviceDelete('9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273', options);

    expect(mockDel).toHaveBeenCalledWith('api/devices/9b1f6ec0-b90d-4bd8-8dd0-f6b2d5138273', options);
    expect(response).toBeUndefined();
  });

  test('encodes device id when deleting a saved device', async () => {
    const mockDel = jest.fn().mockResolvedValue('');
    instance.request = { del: mockDel };

    await instance.mailiskDeviceDelete(' device/id ');

    expect(mockDel).toHaveBeenCalledWith('api/devices/device%2Fid', {});
  });
});
