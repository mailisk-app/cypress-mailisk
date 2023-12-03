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
- By default it returns emails in the last 15 minutes. This ensures that only new emails are returned. Without this, older emails would also be returned, potentially disrupting you if you were waiting for a specific email. This can be overriden by passing the `from_timestamp` parameter (`from_timestamp: 0` will disable filtering by email age).

```js
// timeout of 5 minute
cy.mailiskSearchInbox(namespace);
// timeout of 1 minute
cy.mailiskSearchInbox(namespace, {}, { timeout: 1000 * 60 });
// returns immediately, even if the result would be empty
cy.mailiskSearchInbox(namespace, { wait: false });
```

The implementation of these features is explained in the [NodeJS Guide](/guides/nodejs).

## Example

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
