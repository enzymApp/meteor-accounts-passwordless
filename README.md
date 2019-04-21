# meteor-accounts-passwordless

Passwordless is an open source Meteor package for token-based one-time password (OTPW) and url-based authentication.
Ported to Meteor 1.6 and React 16 (may work with older versions)
Based on acemtp awesome work.


## Changelog

- 0.4: add support for HTML emails


## Install

```
meteor add acemtp:accounts-passwordless
```

## Configuration

Configuration is done overwriting the default values in object Accounts.passwordless.

```javascript
Accounts.passwordless = {
  config: {                 // defined in /passwordless-client.js
    codeType:            'digits',
    validationRoutePath: '/validation',
    emailFrom:           'Meteor Accounts <no-reply@meteor.com>',
    tokenLifeTime:       15 * 60,
  }
  emailTemplates: {}        // default templates in /lib/server/emailTemplates.js
}
```

## Usage

You have 2 ways to use it, the highlevel that use the default ui or the low level to plug on your own application.

Not sure the default UI mode is still working fine: we only use React.

### Default UI

This is the easiest way to use the package. Add this line in a template and voila:

    {{> loginPasswordless}}

This is how it's done on the [live demo](http://passwordless.meteor.com). The source code of this example is on [Github](https://github.com/efounders/meteor-accounts-passwordless/tree/master/example).

### Low Level API

If the default layout doesn't fit your needs, you can call the low level api. You can copy how it's made on the [default ui source file](https://github.com/efounders/meteor-accounts-passwordless/blob/master/accounts-passwordless-ui.js).

Basically, there're 3 methods you have to call on the client:

#### Meteor.sendVerificationCode(selector, options, callback)

Call this one will send the verification code to the user.

The `selector` can be the email of the user or his username. If you pass the username, the accounts must already exists to find the associate email and send the email.

The `options` is an object that could contain `username` and `profile` that would be set in Meteor.users after user creation. Be aware that profile content must be considered as non safe and fully editable by the corresponding user.

The callback has 2 parameters, `error` and `result`.

#### Meteor.loginWithPasswordless(options, callback)

options is an object that must contain the `code` entered by the user after he read the email. It can also contains `selector` that was the selector used at the `Meteor.sendVerificationCode` step.

That's all you need to log in a user with passwordless.

#### Meteor.setUsername(username, callback)

You don't have to call this function. It's just an utility function to set the username of the logged user, in case you don't want to display the user email.

#### withEmailValidation : React High Order Component

Simple optional helper to get the parameters from route, call Meteor.loginWithPasswordless and display component based on status (loading, success, failure).
For the url-based validation only.

#### handleClientIpAddress(profile, clientIpAddress)

Callback you could define to do something with the client IP address and the user's future profile. Must return the profile that will be saved on user creation.


#### Workflow

Here is the minimal workflow you have to implement:

- ask the user his email or username
- call `Meteor.sendVerificationCode` with the value given by the user
- ask the user his verification code sent by email
- call `Meteor.loginWithPasswordless` with the verification code
- the user is logged


For the url-based validation:

- ...
- user clicks on the link
- it opens a new page calling Meteor.loginWithPasswordless (withEmailValidation could be used to do this automatically)
- the user is logged
- *special bonus:* the previous session (where he set his email) is also logged! Useful when first form is fullfilled in the desktop browser and email is received on the mobile phone.

Some optional extra steps:

- (optional) ask the user his username and call `Meteor.setUsername` with the value given by the user
- (optional) call `Meteor.logout()` to logout the user



### Test the example locally on your computer

- git clone https://github.com/efounders/meteor-accounts-passwordless.git
- cd meteor-accounts-passwordless/example
- meteor
- then open a browser to [http://localhost:3000](http://localhost:3000)
- since the email is not configured by default on your computer, the email (verification code) will be displayed on the server console.
