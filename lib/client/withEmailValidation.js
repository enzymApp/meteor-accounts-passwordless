import React    from 'react'
import {Meteor} from 'meteor/meteor'

export default withEmailValidation = ({
  SuccessComponent, FailureComponent, Loading, routerPropsToCode
}) => class EmailValidation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error:   null,
    }
  }
  render() {
    const {loading, error} = this.state
    if(loading) {
      const code = routerPropsToCode(this.props)
      Meteor.loginWithPasswordless({code}, (err, result) => {
        const nextState = {loading: false}
        if(err) {
          this.setState({...nextState, error: err})
          console.warn(err)
          return
        }
        this.setState({...nextState})
      })
      return <Loading />
    }
    if(!error) {
      return <SuccessComponent />
    }
    return <FailureComponent error={error} />
  }
}
