import {Meteor}           from 'meteor/meteor'
import SimpleSchema       from 'simpl-schema'


Meteor.methods({
  'accounts-passwordless.sendVerificationCode': function(
    selector,
    profile = {},
    options = {}
  ) {
    new SimpleSchema({
      selector: String,
      profile: (
        Meteor.users.schema ?
          Meteor.users.schema.getObjectSchema('profile') :
          {type: Object, blackbox: true}
      ),
      options:  {
        type:         Object,
        optional:     true,
        blackbox:     true,
      },
    }).validate({selector, profile, options})
    const {username} = options
    const sendVerificationCode = Accounts.passwordless.sendVerificationCode.bind(this)
    return sendVerificationCode(selector, username, profile, options)
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
