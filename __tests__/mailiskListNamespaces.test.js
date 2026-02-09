const MailiskCommands = require('../src/mailiskCommands');
const { mockCyEnv } = require('./testUtils');

global.cy = {
  env: mockCyEnv(),
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
