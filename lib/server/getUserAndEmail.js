export default function(selector) {
  if (selector.indexOf('@') === -1) {
    const user = Meteor.users.findOne({ username: selector })
    if(!user) throw new Meteor.Error('Username \'' + selector + '\' doesn\'t exists, enter your email address to create your account instead of your username.')
    if(!user.emails || user.emails.length < 1) throw new Meteor.Error('No email attached to user ' + selector)
    return {
      user,
      email: user.emails[0].address
    }
  }
  return {
    user:  Meteor.users.findOne({ 'emails.address': selector }),
    email: selector,
  }
}
