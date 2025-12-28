# cypress-mailisk

Mailisk is an end-to-end email and SMS testing platform. It allows you to receive emails and SMS messages with code to automate tests.

- Get a unique subdomain and unlimited email addresses for free.
- Easily automate E2E password reset and account verification by catching emails.
- Receive SMS messages and automate SMS tests.
- Virtual SMTP and SMS support to test without 3rd party clients.

## Get started

For a more step-by-step walkthrough see the [Cypress Guide](https://docs.mailisk.com/guides/cypress.html).

### Installation

#### Install with npm

```shell
npm install --save-dev cypress-mailisk
```

#### Install with Yarn

```shell
yarn add cypress-mailisk --dev
```

#### Add to Cypress

After installing the package add the following in your project's `cypress/support/e2e.js`:

```js
import 'cypress-mailisk';
```

## Setup API Key

To be able to use the API you will need to add your [API key](http://docs.mailisk.com/#getting-your-api-key) to `cypress.config.js`:

```js
module.exports = defineConfig({
  env: {
    MAILISK_API_KEY: 'YOUR_API_KEY',
  },
});
```

## Usage

The cypress-mailisk plugin provides additional commands which can be accessed on the cypress object, for example `cy.mailiskSearchInbox()`. These commands extend the Chainable object which allows you to use the [`then()`](https://docs.cypress.io/api/commands/then#Usage) method to chain commands.

### cy.mailiskSearchInbox

This is the main command to interact with Mailisk, it wraps the [Search Inbox](/api-reference/search-inbox) endpoint. See the reference documentation for the full list of filters and their description.

```js
cy.mailiskSearchInbox('yournamespace', { to_addr_prefix: 'test.user@', subject_includes: 'register' }).then(
  (response) => {
    const emails = response.data;
    expect(emails).to.not.be.empty;
  },
);
```

This command does a few extra things out of the box:

- Waits until at least one new email arrives (override with `wait: false`).
- Times out after 5 minutes if nothing shows up (adjust via `requestOptions.timeout`).
- Ignores messages older than 15 minutes to avoid picking up leftovers from previous tests (change via `from_timestamp`).

#### Quick examples

```js
// wait up to the default 5 min for *any* new mail
cy.mailiskSearchInbox(namespace);
// custom 60-second timeout
cy.mailiskSearchInbox(namespace, {}, { timeout: 1000 * 60 });
// polling pattern — return immediately, even if inbox is empty
cy.mailiskSearchInbox(namespace, { wait: false });
// returns the last 20 emails in the namespace immediately
cy.mailiskSearchInbox(namespace, { wait: false, from_timestamp: 0, limit: 20 });
```

#### Filter by destination address

A common pattern is to wait for the email your UI just triggered (e.g. password-reset).
Pass `to_addr_prefix` so you don’t pick up stale messages:

```js
cy.mailiskSearchInbox(namespace, {
  to_addr_prefix: `test.user@${namespace}.mailisk.net`,
}).then((response) => {
  const emails = response.data;
  expect(emails).to.not.be.empty;
});
```

#### Filter by sender address

Use `from_addr_includes` to narrow results to a sender or domain. This is useful when multiple systems write to the same namespace but only one sender matters for the test.

```js
cy.mailiskSearchInbox(namespace, {
  from_addr_includes: '@example.com',
}).then((response) => {
  const emails = response.data;
  expect(emails).to.not.be.empty;
});
```

#### Filter by subject contents

The `subject_includes` filter helps when the UI sends different notification types from the same sender. Matching is case-insensitive and only requires the provided string to be present.

```js
cy.mailiskSearchInbox(namespace, {
  to_addr_prefix: `test.user@${namespace}.mailisk.net`,
  subject_includes: 'password reset',
}).then((response) => {
  const emails = response.data;
  expect(emails).to.not.be.empty;
});
```

### cy.mailiskGetAttachment

This command retrieves attachment metadata including download URL, filename, content type, and size.

```js
cy.mailiskGetAttachment('attachment-id').then((attachment) => {
  console.log(attachment.data.filename);
  console.log(attachment.data.content_type);
  console.log(attachment.data.size);
});
```

### cy.mailiskDownloadAttachment

This command downloads the actual attachment content as a Buffer. It first retrieves the attachment metadata, then downloads the file from the provided download URL.

```js
cy.mailiskDownloadAttachment('attachment-id').then((buffer) => {
  cy.writeFile('downloads/attachment.pdf', buffer);
});
```

### cy.mailiskSearchSms

This is the main command to interact with Mailisk SMS, it wraps the [Search SMS](/api-reference/search-sms) endpoint. Use a phone number that is registered to your account.

```js
cy.mailiskSearchSms('phoneNumber', { from_date: new Date('2023-01-01T00:00:00Z'), limit: 5 }).then((response) => {
  const smsMessages = response.data;
});
```

This Cypress command does a few extra things out of the box compared to calling the raw API directly:

- Waits until at least one SMS matches the filters (override with `wait: false`).
- Times out after 5 minutes if nothing shows up (adjust via `requestOptions.timeout`).
- Ignores SMS older than 15 minutes by default (override with `from_date`).

#### Quick examples

```js
// wait up to the default 5 min for *any* new SMS sent to the phone number
cy.mailiskSearchSms('phoneNumber');
// custom 60-second timeout
cy.mailiskSearchSms('phoneNumber', {}, { timeout: 1000 * 60 });
// polling pattern — return immediately, even if inbox is empty
cy.mailiskSearchSms('phoneNumber', { wait: false });
// returns the last 20 SMS messages for the phone number immediately
cy.mailiskSearchSms('phoneNumber', { wait: false, from_date: new Date(0), limit: 20 });
```

#### Filter by sender phone number

Use `from_number` to narrow results to a specific phone number.

```js
cy.mailiskSearchSms('phoneNumber', {
  from_number: '1234567890',
}).then((response) => {
  const smsMessages = response.data;
});
```

#### Filter by body contents

Use `body` to narrow results to a specific message body.

```js
cy.mailiskSearchSms('phoneNumber', {
  body: 'Here is your code:',
}).then((response) => {
  const smsMessages = response.data;
});
```

### cy.mailiskListSmsNumbers

This command lists the SMS numbers available to the current API key.

```js
cy.mailiskListSmsNumbers().then((response) => {
  const smsNumbers = response.data;
  expect(smsNumbers).to.not.be.empty;
});
```

## Common test cases

### Working with email attachments

This example demonstrates how to search for emails with attachments and download them:

```js
describe('Test email attachments', () => {
  const namespace = 'yournamespace';
  const testEmailAddr = `test.user@${namespace}.mailisk.net`;

  it('Finds email with attachment and downloads it', () => {
    cy.mailiskSearchInbox(namespace, {
      to_addr_prefix: testEmailAddr,
      subject_includes: 'invoice',
    }).then((response) => {
      expect(response.data).to.not.be.empty;
      const email = response.data[0];

      // Check if email has attachments
      expect(email.attachments).to.not.be.empty;
      const attachment = email.attachments[0];

      // Get attachment metadata
      cy.mailiskGetAttachment(attachment.id).then((attachmentData) => {
        expect(attachmentData.data.filename).to.contain('.pdf');
        expect(attachmentData.data.content_type).to.equal('application/pdf');

        // Download the attachment
        cy.mailiskDownloadAttachment(attachment.id).then((buffer) => {
          // Save to downloads folder
          cy.writeFile(`downloads/${attachmentData.data.filename}`, buffer);

          // Verify file was downloaded
          cy.readFile(`downloads/${attachmentData.data.filename}`).should('exist');
        });
      });
    });
  });
});
```

### Password reset page

This example demonstrates going to a password reset page, requesting a new password, receiving reset code link via email and finally setting the new password.

```js
describe('Test password reset', () => {
  let resetLink;
  const namespace = 'yournamespace';
  const testEmailAddr = `test.test@${namespace}.mailisk.net`;

  it('Starts a password reset', () => {
    cy.visit('https://example.com/password_reset');
    cy.get('#email_field').type(testEmailAddr);
  });

  it('Gets a password reset email', () => {
    cy.mailiskSearchInbox(namespace, {
      to_addr_prefix: testEmailAddr,
      subject_includes: 'password',
    }).then((response) => {
      expect(response.data).to.not.be.empty;
      const email = response.data[0];
      expect(email.subject).to.equal('Please reset your password');
      resetLink = email.text.match(/.(https:\/\/example.com\/password_reset\/.*)>\n*/)[1];
      expect(resetLink).to.not.be.undefined;
    });
  });

  it('Goes to password reset link', () => {
    cy.visit(resetLink);
    cy.title().should('contain', 'Change your password');
    cy.get('#password').type('MyNewPassword');
    cy.get('#password_confirmation').type('MyNewPassword');
    cy.get('form').submit();
  });
});
```

See the full [Mailisk Documentation](https://docs.mailisk.com) for more examples and information.
