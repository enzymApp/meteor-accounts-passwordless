import {Accounts} from 'meteor/accounts-base'
import {Meteor}   from 'meteor/meteor'
import {Session}  from 'meteor/session'

/**
 * Login with the verification code.
 * @param options code The verification code. selector The username or email (optional)
 * @param [callback]
 */
export default function ({code}, userCallback) {
  const ticket = Session.get('accounts-passwordless.ticket')
  Accounts.callLoginMethod({
    methodArguments: [{ticket, code}],
    userCallback,
  })
  if(ticket) {
    Session.set('accounts-passwordless.ticket', '')
  }
}
