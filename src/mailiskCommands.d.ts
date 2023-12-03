/// <reference types="cypress" />

export interface EmailAddress {
  /** Email address */
  address: string;
  /** Display name, if one is specified */
  name?: string;
}

export interface Email {
  /** Namespace scoped ID */
  id: string;
  /** Sender of email */
  from: EmailAddress;
  /** Recepients of email */
  to: EmailAddress[];
  /** Carbon-copied recipients for email message */
  cc?: EmailAddress[];
  /** Blind carbon-copied recipients for email message */
  bcc?: EmailAddress[];
  /** Subject of email */
  subject?: string;
  /** Email content that was sent in HTML format */
  html?: string;
  /** Email content that was sent in plain text format */
  text?: string;
  /** The datetime that this email was received */
  received_date: Date;
  /** The unix timestamp (s) that this email was received */
  received_timestamp: number;
  /** The unix timestamp (s) when this email will be deleted */
  expires_timestamp: number;
  /** The spam score as reported by SpamAssassin */
  spam_score?: number;
}

export interface SearchInboxParams {
  /**
   * The maximum number of emails that can be returned in this request, used alongside `offset` for pagination.
   */
  limit?: number;
  /**
   * The number of emails to skip/ignore, used alongside `limit` for pagination.
   */
  offset?: number;
  /**
   * Filter emails by starting unix timestamp in seconds.
   */
  from_timestamp?: number;
  /**
   * Filter emails by ending unix timestamp in seconds.
   */
  to_timestamp?: number;
  /**
   * Filter emails by 'to' address. Address must start with this.
   *
   * 'foo' would return for 'foobar@namespace.mailisk.net' but not 'barfoo@namespace.mailisk.net'
   */
  to_addr_prefix?: string;
  /**
   * Filter emails by 'from' address. Address must include this.
   *
   * '@foo' would return for 'a@foo.com', 'b@foo.net'
   */
  from_addr_includes?: string;
  /**
   * Filter emails by subject. This is case insensitive. Subject must include this.
   *
   * 'password' would return for 'Password reset', 'Reset password notification' but not 'Reset'
   */
  subject_includes?: string;
  /**
   * Will keep the request going till at least one email would be returned.
   *
   * Default is `true`
   */
  wait?: boolean;
}

export interface SearchInboxResponse {
  /**
   * Total number of emails matching query.
   */
  total_count: number;
  /**
   * Parameters that were used for the query
   */
  options: SearchInboxParams;
  /**
   * Emails
   */
  data: Email[];
}

declare global {
  namespace Cypress {
    interface Chainable {
      mailiskSearchInbox(
        /**
         * The unique namespace to search.
         */
        namespace: string,
        /**
         * Search parameters.
         */
        params?: SearchInboxParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<SearchInboxResponse>;
    }
  }
}
