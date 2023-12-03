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

  _mailiskSearchAction(namespace, _options, urlParams, startTime, nextTimeout) {
    return this.request
      .get(`api/emails/${namespace}/inbox?${urlParams.toString()}`, { ..._options, timeout: nextTimeout })
      .then((response) => {
        if (response.total_count !== 0) {
          return response;
        }
        const timeout = Math.max(_options.timeout - (Date.now() - startTime), 1);
        cy.wait(Math.min(timeout, 9000), { log: false });
        return this._mailiskSearchAction(namespace, _options, urlParams, startTime, timeout);
      });
  }

  mailiskSearchInbox(namespace, params, options = {}) {
    let _params = { ...params };

    // default from_timestamp, 15 minutes before starting this request
    if (params.from_timestamp == null) {
      _params.from_timestamp = Math.floor(new Date().getTime() / 1000) - 15 * 60;
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

    // temporary workaround due cypress not supporting overriding maxRedirects
    if (_params.wait) {
      urlParams.delete('wait');
      const startTime = Date.now();
      return this._mailiskSearchAction(namespace, _options, urlParams, startTime, _options.timeout);
    } else {
      return this.request.get(`api/emails/${namespace}/inbox?${urlParams.toString()}`, _options);
    }
  }
}

module.exports = MailiskCommands;
