# cypress-mailisk

## Install with npm

```shell
npm install --save-dev cypress-mailisk
```

## Install with Yarn

```shell
yarn add cypress-mailisk --dev
```

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

This is the main command to interact with Mailisk, it wraps the [Search Inbox](/api-reference/search-inbox) endpoint.

```js
cy.mailiskSearchInbox('yournamespace', { to_addr_prefix: 'test.user@' }).then((response) => {
  const emails = response.data;
  // ...
});
```

This Cypress command does a few extra things out of the box compared to calling the raw API directly:

- By default it uses the `wait` flag. This means the call won't return until at least one email is received. Disabling this flag via `wait: false` can cause it to return an empty response immediately.
- The request timeout is adjustable by passing `timeout` in the request options. By default it uses a timeout of 5 minutes.
- By default it returns emails in the last 15 minutes. This ensures that only new emails are returned. This can be overriden by passing the `from_timestamp` parameter (`from_timestamp: 0` will disable filtering by email age).

```js
// timeout of 5 minute
cy.mailiskSearchInbox(namespace);
// timeout of 1 minute
cy.mailiskSearchInbox(namespace, {}, { timeout: 1000 * 60 });
// returns immediately, even if the result would be empty
cy.mailiskSearchInbox(namespace, { wait: false });
```

For the full list of filters and their description see the [Search Inbox](/api-reference/search-inbox#request-1) endpoint reference.

### Filter by TO address

The `to_addr_prefix` option allows filtering by the email's TO address. Specifically the TO address has to start with this.

For example, if someone sends an email to `my-user-1@yournamespace.mailisk.net`, you can filter it by using `my-user-1@`:

```js
cy.mailiskSearchInbox(namespace, {
  to_addr_prefix: 'my-user-1@',
});
```

### Filter by FROM address

The `from_addr_includes` option allows filtering by the email's FROM address. Specifically the TO address has to include this. Note that this is different from the to address as it is _includes_ not _prefix_.

For example, if someone sends an email from the `example.com` domain we could filter like so:

```js
cy.mailiskSearchInbox(namespace, {
  from_addr_includes: '@example.com',
});
```

If we know a specific email address we want to listen to we can do this:

```js
cy.mailiskSearchInbox(namespace, {
  from_addr_includes: 'no-reply@example.com',
});
```

### Filter by Subject

The `subject_includes` option allows filtering by the email's Subject. Specifically the Subject has to include this (case-insensitive).

If we're testing password reset that sends an email with the subject `Password reset request`. We could filter by something like this:

```js
cy.mailiskSearchInbox(namespace, {
  subject_includes: 'password reset request',
});
```

## Common test cases

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
