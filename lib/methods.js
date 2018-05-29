import {Meteor}           from 'meteor/meteor'
import {checkNpmVersions} from 'meteor/tmeasday:check-npm-versions'
import SimpleSchema       from 'simpl-schema'


Meteor.methods({
  'accounts-passwordless.sendVerificationCode': function (selector, options = {}) {
    new SimpleSchema({
      selector: String,
      options:  {
        type:         Object,
        optional:     true,
      },
      'options.username': {
        type:     String,
        optional: true,
      },
      'options.profile': (
        Meteor.users.schema ?
        Meteor.users.schema.pick('profile') :
        {type: Object, blackbox: true}
      ),
    }).validate({selector, options})
    const {username, profile} = options
    return Accounts.passwordless.sendVerificationCode(selector, username, profile)
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
