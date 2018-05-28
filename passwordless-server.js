import {Accounts} from 'meteor/accounts-base'
import {Meteor}   from 'meteor/meteor'

import emailTemplates       from './lib/server/emailTemplates'
import loginHandler         from './lib/server/loginHandler'
import sendVerificationCode from './lib/server/sendVerificationCode'
import verifyCode           from './lib/server/verifyCode'

import './lib/server/methods'
import './lib/server/publications'

Accounts.registerLoginHandler('passwordless', loginHandler)

const defaultConfig = {
  codeType:            'digits',
  validationRoutePath: '/validation'
}

Accounts.passwordless = {
  sendVerificationCode,
  emailTemplates,
  verifyCode,
  config: defaultConfig,
}
