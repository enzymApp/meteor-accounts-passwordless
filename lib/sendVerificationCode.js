import {Accounts} from 'meteor/accounts-base'
import {Email}    from 'meteor/email'
import {Random}   from 'meteor/random'

import {PasswordlessCodes} from './PasswordlessCodes'
import getUserAndEmail     from './getUserAndEmail'
import emailTemplates      from './emailTemplates'


/**
 * Send a verification code by email
 */
export default function(selector, username = '', profile = {}, options = {}) {
  const TOKEN_LIFETIME = Accounts.passwordless.config.tokenLifeTime
  const {user, email} = getUserAndEmail(selector)

  const {emailTemplates, config: {codeType, emailFrom}} = Accounts.passwordless

  const {code, subject, text, html} = (function(user = '', codeType, templates){
    let subject
    switch(codeType) {
      case 'url':
        const stringCode = Random.hexString(20)
        subject = templates.sendVerificationUrl.subject(stringCode, profile)
        return {
          subject,
          text:    templates.sendVerificationUrl.text(user, stringCode, profile, getUrlFromCode),
          html:    template.sendVerificationCode.html && template.sendVerificationCode.html(
            user, stringCode, subject, profile, getUrlFromCode,
          ),
          code:    stringCode,
        }
      case 'digits':
      default:
        const digitCode = randomDigits(6)
        subject = templates.sendVerificationCode.subject(digitCode, profile)
        return {
          subject,
          text:    templates.sendVerificationCode.text(user, digitCode, profile),
          html:    templates.sendVerificationCode.html && templates.sendVerificationCode.html(
            user, digitCode, subject, profile,
          ),
          code:    digitCode,
        }
    }
  })(user, codeType, emailTemplates)

  const ticket = Random.secret()

  const data = Accounts.passwordless.onSendVerificationCode(
    selector, username, profile, options, this.connection
  )
  if(data) {
    if(data.locked) return
    Object.assign(options, data)
  }

  PasswordlessCodes.upsert(
    {email},
    {
      $inc: {loginCount: 1},
      $set: {
        sendToOtherSession: false,
        profile:            JSON.stringify(profile),
        expiredAt:          Date.now() + TOKEN_LIFETIME * 1000,
        ticket,
        code,
        username,
      }
    }
  )

  if(!this.isSimulation) {
    this.unblock()
    Email.send({
      to:      email,
      from:    emailFrom,
      subject,
      text,
      ...(!html ? {} : { html }),
    })
  }
  return {
    ticket
  }
}

function randomDigits(nb) {
  return (
    '0'.repeat(nb) + Math.floor(Random.fraction() * Math.pow(10, nb)) + ''
  ).slice(-1 * nb)
}

function getUrlFromCode(code) {
  const {validationRoutePath} = Accounts.passwordless.config
  const baseUrl = Meteor.absoluteUrl().replace(/\/$/, '')
  const path    = validationRoutePath.replace(/\/$/, '')
  return `${baseUrl}${validationRoutePath}/${code}`
}
