import {Accounts} from 'meteor/accounts-base'
// from accounts-password code
export default (options) => {
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary
  // options.
  check(options, Match.ObjectIncluding({
    username: Match.Optional(String),
    email:    Match.Optional(String),
  }))

  const {clientIpAddress, email, username} = options
  if (!username && !email)
    throw new Meteor.Error(400, "Need to set a username or email")

  const user = {services: {}}

  if (username)
    user.username = username
  if (email)
    user.emails = [{address: email, verified: false}]

  if(Accounts.passwordless.handleClientIpAddress) {
    options.profile = Accounts.passwordless.handleClientIpAddress(
      options.profile,
      clientIpAddress
    )
  }
  return Accounts.insertUserDoc(options, user)
}
