const Request = require('../src/request');

global.cy = {
  request: jest.fn().mockResolvedValue({ isOkStatusCode: true, body: {} })
};

describe('Request Class', () => {
  test('should create instance with default apiUrl', () => {
    const request = new Request({ apiKey: 'test-key' });
    expect(request.apiUrl).toBe('https://api.mailisk.com/');
  });

  test('should create instance with custom apiUrl', () => {
    const request = new Request({ 
      apiKey: 'test-key', 
      apiUrl: 'https://custom.api.com/' 
    });
    expect(request.apiUrl).toBe('https://custom.api.com/');
  });

  test('should set headers correctly', () => {
    const request = new Request({ apiKey: 'test-key' });
    expect(request.headers).toMatchObject({
      Accept: 'application/json',
      'X-Api-Key': 'test-key'
    });
  });

  test('should throw error when apiKey is missing', () => {
    const request = new Request({});
    expect(() => {
      request.buildOptions('GET', 'test');
    }).toThrow('You must set the CYPRESS_MAILISK_API_KEY environment variable');
  });

  test('should make GET request', () => {
    const request = new Request({ apiKey: 'test-key' });
    request.get('api/test');
    
    expect(global.cy.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.mailisk.com/api/test'
      })
    );
  });
});