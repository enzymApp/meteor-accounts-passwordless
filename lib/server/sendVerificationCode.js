import {Accounts} from 'meteor/accounts-base'
import {Random}   from 'meteor/random'

import {PasswordlessCodes} from '../common/PasswordlessCodes'
import getUserAndEmail     from './getUserAndEmail'
import emailTemplates      from './emailTemplates'

/**
 * Send a verification code by email
 */
export default (selector, options) => {
  const {user, email} = getUserAndEmail(selector)

  const {emailTemplates, config: {codeType, emailFrom}} = Accounts.passwordless

  const {code, subject, text} = (function(user, codeType, templates){
    switch(codeType) {
      case 'url':
        const stringCode = Random.hexString(20)
        return {
          subject: templates.sendVerificationUrl.subject(stringCode),
          text:    templates.sendVerificationUrl.text(user, stringCode),
          code:    stringCode,
        }
      case 'digits':
      default:
        const digitCode = randomDigits(6)
        return {
          subject: templates.sendVerificationCode.subject(digitCode),
          text:    templates.sendVerificationCode.text(user, digitCode),
          code:    digitCode,
        }
    }
  })(user, codeType, emailTemplates)

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
    from:    emailFrom,
    subject,
    text,
  })

  return {
    ticket
  }
}

function randomDigits(nb) {
  return (
    '0'.repeat(nb) + Math.floor(Random.fraction() * Math.pow(10, nb)) + ''
  ).slice(-1 * nb)
}
