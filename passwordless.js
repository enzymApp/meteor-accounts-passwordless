import {Accounts}         from 'meteor/accounts-base'
import {Meteor}           from 'meteor/meteor'
import {checkNpmVersions} from 'meteor/tmeasday:check-npm-versions'

import sendVerificationCode from './lib/sendVerificationCode'
import emailTemplates       from './lib/emailTemplates'

import './lib/methods'

checkNpmVersions({
  'simpl-schema': '1.x'
}, '')


const defaultConfig = {
  codeType:            'digits',
  validationRoutePath: '/validation',
  emailFrom:           'Meteor Accounts <no-reply@meteor.com>',
}

Accounts.passwordless = {
  sendVerificationCode,
  emailTemplates,
  config: defaultConfig,
}
