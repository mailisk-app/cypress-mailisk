const Request = require('./request');

class MailiskCommands {
  static get cypressCommands() {
    return [
      'mailiskSetApiKey',
      'mailiskListNamespaces',
      'mailiskSearchInbox',
      'mailiskGetAttachment',
      'mailiskDownloadAttachment',
      'mailiskSearchSms',
      'mailiskListSmsNumbers',
    ];
  }

  constructor() {
    this.request = null;
  }

  _getEnv(keys) {
    if (typeof cy !== 'undefined' && typeof cy.env === 'function') {
      return cy.env(keys);
    }
    // fallback to Cypress.env for Cypress < 15.10.0
    if (typeof Cypress !== 'undefined' && typeof Cypress.env === 'function') {
      const values = {};
      for (const key of keys) {
        values[key] = Cypress.env(key);
      }
      if (typeof cy !== 'undefined' && typeof cy.wrap === 'function') {
        return cy.wrap(values, { log: false });
      }
      return Promise.resolve(values);
    }
    const emptyValues = {};
    for (const key of keys) {
      emptyValues[key] = undefined;
    }
    return Promise.resolve(emptyValues);
  }

  mailiskSetApiKey(apiKey) {
    return this._getEnv(['MAILISK_API_URL']).then(({ MAILISK_API_URL }) => {
      this.request = new Request({ apiKey, apiUrl: MAILISK_API_URL });
      return null;
    });
  }

  _initRequestFromEnv() {
    return this._getEnv(['MAILISK_API_KEY', 'MAILISK_API_URL']).then(({ MAILISK_API_KEY, MAILISK_API_URL }) => {
      this.request = new Request({ apiKey: MAILISK_API_KEY, apiUrl: MAILISK_API_URL });
      return this.request;
    });
  }

  _withRequest(action) {
    if (this.request) {
      return action(this.request);
    }
    return this._initRequestFromEnv().then((request) => action(request));
  }

  mailiskListNamespaces() {
    return this._withRequest((request) => request.get('api/namespaces'));
  }

  _mailiskSearchInboxAction(request, namespace, _options, urlParams, startTime, nextTimeout) {
    return request
      .get(`api/emails/${namespace}/inbox?${urlParams.toString()}`, { ..._options, timeout: nextTimeout })
      .then((response) => {
        if (response.total_count !== 0) {
          return response;
        }
        const timeout = Math.max(_options.timeout - (Date.now() - startTime), 1);
        cy.wait(Math.min(timeout, 9000), { log: false });
        return this._mailiskSearchInboxAction(request, namespace, _options, urlParams, startTime, timeout);
      });
  }

  mailiskSearchInbox(namespace, params = {}, options = {}) {
    let _params = { ...params };

    // default from_timestamp, 15 minutes before starting this request
    if (_params.from_timestamp == null) {
      _params.from_timestamp = Math.floor(Date.now() / 1000) - 15 * 60;
    }

    // by default wait for email
    if (_params.wait !== false) {
      _params.wait = true;
    }

    const urlParams = new URLSearchParams();
    for (const key in _params) {
      const value = _params[key];
      if (value !== undefined && value !== null) urlParams.set(key, value.toString());
    }

    let _options = { ...options };

    // by default wait 5 minutes for emails
    if (_params.wait && !options.timeout) {
      _options.timeout = 1000 * 60 * 5;
    }

    // temporary workaround due cypress not supporting overriding maxRedirects
    return this._withRequest((request) => {
      if (_params.wait) {
        urlParams.delete('wait');
        const startTime = Date.now();
        return this._mailiskSearchInboxAction(request, namespace, _options, urlParams, startTime, _options.timeout);
      }
      return request.get(`api/emails/${namespace}/inbox?${urlParams.toString()}`, _options);
    });
  }

  mailiskGetAttachment(attachmentId, options = {}) {
    return this._withRequest((request) => request.get(`api/attachments/${attachmentId}`, options));
  }

  mailiskDownloadAttachment(attachmentId, options = {}) {
    return this._withRequest((request) =>
      request.get(`api/attachments/${attachmentId}`, options).then((attachment) => {
        return request.getBinary(attachment.data.download_url, options);
      }),
    );
  }

  _mailiskSearchSmsAction(request, phoneNumber, _options, urlParams, startTime, nextTimeout) {
    return request
      .get(`api/sms/${phoneNumber}/messages?${urlParams.toString()}`, { ..._options, timeout: nextTimeout })
      .then((response) => {
        if (response.total_count !== 0) {
          return response;
        }
        const timeout = Math.max(_options.timeout - (Date.now() - startTime), 1);
        cy.wait(Math.min(timeout, 9000), { log: false });
        return this._mailiskSearchSmsAction(request, phoneNumber, _options, urlParams, startTime, timeout);
      });
  }

  mailiskSearchSms(phoneNumber, params = {}, options = {}) {
    let _params = { ...params };

    // default from_date, 15 minutes before starting this request
    if (_params.from_date == null) {
      _params.from_date = new Date(Date.now() - 15 * 60 * 1000);
    }

    // by default wait for email
    if (params.wait !== false) {
      _params.wait = true;
    }

    if (_params.from_date instanceof Date) {
      _params.from_date = _params.from_date.toISOString();
    }
    if (_params.to_date instanceof Date) {
      _params.to_date = _params.to_date.toISOString();
    }

    const urlParams = new URLSearchParams();
    for (const key in _params) {
      const value = _params[key];
      if (value !== undefined && value !== null) urlParams.set(key, value.toString());
    }

    let _options = { ...options };

    // by default wait 5 minutes for emails
    if (_params.wait && !options.timeout) {
      _options.timeout = 1000 * 60 * 5;
    }

    // temporary workaround due cypress not supporting overriding maxRedirects
    return this._withRequest((request) => {
      if (_params.wait) {
        urlParams.delete('wait');
        const startTime = Date.now();
        return this._mailiskSearchSmsAction(request, phoneNumber, _options, urlParams, startTime, _options.timeout);
      }
      return request.get(`api/sms/${phoneNumber}/messages?${urlParams.toString()}`, _options);
    });
  }

  mailiskListSmsNumbers(options = {}) {
    return this._withRequest((request) => request.get(`api/sms/numbers`, options));
  }
}

module.exports = MailiskCommands;
