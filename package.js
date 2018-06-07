Package.describe({
  name: 'enzymapp:accounts-passwordless',
  version: '0.3.2',
  summary: 'Token-based one-time password (OTPW) authentication (nopassword, passwordless)',
  git: 'https://github.com/enzymapp/meteor-accounts-passwordless',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.6.1');

  api.use(['ecmascript', 'tmeasday:check-npm-versions@0.3.2'])
  api.use(['tracker', 'underscore', 'templating@1.3.2', 'session'], 'client');
  api.use('email', 'server');
  api.use(['accounts-base', 'check'], ['client', 'server']);
  api.use(['random', 'jperl:match-ex@1.0.0'], 'server')

  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server'])


  api.addFiles('templates.html', 'client')

  api.mainModule('passwordless-server.js', 'server')
  api.mainModule('passwordless-client.js', 'client')
});
