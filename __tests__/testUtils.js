const mockCyEnv = (envOverrides = {}) => {
  const env = {
    MAILISK_API_KEY: 'test-api-key',
    MAILISK_API_URL: 'https://api.test/',
    ...envOverrides,
  };

  return jest.fn((keys) => {
    const resolvedKeys = Array.isArray(keys) ? keys : [keys];
    const values = {};
    resolvedKeys.forEach((key) => {
      values[key] = env[key];
    });
    return Promise.resolve(values);
  });
};

module.exports = {
  mockCyEnv,
};
