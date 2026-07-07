const MailiskCommands = require('../src/mailiskCommands');
const { mockCyEnv } = require('./testUtils');

global.cy = {
  env: mockCyEnv(),
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} }),
};

describe('mailisk outbound email commands', () => {
  let instance;

  beforeEach(() => {
    instance = new MailiskCommands();
  });

  test('sends an outbound email with namespace query and request options', async () => {
    const mockPost = jest.fn().mockResolvedValue({ id: 'outbound-email-id', status: 'queued' });
    instance.request = { post: mockPost };
    const input = {
      from: {
        email: 'support@test-namespace.mailisk.net',
        name: 'Support',
      },
      reply_to: {
        email: 'team@test-namespace.mailisk.net',
        name: 'Team',
      },
      to: ['verified@example.com'],
      subject: 'Hello',
      text: 'Hello from Mailisk',
      html: '<p>Hello from Mailisk</p>',
      attachments: [
        {
          filename: 'hello.txt',
          content_type: 'text/plain',
          content_base64: Buffer.from('hello').toString('base64'),
          disposition: 'attachment',
        },
      ],
    };
    const options = { timeout: 5000 };

    const response = await instance.mailiskSendEmail(' test-namespace ', input, options);

    expect(mockPost).toHaveBeenCalledWith('api/emails/send?namespace=test-namespace', input, options);
    expect(response).toEqual({ id: 'outbound-email-id', status: 'queued' });
  });

  test('gets outbound email delivery details', async () => {
    const mockGet = jest.fn().mockResolvedValue({ id: 'outbound-email-id', delivery_summary: { delivered: 1 } });
    instance.request = { get: mockGet };
    const options = { timeout: 5000 };

    const response = await instance.mailiskGetOutboundEmail(' outbound/email-id ', options);

    expect(mockGet).toHaveBeenCalledWith('api/emails/outbound/outbound%2Femail-id', options);
    expect(response.id).toBe('outbound-email-id');
  });

  test('replies to an inbound email', async () => {
    const mockPost = jest.fn().mockResolvedValue({ id: 'reply-email-id', type: 'reply' });
    instance.request = { post: mockPost };
    const input = {
      from: {
        email: 'support@test-namespace.mailisk.net',
      },
      cc: ['manager@example.com'],
      subject: 'Re: Hello',
      text: 'Thanks for the message.',
    };
    const options = { timeout: 5000 };

    const response = await instance.mailiskReplyToEmail(' inbound/email-id ', input, options);

    expect(mockPost).toHaveBeenCalledWith('api/emails/inbound%2Femail-id/reply', input, options);
    expect(response.type).toBe('reply');
  });

  test('forwards an inbound email', async () => {
    const mockPost = jest.fn().mockResolvedValue({ id: 'forward-email-id', type: 'forward' });
    instance.request = { post: mockPost };
    const input = {
      from: {
        email: 'support@test-namespace.mailisk.net',
      },
      to: ['verified@example.com'],
      subject: 'Fwd: Hello',
      text: 'Forwarding this along.',
    };
    const options = { timeout: 5000 };

    const response = await instance.mailiskForwardEmail(' inbound/email-id ', input, options);

    expect(mockPost).toHaveBeenCalledWith('api/emails/inbound%2Femail-id/forward', input, options);
    expect(response.type).toBe('forward');
  });

  test('rejects blank identifiers', () => {
    expect(() => instance.mailiskSendEmail('   ', { subject: 'Hello', text: 'Hello' })).toThrow(
      'namespace must be a non-empty string.',
    );
    expect(() => instance.mailiskGetOutboundEmail('   ')).toThrow('outboundEmailId must be a non-empty string.');
    expect(() => instance.mailiskReplyToEmail('   ', { text: 'Hello' })).toThrow('emailId must be a non-empty string.');
    expect(() => instance.mailiskForwardEmail('   ', { to: ['verified@example.com'] })).toThrow(
      'emailId must be a non-empty string.',
    );
  });
});
