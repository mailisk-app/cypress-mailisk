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

- By default it uses the `wait` flag, this means the call won't timeout until at least one email is received or 5 minutes pass. This timeout is adjustable by passing `timeout` in the options array.
  ```js
  // timeout of 1 minute
  cy.mailiskSearchInbox(namespace, { timeout: 1000 * 60 });
  // disable wait entirely, may return empty emails objects immediately
  cy.mailiskSearchInbox(namespace, { wait: false });
  ```
- It has a default `from_timestamp` of **current timestmap - 5 seconds**. This means that only new emails will be returned. Without this older emails would be returned, permaturely returning the results if you were waiting for a specific email to arrive.

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
