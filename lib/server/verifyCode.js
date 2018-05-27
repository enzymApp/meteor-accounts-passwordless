import {Accounts} from 'meteor/accounts-base'
import {PasswordlessCodes} from '../common/PasswordlessCodes'
import createUser          from './createUser'
import getUserAndEmail     from './getUserAndEmail'

/**
 * Verify if the code is valid
 * @param selector The email or username of the user
 * @param code The code the user entered
 */
export default function (code, ticket) {
  console.log("verifyCode", code, ticket)

  const validCode = PasswordlessCodes.findOne({code})
  if (!validCode) throw new Meteor.Error('Unknown email')

  const now = new Date().getTime() / 1000

  if (validCode.lastTry) {
    const timeToWait = validCode.lastTry.getTime() / 1000 + Math.pow(validCode.nbTry, 2)

    if (timeToWait > now)
      throw new Meteor.Error('You must wait ' + Math.ceil(timeToWait - now) + ' seconds')
  }
  const {email} = validCode

  if (validCode.code !== code) {
    PasswordlessCodes.update(
      {email},
      {$set: {lastTry: new Date()}, $inc: {nbTry: 1}}
    )
    throw new Meteor.Error('Invalid verification code')
  }
  if(ticket) {
    PasswordlessCodes.remove({email})
  } else {
    PasswordlessCodes.update({email}, {$set: {sendToOtherSession: true}})
  }

  let user = getUserAndEmail(email).user
  let uid
  if(user) {
    uid = user._id
  } else {
    uid  = createUser({email})
    user = Meteor.users.findOne(uid)
    console.log('created user', uid, user)
  }

  if(user) {
    // Set the email as verified since he validated the code with this email
    const ve = _.find(user.emails, (e) => e.address === email)
    if(ve && !ve.verified) {
      Meteor.users.update(
        { _id: uid, 'emails.address': email },
        { $set: { 'emails.$.verified': true } }
      )
    }
  }
  return { userId: uid }
}
