import {PasswordlessCodes} from '../PasswordlessCodes'

Meteor.publish('passwordless.getTokenForSameUser', function(ticket) {
  if(!ticket) {
    return []
  }
  return PasswordlessCodes.find(
    {ticket, sendToOtherSession: true},
    {fields: {code: 1, ticket: 1}}
  )
})
