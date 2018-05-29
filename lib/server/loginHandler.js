import SimpleSchema from 'simpl-schema'
import {Accounts}   from 'meteor/accounts-base'

// Handler to login with passwordless
export default function (options) {
  if (!options.code) return undefined // don't handle

  new SimpleSchema({
    code:   {type: String},
    ticket: {type: String, optional: true},
  }).validate(options)

  return Accounts.passwordless.verifyCode(options.code, options.ticket)
}
