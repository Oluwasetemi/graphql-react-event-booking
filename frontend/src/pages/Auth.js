import React, { Component } from 'react'
import styled from 'styled-components';

const FormStyles = styled.form`
    width: 30em;
    margin: 5em 25em;

  .form-group label,
  .form-group input {
    display: block;
    width: 100%;
    padding: .5em 2em;
  }

  button {
    margin-top: 1em;
    margin-right: 3em;
    background-color: blue;
    border: 2px solid white;
    border-radius: 3px;
    padding: .5em;
    width: 10em;

    &:first-of-type {
      margin-left: 0;
    }

    &:hover {
      border: 2px solid blue;
      box-shadow: 1px 2px 5px black;
    }
  }
`;

export default class Auth extends Component {

  state = {
    isLoggedIn: true,
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {
        isLoggedIn: !prevState.isLoggedIn,
      }
    })
  }

  constructor(props) {
    super(props)
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody ={
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    }

    if (!this.state.isLoggedIn) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      }
    }


    console.log(email, password);
    fetch('http://localhost:9999/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('failed');
      }
      return res.json();
    }).then(resData => {
      console.log(resData);
    }).catch(err => console.error(err));
  }

  render() {
    return (
      <FormStyles className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input type="text" ref={this.emailEl} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" ref={this.passwordEl} />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={this.switchModeHandler}>
          Switch to {this.state.isLoggedIn ? 'SignUp' : "Login"}
        </button>
      </FormStyles>
    )
  }
}
