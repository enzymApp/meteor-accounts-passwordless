import {Accounts} from 'meteor/accounts-base'

export default {
  from: "Meteor Accounts <no-reply@meteor.com>",
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),

  sendVerificationCode: {
    subject: function (code) {
      return "Your verification code is " + code + " for " + Accounts.passwordless.emailTemplates.siteName;
    },
    text: function (user, code) {
      var greeting = (user && user.username) ?
            ("Hello " + user.username + ",") : "Hello,";
      return greeting + "\n"
        + "\n"
        + "Your verification code is " + code + ".\n"
        + "\n"
        + "Thanks.\n";
    }
  }
}
