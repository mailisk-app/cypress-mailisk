const MailiskCommands = require('../src/mailiskCommands');

global.Cypress = {
  env: jest.fn().mockReturnValue('test-api-key')
};

global.cy = {
  wait: jest.fn(),
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('mailiskListNamespaces', () => {
  test('should call request.get with correct endpoint', () => {
    const instance = new MailiskCommands();
    const mockGet = jest.fn().mockResolvedValue({ namespaces: ['test'] });
    instance.request = { get: mockGet };
    
    instance.mailiskListNamespaces();
    
    expect(mockGet).toHaveBeenCalledWith('api/namespaces');
  });
});