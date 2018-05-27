import {Accounts} from 'meteor/accounts-base'
import {Meteor}   from 'meteor/meteor'
import {Session}  from 'meteor/session'

/**
 * Login with the verification code.
 * @param options code The verification code. selector The username or email (optional)
 * @param [callback]
 */
export default function ({code}, callback) {
  Accounts.callLoginMethod({
    methodArguments: [{
      //selector: Session.get('accounts-passwordless.selector') || selector,
      ticket:   Session.get('accounts-passwordless.ticket'),
      code,
    }],
    userCallback: callback
  })
}
