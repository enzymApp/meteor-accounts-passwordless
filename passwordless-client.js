import {Accounts}         from 'meteor/accounts-base'
import {Meteor}           from 'meteor/meteor'

import loginWithPasswordless from './lib/client/loginWithPasswordless'
import sendVerificationCode  from './lib/client/sendVerificationCode'
import setUsername           from './lib/client/setUsername'
import {PasswordlessCodes}   from './lib/PasswordlessCodes'
import './passwordless'
import './ui'

export withEmailValidation from './lib/client/withEmailValidation'


Meteor.loginWithPasswordless = loginWithPasswordless
Meteor.sendVerificationCode  = sendVerificationCode
Meteor.setUsername           = setUsername

Tracker.autorun(function (computation) {
  const ticket = Session.get('accounts-passwordless.ticket')

  Meteor.subscribe('passwordless.getTokenForSameUser', ticket)

  PasswordlessCodes.find({ticket})
  .forEach(item => {
    const {code} = item

    computation.stop()

    Session.set('accounts-passwordless.ticket', '')
    Meteor.loginWithPasswordless({code}, (err, result) => {
      if(err) console.error(err)
      console.log(result)
    })
  })
})
