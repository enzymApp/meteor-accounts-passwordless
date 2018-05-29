import {Accounts}         from 'meteor/accounts-base'

import sendVerificationCode from './lib/sendVerificationCode'
import emailTemplates       from './lib/emailTemplates'
import loginHandler         from './lib/server/loginHandler'
import verifyCode           from './lib/server/verifyCode'

import './lib/methods'
import './lib/server/publications'
import './passwordless'

Accounts.registerLoginHandler('passwordless', loginHandler)

Accounts.passwordless.verifyCode = verifyCode
