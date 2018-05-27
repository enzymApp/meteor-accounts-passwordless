import {Meteor}  from 'meteor/meteor'
import {Session} from 'meteor/session'

/**
 * Request a verification code.
 * @param selector The email or username of the user
 * @param options method options
 * @param [callback]
 */
export default async function (selector, options, callback) {
  if (!callback && typeof options === 'function') callback = options

  // Save the selector in a Session so even if the client reloads, the selector is stored
  Session.set('accounts-passwordless.selector', selector)
  Meteor.call('accounts-passwordless.sendVerificationCode', selector, options, function(err, result) {
    const {ticket} = result
    if(ticket) {
      console.log("ticket", ticket)
      Session.set('accounts-passwordless.ticket', ticket)
    }
  })
}
