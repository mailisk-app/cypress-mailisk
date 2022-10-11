const Request = require('./request');

class MailiskCommands {
  static get cypressCommands() {
    return ['mailiskSetApiKey', 'mailiskListNamespaces', 'mailiskSearchInbox'];
  }

  constructor() {
    const defaultApiKey = Cypress.env('MAILISK_API_KEY');
    this.mailiskSetApiKey(defaultApiKey);
  }

  mailiskSetApiKey(apiKey) {
    this.request = new Request({ apiKey, baseUrl: Cypress.env('MAILISK_API_URL') });
  }

  mailiskListNamespaces() {
    return this.request.get('api/namespaces');
  }

  mailiskSearchInbox(namespace, params, options = {}) {
    let _params = { ...params };

    // default timestamp, 5 seconds before starting this request
    if (!params.from_timestamp) {
      _params.from_timestamp = Math.floor(new Date().getTime() / 1000) - 5;
    }

    // by default wait for email
    if (params.wait !== false) {
      _params.wait = true;
    }

    const urlParams = new URLSearchParams();
    for (const key in _params) {
      const value = _params[key];
      if (value) urlParams.set(key, value.toString());
    }

    let _options = { ...options };

    // by default wait 5 minutes for emails
    if (_params.wait && !options.timeout) {
      _options.timeout = 1000 * 60 * 5;
    }

    return this.request.get(`api/emails/${namespace}/inbox?${urlParams.toString()}`, _options);
  }
}

module.exports = MailiskCommands;
