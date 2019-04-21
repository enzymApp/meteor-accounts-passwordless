import {Accounts} from 'meteor/accounts-base'

export default {
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),

  sendVerificationCode: {
    subject: function (code, profile) {
      const {siteName} = Accounts.passwordless.emailTemplates
      return `Your verification code is ${code} for ${siteName}`
    },
    text: function (user, code, profile) {
      const hello = greating(user)
      return `
        ${hello}

        Your verification code is ${code}

        Thanks.
      `
    },
    // html: function (user, code, subject, profile) {
    //
    // }
  }
  },
  sendVerificationUrl: {
    subject: function (code, profile) {
      const {siteName} = Accounts.passwordless.emailTemplates
      return "Verification URL for " + siteName
    },
    text: function (user, code, profile, _getUrlFromCode=getUrlFromCode) {
      const hello = greating(user)

      return removeLeadingSpaces(`
        ${hello}

        Please click on this link or copy it in your browser to validate your e-mail address:
        ${_getUrlFromCode(url)}

        Thanks.
      `)
    },
    // html: function (user, code, subject, profile, getUrlFromCode) {
    //
    // }
  }
}

function greating(user) {
  const name = user && user.username ? user.username : ''
  return `Hello ${name},`
}

function removeLeadingSpaces(multiLineString) {
  return multiLineString.replace(/\n +/g, '\n')
}

function getUrlFromCode(code) {
  const {validationRoutePath} = Accounts.passwordless.config
  const baseUrl = Meteor.absoluteUrl().replace(/\/$/, '')
  const path    = validationRoutePath.replace(/\/$/, '')
  return `${baseUrl}${path}/${code}`
}
