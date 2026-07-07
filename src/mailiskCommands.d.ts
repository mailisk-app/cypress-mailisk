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

export type OutboundEmailType = 'new' | 'reply' | 'forward';

export type OutboundEmailStatus = 'queued' | 'sending' | 'sent' | 'failed';

export type OutboundEmailRecipientType = 'to' | 'cc' | 'bcc';

export type OutboundEmailRecipientDeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'queued'
  | 'sent'
  | 'delayed'
  | 'deferred'
  | 'delivered'
  | 'bounced'
  | 'expired'
  | 'complained'
  | 'unsubscribed'
  | 'suppressed'
  | 'rejected'
  | 'failed'
  | 'cancelled';

export type OutboundEmailEventType =
  | 'accepted'
  | 'queued'
  | 'sent'
  | 'failed'
  | 'rejected'
  | 'delayed'
  | 'deferred'
  | 'delivered'
  | 'bounced'
  | 'expired'
  | 'complained'
  | 'unsubscribed'
  | 'suppressed'
  | 'cancelled'
  | 'opened'
  | 'clicked';

export type OutboundEmailAttachmentDisposition = 'attachment' | 'inline';

export interface OutboundEmailAddress {
  /** Email address */
  email: string;
  /** Display name, if one is specified */
  name?: string;
}

export interface OutboundEmailAttachment {
  /** Filename of the attachment */
  filename: string;
  /** MIME content type */
  content_type: string;
  /** Base64 encoded attachment content */
  content_base64: string;
  /** Content-ID for inline attachments */
  content_id?: string;
  /** Attachment disposition */
  disposition?: OutboundEmailAttachmentDisposition;
}

export interface SendEmailParams {
  /** Optional sender override. Must belong to the requested namespace. */
  from?: OutboundEmailAddress;
  /** Optional Reply-To address */
  reply_to?: OutboundEmailAddress;
  /** Primary recipients */
  to?: string[];
  /** Carbon-copied recipients */
  cc?: string[];
  /** Blind carbon-copied recipients */
  bcc?: string[];
  /** Email subject */
  subject: string;
  /** HTML message body */
  html?: string;
  /** Plain text message body */
  text?: string;
  /** Attachments to include */
  attachments?: OutboundEmailAttachment[];
}

export interface ReplyToEmailParams {
  /** Optional sender override. Must belong to the source email namespace. */
  from?: OutboundEmailAddress;
  /** Carbon-copied recipients */
  cc?: string[];
  /** Blind carbon-copied recipients */
  bcc?: string[];
  /** Optional subject. Defaults to Re: original subject. */
  subject?: string;
  /** HTML reply body */
  html?: string;
  /** Plain text reply body */
  text?: string;
  /** Attachments to include */
  attachments?: OutboundEmailAttachment[];
}

export interface ForwardEmailParams {
  /** Optional sender override. Must belong to the source email namespace. */
  from?: OutboundEmailAddress;
  /** Primary recipients */
  to: string[];
  /** Carbon-copied recipients */
  cc?: string[];
  /** Blind carbon-copied recipients */
  bcc?: string[];
  /** Optional subject. Defaults to Fwd: original subject. */
  subject?: string;
  /** Optional HTML body to prepend before the forwarded message */
  html?: string;
  /** Optional plain text body to prepend before the forwarded message */
  text?: string;
}

export interface OutboundEmailResponse {
  id: string;
  organisation_id: string;
  type: OutboundEmailType;
  status: OutboundEmailStatus;
  from: OutboundEmailAddress;
  reply_to?: OutboundEmailAddress;
  subject: string;
  recipient_count: number;
  attachment_count: number;
  message_id: string;
  provider?: string;
  provider_message_id?: string;
  failure_reason?: string;
  queued_at: string;
  sending_at?: string;
  sent_at?: string;
  failed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OutboundEmailDeliverySummary {
  pending: number;
  accepted: number;
  queued: number;
  sent: number;
  delayed: number;
  deferred: number;
  delivered: number;
  bounced: number;
  expired: number;
  complained: number;
  unsubscribed: number;
  suppressed: number;
  rejected: number;
  failed: number;
  cancelled: number;
}

export interface OutboundEmailRecipient {
  id: string;
  type: OutboundEmailRecipientType;
  email: string;
  name?: string;
  delivery_status: OutboundEmailRecipientDeliveryStatus;
  last_event_type?: string;
  last_event_at?: string;
  accepted_at?: string;
  queued_at?: string;
  sent_at?: string;
  delayed_at?: string;
  deferred_at?: string;
  delivered_at?: string;
  bounced_at?: string;
  expired_at?: string;
  complained_at?: string;
  unsubscribed_at?: string;
  suppressed_at?: string;
  rejected_at?: string;
  failed_at?: string;
  cancelled_at?: string;
  last_smtp_code?: string;
  last_enhanced_status_code?: string;
  last_smtp_response?: string;
  attempt_count: number;
  bounce_type?: string;
  bounce_subtype?: string;
  bounce_classification?: string;
  complaint_feedback_type?: string;
}

export interface OutboundEmailEventRecipient {
  id: string;
  outbound_email_recipient_id?: string;
  email: string;
  smtp_code?: string;
  enhanced_status_code?: string;
  smtp_response?: string;
  diagnostic_code?: string;
  action?: string;
  attempt_count?: number;
  bounce_classification?: string;
}

export interface OutboundEmailEvent {
  id: string;
  provider: string;
  provider_message_id?: string;
  provider_event_id?: string;
  event_type: OutboundEmailEventType;
  event_subtype?: string;
  occurred_at: string;
  recipients: OutboundEmailEventRecipient[];
  created_at: string;
}

export interface OutboundEmailDetailResponse extends OutboundEmailResponse {
  delivery_summary: OutboundEmailDeliverySummary;
  recipients: OutboundEmailRecipient[];
  events: OutboundEmailEvent[];
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
  expires_at?: string | null;
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
  shared_secret: string;
  /** Optional device display name. */
  name?: string;
  /** Optional future ISO expiration timestamp. */
  expires_at?: string;
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
  expires_at?: string;
}

export interface CreateBase32SecretKeyTotpDeviceParams {
  /** Base32 secret key. */
  base32_secret_key: string;
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
  expires_at?: string;
}

export interface CreateOtpAuthUrlTotpDeviceParams {
  /** otpauth://totp URL with a secret query parameter. */
  otp_auth_url: string;
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
  expires_at?: string;
}

export interface TotpOtpResponse {
  /** Generated one-time password code. */
  code: string;
  /** ISO timestamp when the code expires. */
  expires: string;
}

export interface TotpOtpParams {
  /**
   * Minimum number of seconds the generated code must remain valid.
   *
   * When the current TOTP code expires sooner than this value, the API waits
   * for the next code before responding.
   */
  min_seconds_until_expire?: number;
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

      mailiskSendEmail(
        /**
         * Namespace to send from.
         */
        namespace: string,
        /**
         * Outbound email input.
         */
        input: SendEmailParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<OutboundEmailResponse>;

      mailiskGetOutboundEmail(
        /**
         * Outbound email ID returned by mailiskSendEmail, mailiskReplyToEmail, or mailiskForwardEmail.
         */
        outboundEmailId: string,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<OutboundEmailDetailResponse>;

      mailiskReplyToEmail(
        /**
         * Inbound email ID returned by mailiskSearchInbox.
         */
        emailId: string,
        /**
         * Reply input.
         */
        input: ReplyToEmailParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<OutboundEmailResponse>;

      mailiskForwardEmail(
        /**
         * Inbound email ID returned by mailiskSearchInbox.
         */
        emailId: string,
        /**
         * Forward input.
         */
        input: ForwardEmailParams,
        /**
         * Request options.
         *
         * See https://docs.cypress.io/api/commands/request#Arguments
         */
        options?: Partial<Cypress.RequestOptions>,
      ): Cypress.Chainable<OutboundEmailResponse>;

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

      mailiskDeviceOtpByDeviceId(
        /**
         * Saved device ID.
         */
        deviceId: string,
        /**
         * OTP generation parameters.
         */
        params?: TotpOtpParams,
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

      mailiskDeviceOtpBySharedSecret(
        /**
         * Shared secret for one-off OTP generation.
         */
        sharedSecret: string,
        /**
         * OTP generation parameters.
         */
        params?: TotpOtpParams,
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
