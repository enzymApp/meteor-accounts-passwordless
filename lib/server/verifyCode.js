import {Accounts} from 'meteor/accounts-base'
import {PasswordlessCodes} from '../PasswordlessCodes'
import getUserAndEmail     from '../getUserAndEmail'
import createUser          from './createUser'

/**
 * Verify if the code is valid
 * @param selector The email or username of the user
 * @param code The code the user entered
 */
export default function (code, ticket, clientIpAddress) {
  const storedData = PasswordlessCodes.findOne({code})
  if (!storedData) throw new Meteor.Error('Unknown validation code')
  const validCode = storedData.code
  const {email, lastTry, nbTry} = storedData

  const now = new Date().getTime() / 1000

  if (lastTry) {
    const timeToWait = lastTry.getTime() / 1000 + Math.pow(nbTry, 2)
    if (timeToWait > now)
      throw new Meteor.Error('You must wait ' + Math.ceil(timeToWait - now) + ' seconds')
  }
  if (validCode !== code) {
    PasswordlessCodes.update(
      {email},
      {$set: {lastTry: new Date()}, $inc: {nbTry: 1}}
    )
    throw new Meteor.Error('Invalid verification code')
  }
  console.log(`code is correct (ticket: ${ticket})`)
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
    const {username, profile} = storedData
    uid  = createUser({
      email,
      username,
      profile: JSON.parse(profile),
      clientIpAddress,
    })
    user = Meteor.users.findOne(uid)
    console.log('created user', uid, user)
    //Meteor.users.update(uid, {$set: {username, profile}})
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
