import {Accounts} from 'meteor/accounts-base'
import {Random}   from 'meteor/random'

import {PasswordlessCodes} from '../common/PasswordlessCodes'
import getUserAndEmail     from './getUserAndEmail'

/**
 * Send a 6 digit verification code by email
 * @param selector The email or username of the user
 */
export default function (selector, options) {
  const {user, email} = getUserAndEmail(selector)

  const code = ('000000' + Math.floor(Random.fraction() * 1000000) + '').slice(-6)

  const ticket = Random.secret()
  PasswordlessCodes.upsert(
    {email},
    {$set: {
      sendToOtherSession: false,
      ticket,
      code,
    }}
  )

  Email.send({
    to:      email,
    from:    Accounts.passwordless.emailTemplates.from,
    subject: Accounts.passwordless.emailTemplates.sendVerificationCode.subject(code),
    text:    Accounts.passwordless.emailTemplates.sendVerificationCode.text(user, code, selector, options)
  })

  return {
    ticket
  }
}
