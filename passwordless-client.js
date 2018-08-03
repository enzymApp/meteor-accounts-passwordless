import {Accounts}         from 'meteor/accounts-base'
import {Meteor}           from 'meteor/meteor'
import {Session}          from 'meteor/session'

import clearLoginAttempt       from './lib/client/clearLoginAttempt'
import getLoginAttemptSelector from './lib/client/getLoginAttemptSelector'
import loginWithPasswordless   from './lib/client/loginWithPasswordless'
import sendVerificationCode    from './lib/client/sendVerificationCode'
import setUsername             from './lib/client/setUsername'
import {PasswordlessCodes}     from './lib/PasswordlessCodes'
import './passwordless'
import './ui'

export withEmailValidation from './lib/client/withEmailValidation'


Meteor.loginWithPasswordless = loginWithPasswordless
Meteor.sendVerificationCode  = sendVerificationCode
Meteor.setUsername           = setUsername

Accounts.clearPasswordlessLoginAttempt       = clearLoginAttempt
Accounts.getPasswordlessLoginAttemptSelector = getLoginAttemptSelector

Tracker.autorun(function (computation) {
  const ticket = Session.get('accounts-passwordless.ticket')

  Meteor.subscribe('passwordless.getTokenForSameUser', ticket)

  PasswordlessCodes.find({ticket})
  .forEach(item => {
    const {code} = item

    computation.stop()
    Session.setPersistent('accounts-passwordless.ticket', '')

    Meteor.loginWithPasswordless({code}, (err, result) => {
      if(err) console.error(err)
      console.log(result)
    })
  })
})
