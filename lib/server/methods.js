import {Meteor} from 'meteor/meteor'

Meteor.methods({
  'accounts-passwordless.sendVerificationCode': function (selector, options) {
    check(selector, String);
    check(options, Match.Optional(Match.Any));
    return Accounts.passwordless.sendVerificationCode(selector, options);
  },
  'accounts-passwordless.setUsername': function (username) {
    check(username, String);
    if(!this.userId)        throw new Meteor.Error('You must be logged to change your username');
    if(username.length < 3) throw new Meteor.Error('Your username must have at least 3 characters');
    var existingUser = Meteor.users.findOne({ username: username });
    if(existingUser) throw new Meteor.Error('This username already exists');
    Meteor.users.update(this.userId, { $set: { username: username } });
  }
})
