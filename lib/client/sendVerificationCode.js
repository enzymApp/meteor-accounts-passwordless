import {Meteor}  from 'meteor/meteor'
import {Session} from 'meteor/session'

/**
 * Request a verification code.
 * @param selector The email or username of the user
 * @param options method options
 * @param [callback]
 */
export default async function (selector, profile, options, callback) {
  if (!callback && typeof options === 'function') callback = options

  // Save the selector in a Session so even if the client reloads, the selector is stored
  Session.setPersistent('accounts-passwordless.selector', selector)
  Meteor.call('accounts-passwordless.sendVerificationCode', selector, profile, options, function(err, result) {
    if(!result) return
    const {ticket} = result
    if(ticket) {
      Session.setPersistent('accounts-passwordless.ticket', ticket)
    }
    callback && callback(err, result)
  })
}
