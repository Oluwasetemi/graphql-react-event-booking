import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingPage from './pages/Booking';
import Nav from './components/Nav';

const Center = styled.div`
  text-align: center;
  margin: 5rem 2.5rem;
`;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <>
        <Nav/>
        <Center>
          <Switch>
            <Redirect from="/" to="/auth" exact/>
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingPage} />
          </Switch>
        </Center>
      </>
      </BrowserRouter>
    );
  }
}

export default App;
