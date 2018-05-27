import {PasswordlessCodes} from '../common/PasswordlessCodes'

Meteor.publish('passwordless.getTokenForSameUser', function(ticket) {
  console.log("subscription with", ticket)
  if(!ticket) {
    return []
  }
  return PasswordlessCodes.find(
    {ticket, sendToOtherSession: true},
    {fields: {code: 1, ticket: 1}}
  )
})
