import {Session} from 'meteor/session'

export default () => {
  if(!Session.get('accounts-passwordless.ticket')) return
  return Session.get('accounts-passwordless.selector')
}
