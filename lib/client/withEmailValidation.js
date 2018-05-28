import React    from 'react'
import {Meteor} from 'meteor/meteor'

export default withEmailValidation = ({
  SuccessComponent, FailureComponent, Loading, routerPropsToCode
}) => class EmailValidation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      success: false,
    }
  }
  render() {
    const {loading, success} = this.state
    if(loading) {
      const code = routerPropsToCode(this.props)
      Meteor.loginWithPasswordless({code}, (err, result) => {
        const nextState = {loading: false}
        if(err) {
          this.setState({...nextState, success: false})
          return
        }
        this.setState({...nextState, success: true})
      })
      return <Loading />
    }
    if(success) {
      return <SuccessComponent />
    }
    return <FailureComponent />
  }
}
