import {Accounts} from 'meteor/accounts-base'

export default {
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),

  sendVerificationCode: {
    subject: function (code) {
      const {siteName} = Accounts.passwordless.emailTemplates
      return `Your verification code is ${code} for ${siteName}`
    },
    text: function (user, code) {
      const hello = greating(user)
      return `
        ${hello}

        Your verification code is ${code}

        Thanks.
      `
    }
  },
  sendVerificationUrl: {
    subject: function (code) {
      const {siteName} = Accounts.passwordless.emailTemplates
      return "Verification URL for " + siteName
    },
    text: function (user, code, getUrlFromCode) {
      const hello = greating(user)
      const url = getUrlFromCode(code)
      return removeLeadingSpaces(`
        ${hello}

        Please click on this link or copy it in your browser to validate your e-mail address:
        ${url}

        Thanks.
      `)
    }
  }
}

function greating(user) {
  const name = user && user.username ? user.username : ''
  return `Hello ${name},`
}

function removeLeadingSpaces(multiLineString) {
  return multiLineString.replace(/\n +/g, '\n')
}
