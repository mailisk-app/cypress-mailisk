const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key')
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('mailiskDownloadAttachment', () => {
  test('should download attachment binary data', async () => {
    const instance = new MailiskCommands();
    const attachmentData = { data: { download_url: 'https://example.com/download' } };
    const binaryData = Buffer.from('binary content');
    
    const mockGet = jest.fn().mockResolvedValue(attachmentData);
    const mockGetBinary = jest.fn().mockResolvedValue(binaryData);
    instance.request = { get: mockGet, getBinary: mockGetBinary };
    
    const attachmentId = 'attachment-123';
    const result = await instance.mailiskDownloadAttachment(attachmentId);
    
    expect(mockGet).toHaveBeenCalledWith(`api/attachments/${attachmentId}`, {});
    expect(mockGetBinary).toHaveBeenCalledWith(attachmentData.data.download_url, {});
    expect(result).toEqual(binaryData);
  });

  test('should pass options to both requests', async () => {
    const instance = new MailiskCommands();
    const attachmentData = { data: { download_url: 'https://example.com/download' } };
    const options = { timeout: 10000 };
    
    const mockGet = jest.fn().mockResolvedValue(attachmentData);
    const mockGetBinary = jest.fn().mockResolvedValue(Buffer.from('test'));
    instance.request = { get: mockGet, getBinary: mockGetBinary };
    
    const attachmentId = 'attachment-123';
    await instance.mailiskDownloadAttachment(attachmentId, options);
    
    expect(mockGet).toHaveBeenCalledWith(`api/attachments/${attachmentId}`, options);
    expect(mockGetBinary).toHaveBeenCalledWith(attachmentData.data.download_url, options);
  });
});