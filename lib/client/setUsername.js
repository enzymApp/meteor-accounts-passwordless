import {Meteor}   from 'meteor/meteor'

/**
 * Set username. The user must be logged
 * @param username The name of the user
 * @param [callback]
 */
export default function (username, callback) {
  Meteor.call('accounts-passwordless.setUsername', username, callback)
}
