/// <reference types="cypress" />

export interface EmailAddress {
  /** Email address */
  address: string;
  /** Display name, if one is specified */
  name?: string;
}

export interface EmailAttachment {
  /** Unique identifier for the attachment */
  id: string;
  /** Filename of the attachment */
  filename: string;
  /** Content type of the attachment */
  content_type: string;
  /** Size in bytes of the attachment */
  size: number;
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
  /** The headers of the email */
  headers?: Record<string, string>;
  /** The attachments of the email */
  attachments?: EmailAttachment[];
}

export interface SmsMessage {
  /** Unique identifier for the message */
  id: string;
  /** Unique identifier for the SMS phone number */
  sms_phone_number_id: string;
  /** Body of the message */
  body: string;
  /** From number of the message */
  from_number: string;
  /** To number of the message */
  to_number: string;
  /** Provider message ID */
  provider_message_id?: string;
  /** Date and time the message was created */
  created_at: string;
  /** Direction of the message */
  direction: 'inbound' | 'outbound';
}

export interface SmsNumber {
  /** Unique identifier for the SMS number */
  id: string;
  /** Unique identifier for the organisation */
  organisation_id: string;
  /** Status of the SMS number */
  status: 'requested' | 'active' | 'disabled';
  /** Country of the SMS number */
  country: string;
  /** SMS Phone number */
  phone_number?: string;
  /** Date and time the SMS number was created */
  created_at: string;
  /** Date and time the SMS number was updated */
  updated_at: string;
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

export interface SmtpSettings {
  data: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
}

export interface GetAttachmentResponse {
  data: {
    id: string;
    filename: string;
    content_type: string;
    size: number;
    expires_at: string | null;
    download_url: string;
  };
}

export interface ListNamespacesResponse {
  total_count: number;
  data: { id: string; namespace: string }[];
}

export interface SearchSmsMessagesParams {
  /**
   * The maximum number of SMS messages returned (1-100), used alongside `offset` for pagination.
   */
  limit?: number;
  /**
   * The number of SMS messages to skip/ignore, used alongside `limit` for pagination.
   */
  offset?: number;
  /**
   * Filter messages by body contents (case insensitive).
   */
  body?: string;
  /**
   * Filter messages by sender phone number prefix.
   */
  from_number?: string;
  /**
   * Filter messages created on or after this date (Date object or ISO 8601 string).
   */
  from_date?: Date | string;
  /**
   * Filter messages created on or before this date (Date object or ISO 8601 string).
   */
  to_date?: Date | string;
  /**
   * When true, keep the request open until at least one SMS is returned.
   */
  wait?: boolean;
}

export interface SearchSmsMessagesResponse {
  total_count: number;
  options: SearchSmsMessagesParams;
  data: SmsMessage[];
}

export interface ListSmsNumbersResponse {
  total_count: number;
  data: SmsNumber[];
}

export interface SendVirtualSmsParams {
  /** The phone number to send the SMS from */
  from_number: string;
  /** The phone number to send the SMS to */
  to_number: string;
  /** The body of the SMS message */
  body: string;
}

export type TotpAlgorithm = 'SHA1' | 'SHA256' | 'SHA512';

export type KnownTotpDeviceSource = 'shared_secret' | 'custom' | 'base32_secret_key' | 'otpauth_url';

export type TotpDeviceSource = KnownTotpDeviceSource | (string & {});

export interface TotpDevice {
  /** Unique identifier for the saved authenticator device */
  id: string;
  /** Unique identifier for the organisation */
  organisation_id: string;
  /** Device display name */
  name: string;
  /** Account label, if one is specified */
  username?: string | null;
  /** Issuer/app label, if one is specified */
  issuer?: string | null;
  /** Number of digits in generated OTP codes */
  digits: number;
  /** OTP validity period in seconds */
  period: number;
  /** TOTP hash algorithm */
  algorithm: TotpAlgorithm;
  /** Source used to create the saved device */
  source: TotpDeviceSource;
  /** Optional expiration timestamp */
  expiresAt?: string | null;
  /** Date and time the device was created */
  created_at: string;
  /** Date and time the device was updated */
  updated_at: string;
}

export interface TotpDeviceListParams {
  /** Maximum number of devices returned. */
  limit?: number;
  /** Number of devices to skip. */
  offset?: number;
  /** Case-insensitive partial username match. */
  username?: string;
  /** Case-insensitive partial issuer match. */
  issuer?: string;
}

export interface TotpDeviceListResponse {
  total_count: number;
  options: TotpDeviceListParams;
  items: TotpDevice[];
}

export interface CreateTotpDeviceParams {
  /** Base32 shared secret. */
  sharedSecret: string;
  /** Optional device display name. */
  name?: string;
  /** Optional future ISO expiration timestamp. */
  expiresAt?: string;
}

export interface CreateCustomTotpDeviceParams {
  /** Base32 shared secret. */
  secret: string;
  /** Optional device display name. */
  name?: string;
  /** Optional account label. */
  username?: string;
  /** Optional issuer/app label. */
  issuer?: string;
  /** Number of digits in generated OTP codes. */
  digits?: 6 | 8;
  /** OTP validity period in seconds. */
  period?: number;
  /** TOTP hash algorithm. */
  algorithm?: TotpAlgorithm;
  /** Optional future ISO expiration timestamp. */
  expiresAt?: string;
}

export interface CreateBase32SecretKeyTotpDeviceParams {
  /** Base32 secret key. */
  base32SecretKey: string;
  /** Optional device display name. */
  name?: string;
  /** Optional account label. */
  username?: string;
  /** Optional issuer/app label. */
  issuer?: string;
  /** Number of digits in generated OTP codes. */
  digits?: 6 | 8;
  /** OTP validity period in seconds. */
  period?: number;
  /** TOTP hash algorithm. */
  algorithm?: TotpAlgorithm;
  /** Optional future ISO expiration timestamp. */
  expiresAt?: string;
}

export interface CreateOtpAuthUrlTotpDeviceParams {
  /** otpauth://totp URL with a secret query parameter. */
  otpAuthUrl: string;
  /** Optional device display name override. */
  name?: string;
  /** Optional account label fallback. */
  username?: string;
  /** Optional issuer/app label fallback. */
  issuer?: string;
  /** Number of digits in generated OTP codes, used only if missing from the URL. */
  digits?: 6 | 8;
  /** OTP validity period in seconds, used only if missing from the URL. */
  period?: number;
  /** TOTP hash algorithm, used only if missing from the URL. */
  algorithm?: TotpAlgorithm;
  /** Optional future ISO expiration timestamp. */
  expiresAt?: string;
}

export interface TotpOtpResponse {
  /** Generated one-time password code. */
  code: string;
  /** ISO timestamp when the code expires. */
  expires: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      mailiskListNamespaces(): Cypress.Chainable<ListNamespacesResponse>;

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

      mailiskGetAttachment(
        /**
         * The attachment ID to retrieve.
         */
        attachmentId: string,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<GetAttachmentResponse>;

      mailiskDownloadAttachment(
        /**
         * The attachment ID to download.
         */
        attachmentId: string,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<Buffer>;

      mailiskSearchSms(
        /**
         * The phone number to search.
         */
        phoneNumber: string,
        /**
         * Search parameters.
         */
        params?: SearchSmsMessagesParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<SearchSmsMessagesResponse>;

      mailiskListSmsNumbers(
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<ListSmsNumbersResponse>;

      mailiskDeviceList(
        /**
         * List filters and pagination options.
         */
        params?: TotpDeviceListParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<TotpDeviceListResponse>;

      mailiskDeviceCreate(
        /**
         * Saved device input using default TOTP settings.
         */
        input: CreateTotpDeviceParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<TotpDevice>;

      mailiskDeviceCreateCustom(
        /**
         * Saved device input using custom TOTP settings.
         */
        input: CreateCustomTotpDeviceParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<TotpDevice>;

      mailiskDeviceCreateFromBase32SecretKey(
        /**
         * Saved device input using a Base32 secret key.
         */
        input: CreateBase32SecretKeyTotpDeviceParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<TotpDevice>;

      mailiskDeviceCreateFromOtpAuthUrl(
        /**
         * Saved device input using an otpauth URL.
         */
        input: CreateOtpAuthUrlTotpDeviceParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<TotpDevice>;

      mailiskDeviceOtpByDeviceId(
        /**
         * Saved device ID.
         */
        deviceId: string,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<TotpOtpResponse>;

      mailiskDeviceOtpBySharedSecret(
        /**
         * Shared secret for one-off OTP generation.
         */
        sharedSecret: string,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<TotpOtpResponse>;

      mailiskDeviceDelete(
        /**
         * Saved device ID.
         */
        deviceId: string,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<void>;
    }
  }
}
