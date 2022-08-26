const MailiskCommands = require('./mailiskCommands');

const register = (Cypress) => {
  const mailiskCommands = new MailiskCommands();
  MailiskCommands.cypressCommands.forEach((commandName) => {
    Cypress.Commands.add(commandName, mailiskCommands[commandName].bind(mailiskCommands));
  });
};

module.exports = {
  register,
};
