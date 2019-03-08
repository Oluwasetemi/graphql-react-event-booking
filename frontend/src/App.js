import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingPage from './pages/Booking';
import Nav from './components/Nav';
import AuthContext from './context/auth-context';

const Center = styled.div`
  text-align: center;
  margin: 5rem 2.5rem;
`;

class App extends Component {
  state = {
    token: null,
    userId: null,
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId })
  }

  logout = (token, userId) => {
    this.setState({ token: null, userId: null })
  }

  render() {
    return (
      <BrowserRouter>
        <>
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}>
            <Nav/>
            <Center>
              <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact/>}
              {this.state.token && <Redirect from="/" to="/events" exact/>}
              {this.state.token && <Redirect from="/auth" to="/events" exact/>}
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
                {this.state.token && <Route path="/bookings" component={BookingPage} />}
              </Switch>
            </Center>
          </AuthContext.Provider>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
