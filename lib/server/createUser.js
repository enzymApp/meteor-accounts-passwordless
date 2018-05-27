
// from accounts-password code
export default (options) => {
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary
  // options.
  check(options, Match.ObjectIncluding({
    username: Match.Optional(String),
    email: Match.Optional(String),
  }));

  var username = options.username;
  var email = options.email;
  if (!username && !email)
    throw new Meteor.Error(400, "Need to set a username or email");

  var user = {services: {}};
  if (options.password) {
    var hashed = hashPassword(options.password);
    user.services.password = { bcrypt: hashed };
  }

  if (username)
    user.username = username;
  if (email)
    user.emails = [{address: email, verified: false}];

  return Accounts.insertUserDoc(options, user);
}
