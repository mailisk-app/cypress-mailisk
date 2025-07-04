// Mock Cypress global
global.Cypress = {
  env: jest.fn().mockReturnValue(null)
};

// Mock cy global
global.cy = {
  wait: jest.fn().mockResolvedValue(undefined),
  request: jest.fn().mockResolvedValue({
    isOkStatusCode: true,
    body: {}
  })
};