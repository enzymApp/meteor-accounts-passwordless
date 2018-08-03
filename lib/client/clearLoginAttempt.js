import {Session} from 'meteor/session'

export default () => {
  return Session.clear('accounts-passwordless.selector')
}
